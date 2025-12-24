# Configuração da API

## 📍 Onde configurar a BASE_URL

A URL base da API está configurada no arquivo:
```
src/utils/constants.ts
```

Procure pela constante `API_BASE_URL` e altere para a URL da sua API:

```typescript
export const API_BASE_URL = __DEV__
  ? 'https://sua-api-dev.com/api'  // URL para desenvolvimento
  : 'https://sua-api-prod.com/api';  // URL para produção
```

## 🔧 Configuração para Android/iOS

### Android (Emulador)
- Use `http://10.0.2.2:PORT` para acessar localhost
- Exemplo: `http://10.0.2.2:3000/api`

### Android (Dispositivo físico)
- Use o IP da sua máquina na rede local
- Exemplo: `http://192.168.1.100:3000/api`

### iOS (Simulador)
- Use `http://localhost:PORT`
- Exemplo: `http://localhost:3000/api`

### iOS (Dispositivo físico)
- Use o IP da sua máquina na rede local
- Exemplo: `http://192.168.1.100:3000/api`

## 📝 Como usar

### Exemplo de GET

```typescript
import { homeService } from '../services/api/endpoints';

// Buscar dados
const { data } = await homeService.getData();

// Buscar com parâmetros
const { data } = await homeService.getWithParams({ page: 1, limit: 10 });
```

### Exemplo de POST

```typescript
import { userService } from '../services/api/endpoints';

// Criar usuário
const response = await userService.createUser({
  name: 'João',
  email: 'joao@email.com',
  password: 'senha123'
});
```

### Exemplo com React Query

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { homeService, userService } from '../services/api/endpoints';

// GET com React Query
const { data, isLoading, error } = useQuery({
  queryKey: ['home'],
  queryFn: () => homeService.getData(),
});

// POST com React Query
const mutation = useMutation({
  mutationFn: (userData) => userService.createUser(userData),
  onSuccess: (data) => {
    console.log('Usuário criado:', data);
  },
});
```

## 🔐 Autenticação

O token de autenticação é adicionado automaticamente em todas as requisições.

Para salvar o token após login:
```typescript
import { storageService } from '../services/storage';
import { STORAGE_KEYS } from '../utils/constants';

// Salvar token
await storageService.setItem(STORAGE_KEYS.USER_TOKEN, token);
```

O token será automaticamente incluído no header `Authorization: Bearer {token}`.

## 🛠️ Adicionar novos endpoints

1. Abra `src/services/api/endpoints.ts`
2. Adicione sua função seguindo o padrão:

```typescript
export const meuService = {
  getData: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/meu-endpoint');
    return response.data;
  },
  
  createData: async (data: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/meu-endpoint', data);
    return response.data;
  },
};
```

## ⚠️ Tratamento de Erros

Os erros são tratados automaticamente pelo interceptor. Você pode capturar assim:

```typescript
try {
  const data = await homeService.getData();
} catch (error) {
  console.error('Erro:', error.message);
  // error.status - código HTTP
  // error.code - código do erro
}
```

