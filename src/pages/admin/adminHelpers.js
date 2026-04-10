import { apiDelete, apiPost, apiPut } from '../../utils/api.js'

export const updateListItem = async (path, list, setList, item) => {
  const updated = await apiPut(`${path}${item.id}/`, item)
  setList(list.map((entry) => (entry.id === item.id ? updated : entry)))
}

export const addListItem = async (path, list, setList, item) => {
  const created = await apiPost(path, item)
  setList([...list, created])
}

export const deleteListItem = async (path, list, setList, id) => {
  await apiDelete(`${path}${id}/`)
  setList(list.filter((entry) => entry.id !== id))
}