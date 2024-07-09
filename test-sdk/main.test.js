import ava from "ava"
import slugify from "slugify"
import { Channel, KIT_APP_PROMPT } from "./config.js"

process.env.NODE_NO_WARNINGS = 1

process.env.KIT = process.env.KIT || path.resolve(os.homedir(), ".kit")

process.env.KNODE = process.env.KNODE || path.resolve(homedir(), ".knode")

ava.serial("app-prompt.js", async (t) => {
	let script = "mock-script-with-arg"
	let scriptPath = kenvPath("scripts", `${script}.js`)
	let placeholder = "hello"
	let contents = `
    await arg("${placeholder}")
    `
	await $`kit new ${script} main --no-edit`
	await writeFile(scriptPath, contents)

	t.log("Starting app-prompt.js...")
	let mockApp = fork(KIT_APP_PROMPT, {
		env: {
			NODE_NO_WARNINGS: "1",
			KIT: home(".kit"),
			KENV: kenvPath(),
			KIT_CONTEXT: "app"
		}
	})

	let command = "mock-script-with-arg"
	let value = {
		script: command,
		args: ["hello"]
	}

	t.log("Waiting for app-prompt.js to start...")
	let result = await new Promise((resolve, reject) => {
		/**
    channel: Channel
    pid: number
    newPid?: number
    state: AppState
    widgetId?: number
       * 
       */
		mockApp.on("message", (data) => {
			console.log("received", data)
			if (data.channel === Channel.SET_SCRIPT) {
				// The mockApp will hang waiting for input if you don't submit a value
				mockApp.send({
					channel: Channel.VALUE_SUBMITTED,
					value: "done"
				})
				resolve(data)
			}
		})

		mockApp.on("spawn", () => {
			mockApp.send(
				{
					channel: Channel.VALUE_SUBMITTED,
					value
				},
				(error) => {}
			)
		})
	})

	t.log({ result, command })
	t.is(result.value.command, command)
})

ava.serial("kit setup", async (t) => {
	let envPath = kenvPath(".env")
	let fileCreated = test("-f", envPath)

	t.true(fileCreated)

	let contents = await readFile(envPath, "utf-8")
	t.true(contents.includes("KIT_TEMPLATE=default"))
})

ava("TypeScript support", async (t) => {
	let tsScript = "mock-typescript-script"
	await $`kit set-env-var KIT_MODE ts`
	await wait(100)

	await $`kit new ${tsScript} main --no-edit`

	let tsScriptPath = kenvPath("scripts", `${tsScript}.ts`)

	t.true(await pathExists(tsScriptPath), `Should create ${tsScriptPath}`)

	t.is(
		await readFile(tsScriptPath, "utf-8"),
		await readFile(kenvPath("templates", "default.ts"), "utf-8"),
		"Generated TypeScript file matches TypeScript template"
	)

	await appendFile(
		tsScriptPath,
		`
console.log(await arg())`
	)

	let message = "success"
	let { stdout, stderr } = await $`kit ${tsScript} ${message}`

	t.is(stderr, "")

	t.regex(stdout, new RegExp(`${message}`), "TypeScript script worked")

	let JSofTSExists = await pathExists(tsScriptPath.replace(/\.ts$/, ".js"))

	t.false(JSofTSExists, "Should remove generated JS file")

	let envContents = await readFile(kenvPath(".env"), "utf-8")

	t.log({
		envContents
	})

	t.true(
		envContents.includes("KIT_MODE=ts"),
		`Should set KIT_MODE=ts ${envContents}`
	)
})

ava("TypeScript import from lib", async (t) => {
	let tsScript = "mock-typescript-script-load-lib"
	await $`kit set-env-var KIT_MODE ts`
	await $`kit new ${tsScript} main --no-edit`

	let tsScriptPath = kenvPath("scripts", `${tsScript}.ts`)

	t.true(await pathExists(tsScriptPath), `Should create ${tsScript}.ts`)

	t.is(
		await readFile(tsScriptPath, "utf-8"),
		await readFile(kenvPath("templates", "default.ts"), "utf-8"),
		"Generated TypeScript file matches TypeScript template"
	)
	await outputFile(
		kenvPath("lib", "yo.ts"),
		`
import "@johnlindquist/kit"    
export let go = async ()=> await arg()
  `
	)

	t.log(await readdir(kenvPath("lib")))

	await appendFile(
		tsScriptPath,
		`
import { go } from "../lib/yo"    
console.log(await go())`
	)

	let message = "success"
	let { stdout, stderr } = await $`kit ${tsScript} ${message}`

	t.is(stderr, "")

	t.regex(stdout, new RegExp(`${message}`), "TypeScript script worked")

	let JSofTSExists = await pathExists(tsScriptPath.replace(/\.ts$/, ".js"))

	t.false(JSofTSExists, "Should remove generated JS file")
})

