# Strip or add trailing slash

Banish or enforce trailing slashes with this edge function!

## Usage

- Copy the appropriate edge function from `/netlify/edge-functions/` to your `/netlify/edge-functions/` directory.
- Add the appropriate deplaration to your site's `netlify.toml`:

```toml
[[edge_functions]]
function = "strip-slash"
path = "/*"
```

Licence: MIT
