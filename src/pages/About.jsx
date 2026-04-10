import { useEffect, useState } from 'react'
import { apiGet } from '../utils/api.js'

const defaultAbout = {
  heading: 'Welcome to BEEM STUDIOS',
  paragraph_one:
    "We are passionate about preserving life's precious moments. Our skilled team of photographers is dedicated to providing exceptional services, ensuring that your memories will be cherished for years to come.",
  paragraph_two:
    'With expertise in various genres, including weddings, engagements, and family portraits, we excel at telling unique and captivating stories through our lenses. Our attention to detail sets us apart, as we work closely with you to capture the essence of your story.',
  phone: '8940110906',
  email: 'beemstudios43@gmail.com',
  address: 'SakthiMalai Road , Ramchand, Ground floor, kotagiri',
}

const defaultTimeline = [
  { title: 'Listen', text: 'We start with your story, mood, and expectations so the plan feels personal.' },
  { title: 'Design', text: 'We build a shot list, styling guidance, and locations that fit your energy.' },
  { title: 'Capture', text: 'Calm direction on the day so emotions stay real and effortless.' },
  { title: 'Deliver', text: 'Cinematic edits, curated sequences, and a gallery you’ll revisit forever.' },
]

const defaultStats = [
  { label: 'Stories captured', value: '480+' },
  { label: 'Wedding projects', value: '190+' },
  { label: 'Families documented', value: '160+' },
]

const defaultTestimonials = [
  {
    quote: 'Beem Studios captured every little detail without ever making us feel staged. The photos feel so true to us.',
    name: 'Anitha & Rahul',
    type: 'Wedding story',
  },
  {
    quote: 'We loved how calm the team was on set. The portraits feel cinematic but still honest.',
    name: 'Sneha',
    type: 'Engagement session',
  },
  {
    quote: 'The final gallery was breathtaking. Our family portraits finally feel like us.',
    name: 'Manoj & Priya',
    type: 'Family portraits',
  },
]

export default function About() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [about, setAbout] = useState(defaultAbout)
  const [timeline, setTimeline] = useState(defaultTimeline)
  const [stats, setStats] = useState(defaultStats)
  const [testimonials, setTestimonials] = useState(defaultTestimonials)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [testimonials])

  useEffect(() => {
    const load = async () => {
      try {
        const [aboutData, timelineData, testimonialData, statData] = await Promise.all([
          apiGet('/about/'),
          apiGet('/about-timeline/'),
          apiGet('/testimonials/'),
          apiGet('/about-stats/'),
        ])

        if (aboutData.length > 0) {
          setAbout(aboutData[0])
        }
        if (timelineData.length > 0) {
          setTimeline(timelineData)
        }
        if (statData.length > 0) {
          setStats(statData)
        }
        if (testimonialData.length > 0) {
          setTestimonials(testimonialData)
        }
      } catch (err) {
        // fallback to defaults
      }
    }

    load()
  }, [])

  return (
    <div>
      <section className="about-hero">
        <div className="container about-hero-grid">
          <div>
            <span className="kicker">BEEMSTUDIOS</span>
            <h1>{about.heading}</h1>
            <p>{about.paragraph_one}</p>
            <p>{about.paragraph_two}</p>
          </div>
          <div className="about-hero-photo">
            <img src="/assets/items/intro-1.jpg" alt="Beem Studios couple portrait" />
          </div>
        </div>
      </section>

      <section className="section about-split">
        <div className="container split">
          <div className="about-card">
            <h3>Our promise</h3>
            <p>
              Every frame is crafted to feel timeless. We guide you through the process, build the mood,
              and ensure the gallery reflects the emotion of your day.
            </p>
            <ul className="about-list">
              <li>Pre-shoot consultation and concept planning.</li>
              <li>Guided posing and candid direction on the day.</li>
              <li>Carefully curated edits, color, and delivery.</li>
            </ul>
          </div>
          <div className="about-highlight">
            <img src="/assets/items/baduga.jpg" alt="Wedding photo" />
            <div>
              <span className="kicker">Signature work</span>
              <h4>Honest, cinematic, and soulful.</h4>
              <p>We keep the energy calm so your moments feel effortless on camera.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section timeline-section">
        <div className="container">
          <span className="kicker">Our process</span>
          <h3>The Beem Studios journey</h3>
          <div className="timeline-grid">
            {timeline.map((item) => (
              <div key={item.title} className="timeline-card">
                <h5>{item.title}</h5>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section stats-band">
        <div className="container stats-grid">
          {stats.map((item) => (
            <div key={item.label} className="stats-card">
              <h2>{item.value}</h2>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section testimonial-band">
        <div className="container testimonial-grid">
          <div>
            <span className="kicker">Client words</span>
            <h3>Testimonials</h3>
            <p>Stories from couples and families who trusted us with their moments.</p>
          </div>
          <div className="testimonial-card">
            <p className="testimonial-quote">“{testimonials[activeIndex]?.quote}”</p>
            <div className="testimonial-meta">
              <span>{testimonials[activeIndex]?.name}</span>
              <small>{testimonials[activeIndex]?.type || testimonials[activeIndex]?.meta}</small>
            </div>
            <div className="testimonial-dots">
              {testimonials.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  className={`dot ${index === activeIndex ? 'active' : ''}`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show testimonial from ${item.name}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section contact-panel">
        <div className="container contact-panel-grid">
          <div>
            <span className="kicker">Let&apos;s connect</span>
            <h3>Beemstudios</h3>
            <p>
              {about.phone}
              <br />
              {about.email}
            </p>
            <p>{about.address}</p>
          </div>
          <div className="contact-panel-photo">
            <img src="/assets/items/intro-3.jpg" alt="Studio portrait" />
          </div>
        </div>
      </section>
    </div>
  )
}