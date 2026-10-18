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

## Lead tracker updates

Deploy the website and this API together when updating lead tracking. The API
accepts the expanded sales stages plus `nextFollowUp` (YYYY-MM-DD or an empty
string) and `lastContactedAt` (ISO timestamp or an empty string) on quote updates.
Existing quote records and legacy statuses remain supported without a migration.
The admin opens to Leads, supports manual lead entry, and sorts the follow-up
queue by date. Completing a contact advances the stage and saves its next date;
it does not send messages. Follow-up suggestions use calendar days: 2 days for
the first follow-up, 7 for the second, 30 for long-term, and 7 after purchase.
