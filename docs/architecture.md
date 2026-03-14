# Architecture

This file documents the architecture required by the assignment.

## High-level flow

```mermaid
flowchart LR
  UI[Expo React Native UI\napp/(tabs)] --> Hooks[Hooks Layer\nuse-products / use-usd-rate]
  Hooks --> Services[Service Layer\napi.ts / firestore.ts / firebase.ts]
  Services --> API[AwesomeAPI\nUSD-BRL quote]
  Services --> DB[Firebase Firestore\ncollection: estoque]
  DB --> Services
  API --> Services
  Services --> Hooks
  Hooks --> UI
```

## Layers

1. UI Layer
- Screens and components under `app/` and `components/`.
- Displays stock metrics, report charts, add form, and item list.

2. Hook Layer
- `hooks/use-products.ts`: subscribes to Firestore realtime data.
- `hooks/use-usd-rate.ts`: loads exchange rate from AwesomeAPI.

3. Service Layer
- `services/firestore.ts`: CRUD + normalization for products.
- `services/firebase.ts`: Firebase app and Firestore initialization.
- `services/api.ts`: HTTP call to AwesomeAPI.

4. Data Sources
- Firestore for persisted stock items.
- AwesomeAPI for external exchange-rate data.

## Data ownership

- Source of truth for products: Firestore (`estoque`).
- Source of truth for FX rate: AwesomeAPI (with local fallback in hook).
