import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { Application, DeclarationReflection, ReflectionKind, TSConfigReader } from "typedoc";

const ROOT = resolve(import.meta.dirname, "..");

const app = await Application.bootstrap(
  { entryPoints: [resolve(ROOT, "src/index.ts")], excludeInternal: true, logLevel: "Error" },
  [new TSConfigReader()],
);

const project = await app.convert();
if (!project) throw new Error("TypeDoc failed to convert the project");

/** Extract the first description line from a reflection's comment. */
function getDescription(reflection: DeclarationReflection): string {
  const summary = reflection.comment?.summary ?? reflection.signatures?.[0]?.comment?.summary;
  if (!summary?.length) return "";
  return summary
    .map((p) => p.text)
    .join("")
    .split("\n")[0]
    .trim()
    .replace(/\|/g, "\\|"); // escape pipe so it doesn't break the table
}

// Factory functions are top-level kind=Function exports.
const factories = (project.children ?? [])
  .filter((c): c is DeclarationReflection => c.kind === ReflectionKind.Function)
  .map((c) => ({ name: c.name, description: getDescription(c) }));

// Sequence methods: defined on the class itself (not inherited from Iterator<T>).
const seqClass = (project.children ?? []).find(
  (c): c is DeclarationReflection => c.kind === ReflectionKind.Class && c.name === "Sequence",
);
const EXCLUDED = new Set(["constructor", "next"]);

const methods = (seqClass?.children ?? [])
  .filter(
    (c): c is DeclarationReflection =>
      c.kind === ReflectionKind.Method &&
      !c.inheritedFrom &&
      !c.flags?.isPrivate &&
      !EXCLUDED.has(c.name),
  )
  .map((c) => ({ name: c.name, description: getDescription(c) }));

// ── build table ───────────────────────────────────────────────────────────────

function buildTable(entries: { name: string; description: string }[]): string {
  const rows = entries.map(({ name, description }) => `| \`${name}\` | ${description} |`);
  return ["| | Description |", "|---|---|", ...rows].join("\n");
}

const generated =
  `### Factory functions\n\n${buildTable(factories)}\n\n` +
  `### \`Sequence<T>\` methods\n\n${buildTable(methods)}`;

// ── inject into README ────────────────────────────────────────────────────────

const START = "<!-- API:START -->";
const END = "<!-- API:END -->";

const readme = readFileSync(resolve(ROOT, "README.md"), "utf-8");
const startIdx = readme.indexOf(START);
const endIdx = readme.indexOf(END);

if (startIdx === -1 || endIdx === -1) {
  console.error(`ERROR: markers ${START} / ${END} not found in README.md`);
  process.exit(1);
}

const updated =
  readme.slice(0, startIdx + START.length) + "\n" + generated + "\n" + readme.slice(endIdx);

writeFileSync(resolve(ROOT, "README.md"), updated);
console.log(
  `Updated README.md — ${factories.length} factory functions, ${methods.length} methods.`,
);
