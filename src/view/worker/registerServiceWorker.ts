export const registerServiceWorker = async () => {
  if (typeof document === 'undefined' ) return

  if ('serviceWorker' in navigator) {
    try {
      console.log('[Register] Start service worker registration')
      const registration = await navigator.serviceWorker.register('/mf/web-wlb-host/service-worker.js', { scope: './' })

      if (registration.installing) {
        console.log('[Register] Service worker installing')
      } else if (registration.waiting) {
        console.log('[Register] Service worker installed')
      } else if (registration.active) {
        console.log('[Register] Service worker active')
      }

    } catch (error) {
      console.error(`Registration failed with ${error}`)
    }
  }
}