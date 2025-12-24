# Estrutura do Projeto SiaoPlay

Esta documentação descreve a arquitetura do projeto React Native.

## 📁 Estrutura de Pastas

```
src/
├── components/          # Componentes reutilizáveis
│   ├── common/         # Componentes comuns (Button, Input, etc)
│   └── ui/             # Componentes de UI específicos
├── screens/            # Telas da aplicação
│   └── Home/           # Exemplo de tela
│       ├── index.ts
│       ├── HomeScreen.tsx
│       └── useHomeController.ts
├── navigation/         # Configuração de navegação
│   ├── index.tsx
│   └── types.ts
├── services/           # Serviços e APIs
│   ├── api/
│   │   ├── client.ts
│   │   ├── queryClient.ts
│   │   └── endpoints.ts
│   └── storage/
│       └── index.ts
├── store/              # Estado global (Zustand)
│   ├── useAppStore.ts
│   └── index.ts
├── hooks/              # Custom hooks
│   ├── useTheme.ts
│   └── index.ts
├── utils/              # Funções utilitárias
│   ├── constants.ts
│   └── helpers.ts
├── types/              # TypeScript types/interfaces
│   └── index.ts
├── theme/              # Tema e estilos globais
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   └── index.ts
└── assets/             # Imagens, fontes, etc
    ├── images/
    └── fonts/
```

## 🏗️ Arquitetura

### Componentes
- **common/**: Componentes reutilizáveis como Button, Input, Card, etc.
- **ui/**: Componentes de UI específicos da aplicação

### Screens
Cada tela deve ter:
- `[ScreenName]Screen.tsx`: Componente da tela
- `use[ScreenName]Controller.ts`: Lógica de negócio (custom hook)
- `index.ts`: Export do componente

### Services
- **api/**: Cliente HTTP (Axios) e endpoints
- **storage/**: Serviço de armazenamento local (AsyncStorage)

### Store
Gerenciamento de estado global usando Zustand.

### Theme
Tema centralizado com cores, tipografia e espaçamentos.

## 📚 Bibliotecas Principais

- **@react-navigation/native**: Navegação
- **@tanstack/react-query**: Gerenciamento de dados do servidor
- **zustand**: Estado global
- **axios**: Cliente HTTP
- **@react-native-async-storage/async-storage**: Armazenamento local

## 🚀 Como Usar

### Criar uma nova tela

1. Criar pasta em `src/screens/[ScreenName]/`
2. Criar `[ScreenName]Screen.tsx`
3. Criar `use[ScreenName]Controller.ts` (se necessário)
4. Criar `index.ts`
5. Adicionar rota em `src/navigation/index.tsx`

### Criar um componente

1. Criar arquivo em `src/components/common/` ou `src/components/ui/`
2. Exportar em `src/components/common/index.ts` ou `src/components/ui/index.ts`

### Adicionar endpoint de API

1. Adicionar função em `src/services/api/endpoints.ts`
2. Usar `apiClient` para fazer requisições

## 🎨 Tema

Use o hook `useTheme()` para acessar cores e estilos:

```typescript
import { useTheme } from '../hooks';

const { colors, theme, isDark } = useTheme();
```

## 📝 Convenções

- Use TypeScript para todos os arquivos
- Componentes em PascalCase
- Hooks começam com `use`
- Arquivos de serviço em camelCase
- Pastas em lowercase

