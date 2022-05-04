import localforage from 'localforage'
import { replaceHtml } from './changeVersion'
import { isHTMLfile, isEmptyObject } from './utils'

declare const self: ServiceWorkerGlobalScope

const store = localforage.createInstance({
  name: 'mf'
})
let versions: Record<string, string> = {}

const syncMfStore = async () => {
  console.log('[Service-worker] Sync mf store')

  const data = {}
  await store.iterate((value: string, key) => {
    data[key] = value
  })

  versions = data
}

self.addEventListener('install', (event) => {
  console.log('[Service-worker] Service worker installing')
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('[Service-worker] Service worker activating')

  event.waitUntil(syncMfStore())
})

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'update-mf-store') {
    console.log('[Service-worker] Update mf event')
    event.waitUntil(syncMfStore())
  }
})

self.addEventListener('fetch', function (event) {
  console.log('[Service-worker] Fetch', event.request.url, versions)

  if(isHTMLfile(event.request) && !isEmptyObject(versions)) {
    event.respondWith(replaceHtml(event.request, versions))
  }

})

export type {}
