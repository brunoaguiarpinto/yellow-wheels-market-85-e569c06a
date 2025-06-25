#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Variáveis ---
REPO_URL="https://github.com/brunoaguiarpinto/yellow-wheels-market-85-e569c06a.git"
PROJECT_DIR="yellow-wheels-market-85-e569c06a"
API_DIR="$PROJECT_DIR/api"
FRONTEND_DIR="$PROJECT_DIR/frontend"
DOMAIN="lordmotors.instabots.com.br"

# --- Funções ---
install_dependencies() {
    echo "--- Atualizando pacotes e instalando dependências (Node.js, Git, PM2, Nginx) ---"
    sudo apt-get update
    sudo apt-get install -y git curl
    
    # Instalar NVM (Node Version Manager) e Node.js
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
    nvm install --lts
    
    # Instalar PM2 globalmente
    npm install pm2 -g
    
    # Instalar Nginx
    sudo apt-get install -y nginx
}

clone_repo() {
    if [ -d "$PROJECT_DIR" ]; then
        echo "--- Diretório do projeto já existe. Fazendo pull das últimas alterações. ---"
        cd "$PROJECT_DIR"
        git pull
        cd ..
    else
        echo "--- Clonando o repositório ---"
        git clone "$REPO_URL"
    fi
}

setup_backend() {
    echo "--- Configurando o Backend (API) ---"
    cd "$API_DIR"
    npm install
    npm run build
    cd ../..
}

setup_frontend() {
    echo "--- Configurando o Frontend ---"
    cd "$FRONTEND_DIR"
    npm install
    npm run build
    cd ../..
}

start_app_with_pm2() {
    echo "--- Iniciando a API com PM2 ---"
    cd "$API_DIR"
    # Para o processo antigo se ele existir
    pm2 stop "api-$DOMAIN" || true
    pm2 delete "api-$DOMAIN" || true
    # Inicia o novo processo
    pm2 start build/index.js --name "api-$DOMAIN"
    
    # Salva a lista de processos do PM2 e configura para iniciar no boot
    pm2 save
    pm2 startup
    cd ../..
}

# --- Execução ---
echo "🚀 Iniciando o deploy da aplicação: $DOMAIN 🚀"

install_dependencies
clone_repo
setup_backend
setup_frontend
start_app_with_pm2

echo "✅ Deploy finalizado com sucesso! ✅"
echo "Próximos passos manuais:"
echo "1. Crie o arquivo .env na pasta 'api' com as variáveis de ambiente necessárias."
echo "2. Configure o Nginx usando o arquivo de configuração fornecido."
echo "3. Certifique-se de que seu domínio $DOMAIN aponta para o IP deste servidor."
