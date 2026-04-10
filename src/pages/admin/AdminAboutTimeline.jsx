import { useEffect, useState } from 'react'
import { apiGet } from '../../utils/api.js'
import { addListItem, deleteListItem, updateListItem } from './adminHelpers.js'

export default function AdminAboutTimeline() {
  const [items, setItems] = useState([])

  useEffect(() => {
    apiGet('/about-timeline/').then(setItems)
  }, [])

  return (
    <div className="admin-section">
      <h2>About Timeline</h2>
      <div className="admin-list">
        {items.map((item) => (
          <div key={item.id} className="admin-card">
            <input value={item.title} onChange={(e) => setItems(items.map((row) => (row.id === item.id ? { ...row, title: e.target.value } : row)))} />
            <textarea value={item.text} onChange={(e) => setItems(items.map((row) => (row.id === item.id ? { ...row, text: e.target.value } : row)))} />
            <input type="number" value={item.order || 0} onChange={(e) => setItems(items.map((row) => (row.id === item.id ? { ...row, order: Number(e.target.value) } : row)))} />
            <div className="admin-row">
              <button className="btn btn-brand" type="button" onClick={() => updateListItem('/about-timeline/', items, setItems, item)}>Save</button>
              <button className="btn btn-outline-cream" type="button" onClick={() => deleteListItem('/about-timeline/', items, setItems, item.id)}>Delete</button>
            </div>
          </div>
        ))}
        <button
          className="btn btn-outline-cream"
          type="button"
          onClick={() => addListItem('/about-timeline/', items, setItems, { title: 'New step', text: '', order: items.length + 1 })}
        >
          Add timeline item
        </button>
      </div>
    </div>
  )
}