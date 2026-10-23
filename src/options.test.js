import { test } from "node:test";
import assert from "node:assert/strict";
import { normaliseUrl, slugFromUrl, buildOptions, validateColor } from "./options.js";

test("normaliseUrl adds https to bare domains", () => {
  assert.equal(normaliseUrl("github.com/himanshuuem"), "https://github.com/himanshuuem");
});

test("normaliseUrl rejects non-http protocols and junk", () => {
  assert.throws(() => normaliseUrl("javascript:alert(1)"), /http/);
  assert.throws(() => normaliseUrl("ftp://example.com"), /http/);
  assert.throws(() => normaliseUrl("not a url"), /valid URL|real host/);
  assert.throws(() => normaliseUrl("   "), /required/);
});

test("slugFromUrl creates safe file names", () => {
  assert.equal(slugFromUrl("https://www.GitHub.com/himanshuuem?tab=repos"), "github-com-himanshuuem");
});

test("validateColor accepts 3 and 6 digit hex", () => {
  assert.equal(validateColor("#0a84ff", "x"), "#0a84ff");
  assert.throws(() => validateColor("blue", "Dark colour"), /hex/);
});

test("buildOptions sets defaults and validates size", () => {
  const options = buildOptions({ url: "example.com" });
  assert.equal(options.format, "png");
  assert.equal(options.out, "qr-output/example-com.png");
  assert.throws(() => buildOptions({ url: "example.com", size: "5000" }), /Size/);
  assert.equal(buildOptions({ url: "example.com", format: "terminal" }).out, null);
});
