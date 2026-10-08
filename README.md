# SharePal – Gaming Gadgets on Rent (Bangalore)

A recreation of the SharePal page
[sharepal.in/bangalore/gaming-gadgets-on-rent](https://sharepal.in/bangalore/gaming-gadgets-on-rent),
built as part of a front-end assignment. The goal was to match the original
layout, typography, spacing, interactions and animations as closely as possible,
while keeping the SharePal design language consistent.

**Live demo:** [https://YOUR-VERCEL-URL.vercel.app/bangalore/gaming-gadgets-on-rent](https://sharepal-gaming-gadgets-ten.vercel.app/bangalore/gaming-gadgets-on-rent)
**Repository:** https://github.com/rakshitha-builds/sharepal-gaming-gadgets

---

## Tech Stack

| Area      | Choice                         |
| --------- | ------------------------------ |
| Framework | Next.js 15 (App Router)        |
| Language  | TypeScript, React              |
| Styling   | Global CSS (`globals.css`)     |
| State     | React Context (`lib/store.tsx`) |
| Data      | Local JSON served via an API route |
| Hosting   | Vercel                         |

---

## Getting Started

**Prerequisites:** Node.js 18.18 or newer and npm.

```bash
# 1. Clone the repository
git clone https://github.com/rakshitha-builds/sharepal-gaming-gadgets.git
cd sharepal-gaming-gadgets

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root route redirects to
`/bangalore/gaming-gadgets-on-rent`.

### Other scripts

```bash
npm run build   # create a production build
npm run start   # run the production build locally
```

---

## Project Structure

```
src/
├── app/
│   ├── api/products/route.ts                 # Products API (reads the JSON data)
│   ├── bangalore/gaming-gadgets-on-rent/
│   │   ├── page.tsx                          # The recreated page
│   │   └── loading.tsx                       # Loading state
│   ├── layout.tsx                            # Root layout
│   ├── page.tsx                              # Redirects to the gaming page
│   ├── not-found.tsx                         # 404 page
│   └── globals.css                           # Global styles and design tokens
├── components/
│   ├── GamingPage.tsx                        # Page composition
│   ├── Header.tsx                            # Site header and navigation
│   ├── ProductCard.tsx                       # Product card
│   ├── Sections.tsx                          # Page sections
│   └── Overlays.tsx                          # Modals and overlays
├── data/
│   └── product-list.json                     # Product data
└── lib/
    ├── products.ts                           # Data helpers
    ├── store.tsx                             # Shared state
    └── types.ts                              # TypeScript types
```

---

## What Was Recreated

- Overall page layout and section order
- Typography, spacing, colours and buttons
- Product listing with product cards and images
- Interactions, hover effects, animations and transitions
- Responsive behaviour for mobile, tablet and desktop

---

## Improvements and Additions

> Edit this list so it matches what you actually built.

- Loading state while products are fetched
- Custom 404 page
- Responsive layout polish
- _Add your own ideas here_

---

## Notes

- The original assignment shipped a very large `product-list.json` (about 1.7 GB).
  It is **not** committed to this repository because GitHub rejects files over
  100 MB. The app uses a smaller product dataset in `src/data/product-list.json`
  so the live site works out of the box.
- Product images and branding belong to SharePal and are used only for this
  assignment.

---

## Author

**Rakshitha R**
GitHub: [@rakshitha-builds](https://github.com/rakshitha-builds)
