import { useEffect, useState } from 'react'
import { apiGet, apiPatchUpload, apiUpload } from '../../utils/api.js'
import { addListItem, deleteListItem, updateListItem } from './adminHelpers.js'

const makeTitle = (file) => file.name.replace(/\.[^/.]+$/, '')

const emptyAlbum = {
  title: '',
  description: '',
  category: '',
  event_date: '',
  location: '',
}

export default function AdminPortfolio() {
  const [albums, setAlbums] = useState([])
  const [photos, setPhotos] = useState([])
  const [selectedAlbumId, setSelectedAlbumId] = useState(null)
  const [editingAlbumId, setEditingAlbumId] = useState(null)
  const [newAlbum, setNewAlbum] = useState(emptyAlbum)
  const [showAddAlbum, setShowAddAlbum] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const load = async () => {
      const [albumData, photoData] = await Promise.all([apiGet('/albums/'), apiGet('/photos/')])
      setAlbums(albumData)
      setPhotos(photoData)
      if (albumData.length > 0) {
        setSelectedAlbumId(albumData[0].id)
      }
    }

    load()
  }, [])

  const selectedAlbum = albums.find((album) => album.id === selectedAlbumId)

  const startEdit = (albumId) => {
    setEditingAlbumId(albumId)
  }

  const cancelEdit = () => {
    setEditingAlbumId(null)
  }

  const saveAlbum = async (album) => {
    await updateListItem('/albums/', albums, setAlbums, album)
    setEditingAlbumId(null)
  }

  const confirmDelete = async (albumId) => {
    const ok = window.confirm('Delete this album and all its photos?')
    if (!ok) return
    await deleteListItem('/albums/', albums, setAlbums, albumId)
    if (selectedAlbumId === albumId) {
      const next = albums.find((item) => item.id !== albumId)
      setSelectedAlbumId(next?.id || null)
    }
  }

  const handleAlbumImageUpload = async (albumId, field, file) => {
    if (!file) return
    const formData = new FormData()
    formData.append(field, file)
    const updated = await apiPatchUpload(`/albums/${albumId}/`, formData)
    setAlbums(albums.map((row) => (row.id === albumId ? updated : row)))
  }

  const uploadFiles = async (files, albumId) => {
    if (!albumId || !files.length) return
    setUploading(true)
    try {
      const uploads = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append('album', albumId)
        formData.append('title', makeTitle(file))
        formData.append('image', file)
        return apiUpload('/photos/', formData)
      })
      const results = await Promise.all(uploads)
      setPhotos((prev) => [...results, ...prev])
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (event, albumId) => {
    event.preventDefault()
    uploadFiles(event.dataTransfer.files, albumId)
  }

  const createAlbum = async () => {
    if (!newAlbum.title.trim()) return
    const created = await addListItem('/albums/', albums, setAlbums, {
      ...newAlbum,
      event_date: newAlbum.event_date || null,
    })
    setSelectedAlbumId(created.id)
    setNewAlbum(emptyAlbum)
    setShowAddAlbum(false)
  }

  const albumPhotos = photos.filter((photo) => photo.album === selectedAlbumId)

  return (
    <div className="admin-section">
      <h2>Portfolio</h2>

      <div className="admin-subsection">
        <div className="admin-subsection__head">
          <h3>Albums</h3>
          {!showAddAlbum ? (
            <button className="btn btn-brand" type="button" onClick={() => setShowAddAlbum(true)}>
              Add new album
            </button>
          ) : null}
        </div>
        {showAddAlbum ? (
          <div className="admin-card">
            <h4>Add new album</h4>
            <div className="admin-list">
              <input value={newAlbum.title} onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })} placeholder="Album name" />
              <textarea value={newAlbum.description} onChange={(e) => setNewAlbum({ ...newAlbum, description: e.target.value })} placeholder="Description" />
              <input value={newAlbum.category} onChange={(e) => setNewAlbum({ ...newAlbum, category: e.target.value })} placeholder="Category" />
              <input type="date" value={newAlbum.event_date} onChange={(e) => setNewAlbum({ ...newAlbum, event_date: e.target.value })} />
              <input value={newAlbum.location} onChange={(e) => setNewAlbum({ ...newAlbum, location: e.target.value })} placeholder="Location" />
              <div className="admin-row">
                <button className="btn btn-brand" type="button" onClick={createAlbum}>Create album</button>
                <button className="btn btn-outline-cream" type="button" onClick={() => setShowAddAlbum(false)}>Cancel</button>
              </div>
            </div>
          </div>
        ) : (
          <ul className="admin-album-list">
            {albums.map((album) => (
              <li key={album.id} className={`admin-album-item ${album.id === selectedAlbumId ? 'active' : ''}`}>
                <button type="button" className="admin-album-name" onClick={() => setSelectedAlbumId(album.id)}>
                  {album.title}
                </button>
                <div className="admin-album-actions">
                  <button type="button" className="icon-button" onClick={() => startEdit(album.id)}>
                    ✎
                  </button>
                  <button type="button" className="icon-button" onClick={() => confirmDelete(album.id)}>
                    🗑
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {editingAlbumId ? (
          <div className="admin-card">
            <h4>Edit album</h4>
            {albums
              .filter((album) => album.id === editingAlbumId)
              .map((album) => (
                <div key={album.id} className="admin-list">
                  <input value={album.title} onChange={(e) => setAlbums(albums.map((row) => (row.id === album.id ? { ...row, title: e.target.value } : row)))} />
                  <textarea value={album.description || ''} onChange={(e) => setAlbums(albums.map((row) => (row.id === album.id ? { ...row, description: e.target.value } : row)))} placeholder="Description" />
                  <input value={album.category || ''} onChange={(e) => setAlbums(albums.map((row) => (row.id === album.id ? { ...row, category: e.target.value } : row)))} placeholder="Category" />
                  <input type="date" value={album.event_date || ''} onChange={(e) => setAlbums(albums.map((row) => (row.id === album.id ? { ...row, event_date: e.target.value } : row)))} />
                  <input value={album.location || ''} onChange={(e) => setAlbums(albums.map((row) => (row.id === album.id ? { ...row, location: e.target.value } : row)))} placeholder="Location" />
                  <div className="admin-inline">
                    <label>
                      Cover image
                      <input type="file" accept="image/*" onChange={(e) => handleAlbumImageUpload(album.id, 'cover_image', e.target.files?.[0])} />
                    </label>
                    <label>
                      Banner image
                      <input type="file" accept="image/*" onChange={(e) => handleAlbumImageUpload(album.id, 'banner_image', e.target.files?.[0])} />
                    </label>
                  </div>
                  <div className="admin-row">
                    <button className="btn btn-brand" type="button" onClick={() => saveAlbum(album)}>Save</button>
                    <button className="btn btn-outline-cream" type="button" onClick={cancelEdit}>Cancel</button>
                  </div>
                </div>
              ))}
          </div>
        ) : null}

      </div>

      {selectedAlbum ? (
        <div className="admin-subsection">
          <h3>Photos for {selectedAlbum.title}</h3>
          <div className="admin-dropzone">
            <h4>Bulk upload</h4>
            <p>Drag & drop images here or select multiple files.</p>
            <div className="admin-row">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => uploadFiles(e.target.files || [], selectedAlbumId)}
              />
            </div>
            <div
              className="admin-dropzone__area"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, selectedAlbumId)}
            >
              {uploading ? 'Uploading...' : 'Drop files here'}
            </div>
          </div>

          <div className="admin-list">
            {albumPhotos.map((photo) => (
              <div key={photo.id} className="admin-card">
                <input value={photo.title} onChange={(e) => setPhotos(photos.map((row) => (row.id === photo.id ? { ...row, title: e.target.value } : row)))} placeholder="Title" />
                <textarea value={photo.description || ''} onChange={(e) => setPhotos(photos.map((row) => (row.id === photo.id ? { ...row, description: e.target.value } : row)))} placeholder="Description" />
                <input value={photo.download_url || ''} onChange={(e) => setPhotos(photos.map((row) => (row.id === photo.id ? { ...row, download_url: e.target.value } : row)))} placeholder="Download URL (optional)" />
                <label className="admin-checkbox">
                  <input type="checkbox" checked={photo.featured} onChange={(e) => setPhotos(photos.map((row) => (row.id === photo.id ? { ...row, featured: e.target.checked } : row)))} />
                  Featured
                </label>
                <div className="admin-row">
                  <button className="btn btn-brand" type="button" onClick={() => updateListItem('/photos/', photos, setPhotos, photo)}>Save</button>
                  <button className="btn btn-outline-cream" type="button" onClick={() => deleteListItem('/photos/', photos, setPhotos, photo.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
