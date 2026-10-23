# 🔳 QRForge

> A friendly Node.js CLI that turns any URL into a QR code: **PNG**, **SVG** or a preview **right in your terminal**. Run it interactively or as a one-liner in scripts.

[![test](https://github.com/himanshuuem/qrforge/actions/workflows/test.yml/badge.svg)](https://github.com/himanshuuem/qrforge/actions/workflows/test.yml)
![Node](https://img.shields.io/badge/Node.js-%E2%89%A520-339933?logo=node.js&logoColor=white)

<img src="docs/example.png" width="160" alt="QR code linking to github.com/himanshuuem">

## ✨ Features

- **Two modes:** interactive prompts with live validation (`@inquirer/prompts`), or flags for scripting (`node:util` `parseArgs`, so no argument-parsing dependency).
- **Three outputs:** PNG, SVG (crisp at any size) or a terminal preview.
- **Custom colours and size:** `--dark`, `--light` (hex) and `--size` from 128 to 2048 px.
- **Input hardening:** bare domains get `https://`, `javascript:`/`ftp:`/`mailto:` are rejected, and `host:port` is still accepted. File names are slugified from the URL.
- **History log:** every generated file is appended to `qr-output/history.log` with a timestamp.
- **Clean exits:** a non-zero exit code on errors and a quiet exit on <kbd>Ctrl</kbd>+<kbd>C</kbd>.
- **Tested:** validation logic in `options.js` is covered by `node:test` and runs in GitHub Actions.

## 🚀 Usage

```bash
git clone https://github.com/himanshuuem/qrforge.git
cd qrforge
npm install

npm start                                         # interactive
node src/cli.js github.com/himanshuuem            # → qr-output/github-com-himanshuuem.png
node src/cli.js example.com -f svg --dark "#0a84ff"
node src/cli.js example.com -f terminal           # preview in the terminal
node src/cli.js --help

npm link    # optional: install the `qrforge` command globally
```

## 📁 Structure

```
qrforge/
├── src/
│   ├── cli.js            # Entry point: args, prompts, output
│   ├── options.js        # Pure validation + defaults
│   ├── options.test.js   # Unit tests
│   └── generate.js       # QR rendering + history log
└── package.json          # "bin": { "qrforge": ... }
```

## 🛠 Tech Stack

Node.js (ES modules, `node:util` parseArgs, `fs/promises`) · [qrcode](https://www.npmjs.com/package/qrcode) · [@inquirer/prompts](https://www.npmjs.com/package/@inquirer/prompts) · `node:test` · GitHub Actions

## 📚 Origin

This is an upgraded version of the **QR Code Generator** Node.js project from [The Complete Web Development Bootcamp](https://www.udemy.com/course/the-complete-web-development-bootcamp/). It replaces the deprecated `qr-image` with `qrcode` and adds validation, flags, formats and tests.

---

Made by [Himanshu](https://github.com/himanshuuem)
