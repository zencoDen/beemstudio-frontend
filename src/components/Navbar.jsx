import { NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <header className={`site-header ${isHome ? 'is-home' : ''}`}>
      <nav className="navbar">
        <div className="container nav-shell">
          <NavLink className="navbar-brand" to="/">BEEMSTUDIOS</NavLink>

          <button
            className="nav-toggle"
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className={`nav-menu ${open ? 'open' : ''}`}>
            <NavLink className="nav-link" to="/about">About us</NavLink>
            <NavLink className="nav-link" to="/portfolio">Portfolio</NavLink>
            <NavLink className="nav-link" to="/services">Services</NavLink>
            <NavLink className="nav-link" to="/testimonials">Testimonials</NavLink>
            <NavLink className="nav-link" to="/contact">Contact</NavLink>
            <NavLink className="btn btn-outline-light btn-outline-cream" to="/contact">
              Book appointment
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  )
}