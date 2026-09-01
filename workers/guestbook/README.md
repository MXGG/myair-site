# Private guestbook service

The website sends private guestbook entries to a Cloudflare Worker mounted at `/api/guestbook/*`. D1 stores the records, one-time image CAPTCHA challenges, and short-lived hashed rate-limit events. No message-list endpoint is public.

Each message may contain up to 3,000 lines. The form has no total character-count limit, while the API retains a 1 MB transport ceiling to protect the service from oversized requests.

GitHub Actions deploys the service without exposing credentials. Add these repository secrets before the first deployment:

- `CLOUDFLARE_API_TOKEN`: a scoped token with Workers Scripts, Workers Routes, and D1 edit permissions.
- `CLOUDFLARE_ACCOUNT_ID`: the Cloudflare account that owns `myair.info`.
- `GUESTBOOK_ADMIN_TOKEN`: a unique administrator passphrase of at least 24 random characters. This is the value entered on the administrator page.

The workflow creates or reuses the `myair-guestbook` D1 database, commits its non-secret database ID, applies migrations, deploys the Worker, and runs an end-to-end privacy check. It generates a new private CAPTCHA signing secret for each deployment; this can only invalidate CAPTCHA images opened during the deployment window.

For a manual deployment:

1. Create the D1 database `myair-guestbook` and replace the placeholder `database_id` in `wrangler.jsonc`.
2. Apply migrations with `npm run guestbook:migrate`.
3. Set `ADMIN_TOKEN` and `CAPTCHA_SECRET` as Worker secrets. Use separate randomly generated values and never commit them.
4. Deploy with `npm run guestbook:deploy`.

The administrator pages are `/guestbook/admin/` and `/zh/guestbook/admin/`. The administrator token stays in `sessionStorage` for the active tab. The API returns private records only when the token is supplied as a Bearer token.
