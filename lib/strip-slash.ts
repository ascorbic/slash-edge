import { Context } from 'https://edge.netlify.com'

export default async function handler(request: Request, context: Context) {
  const url = new URL(request.url)
  const { pathname, search } = url

  // Skip for root, or if we're already proxying the request
  if (pathname === '/' || request.headers.get('x-nf-sub-request')) {
    return
  }

  // Redirect to remove the trailing slash or .html
  for (const suffix of ['/', '/index.html', '.html']) {
    if (pathname.endsWith(suffix)) {
      // Construct the new URL without the suffix and with the query string
      const newLocation = `${url.origin}${pathname.slice(
        0,
        -suffix.length
      )}${search}`

      return Response.redirect(newLocation, 301)
    }
  }

  const response = await context.next({ sendConditionalRequest: true })

  // If origin returns a 301 we need to proxy it to avoid a redirect loop
  if (response.status === 301 && pathname.endsWith('/')) {
    const location = response.headers.get('Location')
    // Avoid infinite loops
    request.headers.set('x-nf-sub-request', '1')
    return context.rewrite(new URL(location || '', request.url).toString())
  }

  return response
}
