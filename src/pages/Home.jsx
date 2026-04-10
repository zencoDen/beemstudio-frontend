import { useEffect, useMemo, useState } from 'react'
import { apiGet, resolveMediaUrl } from '../utils/api.js'

const defaultHeroSlides = [
  {
    image: '/assets/items/intro-1.jpg',
    tagline: 'Timeless weddings and soulful portraits.',
    caption: 'Natural moments, editorial polish.',
  },
  {
    image: '/assets/items/intro-2.jpg',
    tagline: 'Luxury storytelling for modern couples.',
    caption: 'Frames designed for generations.',
  },
  {
    image: '/assets/items/intro-3.jpg',
    tagline: 'Emotion-first photography, artfully refined.',
    caption: 'Where real feeling meets fine art.',
  },
]

const defaultGallerySets = {
  Weddings: [
    '/assets/items/intro-1.jpg',
    '/assets/items/intro-2.jpg',
    '/assets/items/intro-3.jpg',
    '/assets/items/baduga.jpg',
  ],
  Maternity: [
    '/assets/items/baduga.jpg',
    '/assets/items/baduga-2.jpg',
    '/assets/items/intro-2.jpg',
    '/assets/items/intro-3.jpg',
  ],
  Family: [
    '/assets/items/intro-3.jpg',
    '/assets/items/intro-1.jpg',
    '/assets/items/baduga-2.jpg',
    '/assets/items/intro-2.jpg',
  ],
}

const defaultHomeTestimonials = [
  {
    quote: 'They made us feel comfortable, and the final gallery was beyond what we imagined.',
    name: 'Sonia',
  },
]

const defaultSteps = [
  { title: 'Pre-production', description: 'Shot list, mood board, styling, and location guidance tailored to you.' },
  { title: 'On the day', description: 'Gentle direction and candid energy so every moment feels natural.' },
  { title: 'Delivery', description: 'Elegant edits with cinematic color and a curated online gallery.' },
]

