# Strip or add trailing slash

Banish or enforce trailing slashes with Netlify edge functions.

## Usage

- Copy the appropriate function from [`/netlify/edge-functions/`](https://github.com/ascorbic/slash-edge/tree/main/netlify/edge-functions) to your site's `/netlify/edge-functions/` directory.
- Add a declaration to your site's `netlify.toml`:

```toml
[[edge_functions]]
function = "strip-slash" # or "add-slash"
path = "/*"
```

Licence: MIT
