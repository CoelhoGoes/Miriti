# 🐷 Miriti — Educação Financeira para Crianças

Um jogo educacional completo em React focado em ensinar conceitos de educação financeira para crianças de forma divertida, com visual moderno, animações fluidas e experiência polida.

![Made with React](https://img.shields.io/badge/Made%20with-React-61dafb?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Built%20with-Vite-646cff?style=flat-square&logo=vite)

## ✨ Características

- 🎮 **3 fases × 10 perguntas = 30 desafios educacionais** sobre dinheiro, planejamento e investimentos
- 🎨 **Visual moderno e lúdico** com gradientes, glow, partículas, confete e mascote
- 🎵 **Som e música 100% sintetizados** via Web Audio API — sem arquivos externos
- ⚡ **React Spring + Framer Motion** para animações fluidas e profissionais
- 💾 **Progresso salvo em localStorage** — moedas, estrelas, conquistas e configurações
- 📱 **Totalmente responsivo** — funciona em desktop e dispositivos móveis
- ♿ **Acessível** — foco visível, navegação por teclado
- 🏆 **Sistema de progressão** com estrelas, moedas, troféus e conquistas

## 🚀 Como rodar

Pré-requisito: **Node.js 18+** e **npm**.

```bash
# Instalar dependências
npm install

# Iniciar em modo desenvolvimento
npm run dev

# Build de produção
npm run build

# Visualizar build
npm run preview
```

O servidor de desenvolvimento abrirá automaticamente em **http://localhost:5173**.

## 📁 Estrutura do projeto

```
miriti/
├── package.json
├── vite.config.js
├── index.html
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx              # entrada do React
    ├── App.jsx               # controlador de telas
    ├── index.css             # estilos globais e tokens de design
    ├── components/
    │   ├── HomeScreen.jsx        # tela inicial com logo animado
    │   ├── MainMenu.jsx          # menu principal
    │   ├── PhaseSelect.jsx       # seleção de fase
    │   ├── QuizScreen.jsx        # tela do quiz
    │   ├── QuestionCard.jsx      # card de pergunta
    │   ├── ResultScreen.jsx      # resultado animado
    │   ├── OptionsModal.jsx      # modal de configurações
    │   ├── CreditsScreen.jsx     # créditos
    │   ├── ProgressBar.jsx       # barra de progresso
    │   ├── AnimatedBackground.jsx# fundo animado
    │   ├── Confetti.jsx          # efeito de confete
    │   └── SoundManager.js       # re-export do singleton de áudio
    ├── context/
    │   └── GameContext.jsx       # estado global do jogo
    ├── data/
    │   └── questions.js          # banco de 30 perguntas
    ├── hooks/
    │   └── useSound.js           # hook conveniente para sons
    └── utils/
        ├── sound.js              # sistema completo de Web Audio
        └── storage.js            # wrapper de localStorage
```

## 🎯 Fluxo do jogo

1. **Tela Inicial** — logo Miriti animado; toque ou tecle para começar
2. **Menu Principal** — Iniciar Jogo, Opções, Créditos
3. **Seleção de Fase** — escolha entre 3 fases (desbloqueadas progressivamente)
4. **Quiz** — 10 perguntas com feedback imediato e explicação educativa
5. **Resultado** — estrelas, moedas, troféus e mensagem motivacional

## 🎨 Sistema de design

Cores, tipografia e bordas centralizados em **variáveis CSS** em `src/index.css`. Para customizar a paleta, edite os tokens em `:root`.

Fontes: **Baloo 2** e **Fredoka** (carregadas via Google Fonts).

## 🔊 Sistema de som

Todos os sons (clique, hover, acerto, erro, vitória, moedas, música ambiente) são **sintetizados em tempo real** via Web Audio API. Isso mantém o bundle leve e elimina a necessidade de arquivos de áudio externos. Veja `src/utils/sound.js` para detalhes.

A música ambiente toca uma melodia infantil em loop, com baixo, em volume suave.

## 💾 Persistência

Tudo é salvo em `localStorage` com o prefixo `miriti_`:
- progresso das fases
- estrelas, moedas e conquistas
- volumes de música e efeitos
- preferência de animações

Use o botão **Apagar progresso** nas opções para resetar tudo.

## 🛠️ Tecnologias

- [React 18](https://react.dev/)
- [Vite 5](https://vitejs.dev/)
- [React Spring](https://www.react-spring.dev/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Icons](https://react-icons.github.io/react-icons/)
- Web Audio API
- CSS moderno (gradients, backdrop-filter, custom properties)

## 📝 Licença

Projeto educacional aberto. Sinta-se livre para usar, modificar e ensinar! 💜
