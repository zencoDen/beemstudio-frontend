import { useEffect, useState } from 'react'
import { apiGet } from '../../utils/api.js'
import { addListItem, deleteListItem, updateListItem } from './adminHelpers.js'

export default function AdminGallery() {
  const [categories, setCategories] = useState([])
  const [images, setImages] = useState([])

  useEffect(() => {
    const load = async () => {
      const [catData, imgData] = await Promise.all([apiGet('/gallery-categories/'), apiGet('/gallery-images/')])
      setCategories(catData)
      setImages(imgData)
    }

    load()
  }, [])

  return (
    <div className="admin-section">
      <h2>Home Gallery</h2>

      <div className="admin-subsection">
        <h3>Categories</h3>
        <div className="admin-list">
          {categories.map((item) => (
            <div key={item.id} className="admin-card">
              <input value={item.name} onChange={(e) => setCategories(categories.map((row) => (row.id === item.id ? { ...row, name: e.target.value } : row)))} />
              <input type="number" value={item.order || 0} onChange={(e) => setCategories(categories.map((row) => (row.id === item.id ? { ...row, order: Number(e.target.value) } : row)))} />
              <div className="admin-row">
                <button className="btn btn-brand" type="button" onClick={() => updateListItem('/gallery-categories/', categories, setCategories, item)}>Save</button>
                <button className="btn btn-outline-cream" type="button" onClick={() => deleteListItem('/gallery-categories/', categories, setCategories, item.id)}>Delete</button>
              </div>
            </div>
          ))}
          <button
            className="btn btn-outline-cream"
            type="button"
            onClick={() => addListItem('/gallery-categories/', categories, setCategories, { name: 'New category', order: categories.length + 1 })}
          >
            Add category
          </button>
        </div>
      </div>

      <div className="admin-subsection">
        <h3>Images</h3>
        <div className="admin-list">
          {images.map((item) => (
            <div key={item.id} className="admin-card">
              <select
                value={item.category}
                onChange={(e) =>
                  setImages(images.map((row) => (row.id === item.id ? { ...row, category: Number(e.target.value) } : row)))
                }
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <input value={item.image} onChange={(e) => setImages(images.map((row) => (row.id === item.id ? { ...row, image: e.target.value } : row)))} placeholder="Image path" />
              <input type="number" value={item.order || 0} onChange={(e) => setImages(images.map((row) => (row.id === item.id ? { ...row, order: Number(e.target.value) } : row)))} />
              <div className="admin-row">
                <button className="btn btn-brand" type="button" onClick={() => updateListItem('/gallery-images/', images, setImages, item)}>Save</button>
                <button className="btn btn-outline-cream" type="button" onClick={() => deleteListItem('/gallery-images/', images, setImages, item.id)}>Delete</button>
              </div>
            </div>
          ))}
          <button
            className="btn btn-outline-cream"
            type="button"
            onClick={() =>
              addListItem('/gallery-images/', images, setImages, {
                category: categories[0]?.id || 1,
                image: '',
                order: images.length + 1,
              })
            }
          >
            Add image
          </button>
        </div>
      </div>
    </div>
  )
}