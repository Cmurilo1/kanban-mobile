# 📱 Kanban Mobile - cmdev1
App de tarefas no celular.

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000000?style=for-the-badge&logo=expo&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)

🔗 Repositório:
https://github.com/Cmurilo1/kanban-mobile

🌐 Demo ao vivo (Web Vercel):
https://kanban-mobile-two.vercel.app

## 📱 Teste no celular

Escaneie o QR Code:

<img src="./assets/qrcode.png" width="200" />

Ou acesse: https://kanban-mobile-two.vercel.app

- ✅ Criar tarefas novas
- ➡️ Mover entre colunas: A Fazer → Fazendo → Feito
- ◀️ Voltar tarefa pra coluna anterior
- 🗑️ Apagar tarefa com confirmação
- 💾 Salvamento automático com AsyncStorage (não perde ao fechar o app)
- 📱 100% mobile, otimizado para Android/iOS

### 🛠️ Tecnologias

- React Native
- Expo SDK 57
- AsyncStorage
- JavaScript

### 🚀 Como rodar

`bash
# Clone o repo
git clone https://github.com/Cmurilo1/kanban-mobile.git
cd kanban-mobile

# Instale as dependências
npm install

# Instale o AsyncStorage
npx expo install @react-native-async-storage/async-storage

# Rode
npx expo start