# E-Commerce Chat App

A full-stack e-commerce application built with Next.js 15+, Prisma, PostgreSQL (NeonDB), Stripe, Pusher, and Tailwind CSS featuring real-time customer support chat.

## Features

- **Storefront**: Browse products, search, filter by category, and purchase
- **Shopping Cart**: Persistent cart with add/remove items
- **Checkout**: Integrated Stripe payment processing
- **Real-time Chat**: Customer support chat using Pusher Channels
- **Admin Dashboard**: 
  - Overview with stats (revenue, orders, products, users)
  - Product management (CRUD operations)
  - Order management with status updates
  - Customer support chat interface
- **Authentication**: Secure login with NextAuth v5 (Credentials)

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (NeonDB)
- **Payment**: Stripe
- **Real-time**: Pusher Channels
- **Auth**: NextAuth v5

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (NeonDB recommended)
- Stripe account
- Pusher account

### Installation

1. Clone the repository:
```bash
   git clone https://github.com/Rayzhayat/e-commerce-nextjs.git
   cd e-commerce-nextjs
```

2. Install dependencies:
```bash
   npm install
```

3. Setup environment variables:
   
   Create a `.env` file with the following:
```env
   DATABASE_URL=your_postgresql_connection_string
   
   AUTH_SECRET=your_random_secret_here
   
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   
   PUSHER_APP_ID=your_pusher_app_id
   PUSHER_KEY=your_pusher_key
   PUSHER_SECRET=your_pusher_secret
   PUSHER_CLUSTER=your_pusher_cluster
   NEXT_PUBLIC_PUSHER_KEY=your_pusher_key
   NEXT_PUBLIC_PUSHER_CLUSTER=your_pusher_cluster
   
   NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Setup database:
```bash
   npx prisma migrate dev --name init
   npx prisma generate
```

5. Seed database with test data:
```bash
   npx prisma db seed
```
   
   This creates:
   - Admin user: `admin@example.com` / `password123`
   - Regular user: `user@example.com` / `password123`
   - Sample product: Premium Headphones

6. Run development server:
```bash
   npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000)

## Test Accounts

### Admin Account
- **Email**: `admin@example.com`
- **Password**: `password123`
- **Access**: Full admin dashboard with product, order, and chat management

### User Account
- **Email**: `user@example.com`
- **Password**: `password123`
- **Access**: Storefront, cart, checkout, and customer support chat

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma db seed` - Seed database with test data

## Project Structure
```
├── app/
│   ├── (admin)/          # Admin dashboard routes
│   ├── (auth)/           # Authentication pages
│   ├── (shop)/           # Storefront pages
│   └── api/              # API routes
├── actions/              # Server actions
├── components/           # React components
├── lib/                  # Utilities
├── prisma/               # Database schema
└── public/               # Static assets
```

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

**Important**: Update `NEXT_PUBLIC_APP_URL` to your production domain after deployment.

## License

MIT

## Author

Built by [Rayzhayat](https://github.com/Rayzhayat)
