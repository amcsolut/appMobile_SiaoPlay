#!/bin/bash
# Script para criar o diretório NDK com permissões corretas
# Execute este script manualmente no terminal para que o sudo solicite a senha

echo "═══════════════════════════════════════════════════════════"
echo "  Configuração do diretório NDK para React Native"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Este script precisa de permissões de administrador (sudo)."
echo "Execute os seguintes comandos manualmente no seu terminal:"
echo ""
echo "  sudo mkdir -p /usr/lib/android-sdk/ndk"
echo "  sudo chown -R \$USER:\$(id -gn) /usr/lib/android-sdk/ndk"
echo "  sudo chmod -R 755 /usr/lib/android-sdk/ndk"
echo ""
echo "Ou execute este script diretamente:"
echo "  ./install-ndk.sh"
echo ""
echo "═══════════════════════════════════════════════════════════"

# Tentar executar se sudo estiver disponível sem senha (NOPASSWD configurado)
if sudo -n true 2>/dev/null; then
    echo "Executando comandos com sudo..."
    sudo mkdir -p /usr/lib/android-sdk/ndk
    USER=$(whoami)
    GROUP=$(id -gn)
    sudo chown -R $USER:$GROUP /usr/lib/android-sdk/ndk
    sudo chmod -R 755 /usr/lib/android-sdk/ndk
    echo "✓ Diretório NDK criado com sucesso!"
    echo ""
    echo "Agora execute: npm run android"
else
    echo "⚠️  Não foi possível executar automaticamente (sudo requer senha)."
    echo "   Execute os comandos acima manualmente."
fi

