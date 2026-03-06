# PLUGG - Hyperlocal Electronics Marketplace

A full-stack hyperlocal multi-vendor electronics marketplace connecting online buyers with local brick-and-mortar shops.

## Features

### User Roles
- **Buyers**: Search products, find nearby shops, buy with store pickup or home delivery
- **Sellers**: Two-tier registration (Tier 1 - GST optional, Tier 2 - GST mandatory), inventory management, order tracking
- **Admin**: Dashboard for sales tracking, user management, dispute resolution

### Core Functionality
- Product catalog with Flipkart-style image galleries
- Location-based seller discovery using Haversine formula
- GST validation middleware for Tier 2 shops
- Order management with digital pickup tokens
- Revenue tracking for sellers

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, tRPC
- **Database**: SQLite (PostgreSQL with PostGIS for production)
- **ORM**: Prisma
- **State Management**: React Query, Zustand
- **UI Components**: shadcn/ui, Radix UI

## Project Structure

```
plugg/
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Sample data
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── page.tsx     # Homepage
│   │   ├── login/       # Buyer login
│   │   ├── register/    # Buyer registration
│   │   ├── product/[slug]/  # Product detail page
│   │   ├── seller/
│   │   │   ├── register/    # Seller registration
│   │   │   └── dashboard/   # Seller dashboard
│   │   └── api/trpc/        # tRPC API routes
│   ├── components/      # React components
│   ├── lib/             # Utilities
│   └── server/
│       ├── api/         # tRPC routers
│       │   ├── routers/
│       │   │   ├── auth.ts
│       │   │   ├── shop.ts
│       │   │   ├── product.ts
│       │   │   ├── inventory.ts
│       │   │   └── order.ts
│       │   └── trpc.ts
│       └── db.ts        # Prisma client
└── public/
    └── logo.svg         # PLUGG logo
```

## Database Schema

### Key Models
- **User**: Buyers, sellers, admins
- **Shop**: Seller profiles with tier (1/2) and GST
- **Product**: Master catalog
- **Inventory**: Shop-specific pricing and stock
- **Order**: Purchase records with fulfillment type

## Key Algorithms

### Nearest Seller Algorithm (Haversine Formula)
```typescript
// Calculates distance between buyer and shops
(6371 * acos(
  cos(radians(buyerLat)) * 
  cos(radians(shop.lat)) * 
  cos(radians(shop.lng) - radians(buyerLng)) + 
  sin(radians(buyerLat)) * 
  sin(radians(shop.lat))
)) AS distance_km
```

### GST Validation
- Format: 2 digits (state) + 10 chars (PAN) + 1 (entity) + Z + 1 (checksum)
- Validates state code (01-37)
- Validates PAN format
- Optional for Tier 1, mandatory for Tier 2

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env`:
```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"
```

3. Run database migrations:
```bash
npx prisma migrate dev
```

4. Start development server:
```bash
npm run dev
```

5. Open http://localhost:3000

## API Endpoints

### Authentication
- `auth.register` - Register new user
- `auth.login` - User login

### Shops
- `shop.register` - Register shop (with GST validation)
- `shop.getNearby` - Find shops near location
- `shop.validateGST` - Validate GST number

### Products
- `product.getAll` - List products
- `product.getBySlug` - Get product details
- `product.getNearbySellers` - Find sellers for product

### Inventory
- `inventory.getByShop` - Get shop inventory
- `inventory.claimProduct` - Add product to inventory
- `inventory.update` - Update stock/price

### Orders
- `order.create` - Create order
- `order.getByBuyer` - Buyer order history
- `order.getByShop` - Seller orders
- `order.updateStatus` - Update order status

## Future Enhancements

- Razorpay payment integration
- SMS/Email notifications (Twilio/SendGrid)
- PDF invoice generation
- Admin dashboard
- Advanced search filters
- Product reviews and ratings

## License

MIT
