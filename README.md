# SharePal – Gaming Gadgets on Rent (Bangalore)

Recreation of https://sharepal.in/bangalore/gaming-gadgets-on-rent
Stack: Next.js 15 (App Router), React 19, TypeScript, Framer Motion.

## Run
    npm install
    npm run dev      # http://localhost:3000 (redirects to /bangalore/gaming-gadgets-on-rent)
    npm run build && npm start

## Deploy
Import the repo on vercel.com and click Deploy (no config needed).

## Architecture
- `src/data/product-list.json` – supplied product data (23 items)
- `src/lib/products.ts` – filter / sort / paginate / price logic
- `src/app/api/products/route.ts` – REST API: `GET /api/products?q=&category=&sort=&page=`
- `src/app/bangalore/gaming-gadgets-on-rent/page.tsx` – server component, SSRs first page from URL params
- `src/components/` – GamingPage (state + fetching), Header (date picker, scroll-hide), ProductCard, Sections (FAQ, Footer)

## Highlights
- Filters, sort and search live in the URL (shareable, refresh-safe)
- Debounced, abortable fetches with loading and error states
- Edge cases: out of stock, zero ratings, "Vote to Launch" item, broken images, empty results, invalid date range
- Animations: staggered card entrance, layout reflow on filter, animated filter pill, price count-up on date change, spring FAQ, scroll-hide header; respects prefers-reduced-motion
- Accessible focus styles, aria labels, dialog role; dark mode via prefers-color-scheme
