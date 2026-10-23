export const FORMATS = ["png", "svg", "terminal"];
const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

/** Accept bare domains ("github.com") by assuming https, and reject anything that isn't http(s). */
export function normaliseUrl(input) {
  const raw = String(input ?? "").trim();
  if (!raw) throw new Error("A URL is required.");
  // "scheme:" followed by a non-digit means the user typed a protocol; "host:8080" is a port.
  const hasScheme = /^[a-z][a-z\d+.-]*:(?!\d)/i.test(raw);
  const candidate = hasScheme ? raw : `https://${raw}`;
  let url;
  try {
    url = new URL(candidate);
  } catch {
    throw new Error(`"${raw}" is not a valid URL.`);
  }
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Only http and https URLs are supported.");
  if (!url.hostname.includes(".") && url.hostname !== "localhost") throw new Error(`"${url.hostname}" doesn't look like a real host.`);
  return url.toString();
}

export function validateColor(value, name) {
  if (!HEX.test(value)) throw new Error(`${name} must be a hex colour like #111 or #0a84ff.`);
  return value;
}

/** Build a safe, readable file name from a URL: https://github.com/himanshuuem → github-com-himanshuuem */
export function slugFromUrl(urlString) {
  const url = new URL(urlString);
  const slug = `${url.hostname}${url.pathname}`
    .toLowerCase()
    .replace(/^www\./, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return slug || "qr";
}

export function buildOptions({ url, format = "png", dark = "#111111", light = "#ffffff", size = 512, out }) {
  if (!FORMATS.includes(format)) throw new Error(`Format must be one of: ${FORMATS.join(", ")}.`);
  const width = Number(size);
  if (!Number.isInteger(width) || width < 128 || width > 2048) throw new Error("Size must be an integer between 128 and 2048.");
  const normalised = normaliseUrl(url);
  return {
    url: normalised,
    format,
    width,
    color: { dark: validateColor(dark, "Dark colour"), light: validateColor(light, "Light colour") },
    out: out ?? (format === "terminal" ? null : `qr-output/${slugFromUrl(normalised)}.${format}`),
  };
}
