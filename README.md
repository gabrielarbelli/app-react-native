# Aplicação React Native Simples

Uma aplicação React Native simples criada com Expo que inclui:
- Tela de login
- Menu principal
- Calculadora funcional

## Funcionalidades

### 🔐 Login
- Tela de login simples com validação
- Credenciais de teste: `admin` / `123`

### 📱 Menu Principal
- Interface limpa e intuitiva
- Navegação para diferentes funcionalidades
- Opção de terminar sessão

### 🧮 Calculadora
- Operações básicas: +, -, ×, ÷
- Funções adicionais: %, ±, C (limpar)
- Interface similar à calculadora do iOS

## Como Executar

### Pré-requisitos
- Node.js instalado
- Expo CLI instalado globalmente: `npm install -g expo-cli`
- Aplicação Expo Go no seu dispositivo móvel

### Passos para executar

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npx expo start
   ```

3. **Executar no dispositivo:**
   - Abra a aplicação Expo Go no seu dispositivo
   - Escaneie o código QR que aparece no terminal ou no browser
   - A aplicação será carregada no seu dispositivo

### Alternativas de execução

- **Simulador iOS:** `npx expo start --ios` (apenas no macOS)
- **Emulador Android:** `npx expo start --android`
- **Browser:** `npx expo start --web`

## Estrutura do Projeto

```
SimpleApp/
├── App.js              # Componente principal com navegação
├── LoginScreen.js      # Tela de login
├── MenuScreen.js       # Menu principal
├── CalculatorScreen.js # Calculadora
├── package.json        # Dependências do projeto
└── README.md          # Este arquivo
```

## Dependências Principais

- **React Native:** Framework para desenvolvimento mobile
- **Expo:** Plataforma para desenvolvimento React Native
- **React Navigation:** Navegação entre telas
- **React Native Screens:** Otimização de performance para navegação

## Credenciais de Teste

- **Utilizador:** admin
- **Palavra-passe:** 123

## Notas Técnicas

- Compatível com Expo SDK 50+
- Suporte para iOS e Android
- Interface responsiva
- Navegação por stack

## Próximos Passos

Esta é uma aplicação de demonstração. Funcionalidades que podem ser adicionadas:
- Autenticação real
- Persistência de dados
- Mais funcionalidades no menu
- Temas personalizáveis
- Notificações push

