## 🎨 Frontend Architecture

The frontend follows **clean architecture principles** with clear separation between presentation, business logic, and data concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                     PAGES & ROUTES                          │
│  (Top-level route components, layout wrappers)             │
│  RestaurantListPage, RestaurantDetailPage,                 │
│  CheckoutPage, OrderTrackingPage, etc.                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    UI COMPONENTS                            │
│  (Feature & shared components, form fields)                │
│  RestaurantCard, DishCard, OrderList, AddressForm, etc.   │
└────────────────────┬────────────────────────────────────────┘
                     │
          ┌──────────┴──────────────┐
          │                         │
          ▼                         ▼
    ┌──────────────┐        ┌──────────────┐
    │ CUSTOM HOOKS │        │ STATE LAYER  │
    │              │        │              │
    │ useAuth()    │        │ React Query  │
    │ useFetch()   │        │ (via TanStack)
    │ useCart()    │        │ Context API  │
    └──────┬───────┘        └──────┬───────┘
           │                       │
           └───────────┬───────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   SERVICE LAYER                             │
│  (API client, data transformations, business logic)         │
│  restaurantService, orderService, authService, etc.        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                HTTP CLIENT LAYER                            │
│  (Axios configuration, base URL, interceptors)              │
│  Request/response transformation, error handling            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND API                               │
│  (Spring Boot REST endpoints, OAuth2/Keycloak)              │
└─────────────────────────────────────────────────────────────┘
```

### Layer Descriptions

#### **Pages & Routes**
Top-level route components that combine multiple UI components into cohesive pages. Each page handles its route parameters, authentication guards, and data fetching initialization.

**Examples:**
- `RestaurantListPage` - Displays filtered restaurant list
- `RestaurantDetailPage` - Shows menu and ordering interface
- `CheckoutPage` - Delivery address and confirmation
- `OrderTrackingPage` - Real-time order status
- `AdminDashboardPage` - Owner order management

#### **UI Components**
Reusable, focused components organized into two subcategories:

**Shared Components** (used across multiple pages):
- `Header`, `Footer`, `Navigation`
- `Button`, `TextField`, `Select`, `Modal`
- `LoadingSpinner`, `ErrorMessage`, `ConfirmDialog`
- `PriceTag`, `Avatar`, `Badge`

**Feature Components** (specific to feature domains):
- **Restaurant Domain**: `RestaurantCard`, `RestaurantHeader`, `MenuFilter`, `DishCard`, `DishGrid`
- **Order Domain**: `OrderCard`, `OrderList`, `OrderTimeline`, `OrderStatus`
- **Checkout Domain**: `CartSummary`, `AddressForm`, `OrderReview`
- **Auth Domain**: `LoginForm`, `LogoutButton`, `ProtectedRoute`

#### **Custom Hooks**
Encapsulate cross-cutting concerns and complex stateful logic:

- `useAuth()` - Authentication state, login/logout handlers, token management
- `useFetch(url, options)` - Generic data fetching with loading/error states
- `useCart()` - Shopping cart state and operations
- `useRestaurants(filters)` - Restaurant list with filtering
- `useOrder(orderId)` - Single order tracking
- `useLocalStorage(key)` - Persist state to browser storage
- `useDebounce(value, delay)` - Debounced input handling

#### **State Management**
Two-tier approach for optimal simplicity and performance:

**React Query / TanStack Query:**
- Server state management (fetched data from backend)
- Automatic caching, refetching, synchronization
- Query hooks: `useQuery`, `useMutation` for data operations
- Configured with stale time, retry logic, and cache invalidation

**Context API + useState:**
- Client state (UI state, preferences, cart)
- Authentication context for user info across app
- Theme context for dark/light mode
- Avoids prop drilling for frequently accessed data

#### **Service Layer**
Business logic abstraction between components and HTTP client. Each service handles:
- API endpoint mapping
- Request/response data transformation
- Business rule validation
- Error handling and normalization

**Services:**
- `authService` - Sign in, sign out, token refresh
- `restaurantService` - Fetch restaurants, details, filtering logic
- `dishService` - Fetch dishes, apply food tag filters
- `orderService` - Create, fetch, update order status
- `cartService` - Cart calculations, tax/fee logic

#### **HTTP Client Layer**
Centralized Axios instance with:
- Base URL configuration (environment-based)
- Request/response interceptors for authentication
- Error transformation to consistent format
- Timeout and retry configuration
- CORS handling

### Project Structure

```
frontend/
├── src/
│   ├── pages/                       # Route-level components
│   │   ├── RestaurantListPage/
│   │   ├── RestaurantDetailPage/
│   │   ├── CheckoutPage/
│   │   ├── OrderTrackingPage/
│   │   ├── AdminDashboardPage/
│   │   └── LoginPage/
│   │
│   ├── components/
│   │   ├── shared/                  # Used across pages
│   │   │   ├── Header/
│   │   │   ├── Navigation/
│   │   │   ├── Modal/
│   │   │   └── Button/
│   │   │
│   │   ├── restaurant/              # Restaurant domain
│   │   │   ├── RestaurantCard/
│   │   │   ├── MenuFilter/
│   │   │   └── DishGrid/
│   │   │
│   │   ├── order/                   # Order domain
│   │   │   ├── OrderCard/
│   │   │   ├── OrderStatus/
│   │   │   └── OrderTimeline/
│   │   │
│   │   ├── checkout/                # Checkout domain
│   │   │   ├── CartSummary/
│   │   │   ├── AddressForm/
│   │   │   └── OrderReview/
│   │   │
│   │   └── auth/                    # Auth domain
│   │       ├── LoginForm/
│   │       ├── ProtectedRoute/
│   │       └── UserMenu/
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useFetch.ts
│   │   ├── useCart.ts
│   │   ├── useRestaurants.ts
│   │   ├── useOrder.ts
│   │   └── useDebounce.ts
│   │
│   ├── services/                    # Business logic layer
│   │   ├── authService.ts
│   │   ├── restaurantService.ts
│   │   ├── dishService.ts
│   │   ├── orderService.ts
│   │   └── cartService.ts
│   │
│   ├── http/                        # HTTP client configuration
│   │   ├── client.ts                # Axios instance
│   │   └── interceptors.ts          # Auth, error handling
│   │
│   ├── types/                       # TypeScript type definitions
│   │   ├── Restaurant.ts
│   │   ├── Order.ts
│   │   ├── Dish.ts
│   │   ├── User.ts
│   │   └── API.ts
│   │
│   ├── context/                     # React Context providers
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   │
│   ├── styles/                      # Global styles
│   │   ├── global.scss
│   │   ├── colors.scss
│   │   └── typography.scss
│   │
│   ├── config/                      # Configuration
│   │   ├── environment.ts
│   │   ├── constants.ts
│   │   └── keycloak.ts
│   │
│   ├── utils/                       # Utility functions
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── helpers.ts
│   │
│   ├── App.tsx                      # Main app component & routing
│   └── main.tsx                     # Entry point
│
├── public/                          # Static assets
├── vite.config.ts                   # Vite configuration
├── tsconfig.json                    # TypeScript configuration
├── package.json
└── README.md
```


### Best Practices Implemented

✅ **Component Composition**: Large components broken into smaller, focused subcomponents  
✅ **Service Layer Abstraction**: Components never call `axios` directly; all HTTP calls go through services  
✅ **Type Safety**: Full TypeScript coverage for props, state, and API responses  
✅ **Minimal useEffect**: Effects only used for external system synchronization (data fetching via React Query)  
✅ **No Prop Drilling**: Context API and React Query prevent deeply nested prop passing  
✅ **Error Handling**: Consistent error transformation and user-friendly error messages  
✅ **Responsive Design**: Mobile-first CSS approach (work in progress)  
✅ **Code Organization**: Feature-based folder structure for scalability  
✅ **Modern React**: Functional components, hooks, no legacy patterns like `React.FC`  
✅ **Configuration Management**: Environment variables for API URLs and feature flags

### Areas for Improvement

⚠️ **Component Library**: Replace inline styling with Material UI or design system components  
⚠️ **Testing**: Add unit tests for components, hooks, and services  
⚠️ **State Persistence**: Implement Redux or Zustand for complex state if app grows  
⚠️ **Form Validation**: Expand React Hook Form validation rules and error messages  
⚠️ **Accessibility (a11y)**: Add ARIA labels, keyboard navigation, screen reader support  
⚠️ **Performance**: Implement code splitting, lazy loading for routes  
⚠️ **Real-time Updates**: WebSocket integration for live order tracking  
⚠️ **Analytics**: Add event tracking and performance monitoring