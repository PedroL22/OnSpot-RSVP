import fs from 'node:fs'
import path from 'node:path'

const cliPath = path.join(process.cwd(), 'node_modules', 'react-doctor', 'dist', 'cli.js')

const originalSnippet = `const { issues } = knipResult;
\tconst diagnostics = [];
\tfor (const unusedFile of issues.files) diagnostics.push({
\t\tfilePath: path.relative(rootDirectory, unusedFile),`

const patchedSnippet = `const { issues } = knipResult;
\tconst diagnostics = [];
\tconst fileIssues = Array.isArray(issues.files) ? issues.files : Object.values(issues.files ?? {}).flatMap((workspaceIssues) => Object.values(workspaceIssues ?? {}));
\tfor (const unusedFile of fileIssues) diagnostics.push({
\t\tfilePath: path.relative(rootDirectory, typeof unusedFile === "string" ? unusedFile : unusedFile.filePath),`

const source = fs.readFileSync(cliPath, 'utf8')

if (source.includes(patchedSnippet)) {
  process.exit(0)
}

if (!source.includes(originalSnippet)) {
  throw new Error('Unable to patch react-doctor dead code adapter: expected snippet not found.')
}

fs.writeFileSync(cliPath, source.replace(originalSnippet, patchedSnippet))
