import { Context } from 'https://edge.netlify.com'

export default async function handler(request: Request, context: Context) {
  const { pathname } = new URL(request.url)

  // Skip if we're already proxying the request
  if (request.headers.get('x-nf-subrequest')) {
    return
  }

  // Redirect to remove the .html
  for (const suffix of ['/index.html', '.html']) {
    if (pathname.endsWith(suffix)) {
      // Replace the suffix with a slash
      return Response.redirect(`${request.url.slice(0, -suffix.length)}/`, 301)
    }
  }
  // Add a slash, unless there's a file extension
  if (!pathname.endsWith('/') && !pathname.split('/').pop()?.includes('.')) {
    return Response.redirect(`${request.url}/`, 301)
  }

  const response = await context.next({ sendConditionalRequest: true })

  // If origin returns a 301 we need to proxy it to avoid a redirect loop
  if (response.status === 301 && !pathname.endsWith('/')) {
    const location = response.headers.get('Location')
    // Avoid infinite loops
    request.headers.set('x-nf-subrequest', '1')
    return context.rewrite(new URL(location || '', request.url).toString())
  }

  return response
}
