import { useEffect, useState } from 'react'
import { apiGet } from '../../utils/api.js'
import { addListItem, deleteListItem, updateListItem } from './adminHelpers.js'

export default function AdminAboutStats() {
  const [items, setItems] = useState([])

  useEffect(() => {
    apiGet('/about-stats/').then(setItems)
  }, [])

  return (
    <div className="admin-section">
      <h2>About Stats</h2>
      <div className="admin-list">
        {items.map((item) => (
          <div key={item.id} className="admin-card">
            <input value={item.label} onChange={(e) => setItems(items.map((row) => (row.id === item.id ? { ...row, label: e.target.value } : row)))} />
            <input value={item.value} onChange={(e) => setItems(items.map((row) => (row.id === item.id ? { ...row, value: e.target.value } : row)))} />
            <input type="number" value={item.order || 0} onChange={(e) => setItems(items.map((row) => (row.id === item.id ? { ...row, order: Number(e.target.value) } : row)))} />
            <div className="admin-row">
              <button className="btn btn-brand" type="button" onClick={() => updateListItem('/about-stats/', items, setItems, item)}>Save</button>
              <button className="btn btn-outline-cream" type="button" onClick={() => deleteListItem('/about-stats/', items, setItems, item.id)}>Delete</button>
            </div>
          </div>
        ))}
        <button
          className="btn btn-outline-cream"
          type="button"
          onClick={() => addListItem('/about-stats/', items, setItems, { label: 'New stat', value: '0', order: items.length + 1 })}
        >
          Add stat
        </button>
      </div>
    </div>
  )
}