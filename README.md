# E-commerce Chat App

A full-stack e-commerce application built with Next.js 15+, Prisma, Tailwind, and Real-time Chat.

## Features

-   **Storefront**: Browse products, search, filter, and purchase.
-   **Cart**: Persistent shopping cart.
-   **Checkout**: Stripe integration.
-   **Real-time Chat**: Customer support chat using Pusher.
-   **Admin Dashboard**: Manage products and view orders.
-   **Authentication**: Secure login with NextAuth (Google/Email).

## Getting Started

1.  Clone the repository.
2.  Copy `.env.example` to `.env` and fill in your API keys.
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Setup Database:
    ```bash
    npx prisma migrate dev --name init
    node seed.js # Optional: Seed with test data
    ```
5.  Run the development server:
    ```bash
    npm run dev
    ```

## Scripts

-   `npm run dev`: Start development server.
-   `npm run build`: Build for production.
-   `node seed.js`: Seed database.
