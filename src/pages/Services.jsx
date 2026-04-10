import { useEffect, useState } from 'react'
import SectionTitle from '../components/SectionTitle.jsx'
import { apiGet } from '../utils/api.js'

const defaultServices = [
  {
    title: 'Wedding Stories',
    description:
      'Full-day coverage from pre-wedding prep to reception, with curated highlights and a cinematic album.',
    features: ['2 photographers', 'Candid + editorial', 'Premium album'],
    image: '/assets/items/intro-1.jpg',
  },
]

export default function Services() {
  const [services, setServices] = useState(defaultServices)
  const [faqs, setFaqs] = useState([])
  const [openFaq, setOpenFaq] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [serviceData, faqData] = await Promise.all([apiGet('/services/'), apiGet('/faqs/')])
        if (serviceData.length > 0) {
          setServices(
            serviceData.map((item) => ({
              ...item,
              features: item.features ? item.features.split('\n').filter(Boolean) : [],
            }))
          )
        }
        if (faqData.length > 0) {
          setFaqs(faqData)
        }
      } catch (err) {
        // fallback data
      }
    }

    load()
  }, [])

  return (
    <div>
      <section className="services-hero">
        <div className="container services-hero-grid">
          <div>
            <span className="kicker">Beemstudios</span>
            <h1>Photography services with soul</h1>
            <p>
              From elegant wedding stories to intimate family portraits, we craft visuals that feel
              personal, cinematic, and timeless.
            </p>
            <a className="btn btn-outline-cream" href="/contact">Book a consultation</a>
          </div>
          <div className="services-hero-photo">
            <img src="/assets/items/intro-2.jpg" alt="Wedding couple" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionTitle
            kicker="Services"
            title="What we capture"
            subtitle="Curated offerings designed for every milestone."
          />
          <div className="services-grid">
            {services.map((service) => (
              <article key={service.title} className="service-card">
                <div className="service-image">
                  <img src={service.image} alt={service.title} />
                </div>
                <div className="service-body">
                  <h4>{service.title}</h4>
                  <p>{service.description}</p>
                  <ul>
                    {(service.features || []).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section faq-section">
        <div className="container faq-grid">
          <div>
            <span className="kicker">FAQ</span>
            <h3>Questions about our services</h3>
          </div>
          <div className="faq-list">
            {faqs.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={`faq-item ${openFaq === index ? 'open' : ''}`}
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <span>{item.question}</span>
                <p>{item.answer}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section services-process">
        <div className="container">
          <SectionTitle
            kicker="Experience"
            title="How we work"
            subtitle="A calm, guided process that keeps the focus on your story."
          />
          <div className="process-steps">
            <div>
              <h5>Plan</h5>
              <p>Consultation, mood board, and timeline guidance.</p>
            </div>
            <div>
              <h5>Create</h5>
              <p>Direction, candid capture, and creative lighting.</p>
            </div>
            <div>
              <h5>Deliver</h5>
              <p>Elegant edits, curated galleries, and premium albums.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section services-callout">
        <div className="container services-callout-grid">
          <div>
            <span className="kicker">Let’s build your story</span>
            <h3>Need a custom package?</h3>
            <p>
              We tailor our coverage based on your timeline, venue, and creative direction. Tell us
              about your vision and we’ll shape a plan around it.
            </p>
            <a className="btn btn-brand" href="/contact">Start planning</a>
          </div>
          <div className="services-callout-image">
            <img src="/assets/items/intro-1.jpg" alt="Couple portrait" />
          </div>
        </div>
      </section>
    </div>
  )
}