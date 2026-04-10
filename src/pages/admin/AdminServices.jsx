import { useEffect, useState } from 'react'
import { apiGet } from '../../utils/api.js'
import { addListItem, deleteListItem, updateListItem } from './adminHelpers.js'

const emptyService = {
  title: '',
  description: '',
  features: '',
  image: '',
  order: 0,
}

export default function AdminServices() {
  const [items, setItems] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState(emptyService)
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => {
    apiGet('/services/').then(setItems)
  }, [])

  const startEdit = (item) => {
    setEditingId(item.id)
    setDraft({ ...item })
    setShowAdd(false)
  }

  const saveEdit = async () => {
    await updateListItem('/services/', items, setItems, draft)
    setEditingId(null)
    setDraft(emptyService)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setDraft(emptyService)
  }

  const confirmDelete = async (id) => {
    const ok = window.confirm('Delete this service?')
    if (!ok) return
    await deleteListItem('/services/', items, setItems, id)
  }

  const addService = async () => {
    if (!draft.title.trim()) return
    await addListItem('/services/', items, setItems, {
      title: draft.title,
      description: draft.description,
      features: draft.features,
      image: draft.image,
      order: draft.order || items.length + 1,
    })
    setDraft(emptyService)
    setShowAdd(false)
  }

  return (
    <div className="admin-section">
      <div className="admin-subsection__head">
        <h2>Services</h2>
        {!showAdd ? (
          <button className="btn btn-brand btn-small" type="button" onClick={() => setShowAdd(true)}>
            Add service
          </button>
        ) : null}
      </div>

      {showAdd ? (
        <div className="admin-card">
          <h4>Add service</h4>
          <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Title" />
          <textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} placeholder="Description" />
          <textarea value={draft.features} onChange={(e) => setDraft({ ...draft, features: e.target.value })} placeholder="Features (one per line)" />
          <input value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} placeholder="Image path" />
          <input type="number" value={draft.order} onChange={(e) => setDraft({ ...draft, order: Number(e.target.value) })} />
          <div className="admin-row">
            <button className="btn btn-brand btn-small" type="button" onClick={addService}>Save</button>
            <button className="btn btn-outline-cream btn-small" type="button" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      ) : null}

      {editingId ? (
        <div className="admin-card">
          <h4>Edit service</h4>
          <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          <textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          <textarea value={draft.features || ''} onChange={(e) => setDraft({ ...draft, features: e.target.value })} />
          <input value={draft.image || ''} onChange={(e) => setDraft({ ...draft, image: e.target.value })} />
          <input type="number" value={draft.order || 0} onChange={(e) => setDraft({ ...draft, order: Number(e.target.value) })} />
          <div className="admin-row">
            <button className="btn btn-brand btn-small" type="button" onClick={saveEdit}>Save</button>
            <button className="btn btn-outline-cream btn-small" type="button" onClick={cancelEdit}>Cancel</button>
          </div>
        </div>
      ) : null}

      <ul className="admin-album-list">
        {items.map((item) => (
          <li key={item.id} className="admin-album-item">
            <span>{item.title}</span>
            <div className="admin-album-actions">
              <button type="button" className="icon-button" onClick={() => startEdit(item)}>
                ✎
              </button>
              <button type="button" className="icon-button" onClick={() => confirmDelete(item.id)}>
                🗑
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}