# Arquitetura

Este arquivo documenta a arquitetura exigida no trabalho.

## Fluxo de alto nível

```mermaid
flowchart LR
  UI["Interface Expo React Native<br/>app/(tabs)"] --> Hooks["Camada de Hooks<br/>use-products / use-usd-rate"]
  Hooks --> Services["Camada de Serviços<br/>api.ts / firestore.ts / firebase.ts"]
  Services --> API["AwesomeAPI<br/>cotação USD-BRL"]
  Services --> DB["Firebase Firestore<br/>coleção: estoque"]
  DB --> Services
  API --> Services
  Services --> Hooks
  Hooks --> UI
```

## Camadas

1. Camada de Interface (UI)

- Telas e componentes em `app/` e `components/`.
- Exibe métricas de estoque, gráficos de relatórios, formulário de cadastro e lista de itens.

2. Camada de Hooks

- `hooks/use-products.ts`: assina dados em tempo real do Firestore.
- `hooks/use-usd-rate.ts`: carrega a cotação da AwesomeAPI.

3. Camada de Serviços

- `services/firestore.ts`: CRUD e normalização de produtos.
- `services/firebase.ts`: inicialização do Firebase e Firestore.
- `services/api.ts`: chamada HTTP para AwesomeAPI.

4. Fontes de Dados

- Firestore para persistência dos itens de estoque.
- AwesomeAPI para dados externos de cotação.

## Propriedade dos dados

- Fonte de verdade dos produtos: Firestore (`estoque`).
- Fonte de verdade da cotação: AwesomeAPI (com fallback local no hook).
