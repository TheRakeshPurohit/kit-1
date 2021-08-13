import {
  getLastSlashSeparated,
  getKenvs,
} from "kit-bridge/esm/util"

let dir = await arg(
  "Update which kenv",
  (
    await getKenvs()
  ).map(value => ({
    name: getLastSlashSeparated(value, 1),
    value,
  }))
)

await $`cd ${dir} && git stash && git pull`

await getScripts(false)

// Prompt if stash exists to re-apply changes

export {}