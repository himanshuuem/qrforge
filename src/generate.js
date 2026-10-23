import { mkdir, writeFile, appendFile } from "node:fs/promises";
import path from "node:path";
import QRCode from "qrcode";

export async function generate({ url, format, width, color, out }) {
  if (format === "terminal") {
    return { text: await QRCode.toString(url, { type: "terminal", small: true }) };
  }
  await mkdir(path.dirname(out), { recursive: true });
  if (format === "svg") {
    const svg = await QRCode.toString(url, { type: "svg", color, margin: 2, width });
    await writeFile(out, svg, "utf8");
  } else {
    await QRCode.toFile(out, url, { type: "png", color, margin: 2, width, errorCorrectionLevel: "M" });
  }
  await appendFile(path.join(path.dirname(out), "history.log"), `${new Date().toISOString()}\t${format}\t${url}\t${path.basename(out)}\n`);
  return { file: out };
}