ava.serial("JavaScript support", async (t) => {
	let script = "mock-javascript-script"
	await $`KIT_MODE=js kit new ${script} main --no-edit`

	let scriptPath = kenvPath("scripts", `${script}.js`)

	t.true(await pathExists(scriptPath))

	let scriptContents = await readFile(scriptPath, "utf-8")
	let defaultTemplateContents = await readFile(
		kenvPath("templates", "default.js"),
		"utf-8"
	)

	t.is(
		scriptContents,
		defaultTemplateContents,
		"Generated JavaScript file matches JavaScript template"
	)
})

ava.serial("kit new, run, and rm", async (t) => {
	let command = "mock-script-for-new-run-rm"
	let scriptContents = `
  let value = await arg()
  console.log(\`${command} \${value} 🎉!\`)
`

	let { stdout, stderr } =
		await $`KIT_MODE=js kit new ${command} main --no-edit`

	let scriptPath = kenvPath("scripts", `${command}.js`)
	let binPath = kenvPath("bin", `${command}`)

	t.true(stderr === "", "kit new errored out")
	t.true(test("-f", scriptPath), "script created")
	await writeFile(scriptPath, scriptContents)

	t.true(test("-f", binPath), "bin created")

	let message = "success"
	;({ stdout, stderr } = await $`${kenvPath("bin", command)} ${message}`)

	t.true(stdout.includes(message), `stdout includes ${message}`)

	await $`kit rm ${command} --confirm`

	let fileRmed = !test("-f", scriptPath)
	let binRmed = !test("-f", binPath)

	t.true(fileRmed)
	t.true(binRmed)
})

ava.serial("kit hook", async (t) => {
	let script = "mock-script-with-export"
	let contents = `
  export let value = await arg()
  `
	await $`kit new ${script} main --no-edit`
	await writeFile(kenvPath("scripts", `${script}.js`), contents)

	let message = "hello"
	await import(kitPath("index.js"))
	let result = await kit(`${script} ${message}`)
	t.is(result.value, message)
})

ava.serial("kit script-output-hello", async (t) => {
	let script = "mock-script-output-hello"
	let contents = "console.log(await arg())"
	await $`kit new ${script} main --no-edit`
	await writeFile(kenvPath("scripts", `${script}.js`), contents)

	let { stdout } = await $`kit ${script} "hello"`

	t.true(stdout.includes("hello"))
})

ava.serial("kit script in random dir", async (t) => {
	let someRandomDir = kitMockPath(".kit-some-random-dir")
	let script = "mock-some-random-script"
	let contents = "console.log(await arg())"
	let scriptPath = path.resolve(someRandomDir, `${script}.js`)
	await outputFile(scriptPath, contents)

	let { stdout, stderr } = await $`kit ${scriptPath} "hello"`
	// t.log({ stdout, stderr, scriptPath })

	t.true(stdout.includes("hello"))
})

ava.serial("Run both JS and TS scripts", async (t) => {
	let jsCommand = "mock-js-script"
	let tsCommand = "mock-ts-script"

	await $`KIT_MODE=js kit new ${jsCommand} main --no-edit`
	await $`KIT_MODE=ts kit new ${tsCommand} main --no-edit`

	process.env.PATH = `${kenvPath("bin")}:${process.env.PATH}`

	let { stderr: jsErr } = await $`${jsCommand}`
	let { stderr: tsErr } = await $`${tsCommand}`

	t.is(jsErr, "")
	t.is(tsErr, "")
})

ava.serial("Run kit from package.json", async (t) => {
	let command = "mock-pkg-json-script"
	let scriptPath = kenvPath("scripts", `${command}.js`)
	await $`KIT_MODE=js kit new ${command} main --no-edit`

	await appendFile(
		scriptPath,
		`
let value = await arg()  
console.log(value)
`
	)

	let pkgPath = kenvPath("package.json")
	let pkgJson = await readJson(pkgPath)
	let npmScript = "run-kit"

	let message = "success"

	pkgJson.scripts = {
		[npmScript]: `kit ${command} ${message}`
	}

	await writeJson(pkgPath, pkgJson)

	pkgJson = await readJson(pkgPath)
	t.log(pkgJson)

	cd(kenvPath())
	let { stdout, stderr } = await $`npm run ${npmScript}`

	t.is(stderr, "")
	t.regex(stdout, new RegExp(`${message}`))
})

ava.serial(
	"Run a script with --flag values: pass hello instead of one and two",
	async (t) => {
		let command = "mock-boolean-flag-values-pass-hello-instead-of-one-and-two"
		let scriptPath = kenvPath("scripts", `${command}.js`)
		await $`KIT_MODE=js kit new ${command} main --no-edit`

		let success = "success"
		let fail = "fail"

		await appendFile(
			scriptPath,
			`
let value = await arg()
if(flag.one === "one" && flag.two === "two"){
  console.log("${success}")
}else{
  console.log("${fail}")
}
`
		)

		cd(kenvPath())
		;({ stdout, stderr } = await $`kit ${command} hello`)

		t.is(stderr, "")
		t.regex(stdout, new RegExp(fail))
	}
)

