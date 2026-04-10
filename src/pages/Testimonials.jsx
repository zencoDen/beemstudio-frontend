import { useEffect, useState } from 'react'
import { apiGet, resolveMediaUrl } from '../utils/api.js'

const defaultReviews = [
  {
    name: 'Meha Ravi',
    meta: 'Maternity session',
    quote:
      'A huge thank you to Beem Studios for the most beautiful maternity session! They made me feel so comfortable and confident throughout the entire shoot. The photos turned out even better than I imagined. The editing is elegant and timeless. They never rushed me and took the time to ensure every pose felt natural and looked beautiful.',
    rating: 5,
  },
]

const renderStars = (rating = 5) => '★'.repeat(Math.max(1, rating))

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [reviews, setReviews] = useState(defaultReviews)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [reviews])

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiGet('/testimonials/')
        if (data.length > 0) {
          setReviews(data)
        }
      } catch (err) {
        // fallback
      }
    }

    load()
  }, [])

  return (
    <div>
      <section className="testimonial-hero">
        <div className="container">
          <span className="kicker">Google reviews</span>
          <h1>Testimonials</h1>
          <p>Real stories from couples and families who trusted Beem Studios.</p>
        </div>
      </section>

      <section className="section">
        <div className="container testimonial-page-grid">
          <div className="testimonial-feature">
            <div className="testimonial-feature__header">
              <div className="testimonial-avatar">
                {reviews[activeIndex]?.image ? (
                  <img src={resolveMediaUrl(reviews[activeIndex].image)} alt={reviews[activeIndex].name} />
                ) : (
                  <span>{reviews[activeIndex]?.name?.charAt(0)}</span>
                )}
              </div>
              <div>
                <span className="testimonial-stars">{renderStars(reviews[activeIndex]?.rating)}</span>
                <h4>{reviews[activeIndex]?.name}</h4>
                <small>{reviews[activeIndex]?.meta}</small>
              </div>
            </div>
            <p className="testimonial-quote">“{reviews[activeIndex]?.quote}”</p>
            {reviews[activeIndex]?.note ? <div className="testimonial-note">{reviews[activeIndex].note}</div> : null}
            <div className="testimonial-dots">
              {reviews.map((review, index) => (
                <button
                  key={review.name}
                  type="button"
                  className={`dot ${index === activeIndex ? 'active' : ''}`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show review from ${review.name}`}
                />
              ))}
            </div>
          </div>

          <div className="testimonial-list">
            {reviews.map((review) => (
              <article key={review.name} className="testimonial-card light">
                <div className="testimonial-card__header">
                  <div className="testimonial-avatar small">
                    {review.image ? <img src={resolveMediaUrl(review.image)} alt={review.name} /> : <span>{review.name?.charAt(0)}</span>}
                  </div>
                  <div>
                    <div className="testimonial-stars">{renderStars(review.rating)}</div>
                    <h6>{review.name}</h6>
                    <span>{review.meta}</span>
                  </div>
                </div>
                <p>“{review.quote}”</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}