# My Carport Guy catalog API

Small private API for storing the product catalog and website quote leads on
the existing server. It binds to localhost, uses a bearer token, and writes
data atomically. Product changes keep the latest 50 JSON backups.

The public website talks to this API from its server-side routes. The API token
must never be exposed to browser code.

Required server environment variable:

- `CATALOG_API_TOKEN`: long random secret shared only with the website host.

Deployment also requires:

- `catalog.mycarportguy.com` DNS pointed to the existing server.
- Nginx reverse proxy and HTTPS certificate.
- Initial copy of `data/products.json` to `/root/mycarportguy-data/products.json`.

Quote leads are created automatically in `/root/mycarportguy-data/quotes.json`.
Set `CATALOG_QUOTES_FILE` only if a different storage path is needed.

The current one-way admin password hash is stored in
`/root/mycarportguy-data/admin-auth.json`. Set `CATALOG_ADMIN_AUTH_FILE` only
if a different storage path is needed. The website uses this private record for
email password recovery; the plaintext password is never stored.
