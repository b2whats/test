type VersionMap = Record<string, string>
const replaceVersions = (html: string, versions: VersionMap) => {
  const regexp = new RegExp(`src=[",']${self.origin}/(\\w+)/([\\w,.]+)/remoteEntry.js[",']`, 'gm')

  return html.replace(regexp, (_,  module, version) => {
    return `src='${self.origin}/${module}/${versions[module] || version}/remoteEntry.js'`
  })
}

export const replaceHtml = async (request: Request, versions: VersionMap) => {
  const response = await fetch(request)
  const html = await response.text()

  return new Response(
    replaceVersions(html, versions),
    response
  )
}

export const sendUpdateMfStore = () => {
  if (!navigator.serviceWorker.controller) return 

  navigator.serviceWorker.controller.postMessage({
    type: 'update-mf-store',
  })
}
