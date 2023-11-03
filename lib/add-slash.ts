import { Context } from 'https://edge.netlify.com'

export default async function handler(request: Request, context: Context) {
  const url = new URL(request.url)
  const { pathname, search } = url

  // Skip if we're already proxying the request
  if (pathname === '/' || request.headers.get('x-nf-sub-request')) {
    return
  }

  // Redirect to remove the .html
  for (const suffix of ['/index.html', '.html']) {
    if (pathname.endsWith(suffix)) {
      // Replace the suffix with a slash and append the query string
      const newLocation = `${url.origin}${pathname.slice(
        0,
        -suffix.length
      )}/${search}`

      return Response.redirect(newLocation, 301)
    }
  }
  // Add a slash if there's no file extension, and append the query string
  if (!pathname.endsWith('/') && !pathname.split('/').pop()?.includes('.')) {
    const newLocation = `${url.origin}${pathname}/${search}`
    return Response.redirect(newLocation, 301)
  }

  const response = await context.next({ sendConditionalRequest: true })

  // If origin returns a 301 we need to proxy it to avoid a redirect loop
  if (response.status === 301 && !pathname.endsWith('/')) {
    const location = response.headers.get('Location')
    // Avoid infinite loops
    request.headers.set('x-nf-sub-request', '1')
    // Ensure the query string is included in the rewritten location
    const newLocation = new URL(location || '', request.url)
    newLocation.search = search // Preserve the query string
    return context.rewrite(newLocation.toString())
  }

  return response
}
