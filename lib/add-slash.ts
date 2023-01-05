import { Context } from 'https://edge.netlify.com'

export default async function handler(request: Request, context: Context) {
  const { pathname } = new URL(request.url)
  console.log('add slash', pathname)

  // Skip if we're already proxying the request
  if (request.headers.get('x-nf-subrequest')) {
    console.log('skipping')
    return
  }

  // Redirect to remove the .html
  for (const suffix of ['/index.html', '.html']) {
    if (pathname.endsWith(suffix)) {
      // Replace the suffix with a slash
      const uri = `${request.url.slice(0, -suffix.length)}/`
      console.log('redirecting to', uri, '301')
      return Response.redirect(uri, 301)
    }
  }
  // Add a slash, unless there's a file extension
  if (!pathname.endsWith('/') && !pathname.split('/').pop()?.includes('.')) {
    const url = `${request.url}/`
    console.log('redirecting to', url, '301')
    return Response.redirect(url, 301)
  }

  console.log('sending conditional request')
  const response = await context.next({ sendConditionalRequest: true })
  console.log('got response', response)
  // If origin returns a 301 we need to proxy it to avoid a redirect loop
  // TODO: check that this is just a redirect to the canonical URL, not some other kind
  if (response.status === 301) {
    console.log('got 301')
    const location = response.headers.get('Location')
    const proxyTo = new URL(location || '', request.url).toString()
    console.log('proxying to', proxyTo)
    const headers = new Headers(request.headers)
    // Avoid infinite loops
    headers.set('x-nf-subrequest', '1')
    const res = await fetch(proxyTo, {
      headers,
    })
    console.log('proxying response', res)
    return res
  }
  return response
}
