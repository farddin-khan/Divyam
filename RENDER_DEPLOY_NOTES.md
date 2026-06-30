# Render deployment notes

Use these settings on Render:

- Build Command: `npm install && npm run build`
- Start Command: `npm start`

Set these environment variables in Render dashboard:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_USER_ID`
- `ADMIN_SECRET`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `SHIPROCKET_EMAIL`
- `SHIPROCKET_PASSWORD`
- `SHIPROCKET_STORE_ID`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`

Keep `VITE_API_URL` blank when frontend and backend are deployed together on this same Render service. If the frontend is hosted somewhere else, set `VITE_API_URL` to this Render service URL before building the frontend.
