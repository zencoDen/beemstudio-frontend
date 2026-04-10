import { useEffect, useState } from 'react'
import { apiGet } from '../../utils/api.js'

const normalize = (items, label) =>
  (items || []).map((item) => ({
    label,
    title: item.title || item.name || item.heading || item.question || item.label,
    updated_at: item.updated_at || item.created_at,
  }))

export default function AdminDashboard() {
  const [recent, setRecent] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const [services, testimonials, albums, photos, faqs, home, about] = await Promise.all([
          apiGet('/services/'),
          apiGet('/testimonials/'),
          apiGet('/albums/'),
          apiGet('/photos/'),
          apiGet('/faqs/'),
          apiGet('/home/'),
          apiGet('/about/'),
        ])

        const combined = [
          ...normalize(services, 'Service'),
          ...normalize(testimonials, 'Testimonial'),
          ...normalize(albums, 'Album'),
          ...normalize(photos, 'Photo'),
          ...normalize(faqs, 'FAQ'),
          ...normalize(home, 'Home'),
          ...normalize(about, 'About'),
        ]

        const sorted = combined
          .filter((item) => item.updated_at)
          .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
          .slice(0, 8)

        setRecent(sorted)
      } catch (err) {
        setRecent([])
      }
    }

    load()
  }, [])

  return (
    <div className="admin-section">
      <h2>Recent changes</h2>
      <div className="admin-recent">
        {recent.length === 0 ? (
          <p className="muted">No recent updates yet.</p>
        ) : (
          recent.map((item, index) => (
            <div key={`${item.label}-${index}`} className="admin-recent-item">
              <span>{item.label}</span>
              <strong>{item.title}</strong>
              <small>{new Date(item.updated_at).toLocaleString()}</small>
            </div>
          ))
        )}
      </div>
    </div>
  )
}