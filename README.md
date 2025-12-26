# Personal Finance Dashboard

A mobile-first personal finance dashboard built with **Cloudflare Workers + D1** backend and static HTML/CSS/JS frontend.

## Features

- 📊 **Budget Health** - Track spending vs budget per category with visual progress bars
- 📅 **Calendar View** - Heat-mapped spending by day with paycheck indicators  
- 💳 **Transactions** - Search, filter, and manage expenses
- 📋 **Budgets** - Inline editing with "copy last month" and rebalance suggestions
- 🎯 **Goals** - Track rainy day fund and custom savings goals
- 📈 **Reports** - Yearly overview, charts, and CSV export

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend Runtime | Cloudflare Workers |
| Database | Cloudflare D1 (SQLite) |
| API Framework | Hono |
| Frontend | Static HTML/CSS/JS |
| Styling | Vanilla CSS (dark theme) |

## Quick Start

### Prerequisites
- Node.js 18+
- Cloudflare account

### Local Development

```bash
# Install dependencies
cd worker
npm install

# Create D1 database
npx wrangler d1 create finance-db

# Run migrations
npx wrangler d1 execute finance-db --local --file=migrations/0001_initial_schema.sql
npx wrangler d1 execute finance-db --local --file=migrations/0002_seed_data.sql
npx wrangler d1 execute finance-db --local --file=migrations/0003_add_transactions.sql

# Start worker dev server
npm run dev

# In another terminal, serve frontend
cd ../frontend
npx serve -l 3000
```

- Worker API: http://127.0.0.1:8787
- Frontend: http://localhost:3000

## Deployment

### Deploy Worker to Cloudflare

```bash
cd worker

# Update wrangler.toml with your D1 database ID
# Run migrations on production D1
npx wrangler d1 execute finance-db --file=migrations/0001_initial_schema.sql
npx wrangler d1 execute finance-db --file=migrations/0002_seed_data.sql
npx wrangler d1 execute finance-db --file=migrations/0003_add_transactions.sql

# Deploy
npx wrangler deploy
```

### Deploy Frontend to Cloudflare Pages

1. Push to GitHub
2. Connect repo to Cloudflare Pages
3. Set build output directory to `frontend`
4. Update `frontend/js/api.js` to point to your worker URL

## Project Structure

```
finance-dashboard/
├── worker/                 # Cloudflare Worker API
│   ├── src/
│   │   ├── index.ts       # Main Hono router
│   │   └── routes/        # API endpoints
│   ├── migrations/        # D1 SQL migrations
│   └── wrangler.toml      # Worker config
│
└── frontend/              # Static site
    ├── index.html         # Home Dashboard
    ├── calendar.html      # Calendar view
    ├── transactions.html  # Transactions
    ├── budgets.html       # Budgets
    ├── goals.html         # Goals
    ├── reports.html       # Reports
    ├── css/app.css        # Design system
    └── js/                # JavaScript
```

## License

MIT