ava.serial(
	"Run a script with --flag values: ones and twos match",
	async (t) => {
		let command = "mock-boolean-flag-values-ones-and-twos-match"
		let scriptPath = kenvPath("scripts", `${command}.js`)
		await $`KIT_MODE=js kit new ${command} main --no-edit`

		let success = "success"
		let fail = "fail"

		await appendFile(
			scriptPath,
			`
let value = await arg()
if(flag.one === "one" && flag.two === "two"){
  console.log("${success}")
}else{
  console.log("${fail}")
}
`
		)

		cd(kenvPath())
		let { stdout, stderr } = await $`kit ${command} hello --one one --two two`

		t.is(stderr, "")
		t.regex(stdout, new RegExp(success))
	}
)

ava.serial(
	"Run a script with --flag values: ones match, twos mismatch",
	async (t) => {
		let command = "mock-boolean-flag-values-ones-match-twos-mismatch"
		let scriptPath = kenvPath("scripts", `${command}.js`)
		await $`KIT_MODE=js kit new ${command} main --no-edit`

		let success = "success"
		let fail = "fail"

		await appendFile(
			scriptPath,
			`
let value = await arg()
if(flag.one === "one" && flag.two === "two"){
  console.log("${success}")
}else{
  console.log("${fail}")
}
`
		)

		cd(kenvPath())
		;({ stdout, stderr } = await $`kit ${command} hello --one one --two three`)

		t.is(stderr, "")
		t.regex(stdout, new RegExp(fail))
	}
)

ava.serial("Run a scriptlet from a .md file", async (t) => {
	let scriptlet = "mock-scriptlet-from-md-file"
	let scriptletPath = kenvPath("scriptlets", `${scriptlet}.md`)
	let testFilePath = kenvPath("test.md")
	let testFilePathContents = "Success!"
	let scriptletName = "Test Scriptlet"
	let scriptletNameSlug = slugify(scriptletName)
	await ensureDir(kenvPath("scriptlets"))

	await writeFile(
		scriptletPath,
		`
## ${scriptletName}

\`\`\`ts
await writeFile("${testFilePath}", "${testFilePathContents}")
\`\`\`
  `
	)
	await $`kit ${scriptletPath}#${scriptletNameSlug}`

	let testFilePathFinalContents = await readFile(testFilePath, "utf8")
	t.is(testFilePathFinalContents, testFilePathContents)
})

ava.serial("Run a scriptlet from a .md file with args", async (t) => {
	let scriptlet = "mock-scriptlet-from-md-file-with-args"
	let scriptletPath = kenvPath("scriptlets", `${scriptlet}.md`)

	let scriptletDir = path.parse(scriptletPath).dir
	t.log
	await ensureDir(scriptletDir)
	let scriptletName = "Test Scriptlet With Args"
	t.log(`Slugifying ${scriptletName}`)
	let scriptletNameSlug = slugify(scriptletName)

	t.log(`Writing file: ${scriptletPath}`)
	let scriptletContent = `
## ${scriptletName}

\`\`\`ts
let scope = await arg("scope")
let message = await arg("message")
console.log(scope + ": " + message)
\`\`\`
	  `.trim()
	t.log({ scriptletPath, scriptletNameSlug, scriptletContent })
	try {
		await writeFile(scriptletPath, scriptletContent)
	} catch (error) {
		t.log(error)
	}

	let fullCommand = `kit ${scriptletPath}#${scriptletNameSlug} test "Hello, world!"`
	t.log({ fullCommand })
	let { stdout } = await exec(fullCommand)

	t.is(stdout, "test: Hello, world!")
})

ava.serial("Run a bash scriptlet from a .md file with args", async (t) => {
	let scriptlet = "mock-bash-scriptlet-from-md-file-with-args"
	let scriptletPath = kenvPath("scriptlets", `${scriptlet}.md`)

	let scriptletDir = path.parse(scriptletPath).dir
	t.log
	await ensureDir(scriptletDir)
	let scriptletName = "Test Bash Scriptlet With Args"
	let scriptletNameSlug = slugify(scriptletName)

	let scriptletContent = `
## ${scriptletName}

\`\`\`bash
echo "fix($1): $2"
\`\`\`
	  `.trim()
	t.log({ scriptletPath, scriptletNameSlug, scriptletContent })
	try {
		await writeFile(scriptletPath, scriptletContent)
	} catch (error) {
		t.log(error)
	}

	let fullCommand = `kit ${scriptletPath}#${scriptletNameSlug} test "Hello, world!"`
	t.log({ fullCommand })
	let { stdout } = await exec(fullCommand)

	t.is(stdout, "fix(test): Hello, world!")
})
