# terminal.harjeet.dev

> A terminal-style personal website. Because normal portfolios are boring and I spend 90% of my life in a terminal anyway.

## What is this?

It's my personal website disguised as a Unix terminal — heavily inspired by [**Warp**](https://warp.dev), the best modern terminal out there. It has a virtual filesystem, real commands (`ls`, `cd`, `cat`, `pwd`, `whoami`), markdown rendering, and an Oh My Zsh-style prompt with a lime-green git indicator that will never actually track any changes because _there is no git repo inside the virtual FS_. The irony is not lost on me.

## Why?

Honest answer: I wanted something that looked cool, showed off my projects, and made other devs go "oh damn" when they opened it.

Real answer: I have no idea. I was bored one weekend and now this exists.

## Commands

| Command | What it does |
|---|---|
| `help` | Shows available commands |
| `ls` | Lists files and folders |
| `cd [dir]` | Navigate around |
| `cat [file]` | Read a file (`.md` files render with formatting!) |
| `pwd` | Print working directory |
| `whoami` | Guess. |
| `clear` | Clean slate |

## Projects showcased

- **[cena](https://github.com/harciufff/cena)** — Edge-native visual copilot (YOLO-World + MediaPipe + Moondream-2)
- **[aey](https://github.com/harciufff/aey)** — Neuro-symbolic GraphRAG assistant (Neo4j + Gemini + LangChain)

## Tech stack

- **React** (Vite)
- **Tailwind CSS v4**
- **JetBrains Mono Nerd Font**
- Zero backend, zero database, zero API calls. It's just a static site with attitude.

## Running locally

```bash
git clone https://github.com/harciufff/terminal-portfolio
cd terminal-portfolio
npm install
npm run dev
```

## Deploy

Pushed to **Vercel** in 2 minutes. It's free. Do it.

---

## FAQ (that nobody asked)

**Q: Why a terminal?**
A: Because I wanted to make a portfolio that looks like my actual desktop. Also, writing CSS for normal layouts is harder than this somehow.

**Q: Is this a real terminal?**
A: No. It's a React app. But the `cat` command does actually read files from a virtual filesystem I built, so... semi-real?

**Q: Why "cena" and "aey"?**
A: Naming things is the hardest problem in computer science. I gave up and typed random letters.

**Q: Did you really need a custom markdown renderer?**
A: Absolutely not. But now the `cat` command renders bold text and clickable links, so... worth it.

---

Built by [Harjeet Singh](https://github.com/harciufff) — 16 years old, Italy 🇮🇹
