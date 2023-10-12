module.exports = {
  // this will check Typescript files
  "**/*.(ts|tsx)": () => "pnpm tsc --noEmit",

  // This will lint and format TypeScript and
  "**/*.(ts|tsx|js)": (filenames: string[]) => [
    `pnpm eslint --fix ${filenames.join(" ")}`,
    `pnpm prettier --write ${filenames.join(" ")}`,
  ],

  // this will Format MarkDown and JSON
  "**/*.(md|json)": (filenames: string[]) => `pnpm prettier --write ${filenames.join(" ")}`,
}
