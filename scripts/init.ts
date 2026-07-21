import { $ } from "bun";

const TOKENS = [
  "__PROJECT_NAME__",
  "__REPO_SLUG__",
  "__DESCRIPTION__",
  "__AUTHOR__",
  "__OWNER__"
] as const;
type Token = (typeof TOKENS)[number];

const FILES = [
  "package.json",
  "README.md",
  "NOTICE",
  ".github/CODEOWNERS",
  "apps/web/index.html",
  "apps/web/src/App.vue"
];

async function defaultSlug(): Promise<string> {
  try {
    const url = (await $`git remote get-url origin`.text()).trim();
    const match = url.match(/github\.com[:/](.+?)(?:\.git)?$/);
    return match ? match[1] : "";
  } catch {
    return "";
  }
}

const slugGuess = await defaultSlug();
const slug = prompt("Repository slug (owner/repo):", slugGuess) ?? slugGuess;
const [ownerGuess = "", nameGuess = ""] = slug.split("/");
const name = prompt("Project name:", nameGuess) ?? nameGuess;
const description = prompt("Description:", "") ?? "";
const author = prompt("Author (Name <email>):", "") ?? "";
const owner = prompt("Code owner (GitHub handle or team):", ownerGuess) ?? ownerGuess;

const values: Record<Token, string> = {
  __PROJECT_NAME__: name,
  __REPO_SLUG__: slug,
  __DESCRIPTION__: description,
  __AUTHOR__: author,
  __OWNER__: owner
};

for (const file of FILES) {
  const handle = Bun.file(file);
  if (!(await handle.exists())) continue;
  let text = await handle.text();
  for (const token of TOKENS) {
    text = text.replaceAll(token, values[token]);
  }
  await Bun.write(file, text);
}

const readme = Bun.file("README.md");
if (await readme.exists()) {
  const stripped = (await readme.text()).replace(
    /<!-- template:start -->[\s\S]*?<!-- template:end -->\n?/g,
    ""
  );
  await Bun.write("README.md", stripped);
}

const pkg = JSON.parse(await Bun.file("package.json").text());
pkg.name = name
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9._-]+/g, "-")
  .replace(/^[-_.]+/, "");
delete pkg.scripts.init;
await Bun.write("package.json", `${JSON.stringify(pkg, null, 2)}\n`);

await $`rm -f scripts/init.ts`.quiet();
try {
  await $`rmdir scripts`.quiet();
} catch {
  // scripts/ not empty, leave it
}

console.log(
  "\nInitialized. Review the diff, then commit. See the README 'Repository settings' section for the manual GitHub steps."
);
