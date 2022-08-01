import { initLocale } from './locale/init'

export async function initApp () {
  await initLocale()
}