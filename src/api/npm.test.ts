import ava from "ava"

import tmp from "tmp-promise"
import { randomUUID } from "node:crypto"
import { join } from "node:path"
await import("../api/global.js")
await import("../api/kit.js")
await import("../api/pro.js")
await import("../api/lib.js")
await import("../platform/base.js")
await import("../target/terminal.js")

import { kenvPath } from "../core/utils.js"

await tmp.withDir(async (dir) => {
	process.env.KENV = dir.path
	process.env.KIT_CONTEXT = "workflow"
	console.log(process.env.KENV)
	ava.beforeEach(async (t) => {
		global.kitScript = `${randomUUID()}.js`
		global.__kitDbMap = new Map()
	})

	ava.serial("legacy npm import with title-case", async (t) => {
		const pkgJsonPath = kenvPath("package.json")
		t.log({ pkgJsonPath })
		await ensureDir(path.dirname(pkgJsonPath))

		await writeJson(pkgJsonPath, {
			type: "module"
		})
		console.log = t.log
		global.log = t.log
		flag.trust = true
		args.push("hello")
		let { titleCase } = await npm("title-case")
		let result = titleCase(await arg("Enter a string to title case:"))

		t.is(result, "Hello")
	})
})
