#!/usr/bin/env node
import { parseArgs } from "node:util";
import { input, select } from "@inquirer/prompts";
import { buildOptions, normaliseUrl, FORMATS } from "./options.js";
import { generate } from "./generate.js";

const HELP = `
  qrforge — generate QR codes from the command line

  Usage
    qrforge                         interactive mode
    qrforge <url> [options]         one-shot mode

  Options
    -f, --format <png|svg|terminal> output format (default: png)
    -o, --out <file>                output path (default: qr-output/<slug>.<ext>)
    -s, --size <px>                 image width, 128–2048 (default: 512)
        --dark <hex>                foreground colour (default: #111111)
        --light <hex>               background colour (default: #ffffff)
    -h, --help                      show this help

  Examples
    qrforge github.com/himanshuuem
    qrforge https://example.com -f svg --dark "#0a84ff"
    qrforge example.com -f terminal
`;

const paint = (code) => (text) => (process.stdout.isTTY ? `\x1b[${code}m${text}\x1b[0m` : text);
const green = paint("32");
const red = paint("31");
const dim = paint("2");

async function askInteractively() {
  const url = await input({
    message: "Which URL should the QR code open?",
    validate: (value) => {
      try {
        normaliseUrl(value);
        return true;
      } catch (error) {
        return error.message;
      }
    },
  });
  const format = await select({
    message: "Output format",
    choices: FORMATS.map((value) => ({ value, name: value === "terminal" ? "terminal (preview only)" : value.toUpperCase() })),
  });
  return { url, format };
}

async function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      format: { type: "string", short: "f" },
      out: { type: "string", short: "o" },
      size: { type: "string", short: "s" },
      dark: { type: "string" },
      light: { type: "string" },
      help: { type: "boolean", short: "h" },
    },
  });

  if (values.help) {
    console.log(HELP);
    return;
  }

  const raw = positionals[0] ? { url: positionals[0] } : await askInteractively();
  const options = buildOptions({ ...values, ...raw, format: raw.format ?? values.format });
  const result = await generate(options);

  if (result.text) {
    console.log(result.text);
    console.log(dim(options.url));
  } else {
    console.log(`${green("✔")} Saved ${options.format.toUpperCase()} → ${result.file}`);
    console.log(dim(`  encodes ${options.url}`));
  }
}

main().catch((error) => {
  // Ctrl+C inside an inquirer prompt throws ExitPromptError — exit quietly.
  if (error?.name === "ExitPromptError") process.exit(130);
  console.error(`${red("✖")} ${error.message}`);
  process.exitCode = 1;
});
