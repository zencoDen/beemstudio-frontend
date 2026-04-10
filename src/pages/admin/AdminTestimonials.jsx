import { useEffect, useState } from 'react'
import { apiGet, apiPatchUpload } from '../../utils/api.js'
import { addListItem, deleteListItem, updateListItem } from './adminHelpers.js'

const emptyTestimonial = {
  name: '',
  meta: '',
  quote: '',
  rating: 5,
  source: 'Google Reviews',
  note: '',
  order: 0,
}

export default function AdminTestimonials() {
  const [items, setItems] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState(emptyTestimonial)
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => {
    apiGet('/testimonials/').then(setItems)
  }, [])

  const startEdit = (item) => {
    setEditingId(item.id)
    setDraft({ ...item })
    setShowAdd(false)
  }

  const saveEdit = async () => {
    await updateListItem('/testimonials/', items, setItems, draft)
    setEditingId(null)
    setDraft(emptyTestimonial)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setDraft(emptyTestimonial)
  }

  const confirmDelete = async (id) => {
    const ok = window.confirm('Delete this testimonial?')
    if (!ok) return
    await deleteListItem('/testimonials/', items, setItems, id)
  }

  const addTestimonial = async () => {
    if (!draft.name.trim()) return
    await addListItem('/testimonials/', items, setItems, {
      name: draft.name,
      meta: draft.meta,
      quote: draft.quote,
      rating: draft.rating || 5,
      source: draft.source || 'Google Reviews',
      note: draft.note || '',
      order: draft.order || items.length + 1,
    })
    setDraft(emptyTestimonial)
    setShowAdd(false)
  }

  const uploadImage = async (id, file) => {
    if (!file) return
    const formData = new FormData()
    formData.append('image', file)
    const updated = await apiPatchUpload(`/testimonials/${id}/`, formData)
    setItems(items.map((row) => (row.id === id ? updated : row)))
  }

  return (
    <div className="admin-section">
      <div className="admin-subsection__head">
        <h2>Testimonials</h2>
        {!showAdd ? (
          <button className="btn btn-brand btn-small" type="button" onClick={() => setShowAdd(true)}>
            Add testimonial
          </button>
        ) : null}
      </div>

      {showAdd ? (
        <div className="admin-card">
          <h4>Add testimonial</h4>
          <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Name" />
          <input value={draft.meta} onChange={(e) => setDraft({ ...draft, meta: e.target.value })} placeholder="Meta" />
          <textarea value={draft.quote} onChange={(e) => setDraft({ ...draft, quote: e.target.value })} placeholder="Quote" />
          <input value={draft.note} onChange={(e) => setDraft({ ...draft, note: e.target.value })} placeholder="Note" />
          <input type="number" value={draft.rating} onChange={(e) => setDraft({ ...draft, rating: Number(e.target.value) })} />
          <input value={draft.source} onChange={(e) => setDraft({ ...draft, source: e.target.value })} placeholder="Source" />
          <input type="number" value={draft.order} onChange={(e) => setDraft({ ...draft, order: Number(e.target.value) })} />
          <div className="admin-row">
            <button className="btn btn-brand btn-small" type="button" onClick={addTestimonial}>Save</button>
            <button className="btn btn-outline-cream btn-small" type="button" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      ) : null}

      {editingId ? (
        <div className="admin-card">
          <h4>Edit testimonial</h4>
          <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          <input value={draft.meta || ''} onChange={(e) => setDraft({ ...draft, meta: e.target.value })} />
          <textarea value={draft.quote} onChange={(e) => setDraft({ ...draft, quote: e.target.value })} />
          <input value={draft.note || ''} onChange={(e) => setDraft({ ...draft, note: e.target.value })} />
          <input type="number" value={draft.rating || 5} onChange={(e) => setDraft({ ...draft, rating: Number(e.target.value) })} />
          <input value={draft.source || ''} onChange={(e) => setDraft({ ...draft, source: e.target.value })} />
          <input type="number" value={draft.order || 0} onChange={(e) => setDraft({ ...draft, order: Number(e.target.value) })} />
          <div className="admin-inline">
            <label>
              Reviewer image
              <input type="file" accept="image/*" onChange={(e) => uploadImage(draft.id, e.target.files?.[0])} />
            </label>
          </div>
          <div className="admin-row">
            <button className="btn btn-brand btn-small" type="button" onClick={saveEdit}>Save</button>
            <button className="btn btn-outline-cream btn-small" type="button" onClick={cancelEdit}>Cancel</button>
          </div>
        </div>
      ) : null}

      <ul className="admin-album-list">
        {items.map((item) => (
          <li key={item.id} className="admin-album-item">
            <span>{item.name}</span>
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