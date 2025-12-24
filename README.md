# Pazaryeri - Frontend Test Case

Production-ready, scalable marketplace frontend application built with Next.js 15, TypeScript, and modern web technologies.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router |
| **TypeScript** | Type-safe development (strict mode) |
| **Tailwind CSS** | Utility-first styling with dark mode |
| **Zustand** | Lightweight state management |
| **next-intl** | Internationalization (TR/EN) |
| **Framer Motion** | Animations and transitions |
| **Storybook** | Component documentation |
| **Lucide React** | Icon library |

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run Storybook
npm run storybook
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Architecture

```
pazaryeri/
├── app/                          # Next.js App Router
│   ├── [locale]/                 # i18n dynamic routing
│   │   ├── page.tsx              # Home (ISR)
│   │   ├── products/
│   │   │   ├── page.tsx          # Product list (SSR)
│   │   │   └── [slug]/page.tsx   # Product detail (ISR)
│   │   ├── categories/[slug]/    # Category (SSR)
│   │   ├── favorites/            # Favorites (CSR)
│   │   └── cart/                 # Cart (CSR)
│   ├── sitemap.ts                # Dynamic sitemap
│   ├── robots.ts                 # Robots.txt
│   └── not-found.tsx             # 404 page
│
├── components/                   # Atomic Design structure
│   ├── atoms/                    # Basic building blocks
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Badge/
│   │   ├── Skeleton/
│   │   └── Price/
│   ├── molecules/                # Combinations of atoms
│   │   ├── ProductCard/
│   │   ├── CategoryCard/
│   │   ├── SearchBar/
│   │   ├── LanguageSwitcher/
│   │   ├── ThemeToggle/
│   │   └── QuantitySelector/
│   └── organisms/                # Complex UI sections
│       ├── Header/
│       ├── Footer/
│       ├── ProductGrid/
│       └── CategorySlider/
│
├── stores/                       # Zustand state management
│   ├── favorites.ts              # Normalized favorites
│   ├── cart.ts                   # Cart with localStorage
│   └── theme.ts                  # Dark mode toggle
│
├── lib/
│   ├── api/                      # API layer
│   │   ├── client.ts             # Fetch wrapper
│   │   ├── products.ts
│   │   └── categories.ts
│   └── utils/                    # Utilities
│       ├── cn.ts                 # Class name merger
│       └── format.ts             # Formatting helpers
│
├── types/                        # TypeScript definitions
│   ├── product.ts
│   ├── cart.ts
│   └── api.ts
│
├── i18n/                         # Internationalization
│   ├── routing.ts
│   ├── request.ts
│   └── navigation.ts
│
├── messages/                     # Translation files
│   ├── tr.json
│   └── en.json
│
└── mock/                         # Mock data
    ├── products.json
    └── categories.json
```

## Rendering Strategies

| Page | Strategy | Reason |
|------|----------|--------|
| **Home** | ISR (1h) | Content changes periodically, good for caching |
| **Product List** | SSR | Dynamic filters and search params |
| **Product Detail** | ISR (30m) | Static content with high traffic |
| **Category** | SSR | Dynamic based on filters |
| **Favorites** | CSR | User-specific, localStorage based |
| **Cart** | CSR | User-specific, real-time updates |

## State Management

### Favorites Store (Normalized)

```typescript
interface FavoritesState {
  collections: Record<string, Collection>;
  productIdsByCollection: Record<string, Set<string>>;
  allProductIds: Set<string>;

  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  createCollection: (name: string) => string;
}
```

### Cart Store

```typescript
interface CartState {
  items: Record<number, CartItem>;

  addItem: (item: CartItem) => void;
  updateQuantity: (variantId: number, quantity: number) => void;
  getTotalPrice: () => number;
}
```

Both stores use Zustand with `persist` middleware for localStorage persistence.

## Internationalization

URL-based routing with automatic locale detection:

- `/tr/...` - Turkish (default)
- `/en/...` - English

Translation files in `messages/` directory with feature-based organization.

## SEO Implementation

- **Dynamic Metadata**: `generateMetadata()` for each page
- **JSON-LD Schemas**: Product, ItemList, WebSite, Organization
- **OpenGraph & Twitter Cards**: Automatic image and description
- **sitemap.xml**: Dynamic generation from products/categories
- **robots.txt**: Configured for search engines

## Performance Optimizations

1. **Images**: `next/image` with automatic optimization
2. **Code Splitting**: Dynamic imports for heavy components
3. **Lazy Loading**: Intersection Observer for product grids
4. **Memoization**: `React.memo`, `useMemo`, `useCallback`
5. **Route Prefetching**: Automatic for visible links

## Dark Mode

Implemented with:
- CSS variables for theming
- Zustand store for persistence
- System preference detection
- No flash on page load (inline script)

## Component Documentation

Run Storybook to view component documentation:

```bash
npm run storybook
```

Components with stories:
- Button (variants, sizes, icons, loading)
- Badge (variants)
- Input (with label, error, icons)
- Price (with discount)

## API Integration

The project uses mock data from `mock/` directory. The API layer is designed to easily switch to real endpoints:

```typescript
// lib/api/client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.meshur.co";
```

API structure follows [https://api.meshur.co/docs](https://api.meshur.co/docs).

## Environment Variables

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=https://api.meshur.co
```

## Trade-offs & Decisions

1. **Mock Data vs Real API**: Using local JSON files for development speed; API layer is abstracted for easy switching.

2. **SSR vs CSR for Favorites/Cart**: CSR chosen because these are user-specific and don't benefit from SSR SEO.

3. **Zustand vs Redux**: Zustand for simplicity and smaller bundle size; normalized state structure maintains scalability.

4. **next-intl vs next-i18next**: next-intl chosen for better App Router support and simpler API.

5. **Tailwind CSS**: Rapid development with design system consistency; CSS variables for theme customization.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint check
npm run lint:fix     # ESLint fix
npm run format       # Prettier format
npm run storybook    # Storybook dev
npm run test         # Jest tests
```

## License

This project is created as a technical assessment for the Frontend Developer position.

---

Built with Next.js 15 | TypeScript | Tailwind CSS | Zustand
