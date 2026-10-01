# 🐾 Animal Game

> **Projeto acadêmico de estudo de programação web** — Simulação de jogo do bicho com moedas fictícias, totalmente offline e sem fins lucrativos.

![Status](https://img.shields.io/badge/status-ativo-success)
![Licença](https://img.shields.io/badge/licen%C3%A7a-acad%C3%AAmica-blue)
![Idioma](https://img.shields.io/badge/idioma-PT--BR-green)
![PWA](https://img.shields.io/badge/PWA-instal%C3%A1vel-purple)

---

## ⚠️ Aviso Legal

Este é um **projeto acadêmico** de estudo de programação web.

- 🚫 **NÃO é um site de apostas reais**
- 🚫 **Não envolve dinheiro**
- 🚫 **Não incentiva apostas**
- ✅ Todas as "moedas" são **fictícias** e sem valor real
- ✅ Projeto **sem fins lucrativos**

---

## 📖 Sobre o Projeto

**Animal Game** é uma simulação interativa inspirada no tradicional "Jogo do Bicho", desenvolvida como projeto de estudo para praticar:

- Manipulação de DOM com JavaScript puro (vanilla JS)
- Persistência de dados com `localStorage`
- Design responsivo e animações CSS
- Sistema de autenticação local
- Gráficos com Chart.js
- PWA (Progressive Web App)

---

## 🎮 Funcionalidades

### 🎯 Sistema de Apostas
- **3 turnos por dia**: 🌅 Manhã (08-12h) · ☀️ Tarde (13-17h) · 🌙 Noite (18-20h)
- Escolha entre **25 animais** (grupos 01 a 25)
- Modos de aposta:
  - **Só o animal** — acerta o bicho
  - **Animal + milhar** — acerta bicho e milhar
  - **Só a milhar** — acerta apenas o número
- Limite de **10 apostas por turno** (expansível com item da loja)
- Sorteios automáticos nos horários definidos

### 🏆 Progressão
- **5 níveis**: 🥉 Bronze · 🥈 Prata · 🥇 Ouro · 💠 Platina · 💎 Diamante
- Sistema de **XP** com multiplicadores por nível
- **Combo de vitórias** (até 2x de bônus)
- **Conquistas** desbloqueáveis
- **Missões diárias** (banco com 50+ missões)

### 🎁 Extras
- **Bônus de login diário** (streak de 6 dias)
- **Loja de itens**:
  - 🔮 Bola de Cristal — dica do próximo sorteio
  - 🍀 Trevo da Sorte — XP dobrado na próxima aposta
  - 🎫 Aposta Extra — +1 aposta no turno
  - ⚗️ Poção de XP — +50 XP instantâneo
  - 🛡️ Escudo — devolve 50% em caso de derrota
- **Sistema de amigos** com solicitações
- **Ranking** (geral, semanal e entre amigos)
- **Notificações internas** com badge
- **Temas** claro/escuro com detecção automática

### 📊 Análises
- Gráfico de evolução de moedas
- Gráfico de vitórias x derrotas
- Painel completo de histórico de apostas e sorteios

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|------------|-----|
| HTML5 | Estrutura semântica |
| CSS3 | Estilização, animações e temas |
| JavaScript (ES6+) | Toda a lógica do jogo |
| localStorage | Persistência de dados |
| Chart.js | Gráficos estatísticos |
| canvas-confetti | Efeitos visuais |
| Web Audio API | Sons e música gerados |
| Service Worker | Funcionamento offline (PWA) |

---

## 📁 Estrutura do Projeto
animalgame/
├── index.html # Estrutura da aplicação
├── style.css # Estilos e temas
├── script.js # Lógica principal do jogo
├── idiomas.js # Sistema de traduções (PT/EN/ES)
├── sw.js # Service Worker (PWA)
├── manifest.json # Manifesto PWA
├── favicon.svg # Ícone da aplicação
└── README.md # Este arquivo


---

## 🚀 Como Executar

### Pré-requisitos
- Navegador moderno (Chrome, Firefox, Edge ou Safari)
- Não requer instalação de dependências

### Passos

1. **Clone ou baixe o projeto**:
   ```bash
   git clone https://github.com/seu-usuario/animalgame.git