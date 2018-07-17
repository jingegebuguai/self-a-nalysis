import { STORAGE_KEY } from './store'

const localStoragePlugin = store => {
  store.subscribe((mutation, { todos }) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  })
}


export default [localStoragePlugin]