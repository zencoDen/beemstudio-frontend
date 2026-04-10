import { useEffect, useState } from 'react'
import { apiGet, apiPost, apiPut } from '../../utils/api.js'

const emptyAbout = {
  heading: 'Welcome to BEEM STUDIOS',
  paragraph_one:
    "We are passionate about preserving life's precious moments. Our skilled team of photographers is dedicated to providing exceptional services, ensuring that your memories will be cherished for years to come.",
  paragraph_two:
    'With expertise in various genres, including weddings, engagements, and family portraits, we excel at telling unique and captivating stories through our lenses. Our attention to detail sets us apart, as we work closely with you to capture the essence of your story.',
  phone: '8940110906',
  email: 'beemstudios43@gmail.com',
  address: 'SakthiMalai Road , Ramchand, Ground floor, kotagiri',
}

export default function AdminAbout() {
  const [about, setAbout] = useState(emptyAbout)
  const [aboutId, setAboutId] = useState(null)

  useEffect(() => {
    apiGet('/about/').then((data) => {
      if (data.length > 0) {
        setAbout(data[0])
        setAboutId(data[0].id)
      }
    })
  }, [])

  const save = async () => {
    if (aboutId) {
      const updated = await apiPut(`/about/${aboutId}/`, about)
      setAbout(updated)
    } else {
      const created = await apiPost('/about/', about)
      setAbout(created)
      setAboutId(created.id)
    }
  }

  return (
    <div className="admin-section">
      <h2>About Page</h2>
      <div className="admin-grid">
        <label>
          Heading
          <input value={about.heading} onChange={(e) => setAbout({ ...about, heading: e.target.value })} />
        </label>
        <label>
          Paragraph one
          <textarea value={about.paragraph_one} onChange={(e) => setAbout({ ...about, paragraph_one: e.target.value })} />
        </label>
        <label>
          Paragraph two
          <textarea value={about.paragraph_two} onChange={(e) => setAbout({ ...about, paragraph_two: e.target.value })} />
        </label>
        <label>
          Phone
          <input value={about.phone} onChange={(e) => setAbout({ ...about, phone: e.target.value })} />
        </label>
        <label>
          Email
          <input value={about.email} onChange={(e) => setAbout({ ...about, email: e.target.value })} />
        </label>
        <label>
          Address
          <textarea value={about.address} onChange={(e) => setAbout({ ...about, address: e.target.value })} />
        </label>
      </div>
      <button className="btn btn-brand" type="button" onClick={save}>Save About</button>
    </div>
  )
}