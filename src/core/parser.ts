import { readFile } from "node:fs/promises"
import untildify from "untildify"
import type { Script, ScriptMetadata, ScriptPathInfo } from "../types/index.js"
import {
	getMetadata,
	isFile,
	kenvPath,
	kenvFromFilePath,
	shortcutNormalizer,
	friendlyShortcut
} from "./utils.js"
import { ProcessType } from "./enum.js"
import { slash } from "./resolvers.js"
import { path } from "../globals/path.js"

const shebangRegex = /^#!(.+)/m

const previewRegex = /\bpreview\b\s*[:=]/i
export let postprocessMetadata = (
	metadata: Metadata,
	fileContents: string
): ScriptMetadata => {
	const result: Partial<ScriptMetadata> = { ...metadata }

	if (metadata.shortcut) {
		result.shortcut = shortcutNormalizer(metadata.shortcut)
		result.friendlyShortcut = friendlyShortcut(result.shortcut)
	}

	if (metadata.background) {
		if (metadata.background !== "auto") {
			// @ts-ignore
			result.background = metadata.background === "true"
		}
	}

	if (metadata.shortcode) {
		result.shortcode = metadata.shortcode.trim().toLowerCase()
	}

	if (metadata.trigger) {
		result.trigger = metadata.trigger.trim().toLowerCase()
	}

	if (metadata.alias) {
		result.alias = metadata.alias.trim().toLowerCase()
	}

	if (metadata.image) {
		result.img = slash(untildify(metadata.image))
	}

	if (metadata.index !== undefined) {
		result.index = typeof metadata.index === "string"
			? Number.parseInt(metadata.index, 10)
			: metadata.index
	}

	result.type = metadata.schedule
		? ProcessType.Schedule
		: metadata.watch
			? ProcessType.Watch
			: metadata.system
				? ProcessType.System
				: metadata.background
					? ProcessType.Background
					: ProcessType.Prompt

	// Extract tabs
	const onTabRegex = /(?<=^onTab\(['"])(.+?)(?=['"])/gim
	const tabsMatch = fileContents.match(onTabRegex)
	if (tabsMatch?.length > 0) {
		result.tabs = tabsMatch
	}

	// Detect hasPreview
	// Matches `preview:` `preview =` `preview:true` `preview=true` with optional spaces
	if (previewRegex.test(fileContents)) {
		result.hasPreview = true
	}

	return result as ScriptMetadata
}

export let parseMetadata = (fileContents: string): ScriptMetadata => {
	let metadata: Metadata = getMetadata(fileContents)
	return postprocessMetadata(metadata, fileContents)
}

export let getShebangFromContents = (contents: string): string | undefined => {
	let match = contents.match(shebangRegex)
	return match ? match[1].trim() : undefined
}

export let commandFromFilePath = (filePath: string) =>
	path.basename(filePath)?.replace(/\.(j|t)s$/, "") || ""

export let iconFromKenv = async (kenv: string) => {
	let iconPath = kenv ? kenvPath("kenvs", kenv, "icon.png") : ""
	return kenv && (await isFile(iconPath)) ? iconPath : ""
}

export let parseFilePath = async (
	filePath: string
): Promise<ScriptPathInfo> => {
	let command = commandFromFilePath(filePath)
	let kenv = kenvFromFilePath(filePath)
	let icon = await iconFromKenv(kenv)

	return {
		id: filePath,
		command,
		filePath,
		kenv,
		icon
	}
}

export let parseScript = async (filePath: string): Promise<Script> => {
    const contents = await readFile(filePath, "utf8")
    const metadata = parseMetadata(contents)
    const shebang = getShebangFromContents(contents)
    const needsDebugger = /^\s*debugger/gim.test(contents)
    const parsedFilePath = await parseFilePath(filePath)

    return {
        shebang,
        ...metadata,
        ...parsedFilePath,
        needsDebugger,
        name: metadata.name || metadata.menu || parsedFilePath.command,
        description: metadata.description || ""
    } as Script
}
