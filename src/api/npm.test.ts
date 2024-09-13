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
	process.env.KENV = path.resolve(dir.path, ".kenv")

	ava.beforeEach(async (t) => {
		global.kitScript = `${randomUUID()}.js`
		global.__kitDbMap = new Map()

		t.log({
			kenvPath: kenvPath()
		})
	})

	ava.only("legacy npm import with title-case", async (t) => {
		const kenvPkgJsonPath = kenvPath("package.json")
		const kitPkgJsonPath = kitPath("package.json")
		await ensureDir(kenvPath())
		await ensureDir(kitPath())
		try{
			await $`cd ${kenvPath()} && pnpm init`
			await $`cd ${kitPath()} && pnpm init`
		} catch (error) {
			t.log(error)
		}
		console.log = t.log
		global.log = t.log
		flag.trust = true
		let { titleCase } = await npm("title-case")
		args.push("hello")
		let result = titleCase(await arg("Enter a string to title case:"))

		t.is(result, "Hello")
	})
})
