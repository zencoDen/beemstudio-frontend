import { useEffect, useState } from 'react'
import { apiGet, apiPatch, apiPatchUpload, apiPost } from '../../utils/api.js'

const emptyHome = {
  hero_tag: 'Beemstudios',
  hero_title: 'Lorem Ipsum Lorem Ipsum',
  hero_lines:
    'Timeless weddings and soulful portraits.\nLuxury storytelling for modern couples.\nEmotion-first photography, artfully refined.',
  hero_cta_primary_label: 'See our gallery',
  hero_cta_primary_url: '/portfolio',
  hero_cta_secondary_label: 'Book appointment',
  hero_cta_secondary_url: '/contact',
  services_title: "A creative studio for life's milestones",
  services_description:
    'We craft elegant visual stories with a calm, guided approach. Every project is planned, styled, and shot to feel personal, intimate, and timeless.',
  services_pills: 'Maternity\nWeddings\nFamily portraits',
  banner_text: 'Do it your way',
  story_kicker: 'A premium wedding photography company',
  story_title: 'BEEMSTUDIOS',
  story_text:
    "There is no such thing as a perfect love story or a perfect wedding. That's why we focus on the in-between moments, the laughter, the quiet looks, and the emotions that make your day unforgettable. We love documenting honest memories and creating imagery that feels true to you.",
}

export default function AdminHome() {
  const [home, setHome] = useState(emptyHome)
  const [homeId, setHomeId] = useState(null)
  const [status, setStatus] = useState('')

  useEffect(() => {
    const load = async () => {
      const data = await apiGet('/home/')
      if (data.length > 0) {
        setHome(data[0])
        setHomeId(data[0].id)
      }
    }

    load()
  }, [])

  const save = async () => {
    setStatus('Saving...')
    const payload = { ...home }
    delete payload.hero_image
    if (homeId) {
      const updated = await apiPatch(`/home/${homeId}/`, payload)
      setHome(updated)
    } else {
      const created = await apiPost('/home/', payload)
      setHome(created)
      setHomeId(created.id)
    }
    setStatus('Saved')
  }

  const ensureHome = async () => {
    if (homeId) return homeId
    const created = await apiPost('/home/', home)
    setHome(created)
    setHomeId(created.id)
    return created.id
  }

  const uploadHero = async (file) => {
    if (!file) return
    const id = await ensureHome()
    const formData = new FormData()
    formData.append('hero_image', file)
    const updated = await apiPatchUpload(`/home/${id}/`, formData)
    setHome(updated)
    setStatus('Hero updated')
  }

  return (
    <div className="admin-section">
      <div className="admin-subsection__head">
        <h2>Home Page</h2>
      </div>
      <div className="admin-grid">
        <label>
          Hero tag
          <input value={home.hero_tag} onChange={(e) => setHome({ ...home, hero_tag: e.target.value })} />
        </label>
        <label>
          Hero title
          <input value={home.hero_title} onChange={(e) => setHome({ ...home, hero_title: e.target.value })} />
        </label>
        <label>
          Hero lines (one per line)
          <textarea value={home.hero_lines} onChange={(e) => setHome({ ...home, hero_lines: e.target.value })} />
        </label>
        <label>
          Hero image
          <input type="file" accept="image/*" onChange={(e) => uploadHero(e.target.files?.[0])} />
        </label>
        <label>
          Primary button label
          <input
            value={home.hero_cta_primary_label}
            onChange={(e) => setHome({ ...home, hero_cta_primary_label: e.target.value })}
          />
        </label>
        <label>
          Primary button URL
          <input
            value={home.hero_cta_primary_url}
            onChange={(e) => setHome({ ...home, hero_cta_primary_url: e.target.value })}
          />
        </label>
        <label>
          Secondary button label
          <input
            value={home.hero_cta_secondary_label}
            onChange={(e) => setHome({ ...home, hero_cta_secondary_label: e.target.value })}
          />
        </label>
        <label>
          Secondary button URL
          <input
            value={home.hero_cta_secondary_url}
            onChange={(e) => setHome({ ...home, hero_cta_secondary_url: e.target.value })}
          />
        </label>
        <label>
          Services title
          <input value={home.services_title} onChange={(e) => setHome({ ...home, services_title: e.target.value })} />
        </label>
        <label>
          Services description
          <textarea
            value={home.services_description}
            onChange={(e) => setHome({ ...home, services_description: e.target.value })}
          />
        </label>
        <label>
          Services pills (one per line)
          <textarea value={home.services_pills} onChange={(e) => setHome({ ...home, services_pills: e.target.value })} />
        </label>
        <label>
          Banner text
          <input value={home.banner_text} onChange={(e) => setHome({ ...home, banner_text: e.target.value })} />
        </label>
      </div>
      <div className="admin-row">
        <button className="btn btn-brand btn-small" type="button" onClick={save}>Save Home</button>
        {status ? <span className="muted">{status}</span> : null}
      </div>
    </div>
  )
}
