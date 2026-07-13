# Prashant Saini — Dark Theme Portfolio

Personal portfolio site of **Prashant Saini** — Full Stack Developer, AI Enthusiast, Cloud Learner, and Data Analyst.

## Overview

Single-page React portfolio built with Vite, TypeScript, and Tailwind CSS, wrapped in a dark, aurora-lit visual theme. Features an animated aurora background, a rotating globe pinned to the owner's location, a project showcase, a skills breakdown, and an AI chatbot that answers questions about the owner using a built-in knowledge base.

## Features

- **Hero section** with animated intro and role rotation
- **Interactive globe / location map** showing the owner's coordinates
- **Projects showcase** — cards with live demo + GitHub links, tech stack tags, and preview images/GIFs
- **Skills section** — frontend, backend, languages, and cloud/AI stacks with proficiency levels
- **AI ChatBot** — answers visitor questions about the owner (experience, skills, certificates, LeetCode stats) from a local knowledge base
- **Aurora background** and **custom cursor** for a distinctive visual feel
- **Page loader**, scroll-reveal animations, and a rotating quote banner
- **Contact section** with social/professional links (GitHub, LinkedIn, LeetCode, email)
- Fully responsive across desktop and mobile

## Tech Stack

| Category | Technologies |
|---|---|
| Framework | React 18, TypeScript, Vite |
| Styling | Tailwind CSS v4, Emotion |
| UI Components | Radix UI, MUI, shadcn-style primitives |
| Animation | Motion (Framer Motion), tw-animate-css, canvas-confetti |
| Data / Charts | Recharts |
| Routing | React Router |
| Other | react-hook-form, embla-carousel, react-icons, lucide-react |

## Project Structure

```
src/
├── app/
│   ├── App.tsx              # Root layout — composes all sections
│   ├── components/          # Hero, NavBar, Projects, Skills, ChatBot, Globe, etc.
│   └── data/
│       ├── portfolio.ts     # Identity, internships, certificates, skills, chatbot knowledge
│       └── projects.ts      # Project cards (name, description, tech, links, images)
├── imports/                 # Figma-exported assets/snippets
├── styles/                  # Global styles
└── main.tsx                 # Entry point
public/
└── projects/                # Project screenshots/GIFs
```

## Getting Started

```bash
# install dependencies
npm install

# start dev server
npm run dev

# production build
npm run build
```

The dev server runs on Vite's default port (falls back to the next free port if `5173` is taken).

## Connect

- GitHub: [prashant-GKV](https://github.com/prashant-GKV)
- LinkedIn: [prashant-saini-0660aa294](https://linkedin.com/in/prashant-saini-0660aa294)
- LeetCode: [Prashant_Saini__](https://leetcode.com/u/Prashant_Saini__/)
- Email: ps0875135@gmail.com
