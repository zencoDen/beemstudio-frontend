import { useEffect, useState } from 'react'
import {
  apiDelete,
  apiGet,
  apiLogin,
  apiPost,
  apiPut,
  getToken,
  setToken,
} from '../utils/api.js'

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

export default function AdminPanel() {
  const [token, setTokenState] = useState(getToken())
  const [login, setLogin] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [home, setHome] = useState(emptyHome)
  const [homeId, setHomeId] = useState(null)
  const [about, setAbout] = useState(emptyAbout)
  const [aboutId, setAboutId] = useState(null)
  const [services, setServices] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [homeTestimonials, setHomeTestimonials] = useState([])
  const [faqs, setFaqs] = useState([])
  const [experienceSteps, setExperienceSteps] = useState([])
  const [timeline, setTimeline] = useState([])
  const [aboutStats, setAboutStats] = useState([])
  const [galleryCategories, setGalleryCategories] = useState([])
  const [galleryImages, setGalleryImages] = useState([])

  const loadAll = async () => {
    try {
      const [
        homeData,
        aboutData,
        servicesData,
        testimonialData,
        homeTestData,
        faqData,
        expData,
        timelineData,
        statsData,
        catData,
        imgData,
      ] = await Promise.all([
        apiGet('/home/'),
        apiGet('/about/'),
        apiGet('/services/'),
        apiGet('/testimonials/'),
        apiGet('/home-testimonials/'),
        apiGet('/faqs/'),
        apiGet('/experience-steps/'),
        apiGet('/about-timeline/'),
        apiGet('/about-stats/'),
        apiGet('/gallery-categories/'),
        apiGet('/gallery-images/'),
      ])

      if (homeData.length > 0) {
        setHome(homeData[0])
        setHomeId(homeData[0].id)
      }
      if (aboutData.length > 0) {
        setAbout(aboutData[0])
        setAboutId(aboutData[0].id)
      }
      setServices(servicesData)
      setTestimonials(testimonialData)
      setHomeTestimonials(homeTestData)
      setFaqs(faqData)
      setExperienceSteps(expData)
      setTimeline(timelineData)
      setAboutStats(statsData)
      setGalleryCategories(catData)
      setGalleryImages(imgData)
    } catch (err) {
      setError('Failed to load content. Check the API server.')
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    setError('')
    try {
      const result = await apiLogin(login.username, login.password)
      setToken(result.token)
      setTokenState(result.token)
    } catch (err) {
      setError('Login failed. Please check your credentials.')
    }
  }

  const handleSaveHome = async () => {
    setError('')
    try {
      if (homeId) {
        const updated = await apiPut(`/home/${homeId}/`, home)
        setHome(updated)
      } else {
        const created = await apiPost('/home/', home)
        setHome(created)
        setHomeId(created.id)
      }
    } catch (err) {
      setError('Failed to save home content.')
    }
  }

  const handleSaveAbout = async () => {
    setError('')
    try {
      if (aboutId) {
        const updated = await apiPut(`/about/${aboutId}/`, about)
        setAbout(updated)
      } else {
        const created = await apiPost('/about/', about)
        setAbout(created)
        setAboutId(created.id)
      }
    } catch (err) {
      setError('Failed to save about content.')
    }
  }

  const updateListItem = async (path, list, setList, item) => {
    const updated = await apiPut(`${path}${item.id}/`, item)
    setList(list.map((entry) => (entry.id === item.id ? updated : entry)))
  }

  const addListItem = async (path, list, setList, item) => {
    const created = await apiPost(path, item)
    setList([...list, created])
  }

  const deleteListItem = async (path, list, setList, id) => {
    await apiDelete(`${path}${id}/`)
    setList(list.filter((entry) => entry.id !== id))
  }

  if (!token) {
    return (
      <div className="admin-page">
        <div className="admin-login">
          <h1>Admin Login</h1>
          <p>Sign in to manage Beem Studios content.</p>
          {error ? <div className="admin-error">{error}</div> : null}
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={login.username}
              onChange={(event) => setLogin({ ...login, username: event.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              value={login.password}
              onChange={(event) => setLogin({ ...login, password: event.target.value })}
            />
            <button className="btn btn-brand" type="submit">Log in</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="container admin-shell">
        <aside className="admin-sidebar">
          <div className="admin-sidebar__title">Admin Menu</div>
          <nav className="admin-sidebar__nav">
            <a href="#admin-home">Home</a>
            <a href="#admin-about">About</a>
            <a href="#admin-about-stats">About Stats</a>
            <a href="#admin-services">Services</a>
            <a href="#admin-testimonials">Testimonials</a>
            <a href="#admin-home-testimonials">Home Testimonials</a>
            <a href="#admin-faqs">FAQs</a>
            <a href="#admin-experience">Experience Steps</a>
            <a href="#admin-timeline">About Timeline</a>
            <a href="#admin-gallery-categories">Gallery Categories</a>
            <a href="#admin-gallery-images">Gallery Images</a>
          </nav>
          <button
            className="btn btn-outline-cream admin-logout"
            type="button"
            onClick={() => {
              setToken(null)
              setTokenState(null)
            }}
          >
            Log out
          </button>
        </aside>

        <div className="admin-content">
          <div className="admin-header">
            <div>
              <h1>Beem Studios Admin</h1>
              <p>Manage all site content from one place.</p>
            </div>
          </div>
          {error ? <div className="admin-error">{error}</div> : null}

          <section id="admin-home" className="admin-section">
          <h2>Home Page</h2>
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
            <label>
              Story kicker
              <input value={home.story_kicker} onChange={(e) => setHome({ ...home, story_kicker: e.target.value })} />
            </label>
            <label>
              Story title
              <input value={home.story_title} onChange={(e) => setHome({ ...home, story_title: e.target.value })} />
            </label>
            <label>
              Story text
              <textarea value={home.story_text} onChange={(e) => setHome({ ...home, story_text: e.target.value })} />
            </label>
          </div>
          <button className="btn btn-brand" type="button" onClick={handleSaveHome}>Save Home</button>
        </section>

        <section id="admin-about" className="admin-section">
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
          <button className="btn btn-brand" type="button" onClick={handleSaveAbout}>Save About</button>
        </section>

        <section id="admin-about-stats" className="admin-section">
          <h2>About Stats</h2>
          <div className="admin-list">
            {aboutStats.map((item) => (
              <div key={item.id} className="admin-card">
                <input value={item.label} onChange={(e) => setAboutStats(aboutStats.map((row) => (row.id === item.id ? { ...row, label: e.target.value } : row)))} />
                <input value={item.value} onChange={(e) => setAboutStats(aboutStats.map((row) => (row.id === item.id ? { ...row, value: e.target.value } : row)))} />
                <input type="number" value={item.order || 0} onChange={(e) => setAboutStats(aboutStats.map((row) => (row.id === item.id ? { ...row, order: Number(e.target.value) } : row)))} />
                <div className="admin-row">
                  <button className="btn btn-brand" type="button" onClick={() => updateListItem('/about-stats/', aboutStats, setAboutStats, item)}>Save</button>
                  <button className="btn btn-outline-cream" type="button" onClick={() => deleteListItem('/about-stats/', aboutStats, setAboutStats, item.id)}>Delete</button>
                </div>
              </div>
            ))}
            <button
              className="btn btn-outline-cream"
              type="button"
              onClick={() => addListItem('/about-stats/', aboutStats, setAboutStats, { label: 'New stat', value: '0', order: aboutStats.length + 1 })}
            >
              Add stat
            </button>
          </div>
        </section>

        <section id="admin-services" className="admin-section">
          <h2>Services</h2>
          <div className="admin-list">
            {services.map((service) => (
              <div key={service.id} className="admin-card">
                <input value={service.title} onChange={(e) => setServices(services.map((item) => (item.id === service.id ? { ...item, title: e.target.value } : item)))} />
                <textarea value={service.description} onChange={(e) => setServices(services.map((item) => (item.id === service.id ? { ...item, description: e.target.value } : item)))} />
                <textarea value={service.features || ''} onChange={(e) => setServices(services.map((item) => (item.id === service.id ? { ...item, features: e.target.value } : item)))} placeholder="Feature lines" />
                <input value={service.image || ''} onChange={(e) => setServices(services.map((item) => (item.id === service.id ? { ...item, image: e.target.value } : item)))} placeholder="Image path" />
                <input type="number" value={service.order || 0} onChange={(e) => setServices(services.map((item) => (item.id === service.id ? { ...item, order: Number(e.target.value) } : item)))} />
                <div className="admin-row">
                  <button className="btn btn-brand" type="button" onClick={() => updateListItem('/services/', services, setServices, service)}>Save</button>
                  <button className="btn btn-outline-cream" type="button" onClick={() => deleteListItem('/services/', services, setServices, service.id)}>Delete</button>
                </div>
              </div>
            ))}
            <button
              className="btn btn-outline-cream"
              type="button"
              onClick={() =>
                addListItem('/services/', services, setServices, {
                  title: 'New service',
                  description: '',
                  features: '',
                  image: '',
                  order: services.length + 1,
                })
              }
            >
              Add service
            </button>
          </div>
        </section>

        <section id="admin-testimonials" className="admin-section">
          <h2>Testimonials (Main page)</h2>
          <div className="admin-list">
            {testimonials.map((item) => (
              <div key={item.id} className="admin-card">
                <input value={item.name} onChange={(e) => setTestimonials(testimonials.map((row) => (row.id === item.id ? { ...row, name: e.target.value } : row)))} />
                <input value={item.meta || ''} onChange={(e) => setTestimonials(testimonials.map((row) => (row.id === item.id ? { ...row, meta: e.target.value } : row)))} placeholder="Meta" />
                <textarea value={item.quote} onChange={(e) => setTestimonials(testimonials.map((row) => (row.id === item.id ? { ...row, quote: e.target.value } : row)))} />
                <input type="number" value={item.rating || 5} onChange={(e) => setTestimonials(testimonials.map((row) => (row.id === item.id ? { ...row, rating: Number(e.target.value) } : row)))} />
                <input value={item.source || ''} onChange={(e) => setTestimonials(testimonials.map((row) => (row.id === item.id ? { ...row, source: e.target.value } : row)))} />
                <input type="number" value={item.order || 0} onChange={(e) => setTestimonials(testimonials.map((row) => (row.id === item.id ? { ...row, order: Number(e.target.value) } : row)))} />
                <div className="admin-row">
                  <button className="btn btn-brand" type="button" onClick={() => updateListItem('/testimonials/', testimonials, setTestimonials, item)}>Save</button>
                  <button className="btn btn-outline-cream" type="button" onClick={() => deleteListItem('/testimonials/', testimonials, setTestimonials, item.id)}>Delete</button>
                </div>
              </div>
            ))}
            <button
              className="btn btn-outline-cream"
              type="button"
              onClick={() =>
                addListItem('/testimonials/', testimonials, setTestimonials, {
                  name: 'New client',
                  meta: '',
                  quote: '',
                  rating: 5,
                  source: 'Google Reviews',
                  order: testimonials.length + 1,
                })
              }
            >
              Add testimonial
            </button>
          </div>
        </section>

        <section id="admin-home-testimonials" className="admin-section">
          <h2>Home Testimonials</h2>
          <div className="admin-list">
            {homeTestimonials.map((item) => (
              <div key={item.id} className="admin-card">
                <input value={item.name} onChange={(e) => setHomeTestimonials(homeTestimonials.map((row) => (row.id === item.id ? { ...row, name: e.target.value } : row)))} />
                <textarea value={item.quote} onChange={(e) => setHomeTestimonials(homeTestimonials.map((row) => (row.id === item.id ? { ...row, quote: e.target.value } : row)))} />
                <input type="number" value={item.order || 0} onChange={(e) => setHomeTestimonials(homeTestimonials.map((row) => (row.id === item.id ? { ...row, order: Number(e.target.value) } : row)))} />
                <div className="admin-row">
                  <button className="btn btn-brand" type="button" onClick={() => updateListItem('/home-testimonials/', homeTestimonials, setHomeTestimonials, item)}>Save</button>
                  <button className="btn btn-outline-cream" type="button" onClick={() => deleteListItem('/home-testimonials/', homeTestimonials, setHomeTestimonials, item.id)}>Delete</button>
                </div>
              </div>
            ))}
            <button
              className="btn btn-outline-cream"
              type="button"
              onClick={() => addListItem('/home-testimonials/', homeTestimonials, setHomeTestimonials, { name: 'New client', quote: '', order: homeTestimonials.length + 1 })}
            >
              Add home testimonial
            </button>
          </div>
        </section>

        <section id="admin-faqs" className="admin-section">
          <h2>FAQs</h2>
          <div className="admin-list">
            {faqs.map((item) => (
              <div key={item.id} className="admin-card">
                <input value={item.question} onChange={(e) => setFaqs(faqs.map((row) => (row.id === item.id ? { ...row, question: e.target.value } : row)))} />
                <textarea value={item.answer} onChange={(e) => setFaqs(faqs.map((row) => (row.id === item.id ? { ...row, answer: e.target.value } : row)))} />
                <input type="number" value={item.order || 0} onChange={(e) => setFaqs(faqs.map((row) => (row.id === item.id ? { ...row, order: Number(e.target.value) } : row)))} />
                <div className="admin-row">
                  <button className="btn btn-brand" type="button" onClick={() => updateListItem('/faqs/', faqs, setFaqs, item)}>Save</button>
                  <button className="btn btn-outline-cream" type="button" onClick={() => deleteListItem('/faqs/', faqs, setFaqs, item.id)}>Delete</button>
                </div>
              </div>
            ))}
            <button
              className="btn btn-outline-cream"
              type="button"
              onClick={() => addListItem('/faqs/', faqs, setFaqs, { question: 'New question', answer: '', order: faqs.length + 1 })}
            >
              Add FAQ
            </button>
          </div>
        </section>

        <section id="admin-experience" className="admin-section">
          <h2>Experience Steps</h2>
          <div className="admin-list">
            {experienceSteps.map((item) => (
              <div key={item.id} className="admin-card">
                <input value={item.title} onChange={(e) => setExperienceSteps(experienceSteps.map((row) => (row.id === item.id ? { ...row, title: e.target.value } : row)))} />
                <textarea value={item.description} onChange={(e) => setExperienceSteps(experienceSteps.map((row) => (row.id === item.id ? { ...row, description: e.target.value } : row)))} />
                <input type="number" value={item.order || 0} onChange={(e) => setExperienceSteps(experienceSteps.map((row) => (row.id === item.id ? { ...row, order: Number(e.target.value) } : row)))} />
                <div className="admin-row">
                  <button className="btn btn-brand" type="button" onClick={() => updateListItem('/experience-steps/', experienceSteps, setExperienceSteps, item)}>Save</button>
                  <button className="btn btn-outline-cream" type="button" onClick={() => deleteListItem('/experience-steps/', experienceSteps, setExperienceSteps, item.id)}>Delete</button>
                </div>
              </div>
            ))}
            <button
              className="btn btn-outline-cream"
              type="button"
              onClick={() => addListItem('/experience-steps/', experienceSteps, setExperienceSteps, { title: 'New step', description: '', order: experienceSteps.length + 1 })}
            >
              Add step
            </button>
          </div>
        </section>

        <section id="admin-timeline" className="admin-section">
          <h2>About Timeline</h2>
          <div className="admin-list">
            {timeline.map((item) => (
              <div key={item.id} className="admin-card">
                <input value={item.title} onChange={(e) => setTimeline(timeline.map((row) => (row.id === item.id ? { ...row, title: e.target.value } : row)))} />
                <textarea value={item.text} onChange={(e) => setTimeline(timeline.map((row) => (row.id === item.id ? { ...row, text: e.target.value } : row)))} />
                <input type="number" value={item.order || 0} onChange={(e) => setTimeline(timeline.map((row) => (row.id === item.id ? { ...row, order: Number(e.target.value) } : row)))} />
                <div className="admin-row">
                  <button className="btn btn-brand" type="button" onClick={() => updateListItem('/about-timeline/', timeline, setTimeline, item)}>Save</button>
                  <button className="btn btn-outline-cream" type="button" onClick={() => deleteListItem('/about-timeline/', timeline, setTimeline, item.id)}>Delete</button>
                </div>
              </div>
            ))}
            <button
              className="btn btn-outline-cream"
              type="button"
              onClick={() => addListItem('/about-timeline/', timeline, setTimeline, { title: 'New step', text: '', order: timeline.length + 1 })}
            >
              Add timeline item
            </button>
          </div>
        </section>

        <section id="admin-gallery-categories" className="admin-section">
          <h2>Gallery Categories</h2>
          <div className="admin-list">
            {galleryCategories.map((item) => (
              <div key={item.id} className="admin-card">
                <input value={item.name} onChange={(e) => setGalleryCategories(galleryCategories.map((row) => (row.id === item.id ? { ...row, name: e.target.value } : row)))} />
                <input type="number" value={item.order || 0} onChange={(e) => setGalleryCategories(galleryCategories.map((row) => (row.id === item.id ? { ...row, order: Number(e.target.value) } : row)))} />
                <div className="admin-row">
                  <button className="btn btn-brand" type="button" onClick={() => updateListItem('/gallery-categories/', galleryCategories, setGalleryCategories, item)}>Save</button>
                  <button className="btn btn-outline-cream" type="button" onClick={() => deleteListItem('/gallery-categories/', galleryCategories, setGalleryCategories, item.id)}>Delete</button>
                </div>
              </div>
            ))}
            <button
              className="btn btn-outline-cream"
              type="button"
              onClick={() => addListItem('/gallery-categories/', galleryCategories, setGalleryCategories, { name: 'New category', order: galleryCategories.length + 1 })}
            >
              Add category
            </button>
          </div>
        </section>

        <section id="admin-gallery-images" className="admin-section">
          <h2>Gallery Images</h2>
          <div className="admin-list">
            {galleryImages.map((item) => (
              <div key={item.id} className="admin-card">
                <select
                  value={item.category}
                  onChange={(e) =>
                    setGalleryImages(
                      galleryImages.map((row) =>
                        row.id === item.id ? { ...row, category: Number(e.target.value) } : row
                      )
                    )
                  }
                >
                  {galleryCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <input value={item.image} onChange={(e) => setGalleryImages(galleryImages.map((row) => (row.id === item.id ? { ...row, image: e.target.value } : row)))} placeholder="Image path" />
                <input type="number" value={item.order || 0} onChange={(e) => setGalleryImages(galleryImages.map((row) => (row.id === item.id ? { ...row, order: Number(e.target.value) } : row)))} />
                <div className="admin-row">
                  <button className="btn btn-brand" type="button" onClick={() => updateListItem('/gallery-images/', galleryImages, setGalleryImages, item)}>Save</button>
                  <button className="btn btn-outline-cream" type="button" onClick={() => deleteListItem('/gallery-images/', galleryImages, setGalleryImages, item.id)}>Delete</button>
                </div>
              </div>
            ))}
            <button
              className="btn btn-outline-cream"
              type="button"
              onClick={() =>
                addListItem('/gallery-images/', galleryImages, setGalleryImages, {
                  category: galleryCategories[0]?.id || 1,
                  image: '',
                  order: galleryImages.length + 1,
                })
              }
            >
              Add image
            </button>
          </div>
        </section>
        </div>
      </div>
    </div>
  )
}
