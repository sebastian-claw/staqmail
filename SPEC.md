# StaqMail — Project Specification

## Overview

**Project Name:** StaqMail  
**Type:** Desktop Application (Tauri v2 + Next.js)  
**Version:** 0.1.0 (Initial Setup)  

## Core Functionality

StaqMail is a visual email composer built for church staff using ChurchStaq (Pushpay). It provides a polished, offline-capable desktop experience for creating, managing, and sending HTML emails through the ChurchStaq platform.

### Feature Set

- **WYSIWYG Email Editor** — Rich text editing powered by TipTap with email-safe HTML output
- **Template Management** — Save, load, and organize reusable email templates
- **HTML Output** — Clean, email-client-compatible HTML generation
- **ChurchStaq Integration** — Authenticate and interact with the ChurchStaq/Pushpay API
- **Local Storage** — Persist templates and settings locally via Tauri plugin-store

## Target Users

Church staff members who use ChurchStaq (Pushpay) as their Church Management System (CHMS). Specifically:
- Communications coordinators
- Pastors and ministry leaders
- Administrative staff managing congregation outreach

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Desktop shell | Tauri v2 (Rust) |
| Frontend framework | Next.js 15 (static export) |
| UI components | shadcn/ui + Tailwind CSS |
| Rich text editor | TipTap |
| Local storage | @tauri-apps/plugin-store |
| Secure storage | @tauri-apps/plugin-stronghold |
| State management | Zustand |
| HTTP (frontend) | @tauri-apps/plugin-http |

## Architecture

```
staqmail/
├── src/                        # Next.js frontend
│   ├── app/                    # App router pages
│   ├── components/
│   │   ├── editor/             # TipTap WYSIWYG editor components
│   │   ├── preview/            # Email HTML preview panel
│   │   ├── auth/               # ChurchStaq login UI
│   │   ├── templates/          # Template browser & manager
│   │   └── ui/                 # shadcn/ui base components
│   └── lib/
│       ├── api/                # ChurchStaq API client
│       ├── store/              # Zustand state stores
│       └── utils/              # HTML generation, helpers
├── src-tauri/
│   ├── src/
│   │   ├── main.rs             # Tauri entry point
│   │   ├── lib.rs              # App setup & plugin registration
│   │   └── commands/           # Rust IPC commands
│   └── tauri.conf.json         # Tauri configuration
└── SPEC.md                     # This file
```

## Development Notes

- Next.js runs in **static export** mode (no server required) — Tauri serves the built output
- Rust commands handle file I/O, secure credential storage, and native OS integration
- All ChurchStaq credentials stored via plugin-stronghold (encrypted)
- Templates and app settings stored via plugin-store (JSON, local)
