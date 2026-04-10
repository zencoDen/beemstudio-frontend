import { NavLink, Outlet } from 'react-router-dom'
import { useState } from 'react'
import { apiLogin, getToken, setToken } from '../../utils/api.js'

export default function AdminLayout() {
  const [token, setTokenState] = useState(getToken())
  const [login, setLogin] = useState({ username: '', password: '' })
  const [error, setError] = useState('')

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
            <NavLink to="/admin-panel">Dashboard</NavLink>
            <NavLink to="/admin-panel/home">Home</NavLink>
            <NavLink to="/admin-panel/gallery">Home Gallery</NavLink>
            <NavLink to="/admin-panel/home-testimonials">Home Testimonials</NavLink>
            <NavLink to="/admin-panel/about">About</NavLink>
            <NavLink to="/admin-panel/portfolio">Portfolio</NavLink>
            <NavLink to="/admin-panel/testimonials">Testimonials</NavLink>
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
          <Outlet />
        </div>
      </div>
    </div>
  )
}