import SectionTitle from '../components/SectionTitle.jsx'
import { galleryMasonry } from '../data/portfolioData.js'

export default function Contact() {
  return (
    <section className="section">
      <div className="container contact-grid">
        <div>
          <SectionTitle
            kicker="Let’s talk"
            title="Book a shoot"
            subtitle="Tell us about the project and we’ll respond within 48 hours."
          />
          <ul className="contact-info">
            <li>hello@beemstudios.in</li>
            <li>+91 98765 43210</li>
            <li>Ooty • Coimbatore • Chennai</li>
          </ul>
          <div className="contact-gallery">
            {galleryMasonry.slice(0, 4).map((image, index) => (
              <img key={`${image}-${index}`} src={image} alt="Contact gallery" />
            ))}
          </div>
        </div>
        <form className="contact-form">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input className="form-control" type="text" placeholder="Your name" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input className="form-control" type="email" placeholder="Your email" />
            </div>
            <div className="col-12">
              <label className="form-label">Project type</label>
              <input className="form-control" type="text" placeholder="Wedding, brand, editorial..." />
            </div>
            <div className="col-12">
              <label className="form-label">Message</label>
              <textarea className="form-control" rows="5" placeholder="Share the mood, dates, or locations."></textarea>
            </div>
          </div>
          <button className="btn btn-brand mt-3" type="button">Send inquiry</button>
        </form>
      </div>
    </section>
  )
}