# My Carport Guy catalog API

Small private API for storing the product catalog on the existing server. It
binds to localhost, uses a bearer token, writes the catalog atomically, and
keeps the latest 50 JSON backups.

The public website talks to this API from its server-side routes. The API token
must never be exposed to browser code.

Required server environment variable:

- `CATALOG_API_TOKEN`: long random secret shared only with the website host.

Deployment also requires:

- `catalog.mycarportguy.com` DNS pointed to the existing server.
- Nginx reverse proxy and HTTPS certificate.
- Initial copy of `data/products.json` to `/root/mycarportguy-data/products.json`.
