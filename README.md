# Aplicação React Native Completa

Uma aplicação React Native completa criada com Expo que inclui múltiplas funcionalidades e recursos avançados:

## Funcionalidades

### 🔐 Sistema de Autenticação
- Tela de login com validação
- Context API para gerenciamento de estado global
- Persistência de sessão com AsyncStorage
- Credenciais de teste: `admin` / `123`

### 📱 Menu Principal
- Interface moderna e intuitiva
- Navegação para todas as funcionalidades
- Toast de notificação de boas-vindas
- Opção de terminar sessão com confirmação

### 👤 Perfil do Usuário
- Visualização completa do perfil
- Edição de informações pessoais (modal)
- Upload de foto de perfil (câmera/galeria)
- Persistência de dados com AsyncStorage
- Indicador de status online

### 🧮 Calculadora Avançada
- Operações básicas: +, -, ×, ÷
- Funções adicionais: %, ±, C (limpar)
- Interface similar à calculadora do iOS
- Histórico de cálculos

### 🖼️ Galeria de Imagens
- Exibição de imagens em grid
- API de imagens aleatórias (Picsum)
- Interface responsiva

### 🎮 Pokedéx
- Integração com API pública do Pokémon
- Lista de 20 pokémons com imagens
- Informações de tipos
- Interface em cards

### ⚙️ Configurações
- Alternância entre modo claro e escuro
- Persistência da preferência de tema
- Interface adaptativa

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
├── App.js                 # Componente principal com navegação
├── AuthContext.js         # Context para autenticação e estado global
├── LoginScreen.js         # Tela de login
├── MenuScreen.js          # Menu principal
├── ProfileScreen.js       # Tela de perfil do usuário
├── CalculatorScreen.js    # Calculadora avançada
├── GalleryScreen.js       # Galeria de imagens
├── PokemonScreen.js       # Pokedéx com API
├── SettingsScreen.js      # Configurações e temas
├── theme.js              # Configurações de cores e estilos
├── package.json          # Dependências do projeto
├── app.json              # Configurações do Expo
├── assets/               # Recursos (ícones, imagens)
│   ├── icon.png
│   ├── adaptive-icon.png
│   ├── favicon.png
│   └── splash-icon.png
└── README.md             # Este arquivo
```

## Dependências Principais

- **React Native:** Framework para desenvolvimento mobile
- **Expo:** Plataforma para desenvolvimento React Native
- **React Navigation:** Navegação entre telas (Stack Navigator)
- **React Native Screens:** Otimização de performance para navegação
- **AsyncStorage:** Armazenamento local de dados
- **Axios:** Cliente HTTP para requisições de API
- **Expo Image Picker:** Seleção de imagens da galeria e câmera
- **React Native Safe Area Context:** Gerenciamento de áreas seguras

## Credenciais de Teste

- **Utilizador:** admin
- **Palavra-passe:** 123

## Notas Técnicas

- Compatível com Expo SDK 53+
- Suporte para iOS e Android
- Interface responsiva e adaptativa
- Navegação por stack
- Sistema de temas (claro/escuro)
- Persistência de dados local
- Integração com APIs externas
- Gerenciamento de estado com Context API
- Componentes reutilizáveis e modulares

## Funcionalidades Implementadas ✅

- ✅ Sistema de autenticação com Context API
- ✅ Persistência de dados com AsyncStorage
- ✅ Múltiplas funcionalidades no menu
- ✅ Sistema de temas (claro/escuro)
- ✅ Upload de imagens (câmera/galeria)
- ✅ Integração com APIs externas
- ✅ Interface responsiva e moderna
- ✅ Navegação completa entre telas

## Próximos Passos

Funcionalidades que podem ser adicionadas no futuro:
- Notificações push
- Autenticação com Firebase
- Banco de dados em nuvem
- Mais jogos e funcionalidades interativas
- Compartilhamento de conteúdo
- Modo offline
- Animações avançadas
- Testes automatizados

