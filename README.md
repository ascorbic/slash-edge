# Strip or add trailing slash

Banish or enforce trailing slashes with Netlify edge functions. [Demo](https://trailing-slash-edge.netlify.app/)

## Usage

You can either manually copy the function, or import it from a URL.

### Manual

Copy the appropriate function from [`/lib/`](https://github.com/ascorbic/slash-edge/tree/main/lib) to your site's `/netlify/edge-functions/` directory.

### Import from URL

Create a handler and import the function from deno.land/x:

```typescript
export { stripSlash as default } from 'https://deno.land/x/slash_handler/mod.ts'
```

- Add a declaration to your site's `netlify.toml`:

```toml
[[edge_functions]]
function = "strip-slash" # or "add-slash"
path = "/*"
```

Licence: MIT
