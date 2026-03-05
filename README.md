# StaqMail

Visual email composer for ChurchStaq (Pushpay) — built with Tauri v2 + Next.js.

## Stack

- **Tauri v2** — Desktop shell (Rust)
- **Next.js 16** — Frontend (static export)
- **TipTap** — WYSIWYG email editor
- **Tailwind CSS + shadcn/ui** — UI
- **Zustand** — State management

## Dev Setup

### Prerequisites

#### Linux

Install system dependencies first (required for Tauri/WebKit):

```bash
sudo apt install -y \
  pkg-config \
  libgtk-3-dev \
  libwebkit2gtk-4.1-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev \
  libssl-dev
```

#### macOS

Install Homebrew if needed, then:

```bash
brew install pkg-config gtk+3 librsvg openssl
```

Note: WebKit is built into macOS, so you don't need webkit2gtk.

You also need Xcode Command Line Tools:

```bash
xcode-select --install
```

#### Windows

Install Visual Studio Build Tools with C++ workload, or use WSL for easier setup.

#### Install Rust

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### Running

```bash
npm install
npm run tauri:dev
```

This starts Next.js on localhost:3000 and opens the Tauri window.

### Build for production

```bash
npm run tauri:build
```

## Project Structure

```
src/
  app/              → Next.js app router
  components/
    editor/         → TipTap WYSIWYG editor + toolbar
    preview/        → Live HTML email preview (iframe)
    auth/           → ChurchStaq login form
    templates/      → Template save/load sidebar
  lib/
    api/            → ChurchStaq API client
    store/          → Zustand global state
    utils/          → HTML export, helpers

src-tauri/
  src/
    lib.rs          → Tauri setup + command registration
    commands/
      storage.rs    → File export/read Rust commands
  tauri.conf.json   → Window config (1200×800)
```

## Status

- ✅ Next.js static export builds successfully
- ✅ TypeScript compiles clean
- ✅ All frontend components scaffolded
- ⚠️  Tauri dev requires GTK system libs (see Prerequisites above)
