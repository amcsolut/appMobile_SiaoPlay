# 🔄 Fast Refresh - Guia Rápido

## O que é Fast Refresh?

O Fast Refresh é o sistema de atualização automática do React Native que permite ver mudanças no código em tempo real no emulador/dispositivo.

## ✅ Como Funciona

1. **Salve o arquivo** - Ao salvar qualquer arquivo `.tsx`, `.ts`, `.js`, etc.
2. **Atualização automática** - O Metro Bundler detecta a mudança e recarrega automaticamente
3. **Mantém o estado** - O estado da aplicação é preservado (exceto em alguns casos)

## 🚀 Atalhos Rápidos

### Android Emulator
- **Recarregar**: Pressione `R` duas vezes rapidamente
- **Menu Dev**: `Ctrl+M` (Windows/Linux) ou `Cmd+M` (Mac)
- **Reload do Menu**: No menu Dev, selecione "Reload"

### iOS Simulator
- **Recarregar**: Pressione `R` no simulador
- **Menu Dev**: `Cmd+D`

## 🔧 Se o Fast Refresh Não Estiver Funcionando

### 1. Verificar se o Metro está rodando
```bash
# Deve estar rodando em um terminal separado
npm start
# ou
yarn start
```

### 2. Limpar cache e reiniciar
```bash
# Limpar cache
npm run clean

# Reiniciar com cache limpo
npm run start:reset
```

### 3. Recarregar manualmente no emulador
- Pressione `R` duas vezes no emulador Android
- Ou use o menu Dev (`Ctrl+M` / `Cmd+M`) → "Reload"

### 4. Reiniciar completamente
```bash
# Parar o Metro (Ctrl+C)
# Limpar cache
npm run clean

# Reiniciar Metro
npm start

# Em outro terminal, rodar o app novamente
npm run android
```

## ⚠️ Quando o Fast Refresh Não Funciona

O Fast Refresh pode não funcionar automaticamente quando:

1. **Erros de sintaxe** - Corrija o erro primeiro
2. **Mudanças em arquivos não-React** - Como `metro.config.js`, `babel.config.js`
3. **Mudanças em arquivos nativos** - Requer rebuild completo
4. **Alterações em `index.js` ou `App.tsx`** - Pode precisar de reload manual

## 📝 Scripts Úteis

```bash
# Iniciar Metro normalmente
npm start

# Iniciar Metro com cache limpo
npm run start:reset

# Limpar cache
npm run clean

# Rodar Android
npm run android

# Rodar iOS
npm run ios
```

## 🐛 Troubleshooting Avançado

### Problema: Mudanças não aparecem mesmo após reload

1. **Verifique se o arquivo foi salvo**
2. **Verifique se há erros no terminal do Metro**
3. **Tente um reload completo**: `npm run start:reset`
4. **Reinicie o emulador/dispositivo**

### Problema: Erro "Unable to resolve module"

```bash
# Limpar tudo e reinstalar
rm -rf node_modules
npm install
npm run start:reset
```

### Problema: Metro não conecta ao emulador

1. Verifique se o emulador está rodando
2. Verifique a porta 8081: `lsof -i :8081`
3. Reinicie o Metro: `npm start`

## 💡 Dica Pro

Mantenha sempre o Metro Bundler rodando em um terminal separado. Isso garante que o Fast Refresh funcione corretamente.