export default function Home() {
  const [heroIndex, setHeroIndex] = useState(0)
  const [activeSet, setActiveSet] = useState('Weddings')
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [home, setHome] = useState(null)
  const [gallerySets, setGallerySets] = useState(defaultGallerySets)
  const [homeTestimonials, setHomeTestimonials] = useState(defaultHomeTestimonials)
  const [steps, setSteps] = useState(defaultSteps)

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % defaultHeroSlides.length)
    }, 3800)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % homeTestimonials.length)
    }, 5200)

    return () => clearInterval(interval)
  }, [homeTestimonials])

  useEffect(() => {
    const load = async () => {
      try {
        const [homeData, categories, images, testimonialsData, stepData] = await Promise.all([
          apiGet('/home/'),
          apiGet('/gallery-categories/'),
          apiGet('/gallery-images/'),
          apiGet('/home-testimonials/'),
          apiGet('/experience-steps/'),
        ])

        if (homeData.length > 0) {
          const entry = homeData[0]
          setHome({
            ...entry,
            services_pills: entry.services_pills?.split('\n').filter(Boolean) || [],
          })
        }

        if (categories.length > 0 && images.length > 0) {
          const grouped = {}
          categories.forEach((cat) => {
            grouped[cat.name] = []
          })
          images.forEach((img) => {
            const category = categories.find((cat) => cat.id === img.category)
            if (category) {
              grouped[category.name].push(img.image)
            }
          })
          setGallerySets(grouped)
          setActiveSet(Object.keys(grouped)[0] || 'Weddings')
        }

        if (testimonialsData.length > 0) {
          setHomeTestimonials(testimonialsData)
        }
        if (stepData.length > 0) {
          setSteps(stepData)
        }
      } catch (err) {
        // fallback data already set
      }
    }

    load()
  }, [])

  const galleryImages = useMemo(() => gallerySets[activeSet] || [], [activeSet, gallerySets])
  const activeHeroSlide = defaultHeroSlides[heroIndex] || defaultHeroSlides[0]
  const goToPrevHero = () => {
    setHeroIndex((prev) => (prev - 1 + defaultHeroSlides.length) % defaultHeroSlides.length)
  }
  const goToNextHero = () => {
    setHeroIndex((prev) => (prev + 1) % defaultHeroSlides.length)
  }
  const currentSlideNumber = String(heroIndex + 1).padStart(2, '0')
  const totalSlideNumber = String(defaultHeroSlides.length).padStart(2, '0')

  return (
    <div>
      <section
        className="hero hero-figma"
        style={{
          backgroundImage: `linear-gradient(110deg, rgba(20, 16, 12, 0.62), rgba(20, 16, 12, 0.4)), url('${resolveMediaUrl(activeHeroSlide.image || home?.hero_image || '/assets/items/baduga.jpg')}')`,
        }}
      >
        <div className="container hero-figma-grid">
          <div className="hero-figma-copy">
            <span className="hero-tag">{home?.hero_tag || 'Beemstudios'}</span>
            <h1>{home?.hero_title || 'Lorem Ipsum Lorem Ipsum'}</h1>
            <p>{activeHeroSlide.tagline}</p>
            <p className="hero-caption">{activeHeroSlide.caption}</p>
            <div className="hero-actions">
              <a className="btn btn-outline-light btn-outline-cream" href={home?.hero_cta_primary_url || '/portfolio'}>
                {home?.hero_cta_primary_label || 'See our gallery'}
              </a>
              <a className="btn btn-ghost" href={home?.hero_cta_secondary_url || '/contact'}>
                {home?.hero_cta_secondary_label || 'Book appointment'}
              </a>
            </div>
          </div>
        </div>
        <div className="hero-slider-bottom">
          <button type="button" className="hero-nav-arrow hero-nav-left" onClick={goToPrevHero} aria-label="Previous slide">
            &#8592;
          </button>
          <div className="hero-slider-center">
            <span className="hero-slide-index">{currentSlideNumber} / {totalSlideNumber}</span>
            <span className="hero-slider-line" />
          </div>
          <button type="button" className="hero-nav-arrow hero-nav-right" onClick={goToNextHero} aria-label="Next slide">
            &#8594;
          </button>
        </div>
      </section>

      <section className="section section-floral" id="services">
        <div className="container split">
          <div>
            <span className="script-title">Beem Studios</span>
            <h2 className="section-heading">{home?.services_title || "A creative studio for life's milestones"}</h2>
            <p>{home?.services_description}</p>
            <div className="pill-row">
              {(home?.services_pills || ['Maternity', 'Weddings', 'Family portraits']).map((pill) => (
                <span key={pill}>{pill}</span>
              ))}
            </div>
            <a className="btn btn-outline-cream" href="/contact">Book now</a>
          </div>
          <div className="floral-card">
            <img src="/assets/items/intro-1.jpg" alt="Bride and groom" />
          </div>
        </div>
      </section>

      <section className="section gallery-section">
        <div className="container">
          <div className="gallery-header">
            <div>
              <span className="kicker">Signature galleries</span>
              <h2>Choose a collection</h2>
            </div>
            <div className="gallery-tabs">
              {Object.keys(gallerySets).map((key) => (
                <button
                  key={key}
                  type="button"
                  className={`tab ${key === activeSet ? 'active' : ''}`}
                  onClick={() => setActiveSet(key)}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>
          <div className="gallery-rail">
            {galleryImages.map((image, index) => (
              <div key={`${image}-${index}`} className="gallery-tile">
                <img src={image} alt="Gallery" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section experience-section">
        <div className="container experience-grid">
          {steps.map((step) => (
            <div key={step.title} className="experience-card">
              <h4>{step.title}</h4>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section hero-banner">
        <div className="banner-image">
          <img src="/assets/items/intro-2.jpg" alt="Outdoor couple" />
          <div className="banner-copy">
            <h2>{home?.banner_text || 'Do it your way'}</h2>
          </div>
        </div>
      </section>

      <section className="section home-final-story" id="stories">
        <div className="container story-grid">
          <div className="story-image">
            <img src="/assets/items/intro-3.jpg" alt="Golden hour portrait" />
          </div>
          <div className="story-copy">
            <span className="kicker">{home?.story_kicker || 'A premium wedding photography company'}</span>
            <h3>{home?.story_title || 'BEEMSTUDIOS'}</h3>
            <p>{home?.story_text}</p>
          </div>
        </div>
      </section>

      <section className="section testimonials-mini home-final-testimonials">
        <div className="container testimonials-mini-grid">
          <div>
            <span className="kicker">Client words</span>
            <h3>What couples say</h3>
            <p className="muted">Real stories from couples and families we photographed.</p>
          </div>
          <div className="testimonial-card">
            <p className="testimonial-quote">"{homeTestimonials[activeTestimonial]?.quote}"</p>
            <div className="testimonial-meta">
              <span>{homeTestimonials[activeTestimonial]?.name}</span>
            </div>
            <div className="testimonial-dots">
              {homeTestimonials.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  className={`dot ${index === activeTestimonial ? 'active' : ''}`}
                  onClick={() => setActiveTestimonial(index)}
                  aria-label={`Show testimonial from ${item.name}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
