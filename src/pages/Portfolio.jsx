import { useEffect, useMemo, useState } from 'react'
import SectionTitle from '../components/SectionTitle.jsx'
import { apiGet, resolveMediaUrl } from '../utils/api.js'

export default function Portfolio() {
  const [albums, setAlbums] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [likes, setLikes] = useState({})

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiGet('/albums/')
        setAlbums(data)
        if (data.length > 0) setActiveId(data[0].id)
      } catch (err) {
        // no-op
      }
    }

    load()
  }, [])

  const activeAlbum = useMemo(() => albums.find((album) => album.id === activeId), [albums, activeId])

  const toggleLike = (photoId) => {
    setLikes((prev) => ({ ...prev, [photoId]: !prev[photoId] }))
  }

  return (
    <div>
      <section className="section">
        <div className="container">
          <SectionTitle
            kicker="Portfolio"
            title="Albums & Galleries"
            subtitle="Browse curated stories from our latest shoots."
          />
          {albums.length === 0 ? (
            <p className="muted">No albums yet. Add them from the admin panel.</p>
          ) : null}
          <div className="portfolio-album-grid">
            {albums.map((album) => (
              <button
                key={album.id}
                type="button"
                className={`portfolio-album-card ${album.id === activeId ? 'active' : ''}`}
                onClick={() => setActiveId(album.id)}
              >
                <img
                  src={resolveMediaUrl(album.cover_image || album.banner_image || album.photos?.[0]?.image)}
                  alt={album.title}
                />
                <div className="portfolio-album-meta">
                  <h5>{album.title}</h5>
                  <span>{album.location}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {activeAlbum ? (
        <section className="section portfolio-detail">
          <div className="container">
            <div className="portfolio-banner">
              <img
                src={resolveMediaUrl(
                  activeAlbum.banner_image || activeAlbum.cover_image || activeAlbum.photos?.[0]?.image
                )}
                alt={activeAlbum.title}
              />
              <div className="portfolio-banner__content">
                <h2>{activeAlbum.title}</h2>
                <p>{activeAlbum.description}</p>
                <div className="portfolio-banner__meta">
                  {activeAlbum.event_date ? <span>{new Date(activeAlbum.event_date).toLocaleDateString()}</span> : null}
                  {activeAlbum.location ? <span>{activeAlbum.location}</span> : null}
                </div>
              </div>
            </div>

            {activeAlbum.photos?.length ? (
              <div className="portfolio-highlights">
                {(activeAlbum.photos || []).slice(0, 4).map((photo) => (
                  <div key={photo.id} className="portfolio-photo">
                    <img src={resolveMediaUrl(photo.image)} alt={photo.title} />
                    <div className="portfolio-photo__overlay">
                      <button
                        className={`icon-button ${likes[photo.id] ? 'active' : ''}`}
                        type="button"
                        onClick={() => toggleLike(photo.id)}
                        aria-label="Like"
                      >
                        ❤
                      </button>
                      <a
                        className="icon-button"
                        href={resolveMediaUrl(photo.download_url || photo.image)}
                        download
                        aria-label="Download"
                      >
                        ⬇
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="portfolio-gallery">
              {((activeAlbum.photos || []).slice(4).length
                ? (activeAlbum.photos || []).slice(4)
                : activeAlbum.photos || []
              ).map((photo) => (
                <div key={photo.id} className="portfolio-photo">
                  <img src={resolveMediaUrl(photo.image)} alt={photo.title} />
                  <div className="portfolio-photo__overlay">
                    <button
                      className={`icon-button ${likes[photo.id] ? 'active' : ''}`}
                      type="button"
                      onClick={() => toggleLike(photo.id)}
                      aria-label="Like"
                    >
                      ❤
                    </button>
                    <a
                      className="icon-button"
                      href={resolveMediaUrl(photo.download_url || photo.image)}
                      download
                      aria-label="Download"
                    >
                      ⬇
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}
