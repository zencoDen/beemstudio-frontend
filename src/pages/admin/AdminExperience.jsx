import { useEffect, useState } from 'react'
import { apiGet } from '../../utils/api.js'
import { addListItem, deleteListItem, updateListItem } from './adminHelpers.js'

export default function AdminExperience() {
  const [items, setItems] = useState([])

  useEffect(() => {
    apiGet('/experience-steps/').then(setItems)
  }, [])

  return (
    <div className="admin-section">
      <h2>Experience Steps</h2>
      <div className="admin-list">
        {items.map((item) => (
          <div key={item.id} className="admin-card">
            <input value={item.title} onChange={(e) => setItems(items.map((row) => (row.id === item.id ? { ...row, title: e.target.value } : row)))} />
            <textarea value={item.description} onChange={(e) => setItems(items.map((row) => (row.id === item.id ? { ...row, description: e.target.value } : row)))} />
            <input type="number" value={item.order || 0} onChange={(e) => setItems(items.map((row) => (row.id === item.id ? { ...row, order: Number(e.target.value) } : row)))} />
            <div className="admin-row">
              <button className="btn btn-brand" type="button" onClick={() => updateListItem('/experience-steps/', items, setItems, item)}>Save</button>
              <button className="btn btn-outline-cream" type="button" onClick={() => deleteListItem('/experience-steps/', items, setItems, item.id)}>Delete</button>
            </div>
          </div>
        ))}
        <button
          className="btn btn-outline-cream"
          type="button"
          onClick={() => addListItem('/experience-steps/', items, setItems, { title: 'New step', description: '', order: items.length + 1 })}
        >
          Add step
        </button>
      </div>
    </div>
  )
}