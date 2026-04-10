import { useEffect, useState } from 'react'
import { apiGet } from '../../utils/api.js'
import { addListItem, deleteListItem, updateListItem } from './adminHelpers.js'

const emptyFaq = {
  question: '',
  answer: '',
  order: 0,
}

export default function AdminFaqs() {
  const [items, setItems] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState(emptyFaq)
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => {
    apiGet('/faqs/').then(setItems)
  }, [])

  const startEdit = (item) => {
    setEditingId(item.id)
    setDraft({ ...item })
    setShowAdd(false)
  }

  const saveEdit = async () => {
    await updateListItem('/faqs/', items, setItems, draft)
    setEditingId(null)
    setDraft(emptyFaq)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setDraft(emptyFaq)
  }

  const confirmDelete = async (id) => {
    const ok = window.confirm('Delete this FAQ?')
    if (!ok) return
    await deleteListItem('/faqs/', items, setItems, id)
  }

  const addFaq = async () => {
    if (!draft.question.trim()) return
    await addListItem('/faqs/', items, setItems, {
      question: draft.question,
      answer: draft.answer,
      order: draft.order || items.length + 1,
    })
    setDraft(emptyFaq)
    setShowAdd(false)
  }

  return (
    <div className="admin-section">
      <div className="admin-subsection__head">
        <h2>FAQs</h2>
        {!showAdd ? (
          <button className="btn btn-brand btn-small" type="button" onClick={() => setShowAdd(true)}>
            Add FAQ
          </button>
        ) : null}
      </div>

      {showAdd ? (
        <div className="admin-card">
          <h4>Add FAQ</h4>
          <input value={draft.question} onChange={(e) => setDraft({ ...draft, question: e.target.value })} placeholder="Question" />
          <textarea value={draft.answer} onChange={(e) => setDraft({ ...draft, answer: e.target.value })} placeholder="Answer" />
          <input type="number" value={draft.order} onChange={(e) => setDraft({ ...draft, order: Number(e.target.value) })} />
          <div className="admin-row">
            <button className="btn btn-brand btn-small" type="button" onClick={addFaq}>Save</button>
            <button className="btn btn-outline-cream btn-small" type="button" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      ) : null}

      {editingId ? (
        <div className="admin-card">
          <h4>Edit FAQ</h4>
          <input value={draft.question} onChange={(e) => setDraft({ ...draft, question: e.target.value })} />
          <textarea value={draft.answer} onChange={(e) => setDraft({ ...draft, answer: e.target.value })} />
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
            <span>{item.question}</span>
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