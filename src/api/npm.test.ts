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

// biome-ignore lint/suspicious/useAwait: <explanation>
await tmp.withDir(async (dir) => {
	process.env.KENV = path.resolve(dir.path, ".kenv")
	process.env.KIT = path.resolve(dir.path, ".kit")
	process.env.KIT_CONTEXT = "workflow"

	ava.beforeEach(async (t) => {
		global.kitScript = `${randomUUID()}.js`
		global.__kitDbMap = new Map()

		await ensureDir(kenvPath())
		await ensureDir(kitPath())
		await ensureDir(kitPath("db"))


		t.log({
			kenvPath: kenvPath(),
			kitPath: kitPath()
		})
	})

	ava("legacy npm import with title-case", async (t) => {
		try{
			await exec(`pnpm init`, {
				cwd: kenvPath()
			})
			await exec(`pnpm init`, {
				cwd: kitPath()
			})
		} catch (error) {
			t.log(error)
		}
		console.log = t.log
		global.log = t.log
		flag.trust = true
		args.push("hello")
		let { titleCase } = await npm("title-case")
		let result = titleCase(await arg("Enter a string to title case:"))

		t.is(result, "Hello")
	})
})
