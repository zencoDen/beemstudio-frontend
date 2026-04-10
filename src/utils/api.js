const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api'

export const getToken = () => localStorage.getItem('beem_admin_token')

export const setToken = (token) => {
  if (token) {
    localStorage.setItem('beem_admin_token', token)
  } else {
    localStorage.removeItem('beem_admin_token')
  }
}

const headers = (isJson = true) => {
  const token = getToken()
  const base = {}
  if (isJson) base['Content-Type'] = 'application/json'
  if (token) base.Authorization = `Token ${token}`
  return base
}

export const apiGet = async (path) => {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) throw new Error('Failed to load')
  return res.json()
}

export const apiPost = async (path, payload) => {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to save')
  return res.json()
}

export const apiPut = async (path, payload) => {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to update')
  return res.json()
}

export const apiPatch = async (path, payload) => {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to update')
  return res.json()
}

export const apiDelete = async (path) => {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'DELETE',
    headers: headers(false),
  })
  if (!res.ok) throw new Error('Failed to delete')
  return true
}

export const apiUpload = async (path, formData) => {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: headers(false),
    body: formData,
  })
  if (!res.ok) throw new Error('Upload failed')
  return res.json()
}

export const apiPatchUpload = async (path, formData) => {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PATCH',
    headers: headers(false),
    body: formData,
  })
  if (!res.ok) throw new Error('Upload failed')
  return res.json()
}

export const apiLogin = async (username, password) => {
  const res = await fetch(`${API_BASE}/auth/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) throw new Error('Login failed')
  return res.json()
}

export const resolveMediaUrl = (value) => {
  if (!value) return ''
  if (value.startsWith('http')) return value
  const base = API_BASE.replace('/api', '')
  if (value.startsWith('/')) return `${base}${value}`
  return `${base}/${value}`
}