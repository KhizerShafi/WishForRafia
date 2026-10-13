# For Rafia — Birthday Website

A mobile-first, animated birthday experience built with React + Vite. It has six connected screens, responsive layouts, a progress indicator, a surprise reveal, and a confetti finale.

## Run locally

1. Install Node.js (LTS).
2. Extract this folder and open it in a terminal.
3. Run:

   ```bash
   npm install
   npm run dev
   ```

4. Open the local URL printed in your terminal.

## Production build

```bash
npm run build
npm run preview
```

The production website is generated in `dist/`.

## Deploy to Vercel

**Option A — GitHub (recommended)**
1. Upload the project folder to a new GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Framework preset: **Vite**.
4. Build command: `npm run build`
5. Output directory: `dist`
6. Click **Deploy**.

**Option B — Vercel CLI**
```bash
npm install
npm run build
npx vercel
```

`vercel.json` includes a fallback rewrite for client-side routing if routes are added later.

## Quick customization

- Edit the six screen messages in `src/main.jsx`.
- Change the visual palette and animation timing in `src/styles.css`.
- The current experience uses CSS artwork and emoji, so there are no image files to upload.
- For a personal touch, replace the sample messages with your client's own words and add real photos only with permission.

No API keys, database, or environment variables are required.
