#!/bin/bash

# Script para limpar cache e reiniciar o Metro Bundler

echo "🧹 Limpando cache do Metro..."
rm -rf node_modules/.cache
rm -rf /tmp/metro-*

echo "🔄 Reiniciando Metro Bundler..."
npm start -- --reset-cache

