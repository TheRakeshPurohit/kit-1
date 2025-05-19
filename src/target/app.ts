import util from "node:util"
import path from "node:path"
import type {
  Action,
  AppState,
  ChannelHandler,
  Choice,
  PromptConfig,
  PromptData,
  Shortcut,
} from "../types/core.js"

import type {
  GetAppData,
  KeyData,
  AppMessage,
  EditorOptions,
  KitStatus,
  GuideSection,
  KitTheme,
  MicConfig,
  Fields,
  ClipboardItem,
  ChannelMap,
  ScreenshotConfig,
  DivConfig,
} from "../types/kitapp.js"

import {
  filter,
  Observable,
  share,
  switchMap,
  take,
  takeUntil,
  tap,
  Subject,
  merge,
} from "../lib/mini-rxjs.js"
import { default as minimist } from "minimist"
import { default as stripAnsi } from "strip-ansi"

import {
  Key,
  Mode,
  Channel,
  UI,
  Value,
  PROMPT,
} from "../core/enum.js"
import {
  assignPropsTo,
  getMainScriptPath,
  cmd,
  defaultShortcuts,
  escapeShortcut,
  closeShortcut,
  editScriptShortcut,
  formShortcuts,
  argShortcuts,
  smallShortcuts,
  isMac,
  debounce,
  adjustPackageName,
  editorShortcuts,
  processPlatformSpecificTheme,
  resetPATH,
} from "../core/utils.js"
import { keyCodeFromKey } from "../core/keyboard.js"
import {
  errorPrompt,
  getFlagsFromActions,
  tmpPath,
} from "../api/kit.js"
import type { Rectangle } from "../types/electron.js"

export let shortcutsShortcut: Shortcut = {
  name: "Display Shortcuts",
  key: `${cmd}+/`,
  bar: "right",
  onPress: async () => {
    setAlwaysOnTop(true)
    let shortcutsList = ""
    for (const [
      name,
      action,
    ] of global.__kitActionsMap.entries()) {
      const shortcut =
        (action as Action)?.shortcut ||
        (action as Shortcut)?.key
      shortcutsList += `<div><span class="justify-center rounded py-0.5 px-1.5 text-sm text-primary text-opacity-90 bg-text-base bg-opacity-0 bg-opacity-10 font-medium">${shortcut}</span> - ${name}<div>`
    }

    if (shortcutsList) {
      await widget(
        md(`## Shortcuts
      
${shortcutsList}`),
        {
          width: 274,
          draggable: true,
          containerClass: "bg-bg-base",
          resizable: true,
          transparent: true,
        }
      )
    }
  },
}

interface DisplayChoicesProps
  extends Partial<PromptConfig> {
  className: string
  generated?: boolean
  inputRegex?: string
  state: AppState
}

let promptId = 0

global.__kitPromptId = ""

let createHandlerWrapper = (
  channel: keyof ChannelMap,
  handler: (data: any) => void
) => {
  global.send(channel, true)
  let wrappedHandler = (data: any) => {
    // log(data)
    if (data?.channel === channel) {
      handler(data.state)
    }
  }
  process.on("message", wrappedHandler)

  return () => {
    global.send(channel, false)
    process.off("message", wrappedHandler)
  }
}

global.onClick = handler => {
  log(`Registering onClick handler`)
  return createHandlerWrapper(Channel.SYSTEM_CLICK, handler)
}

global.onMousedown = handler => {
  return createHandlerWrapper(
    Channel.SYSTEM_MOUSEDOWN,
    handler
  )
}

global.onMouseup = handler => {
  return createHandlerWrapper(
    Channel.SYSTEM_MOUSEUP,
    handler
  )
}

global.onMousemove = handler => {
  return createHandlerWrapper(
    Channel.SYSTEM_MOUSEMOVE,
    handler
  )
}

global.onWheel = handler => {
  return createHandlerWrapper(Channel.SYSTEM_WHEEL, handler)
}

global.onKeydown = handler => {
  return createHandlerWrapper(
    Channel.SYSTEM_KEYDOWN,
    handler
  )
}

global.onKeyup = handler => {
  return createHandlerWrapper(Channel.SYSTEM_KEYUP, handler)
}

global.system = {
  onClick: global.onClick,
  onMousedown: global.onMousedown,
  onMouseup: global.onMouseup,
  onWheel: global.onWheel,
  onKeydown: global.onKeydown,
  onKeyup: global.onKeyup,
}

global.app = {
  onScriptChanged: handler => {
    return createHandlerWrapper(
      Channel.SCRIPT_CHANGED,
      handler
    )
  },
  onScriptAdded: handler => {
    return createHandlerWrapper(
      Channel.SCRIPT_ADDED,
      handler
    )
  },
  onScriptRemoved: handler => {
    return createHandlerWrapper(
      Channel.SCRIPT_REMOVED,
      handler
    )
  },
}

let _exec = global.exec
  ; (global as any).exec = (
    command: string,
    options = {
      shell: true,
      all: true,
      cwd: process.cwd(),
      windowsHide: true,
      node: false,
    }
  ) => {
    options.windowsHide = true
    let child = _exec(command, options)
    if (child?.all) child.all.pipe(process.stdout)
    return child as any
  }

let displayChoices = async ({
  choices,
  className,
  scripts,
  generated,
  inputRegex,
}: DisplayChoicesProps) => {
  switch (typeof choices) {
    case "string":
      global.setPanel(choices, className)
      break

    case "object":
      if (choices === null) {
        global.setChoices(null)
      } else {
        let resultChoices = checkResultInfo(choices)
        global.setChoices(resultChoices, {
          className,
          generated: Boolean(generated),
          inputRegex: inputRegex || ``,
        })
      }

      break
  }
}

let checkResultInfo = result => {
  if (result?.preview) {
    global.setPanel(result.preview, result?.className || "")
  }
  if (result?.panel) {
    global.setPanel(result.panel, result?.className || "")
  }
  if (result?.hint) {
    global.setHint(result.hint)
  }
  if (result?.choices) {
    return result.choices
  }

  return result
}

interface InvokeChoicesProps extends DisplayChoicesProps {
  promptId: number
  tabIndex: number
}

let invocation = 0
let invokeChoices = async (props: InvokeChoicesProps) => {
  invocation++
  let localInvocation = invocation
  if (!props?.choices) return

  if (Array.isArray(props.choices)) {
    displayChoices(props)
    return props.choices
  }
  let resultOrPromise = (props.choices as Function)(
    props.state.input
  )

  if (resultOrPromise && resultOrPromise.then) {
    let result = await resultOrPromise
    if (localInvocation !== invocation) return
    if (
      props.promptId === promptId &&
      props.tabIndex === global.onTabIndex
    ) {
      displayChoices({
        ...props,
        choices: result,
        generated: (props.choices as Function).length !== 0,
      })
      return result
    }
  } else {
    displayChoices({
      ...props,
      choices: resultOrPromise,
      generated: (props.choices as Function).length !== 0,
    })
    return resultOrPromise
  }
}

let getInitialChoices = async (
  props: InvokeChoicesProps
) => {
  if (Array.isArray(props.initialChoices)) {
    setChoices(props.initialChoices)
    return
  }
  if (!Array.isArray(props.choices)) {
    setChoices([])
  }
  if (typeof props?.choices === "function") {
    log({ getInitialChoices: props?.choices?.length })
    return await invokeChoices({ ...props })
  } else {
    displayChoices(props)
    return props.choices
  }
}

interface WaitForPromptValueProps
  extends DisplayChoicesProps {
  validate?: PromptConfig["validate"]
}

let invalid = Symbol("invalid")
global.preventSubmit = Symbol("preventSubmit")

let truncate = (str: string, length: number) => {
  if (str.length > length) {
    return str.slice(0, length) + "..."
  }
  return str
}

let createOnChoiceFocusDefault = (
  debounceChoiceFocus: number,
  onUserChoiceFocus?: ChannelHandler
) => {
  let _promptId = promptId
  let debouncedChoiceFocus = debounce(
    async (input: string, state: AppState = {}) => {
      if (_promptId !== promptId) return
      let preview = ``

      let { index, focused } = state
      let { id } = focused

      let currentChoices = (
        global?.kitPrevChoices || []
      ).concat(
        Array.from(global.__kitActionsMap.values()) || []
      )
      let choice = currentChoices.find(
        (c: Choice) => c?.id === id
      )

      if (choice?.onFocus) {
        try {
          choice?.onFocus(input, state)
        } catch (error) {
          throw new Error(error)
        }
      }

      if (
        choice?.preview &&
        typeof choice?.preview === "function"
      ) {
        ; (choice as any).index = index
          ; (choice as any).input = input

        try {
          preview = await choice?.preview(input, state)
        } catch {
          preview = md(`# Failed to render preview... 🤔`)
        }

        setPreview(preview)
      }

      if (global?.__currentPromptConfig?.shortcuts) {
        const shortcuts =
          global?.__currentPromptConfig?.shortcuts?.filter(
            shortcut => {
              if (shortcut?.condition) {
                return shortcut.condition(state.focused)
              }
              return true
            }
          )

        send(Channel.SET_SHORTCUTS, shortcuts)
      }

      if (typeof onUserChoiceFocus === "function") {
        onUserChoiceFocus(input, state)
      }
    },
    debounceChoiceFocus
  )
  return debouncedChoiceFocus
}

let onTabChanged = (input, state) => {
  let { tab } = state
  let tabIndex = global.onTabs.findIndex(({ name }) => {
    return name === tab
  })

  global.onTabIndex = tabIndex
  global.currentOnTab = global.onTabs?.[tabIndex]?.fn(input)
}

// If you call a prompt while a prompt is already running, end the stream
// This is especially important when switching tabs
global.__kitEndPrevPromptSubject = new Subject()
global.__kitPromptState = {}
global.finishPrompt = () => { }
let promptPromises: Promise<any>[] = []

export let inspectPromptPromises = () => {
  let result = promptPromises.map(p => {
    return util.inspect(p)
  })

  dev(result)
}

let runAction = async (data: AppMessage) => {
  let action: Action | Shortcut
  if (
    global.__kitActionsMap.has(data?.state?.action?.name)
  ) {
    action = global.__kitActionsMap.get(
      data?.state?.action?.name
    )
  } else if (data?.state?.shortcut) {
    for (let [
      key,
      value,
    ] of global.__kitActionsMap.entries()) {
      if (
        value?.shortcut === data.state.shortcut ||
        value?.key === data.state.shortcut
      ) {
        action = value
        break
      }
    }
  }

  if (action) {
    const hasOnAction =
      typeof (action as Action)?.onAction === "function"
    const hasOnPress =
      typeof (action as Shortcut)?.onPress === "function"
    if (
      action?.value &&
      !hasOnAction &&
      !hasOnPress
    ) {
      submit(action.value)
      return
    }
    let actionFunction =
      hasOnAction
        ? (action as Action).onAction
        : hasOnPress
          ? (action as Shortcut).onPress
          : null
    if (actionFunction) {
      return await actionFunction(
        data?.state?.input,
        data?.state
      )
    }
  }

  return false
}

let waitForPromptValue = ({
  ui,
  choices,
  initialChoices,
  validate,
  className,
  onNoChoices,
  onInput,
  onActionsInput,
  onSelected,
  onChange,
  onEscape,
  onAbandon,
  onBack,
  onForward,
  onUp,
  onDown,
  onTab,
  onKeyword,
  onChoiceFocus,
  onMessageFocus,
  onBlur,
  onLeft,
  onRight,
  onPaste,
  onDrop,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onMenuToggle,
  onInit,
  onSubmit,
  onValidationFailed,
  onAudioData,
  state,
  shortcuts,
  inputRegex,
}: WaitForPromptValueProps) => {
  global.actionFlag = ""
  global.__kitPromptState = {}
  global.__kitEndPrevPromptSubject.next()
  global.activePromptPromise = new Promise(
    (resolve, reject) => {
      if (
        ui === UI.arg ||
        ui === UI.hotkey ||
        ui === UI.div
      ) {
        getInitialChoices({
          promptId,
          tabIndex: global.onTabIndex,
          choices,
          initialChoices,
          className,
          onNoChoices,
          state,
          inputRegex,
        })
      } else {
        setChoices([])
      }

      global.__kitPromptSubject = new Subject()
      let process$ = merge(
        global.__kitPromptSubject as Subject<AppMessage>,
        new Observable<AppMessage>(observer => {
          let messageHandler = (data: AppMessage) => {
            observer.next(data)
          }
          let errorHandler = (error: Error) => {
            observer.error(error)
          }

          global.finishPrompt()
          process.on("message", messageHandler)
          process.on("error", errorHandler)

          global.finishPrompt = () => {
            process.off("message", messageHandler)
            process.off("error", errorHandler)
            global.finishPrompt = () => { }
          }

          return global.finishPrompt
        })
      ).pipe(
        takeUntil(global.__kitEndPrevPromptSubject),
        share()
      )

      let tab$ = process$.pipe(
        filter(
          data => data.channel === Channel.TAB_CHANGED
        ),
        share()
      )

      let message$ = process$.pipe(takeUntil(tab$), share())

      let valueSubmitted$ = message$.pipe(
        filter(
          data => data.channel === Channel.VALUE_SUBMITTED
        ),
        share()
      )

      let value$ = valueSubmitted$.pipe(
        tap(data => {
          if (data.state?.flag) {
            global.flag[data.state?.flag] = true
            global.actionFlag = data.state?.flag || ""
          }
        }),
        switchMap(async (data: AppMessage) => {
          if (!data?.state) {
            global.warn(
              `AppMessage failed: ${JSON.stringify(
                data,
                null,
                2
              )}`
            )
            return
          }
          let { value, focused, multiple, selected } =
            data?.state
          let choice = (global.kitPrevChoices || []).find(
            (c: Choice) => c.id === focused?.id
          )

          // handle when a select prompt uses a flag
          if (multiple) {
            return selected
          }

          // TODO: Dont use onSubmit for chat component? onUserMessage maybe?
          if (global.__kitPromptState?.ui !== UI.chat) {
            let checkPreventSubmit: any

            if (!data?.state?.flag) {
              if (choice?.onSubmit) {
                checkPreventSubmit = await choice?.onSubmit(
                  data?.state?.input,
                  data?.state
                )
              } else {
                checkPreventSubmit = await onSubmit(
                  data?.state?.input,
                  data.state
                )
              }
            }

            if (checkPreventSubmit === preventSubmit) {
              send(Channel.PREVENT_SUBMIT)
              return preventSubmit
            }
          }

          // TODO: Refactor out an invalid$ stream
          if (validate) {
            let validateMessage = await validate(value)
            if (
              typeof validateMessage === "boolean" &&
              !validateMessage
            ) {
              send(
                Channel.VALUE_INVALID,
                chalk`${value} is {red not valid}`
              )
              return invalid
            }

            if (typeof validateMessage === "string") {
              send(Channel.VALUE_INVALID, validateMessage)

              return invalid
            }
            return value
          }
          return value
        }),
        filter(
          value =>
            value !== invalid && value !== preventSubmit
        ),
        take(1),
        share()
      )

      tab$.pipe(takeUntil(value$)).subscribe(data => {
        onTabChanged(data.state.input, data.state)
      })

      message$.pipe(takeUntil(value$), share()).subscribe({
        next: async data => {
          // if (data?.promptId !== global.__kitPromptId) {
          //   log(
          //     `🤔 ${data?.channel} ${data?.promptId} : ${global.__kitPromptId} Received "prompt" message from an unmatched prompt`
          //   )
          //   return
          // }
          if (data?.state?.input === Value.Undefined) {
            data.state.input = ""
          }

          global.__kitPromptState = data.state

          trace.instant({
            name: data?.channel,
            channel: data?.channel,
            args: data,
          })
          switch (data.channel) {
            case Channel.PING:
              send(Channel.PONG)
              break

            case Channel.ON_SUBMIT:
              await onSubmit(data.state.input, data.state)
              break

            case Channel.INPUT:
              onInput(data.state.input, data.state)
              break

            case Channel.ACTION:
              await runAction(data)
              break

            case Channel.ACTIONS_INPUT:
              onActionsInput(data.state.input, data.state)
              break

            case Channel.SELECTED:
              onSelected(data.state.input, data.state)
              break

            case Channel.CHANGE:
              onChange(data.state.input, data.state)
              break

            case Channel.NO_CHOICES:
              onNoChoices(data.state.input, data.state)
              break

            case Channel.ESCAPE:
              onEscape(data.state.input, data.state)

              break

            case Channel.BACK:
              onBack(data.state.input, data.state)
              break

            case Channel.FORWARD:
              onForward(data.state.input, data.state)
              break

            case Channel.UP:
              onUp(data.state.input, data.state)
              break

            case Channel.DOWN:
              onDown(data.state.input, data.state)
              break

            case Channel.LEFT:
              onLeft(data.state.input, data.state)
              break

            case Channel.RIGHT:
              onRight(data.state.input, data.state)
              break

            case Channel.TAB:
              onTab(data.state.input, data.state)
              break

            case Channel.KEYWORD_TRIGGERED:
              onKeyword(data.state.input, data.state)
              break

            case Channel.CHOICE_FOCUSED:
              onChoiceFocus(data.state.input, data.state)
              break

            case Channel.MESSAGE_FOCUSED:
              onMessageFocus(data.state.input, data.state)
              break

            case Channel.BLUR:
              onBlur(data.state.input, data.state)
              break

            case Channel.ABANDON: {
              global.__kitAbandoned = true
              onAbandon(data.state.input, data.state)
              break
            }

            case Channel.SHORTCUT:
              await runAction(data)
              break

            case Channel.ON_PASTE:
              onPaste(data.state.input, data.state)
              break

            case Channel.ON_DROP:
              onDrop(data.state.input, data.state)
              break

            case Channel.ON_DRAG_ENTER:
              onDragEnter(data.state.input, data.state)
              break

            case Channel.ON_DRAG_LEAVE:
              onDragLeave(data.state.input, data.state)
              break

            case Channel.ON_DRAG_OVER:
              onDragOver(data.state.input, data.state)
              break

            case Channel.ON_MENU_TOGGLE:
              onMenuToggle(data.state.input, data.state)
              break

            case Channel.ON_INIT:
              onInit(data.state.input, data.state)
              break

            case Channel.ON_VALIDATION_FAILED:
              onValidationFailed(
                data.state.input,
                data.state
              )
              break

            case Channel.SCRIPTS_CHANGED:
              global.__kitScriptsFromCache = false
              break

            case Channel.ENV_CHANGED: {
              ; (process as any).env = data?.env
              break
            }

            default:
              // warn(`Unknown channel: ${data.channel}`)
              break
          }
        },
        // TODO: Add a kit log
        // TODO: Why abandon on CLI?
        complete: () => {
          // global.log(
          //   `${process.pid}: ✂️  Remove all handlers`
          // )
        },
      })

      value$.subscribe({
        next: value => {
          if (value?.data) {
            console.log(`Found value.data`)
            value = value.data
          }
          if (
            typeof value === "string" &&
            value.startsWith("data:")
          ) {
            const [header, content] = value.split(",")
            const [type, encoding] = header.split(";")

            // log(`decoding ${encoding} ${type}`)

            if (encoding === "base64") {
              value = Buffer.from(content, "base64")
            }
          }

          // for (let eventName of process.eventNames()) {
          //   let count = process.listenerCount(eventName)

          //   console.log(
          //     `${process.pid}: ✅  ${String(
          //       eventName
          //     )} ${count} listeners left.`
          //   )
          // }

          global.finishPrompt()
          resolve(value)

          global.__kitAddErrorListeners()
        },
        complete: () => {
          // global.log(
          //   `${process.pid}: Prompt #${promptId} complete 👍`
          // )
        },
        error: error => {
          reject(error)
        },
      })
    }
  )
  return global.activePromptPromise
}

let onNoChoicesDefault = (input: string) => {
  setPreview('')
}

let onEscapeDefault: ChannelHandler = (
  input: string,
  state: AppState
) => {
  // global.log(`onEscapeDefault ${state.input}`)
  exit()
}

let onAbandonDefault = () => {
  global.log(
    `${process.pid}: Abandon caused exit. Provide a "onAbandon" handler to override.`
  )
  exit()
}

let onBackDefault = async () => { }
let onForwardDefault = async () => { }
let onUpDefault = async () => { }
let onDownDefault = async () => { }
let onLeftDefault = async () => { }
let onRightDefault = async () => { }
let onTabDefault = async () => { }
let onMessageFocusDefault = async () => { }
let onActionsInputDefault = async () => { }
let onSelectedDefault = async () => { }

let onKeywordDefault = async (input, state) => {
  if (!state.keyword) {
    await mainScript(state.input)
  }
}
let onMenuToggleDefault = async (input, state) => {
  if (state.flaggedValue) {
    let localChoice: Choice = (
      global.kitPrevChoices || []
    ).find((c: Choice) => c.id === state?.focused?.id)
    if (localChoice && localChoice?.actions) {
      let flags = getFlagsFromActions(localChoice?.actions)
      setFlags(flags)
    }
  }
}
let onPasteDefault = async (input, state) => {
  if (state.paste) setSelectedText(state.paste, false)
}
let onDropDefault = async (input, state) => {
  log(`onDrop`)
  if (state.drop && state.ui === UI.arg) {
    setInput(state.drop)
  }
  await focus()
}

let onDragEnterDefault = async (input, state) => {
  log(`onDragEnter`)
}
let onDragLeaveDefault = async (input, state) => {
  log(`onDragLeave`)
}
let onDragOverDefault = async (input, state) => {
  log(`onDragOver`)
}

let onInitDefault = async (input, state) => { }
let onSubmitDefault = async (input, state) => { }
let onValidationFailedDefault = async (input, state) => { }
let onAudioDataDefault = async (input, state) => { }

global.setPrompt = async (data: Partial<PromptData>) => {
  let { tabs } = data
  if (tabs) global.onTabs = tabs

  // let id = uuid()
  let id = `${global.kitScript}-${promptId}`
  global.__kitPromptId = id
  let actionsConfig = {
    name: data?.actionsConfig?.name || "Actions",
    placeholder:
      data?.actionsConfig?.placeholder || "Actions",
    active: data?.actionsConfig?.active || "Actions",
  }
  const result = await global.sendWait(Channel.SET_PROMPT_DATA, {
    id,
    scriptPath: global.kitScript,
    flags: prepFlags(data?.flags),
    actionsConfig,
    hint: "",
    input: "",
    kitScript: global.kitScript,
    kitArgs: global.args,
    mode: Mode.FILTER,
    placeholder: "",
    panel: "",
    preview: "",
    secret: false,
    selected: "",
    strict: false,
    tabs: global.onTabs?.length
      ? global.onTabs.map(({ name }) => name)
      : [],
    tabIndex: 0,
    type: "text",
    ui: UI.arg,
    resize: false,
    env: global.env,
    show: true,
    ...(data as PromptData),
  }, 0)

  performance.measure("SET_PROMPT_DATA", "run")

  return result
}

let prepPrompt = async (config: PromptConfig) => {
  global.__kitActionsMap.clear()
  let escapeDefault = Boolean(
    !config?.onEscape ||
    config?.onEscape === onEscapeDefault
  )
  let hasEscapeShortcut = Boolean(
    (config?.shortcuts || []).find(s => s.key === "escape")
  )

  if (config?.actions) {
    let actionsFlags = getFlagsFromActions(config.actions)

    if (typeof config?.flags === "object") {
      config.flags = {
        ...config.flags,
        ...actionsFlags,
      }
    } else {
      config.flags = actionsFlags
    }
  }

  if (Array.isArray(config?.actions)) {
    for (let action of config.actions) {
      if (action?.name && (action?.onAction || action?.value)) {
        global.__kitActionsMap.set(action.name, action)
      }
    }
  }

  for (let shortcut of config?.shortcuts || []) {
    if (shortcut?.name && (shortcut?.onPress || shortcut?.value)) {
      if (shortcut.key)
        shortcut.key = shortcut.key.toLowerCase()
      global.__kitActionsMap.set(shortcut.name, shortcut)
    }
  }

  let {
    choices,
    placeholder,
    footer,
    preview,
    previewWidthPercent,
    panel,
    shortcodes = {},
    hideOnEscape,
    keyword = config?.ui !== UI.arg ? "" : undefined,
    ...restConfig
  } = config

  if (typeof keyword === "string") {
    delete arg?.keyword
  }

  if (typeof hideOnEscape === "undefined") {
    hideOnEscape = Boolean(
      escapeDefault && !hasEscapeShortcut
    )
  }
  let choicesAreAFunction = typeof choices === "function"
  let choicesHasAnInputArg =
    (choices as Function)?.length > 0

  let mode =
    !choicesAreAFunction || !choicesHasAnInputArg
      ? Mode.FILTER
      : Mode.GENERATE

  let promptData = {
    footer: footer || "",
    strict: Boolean(choices),
    hasPreview: Boolean(preview),
    headerClassName: "",
    footerClassName: "",
    inputClassName: "",
    css: "",
    preventCollapse: false,
    ...restConfig,
    shortcodes,
    tabIndex: global.onTabs?.findIndex(
      ({ name }) => global.arg?.tab
    ),
    mode,
    placeholder: stripAnsi(placeholder || ""),
    panel:
      panel && typeof panel === "function"
        ? await (panel as Function)()
        : (panel as string),
    preview:
      preview && typeof preview === "function"
        ? await (preview as Function)()
        : (preview as string),
    previewWidthPercent: previewWidthPercent || 60,
    env: config?.env || global.env,
    choicesType: determineChoicesType(choices),
    hasOnNoChoices: Boolean(config?.onNoChoices),
    inputCommandChars: config?.inputCommandChars || [],
    hideOnEscape,
    keyword,
    searchKeys: config?.searchKeys || [
      "slicedName",
      "friendlyShortcut",
      "tag",
      "group",
      "command",
      "alias"
    ],
  }

  global.setPrompt(promptData as PromptData)
}

let createOnInputDefault = (
  choices,
  className,
  debounceInput
) => {
  let choicesAreAFunction = typeof choices === "function"
  let choicesHasAnInputArg = choices?.length > 0

  if (!choicesAreAFunction || !choicesHasAnInputArg) {
    return async () => { }
  }

  // "input" is on the state, so this is only provided as a convenience for the user
  let _promptId = promptId
  return debounce(async (input, state) => {
    if (_promptId !== promptId) return
    return invokeChoices({
      promptId,
      tabIndex: global.onTabIndex,
      choices,
      className,
      state,
    })
  }, debounceInput)
}

let createOnActionInputDefault = (
  actions,
  className,
  debounceInput
) => {
  let actionsAreAFunction = typeof actions === "function"
  let actionsHasAnInputArg = actions?.length > 0

  if (!actionsAreAFunction || !actionsHasAnInputArg) {
    return async () => { }
  }

  // "input" is on the state, so this is only provided as a convenience for the user
  let _promptId = promptId
  return debounce(async (input, state) => {
    if (_promptId !== promptId) return
    let result = await actions(input, state)
    return setFlags(getFlagsFromActions(result))
  }, debounceInput)
}

let onBlurDefault = () => { }

let onChangeDefault = () => { }

let determineChoicesType = choices => {
  if (!choices) return "null"
  if (typeof choices === "function") {
    if (choices.constructor.name === "AsyncFunction")
      return "async"
    return "function"
  } else if (Array.isArray(choices)) {
    return "array"
  } else if (typeof choices === "string") {
    return "string"
  }
}

global.__currentPromptSecret = false
global.__currentPromptConfig = {}

global.kitPrompt = async (config: PromptConfig) => {
  trace.begin({
    name: config.ui,
    channel: Channel.SET_PROMPT_DATA,
    args: config,
  })
  promptId++
  global.__currentPromptSecret = config.secret || false
  let ui = config?.ui || UI.arg
  global.__kitCurrentUI = ui

  //need to let onTabs() gather tab names. See Word API
  if (global?.onTabs?.length) {
    await new Promise(r => setTimeout(r, 0))
  }

  config.shortcuts ||= []
  config.choices ||= config.panel
  config.width ||= PROMPT.WIDTH.BASE

  // if (!config.shortcuts.find(s => s.key === `escape`)) {
  //   config.shortcuts.push({
  //     ...backToMainShortcut,
  //     bar: "",
  //   })
  // }

  if (!config.shortcuts.find(s => s.key === `${cmd}+o`)) {
    config.shortcuts.push({
      ...editScriptShortcut,
      bar: "",
    })
  }

  if (!config.shortcuts.find(s => s.key === `${cmd}+w`)) {
    config.shortcuts.push({
      ...closeShortcut,
      bar: "",
    })
  }

  if (!config.shortcuts.find(s => s.key === `${cmd}+/`)) {
    config.shortcuts.push({
      ...shortcutsShortcut,
      bar: "",
    })
  }

  if (typeof config?.keyword === "string") {
    delete arg?.keyword
  }

  if (config?.focused) {
    config.defaultValue = config.focused
  }

  if (config?.focusedId) {
    config.defaultChoiceId =
      config.focusedId || global.__kitFocusedChoiceId
  }

  let {
    input = "",
    inputRegex = arg?.keyword
      ? `(?<=${arg?.keyword}\\s)(.*)`
      : "",
    choices = null,
    initialChoices = null,
    className = "",
    validate = null,
    onNoChoices = onNoChoicesDefault,
    onEscape = onEscapeDefault,
    onAbandon = onAbandonDefault,
    onBack = onBackDefault,
    onForward = onForwardDefault,
    onUp = onUpDefault,
    onDown = onDownDefault,
    onLeft = onLeftDefault,
    onRight = onRightDefault,
    onTab = onTabDefault,
    onKeyword = onKeywordDefault,
    debounceChoiceFocus = 0,
    onChoiceFocus,
    onMessageFocus = onMessageFocusDefault,
    debounceInput = 200,
    onInput = createOnInputDefault(
      choices,
      className,
      debounceInput
    ),
    onActionsInput = createOnActionInputDefault(
      config?.actions,
      className,
      debounceInput
    ),
    onSelected = onSelectedDefault,
    onChange = onChangeDefault,
    onBlur = onBlurDefault,
    onPaste = onPasteDefault,
    onDrop = onDropDefault,
    onMenuToggle = onMenuToggleDefault,
    onDragEnter = onDragEnterDefault,
    onDragLeave = onDragLeaveDefault,
    onDragOver = onDragOverDefault,
    onInit = onInitDefault,
    onSubmit = onSubmitDefault,
    onValidationFailed = onValidationFailedDefault,
    onAudioData = onAudioDataDefault,
  } = config

  global.__currentPromptConfig = config
  await prepPrompt(config)

  let choiceFocus = createOnChoiceFocusDefault(
    debounceChoiceFocus,
    onChoiceFocus
  )

  let value = await waitForPromptValue({
    ui,
    choices,
    validate,
    className,
    onInput,
    onActionsInput,
    onSelected,
    onChange,
    onNoChoices,
    onEscape,
    onAbandon,
    onBack,
    onForward,
    onUp,
    onDown,
    onLeft,
    onRight,
    onKeyword,
    onTab,
    onChoiceFocus: choiceFocus,
    onMessageFocus,
    onBlur,
    onPaste,
    onDrop,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onMenuToggle,
    onInit,
    onSubmit,
    onValidationFailed,
    onAudioData,
    shortcuts: config.shortcuts,
    state: { input },
    inputRegex,
    initialChoices,
  })

  trace.end({
    name: config.ui,
    channel: Channel.SET_PROMPT_DATA,
  })

  return value
}

global.drop = async (
  placeholder = "Drop something here...",
  actions?: Action[]
) => {
  let config: Partial<PromptConfig> =
    typeof placeholder === "string"
      ? { placeholder }
      : placeholder

  return await global.kitPrompt({
    ui: UI.drop,
    enter: "",
    actions,
    width: config?.preview
      ? PROMPT.WIDTH.BASE
      : PROMPT.WIDTH.XXS,
    height: PROMPT.WIDTH.XXS,
    shortcuts: [escapeShortcut, closeShortcut],
    ...config,
  })
}

global.emoji = async (config?: PromptConfig) => {
  return await global.kitPrompt({
    ui: UI.emoji,
    enter: "Select",
    shortcuts: [escapeShortcut],

    width: 350,
    height: 510,
    ...config,
  })
}

global.showEmojiPanel = () => {
  send(Channel.SHOW_EMOJI_PANEL)
}

global.fields = async (formFields, actions?: Action[]) => {
  let config: Parameters<Fields>[0] = []
  let f = []
  if (
    Array.isArray(formFields) &&
    !(formFields as any)[0]?.fields // not sure if I can safely deprecate this
  ) {
    f = formFields
  } else {
    config = formFields
    f = (config as any)?.fields
  }

  let inputs = f
    .map((field, i) => {
      let defaultElement: any = {
        element: "input",
        label: "Label",
      }
      let fieldString = typeof field === "string"
      if (fieldString) {
        defaultElement.label = field
        defaultElement.placeholder = field
      } else {
        Object.entries(field).forEach(([key, value]) => {
          defaultElement[key] = value
        })
      }
      if (global.args.length) {
        defaultElement.value = global.args.shift()
      }
      let { element, label, id, name, ...attrs } =
        defaultElement
      let attributes = Object.entries(attrs)
        .map(([key, value]) => {
          return ` ${key}="${value}" `
        })
        .join("")
      // log(attributes)
      return `
      <div class="w-full pt-4 flex flex-col-reverse">
           
              <${element}
                  id="${id || i}"
                  name="${name || i}"
                  data-name="${name ? name : fieldString ? field : i
        }"
                  ${i === 0 ? `autofocus` : ``
        }                  
                  ${attributes}   
                  class="peer text-xl h-10 px-4 py-0 outline-none border-b border-opacity-25 placeholder-text-base placeholder-opacity-25 border-text-base border-opacity-15 focus:border-primary w-full"/>

                  <label for=${id || i} htmlFor=${id || i
        } class="text-sm px-4 block font-normal text-text-base text-opacity-75 peer-focus:text-primary peer-focus:text-opacity-90">
                          ${label}
                        </label>
          </div>
      
      `
    })
    .join("")
    ; (
      config as PromptConfig
    ).html = `<div class="flex flex-col items-center min-h-full flex-1 w-full">

${inputs}

<div class="w-full px-4 invisible h-0">
<input type="reset" name="reset-form" value="Reset" accesskey="r"> class="focus:underline underline-offset-4 outline-none p-3 dark:text-white text-opacity-50 dark:text-opacity-50 font-medium text-sm focus:text-text-base dark:focus:text-primary-light  hover:text-text-base dark:hover:text-primary-light hover:underline dark:hover:underline"/>
<input type="submit" name="submit-form" value="Submit" class="focus:underline underline-offset-4 outline-none p-3 text-contrast-dark dark:text-contrast-light text-opacity-75 dark:text-opacity-75 font-medium text-sm focus:text-text-base dark:focus:text-primary-light hover:text-text-base dark:hover:text-primary-light hover:underline dark:hover:underline bg-opacity-75 dark:bg-opacity-75"/>
</div>
</div>`
    ; (config as PromptConfig).shortcuts = formShortcuts
    ; (config as PromptConfig).actions = actions

  if (typeof (config as PromptConfig).enter !== "string") {
    ; (config as PromptConfig).enter = "Submit"
  }

  let formResponse = await global.form(
    config as PromptConfig
  )
  return formResponse.orderedValues
}

global.setDisableSubmit = async (disable = true) => {
  await sendWait(Channel.SET_DISABLE_SUBMIT, disable)
}

global.setFormData = async (formData = {}) => {
  await sendWait(Channel.SET_FORM_DATA, formData)
}

global.form = async (
  html = "",
  formData = {},
  actions?: Action[]
) => {
  let config: PromptConfig = {}
  if ((html as PromptConfig)?.html) {
    config = html as PromptConfig
    config.formData = formData
  } else {
    config = {
      html: html as string,
      formData,
    }
  }

  config.ui = UI.form
  if (typeof config.enter !== "string") {
    config.enter = "Submit"
  }
  config.shortcuts ||= formShortcuts
  config.actions ||= actions

  return await global.kitPrompt(config)
}

// global.form = async (
//   ...fields: PromptConfig[] | string[]
// ) => {
//   let configs: PromptConfig[] = []

//   for await (let f of fields) {
//     if (typeof f === "string") {
//       configs.push({
//         placeholder: f,
//       })
//     } else {
//       configs.push(f)
//     }
//   }
//   send(Channel.SET_FORM, configs)
// }

let maybeWrapHtml = (html = "", containerClasses = "") => {
  return containerClasses?.length === 0
    ? html
    : `<div class="${containerClasses}">${html}</div>`
}

global.div = async (
  htmlOrConfig: string | DivConfig = "",
  actions: Action[] = []
): Promise<any> => {
  let config: DivConfig = typeof htmlOrConfig === "string"
    ? { html: htmlOrConfig }
    : htmlOrConfig

  if (!config.html?.trim()) {
    config.html = md("⚠️ html string was empty")
  }

  return await global.kitPrompt({
    enter: 'Continue',
    shortcuts: [escapeShortcut],
    ...config,
    choices: maybeWrapHtml(config.html, config.containerClasses),
    ui: UI.div,
    actions,
  })
}

global.getCodeblocksFromSections =
  (sections: GuideSection[]) =>
    (name: string): string => {
      let fileMarkdown = sections.find(
        s => s.name === name
      )?.raw
      if (!fileMarkdown) {
        return ""
      }
      let lexer = new marked.Lexer()
      let nodes = lexer.lex(fileMarkdown)
      // Grab all of the code blocks
      let codeBlocks = nodes
        .filter(node => node.type === "code")
        .map((node: any) => (node?.text ? node.text : ``))
        .join("\n\n")

      return codeBlocks
    }

global.groupMarkdownFileIntoChoices = async (
  filePath: string
) => {
  let fileMarkdown = await readFile(filePath, "utf-8")
  let lexer = new marked.Lexer()
  let tokens = lexer.lex(fileMarkdown)

  let sections: GuideSection[] = []
  let placeholder = ""
  let group = ""
  let order = []
  let useGroups = tokens.find(
    t => t.type === "heading" && t.depth === 3
  )

  let parseKVFromText = (text: string) => {
    return (
      text
        .replace(/<!--(.*)-->/, "$1")
        .trim()
        // Only split on the first colon and filter out empty strings
        .split(/:(.+)/)
        .map(s => s.trim())
        .filter(s => s.length > 0)
    )
  }

  let h1Value = ""
  let h2Value = ""
  let currentHeading = ""

  for (let token of tokens) {
    if (token.type === "heading" && token.depth < 3) {
      currentHeading = `h${token.depth}`
    }

    if (token.type === "heading" && token.depth === 1) {
      setName(token.text)
      placeholder = token.text

      continue
    }

    if (
      token.type === "heading" &&
      token.depth === 2 &&
      useGroups
    ) {
      group = token.text
      if (!order.includes(group)) order.push(group)
    } else if (
      token.type === "heading" &&
      token.depth === 3
    ) {
      sections.push({
        name: token.text,
        group,
        raw: `# ${token.text}\n\n`,
        comments: {
          // TODO: determine if we want to keep a strategy where values can default to the parent heading value
          // value: h2Value || h1Value,
        },
      })
    } else if (
      token.type === "html" &&
      token.text.startsWith("<!--")
    ) {
      // Fallback to h2/h1s
      let [key, value] = parseKVFromText(token.text)
      let trimmedValue = value.trim()
      if (key === "value") {
        if (currentHeading === "h1") {
          h1Value = trimmedValue
        } else if (currentHeading === "h2") {
          h2Value = trimmedValue
        }
      }

      if (sections.length) {
        sections[sections.length - 1].comments[key.trim()] =
          trimmedValue
      }
    } else if (sections.length) {
      sections[sections.length - 1].raw += token.raw
    }
  }

  let containerClasses =
    "p-5 prose dark:prose-dark prose-sm"

  let choices = sections.map(section => {
    let value = section?.comments?.value || section?.name

    return {
      name: section.name,
      className: "text-base",
      preview: async () =>
        highlight(section.raw, containerClasses),
      value,
      ...section.comments,
      group: section?.group,
    }
  })

  let groupedChoices = groupChoices(choices, {
    order,
    sortChoicesKey: Array.from(
      { length: order.length },
      () => false
    ),
  })

  return {
    sections,
    tokens,
    placeholder,
    choices,
    groupedChoices,
  }
}

global.docs = async (filePath: string, options = {}) => {
  let { placeholder, groupedChoices, sections, tokens } =
    await global.groupMarkdownFileIntoChoices(
      filePath,
      options
    )

  let config =
    typeof options === "function"
      ? await options(sections, tokens)
      : options

  return await arg(
    {
      placeholder,

      ...config,
    },
    groupedChoices
  )
}

global.editor = (async (
  options?: EditorOptions,
  actions?: Action[]
) => {
  if (options?.language) {
    let fileTypes = {
      css: "css",
      js: "javascript",
      jsx: "javascript",
      json: "json",
      md: "markdown",
      mjs: "javascript",
      ts: "typescript",
      tsx: "typescript",
    }

    if (fileTypes[options?.language]) {
      options.language = fileTypes[options.language]
    }
  }

  let defaultOptions: EditorOptions = {
    value: "",
    language: "markdown",
    scrollTo: "top",
    onInput: () => { },
    onEscape: () => { },
    onAbandon: onAbandonDefault,
    onPaste: onPasteDefault,
    onDrop: onDropDefault,
    onBlur: () => { },
  }

  let editorOptions =
    typeof options === "string"
      ? { ...defaultOptions, value: options }
      : { ...defaultOptions, ...options }

  send(Channel.SET_EDITOR_CONFIG, editorOptions)

  return await global.kitPrompt({
    ui: UI.editor,
    input: editorOptions.value,
    flags: {},
    shortcuts: editorShortcuts,
    height: PROMPT.HEIGHT.XL,
    ...editorOptions,
    actions: actions || options?.actions,
    enter: "",
    choices: [],
    hideOnEscape: false,
  })
}) as any // TODO: Fix global implementation to better match exported types

global.editor.setSuggestions = async (
  suggestions: string[] = []
) => {
  await sendWait(
    Channel.SET_EDITOR_SUGGESTIONS,
    suggestions
  )
}

global.editor.setConfig = async (config: EditorOptions) => {
  await sendWait(Channel.SET_EDITOR_CONFIG, config)
}

global.editor.append = async (value: string) => {
  await sendWait(Channel.APPEND_EDITOR_VALUE, value)
}

global.editor.getSelection = async () => {
  let message = await sendWait(Channel.EDITOR_GET_SELECTION)
  return message?.state?.value
}

global.editor.getCursorOffset = async () => {
  let message = await sendWait(
    Channel.EDITOR_GET_CURSOR_OFFSET
  )
  return message?.state?.value
}

global.editor.moveCursor = async (offset: number) => {
  let message = await sendWait(
    Channel.EDITOR_MOVE_CURSOR,
    offset
  )
  return message?.state?.value
}

global.editor.insertText = async (text: string) => {
  let message = await sendWait(
    Channel.EDITOR_INSERT_TEXT,
    text
  )
  return message?.state?.value
}

global.editor.setText = async (text: string) => {
  await setInput(text)
}

// global.editor.setCodeHint = async (value: string) => {
//   await sendWait(Channel.EDITOR_SET_CODE_HINT, value)
// }

global.template = async (
  template = "",
  options: EditorOptions = { language: "plaintext" },
  actions?: Action[]
) => {
  let updatedTemplate = template
  if (template.includes("$SELECTION")) {
    updatedTemplate = updatedTemplate.replaceAll(
      "$SELECTION",
      await getSelectedText()
    )
  }

  if (updatedTemplate.includes("$CLIPBOARD")) {
    updatedTemplate = updatedTemplate.replaceAll(
      "$CLIPBOARD",
      await paste()
    )
  }

  if (updatedTemplate.includes("$HOME")) {
    updatedTemplate = updatedTemplate.replaceAll(
      "$HOME",
      home()
    )
  }

  return global.editor({
    template: updatedTemplate,
    ...options,
    actions,
    enter: "",
  })
}

global.hotkey = async (
  placeholder = "Press a key combo:"
) => {
  let config =
    typeof placeholder === "string"
      ? { placeholder }
      : placeholder

  return await global.kitPrompt({
    resize: true,
    shortcuts: [escapeShortcut],
    enter: "",
    ui: UI.hotkey,
    ...config,
  })
}

global.basePrompt = async (
  placeholderOrConfig = "Enter text...",
  choices = ``,
  actions = ``
) => {
  if (
    typeof placeholderOrConfig === "object" &&
    placeholderOrConfig?.choices
  ) {
    choices = placeholderOrConfig.choices
  }
  if (!choices) {
    setChoices([])
    if (!(placeholderOrConfig as PromptConfig)?.panel) {
      setPanel(``)
    }
  }
  let firstArg = global.args.length
    ? global.args.shift()
    : null

  let hint =
    (placeholderOrConfig as PromptConfig)?.hint || ""

  if (
    typeof firstArg !== "undefined" &&
    firstArg !== null
  ) {
    let validate = (placeholderOrConfig as PromptConfig)
      ?.validate

    if (typeof validate === "function") {
      let valid: boolean | string = await validate(firstArg)

      if (typeof valid === "boolean" && valid)
        return firstArg

      hint =
        typeof valid === "boolean" && !valid
          ? `${firstArg} is not valid`
          : (valid as string)
    } else {
      return firstArg
    }
  }

  let height = PROMPT.HEIGHT.BASE
  if (!choices) {
    height =
      PROMPT.HEIGHT.HEADER +
      PROMPT.INPUT.HEIGHT.SM +
      PROMPT.HEIGHT.FOOTER
  }
  if (typeof placeholderOrConfig === "object") {
    let {
      headerClassName = "",
      footerClassName = "",
      inputHeight,
    } = placeholderOrConfig as PromptConfig
    if (inputHeight) {
      height = inputHeight
    }
    if (headerClassName.includes("hidden")) {
      height -= PROMPT.HEIGHT.HEADER
    }

    if (footerClassName.includes("hidden")) {
      height -= PROMPT.HEIGHT.FOOTER
    }
  }

  let promptConfig: PromptConfig = {
    ui: UI.arg,
    enter: "Submit",
    inputHeight: PROMPT.INPUT.HEIGHT.SM,
    itemHeight: PROMPT.ITEM.HEIGHT.SM,
    hint,
    height,
    resize: !choices ? true : undefined,
    shortcuts: (placeholderOrConfig as PromptConfig)?.resize
      ? smallShortcuts
      : argShortcuts,
    choices,
    actions,
    preview:
      typeof actions === "string" ? actions : undefined,
  }

  if (
    Array.isArray(choices) &&
    !(choices as Choice[]).find(c => c?.preview)
  ) {
    promptConfig.resize ??= true
  }

  if (typeof placeholderOrConfig === "string") {
    promptConfig.placeholder = placeholderOrConfig
  }

  if (typeof placeholderOrConfig === "object") {
    promptConfig = {
      ...promptConfig,
      ...(placeholderOrConfig as any),
    }
  }

  return await global.kitPrompt(promptConfig)
}

global.select = async (
  placeholderOrConfig = "Type something...",
  choices = [],
  actions = []
) => {
  let config: PromptConfig = {
    multiple: true,
    enter: "Select",
    shortcuts: [
      {
        name: "Toggle All",
        key: `${cmd}+a`,
        onPress: async (input, state) => {
          toggleAllSelectedChoices()
        },
        bar: "right",
        visible: true,
      },
      {
        name: "Submit",
        key: `${cmd}+enter`,
        onPress: async (input, state) => {
          submit(state.selected)
        },
        bar: "right",
        visible: true,
      },
    ],
  }

  if (typeof placeholderOrConfig === "string") {
    config.placeholder = placeholderOrConfig
  } else {
    config = {
      ...config,
      ...(placeholderOrConfig as PromptConfig),
    }
  }

  return await arg(config, choices, actions)
}

global.grid = async (
  placeholderOrConfig = "Type something...",
  choices = [],
  actions = []
) => {
  let config: PromptConfig = {
    grid: true,
    enter: "Select",
  }

  if (typeof placeholderOrConfig === "string") {
    config.placeholder = placeholderOrConfig
  } else {
    config = {
      ...config,
      ...(placeholderOrConfig as PromptConfig),
    }
  }

  return await arg(config, choices, actions)
}

global.mini = async (
  placeholderOrConfig = "Type a value:",
  choices = "",
  actions = ""
) => {
  let miniConfig = {
    headerClassName: "hidden",
    footerClassName: "hidden",
    inputHeight: PROMPT.INPUT.HEIGHT.SM,
    itemHeight: PROMPT.ITEM.HEIGHT.SM,
    height: PROMPT.INPUT.HEIGHT.SM,
    placeholder: "",
  }

  if (typeof placeholderOrConfig === "string") {
    miniConfig.placeholder = placeholderOrConfig
  }

  if (typeof placeholderOrConfig === "object") {
    miniConfig = {
      ...miniConfig,
      ...(placeholderOrConfig as PromptConfig),
    }
  }

  return await global.basePrompt(
    miniConfig,
    choices,
    actions
  )
}

global.micro = async (
  placeholderOrConfig = "Type a value:",
  choices = ``,
  actions = ``
) => {
  let microConfig = {
    headerClassName: "hidden",
    footerClassName: "hidden",
    inputHeight: PROMPT.INPUT.HEIGHT.XS,
    itemHeight: PROMPT.ITEM.HEIGHT.XS,
    height: PROMPT.INPUT.HEIGHT.XS,
    width: PROMPT.WIDTH.XS,
    placeholder: "",
  }

  if (typeof placeholderOrConfig === "string") {
    microConfig.placeholder = placeholderOrConfig
  }

  if (typeof placeholderOrConfig === "object") {
    microConfig = {
      ...microConfig,
      ...(placeholderOrConfig as PromptConfig),
    }
  }

  return await global.basePrompt(
    microConfig,
    choices,
    actions
  )
}

global.arg =
  process?.env?.KIT_MAIN_SCRIPT === "v1"
    ? global.basePrompt
    : global.mini

global.chat = (async (
  options = {},
  actions: Action[] = []
) => {
  let messages = await global.kitPrompt({
    placeholder: "",
    strict: true,
    resize: true,
    ui: UI.chat,
    width: PROMPT.WIDTH.BASE,
    height: PROMPT.HEIGHT.XL,
    enter: "",
    shortcuts: [
      {
        name: "Done",
        key: `${cmd}+enter`,
        onPress: async () => {
          let messages = await chat.getMessages()
          submit(messages)
        },
        bar: "right",
      },
    ],
    ...options,
    actions,
  })

  return messages
}) as any // TODO: Fix global implementation to better match exported types

global.chat.addMessage = async (message = {}) => {
  if (typeof message === "string") {
    message = { text: message }
  }
  let messageDefaults = {
    type: "text",
    position: "left",
    text: "",
  }
  await sendWait(Channel.CHAT_ADD_MESSAGE, {
    ...messageDefaults,
    ...message,
  })
}

global.chat.getMessages = async () => {
  return await sendWait(Channel.CHAT_GET_MESSAGES)
}

global.chat.setMessages = async (messages = []) => {
  await sendWait(Channel.CHAT_SET_MESSAGES, messages)
}

global.chat.pushToken = async (token: string = "") => {
  await sendWait(Channel.CHAT_PUSH_TOKEN, token)
}

global.chat.setMessage = async (
  index: number,
  message = ""
) => {
  if (typeof message === "string") {
    message = { text: message }
  }
  let messageDefaults = {
    type: "text",
    position: "left",
    text: "",
  }
  await sendWait(Channel.CHAT_SET_MESSAGE, {
    index,
    message: {
      ...messageDefaults,
      ...message,
    },
  })
}

global.textarea = async (options = "") => {
  let config =
    typeof options === "string"
      ? { value: options }
      : options

  return await global.kitPrompt({
    ui: UI.textarea,

    enter: "",
    shortcuts: defaultShortcuts,
    height: PROMPT.HEIGHT.XL,
    ...config,
    input: config?.value || config?.input || "",
  })
}

global.args = []
global.updateArgs = arrayOfArgs => {
  let argv = minimist(arrayOfArgs)
  global.args = [...argv._, ...global.args]
  global.argOpts = Object.entries(argv)
    .filter(([key]) => key !== "_")
    .flatMap(([key, value]) => {
      if (typeof value === "boolean") {
        if (value) { return [`--${key}`] }
        if (!value) { return [`--no-${key}`] }
      }
      return [`--${key}`, value as string]
    })

  assignPropsTo(argv, global.arg)
  global.flag = { ...argv, ...global.flag }
  if (global.flag?.hardPass) {
    global.flag.pass = global.flag.hardPass
    global.arg.pass = global.flag.hardPass
    delete global.flag.hardPass
  }
  delete global.flag._
}

global.updateArgs(process.argv.slice(2))

export let appInstallMultiple = async (
  packageNames: string[]
) => {
  let adjustedPackageNames = packageNames.map(
    adjustPackageName
  )

  let i = 0
  let confirmedPackages = []
  for await (let packageName of adjustedPackageNames) {
    let placeholder = `${packageName} is required for this script`
    setDescription(placeholder)
    setName(" ")

    let stripVersion = packageName.replace(
      /(?<=.)(@|\^|~).*/g,
      ""
    )
    let packageLink = `https://npmjs.com/package/${stripVersion}`

    let response = null
    try {
      response = await get<{ downloads: number }>(
        `https://api.npmjs.org/downloads/point/last-week/` +
        stripVersion
      )
    } catch (error) { }

    let downloads =
      response?.data?.downloads || `an unknown number of`

    let hint =
      md(`A script requires the following packages. Do you trust them? 
* ${adjustedPackageNames
          .map((name, index) =>
            index === i
              ? `<span class="text-primary font-bold">${name}</span>`
              : name
          )
          .join("\n* ")}

---

`)

    let preview =
      hint +
      md(
        `[${stripVersion}](${packageLink}) has had ${downloads} downloads from npm in the past week`
      )

    let trust = await global.arg({ placeholder }, [
      {
        name: `Abort`,
        value: "false",
        preview,
      },
      {
        name: `Install ${packageName}`,
        value: "true",
        preview,
      },
    ])

    if (trust === "false") {
      echo(`Ok. Exiting...`)
      exit()
    }

    i++
    confirmedPackages.push(packageName)
  }

  setHint(
    `Installing ${confirmedPackages.join(", ")}...`
  )

  global.confirmedPackages = confirmedPackages
  await global.cli("install")
  console.clear()
}

export let appInstall = async (packageName: string) => {
  global.installCwd = global.flag?.cwd as string || ''
  // don't try to install explicit built-in node modules
  if (packageName.startsWith("node:")) return

  // if it detects an import like "langchain/models", we need to adjust the package name
  // allow a slash for scoped packages like "@johnlindquist/kit"
  packageName = adjustPackageName(packageName)

  if (!global.arg?.trust) {
    let placeholder = `${packageName} is required for this script`
    setDescription(placeholder)
    setName(" ")

    let stripVersion = packageName.replace(
      /(?<=.)(@|\^|~).*/g,
      ""
    )
    let packageLink = `https://npmjs.com/package/${stripVersion}`

    let response = null
    try {
      response = await get<{ downloads: number }>(
        `https://api.npmjs.org/downloads/point/last-week/` +
        stripVersion
      )
    } catch (error) { }

    let downloads =
      response?.data?.downloads || `an unknown number of`

    let preview = md(
      `[${stripVersion}](${packageLink}) has had ${downloads} downloads from npm in the past week`
    )

    let trust = await global.arg({ placeholder }, [
      {
        name: `Abort`,
        value: "false",
        preview,
      },
      {
        name: `Install ${packageName}`,
        value: "true",
        preview,
      },
    ])

    if (trust === "false") {
      echo(`Ok. Exiting...`)
      exit()
    }
  }

  setHint(`Installing ${packageName}...`)

  await global.cli("install", packageName);
  console.clear()
}

let { createNpm, createKenvPackageMissingInstall } =
  await import("../api/npm.js")
global.npm = createNpm(appInstall)
global.npmInstall = createNpm(appInstall, false)
global.installMissingPackage =
  createKenvPackageMissingInstall(appInstall, false)

global.setPanel = async (h, containerClasses = "") => {
  let html = maybeWrapHtml(h, containerClasses)
  global.send(Channel.SET_PANEL, html)
}

global.setFooter = async (footer: string) => {
  await global.sendWait(Channel.SET_FOOTER, footer)
}

global.setDiv = async (h, containerClasses = "") => {
  let html = maybeWrapHtml(h, containerClasses)
  await global.sendWait(Channel.SET_PANEL, html)
}

global.setPreview = async (h, containerClasses = "") => {
  let html = maybeWrapHtml(h, containerClasses)
  await global.sendWait(Channel.SET_PREVIEW, html)
  // setLoading(false)
}

global.setHint = hint => {
  global.send(Channel.SET_HINT, hint)
}

global.setInput = async input => {
  log(`setInput: ${input}`)
  return await global.sendWait(Channel.SET_INPUT, input)
}

global.getInput = async () => {
  let message = await global.sendWait(Channel.GET_INPUT)
  return message?.state?.input
}

global.appendInput = async text => {
  return await global.sendWait(Channel.APPEND_INPUT, text)
}

global.scrollTo = async location => {
  return await global.sendWait(Channel.SCROLL_TO, location)
}

global.setFilterInput = inputFilter => {
  return global.sendWait(Channel.SET_FILTER_INPUT, inputFilter)
}

global.showDeprecated = async (markdown: string) => {
  await div(md(markdown))
}

global.setIgnoreBlur = async ignore => {
  return await global.showDeprecated(`# setIgnoreBlur is deprecated
  

All prompts now ignore blur by default  
  `)
}

global.setResize = ignore => {
  global.send(Channel.SET_RESIZE, ignore)
}

global.setPauseResize = async pause => {
  await global.sendWait(Channel.SET_PAUSE_RESIZE, pause)
}

global.setValue = value => {
  global.send(Channel.SET_VALUE, value)
}

global.getDataFromApp = global.sendWait = async (
  channel: GetAppData,
  data?: any,
  timeout = process?.env?.KIT_DEFAULT_APP_TIMEOUT
    ? Number.parseInt(
      process?.env?.KIT_DEFAULT_APP_TIMEOUT,
      10
    )
    : 1000
) => {
  if (process?.send) {
    return await new Promise((res, rej) => {
      let timeoutId: NodeJS.Timeout | null = null
      let messageHandler = data => {
        // if (data?.promptId !== global.__kitPromptId) {
        //   log(
        //     `🤔 ${data?.channel} ${data?.promptId} : ${global.__kitPromptId} Received "sendWait" from an unmatched prompt`
        //   )
        //   return
        // }
        if (data.channel === channel) {
          res(
            typeof data?.value === "undefined"
              ? data
              : data?.value
          )
          if (timeoutId) {
            clearTimeout(timeoutId)
          }
          process.off("message", messageHandler)

          let count = process.listenerCount("message")
          // log(
          //   `******* 🤔 ${process.pid}: REMOVE ${channel} Listener: message listener count ${count}`
          // )
        }
      }
      process.on("message", messageHandler)
      // log(
      //   `******* 🤔 ${
      //     process.pid
      //   }: ADD ${channel} Listener: message listener count ${process.listenerCount(
      //     "message"
      //   )}`
      // )
      if (timeout) {
        timeoutId = setTimeout(() => {
          process.off("message", messageHandler)
          rej(
            new Error(
              `Timeout after ${timeout / 1000
              } seconds waiting for ${channel} response
              
The app failed to send a ${channel} response to the script process within the expected timeframe. Halting script.

Please share this error to our GitHub Discussions with your scenario: https://github.com/johnlindquist/kit/discussions/categories/errors
`,
              {
                cause: "timeout",
              }
            )
          )

          let count = process.listenerCount("message")
          // log(
          //   `******* 🤔 ${process.pid}: REMOVE ${channel} Listener: message listener count ${count}`
          // )
        }, timeout)
      }
      send(channel, data)
    })
  } else {
    return null
  }
}

global.sendWaitLong = async (
  channel: GetAppData,
  data?: any,
  timeout: number = 60000
) => {
  return await global.sendWait(channel, data, timeout)
}

global.getBackgroundTasks = () =>
  global.getDataFromApp(Channel.GET_BACKGROUND)

global.getSchedule = () =>
  global.getDataFromApp(Channel.GET_SCHEDULE)
global.getBounds = async () => {
  let data = await global.getDataFromApp(Channel.GET_BOUNDS)
  return data?.bounds
}

global.getCurrentScreen = async () => {
  let data = await global.getDataFromApp(
    Channel.GET_SCREEN_INFO
  )
  return data?.screen
}

global.getScriptsState = () =>
  global.getDataFromApp(Channel.GET_SCRIPTS_STATE)

global.setBounds = async (bounds: Partial<Rectangle>) => {
  await global.sendWait(Channel.SET_BOUNDS, bounds)
}

let clipboardStore
let getClipboardStore = async () => {
  if (clipboardStore) return clipboardStore
  clipboardStore = await store(
    kitPath("db", "clipboard.json"),
    {
      history: [],
    }
  )

  return clipboardStore
}

global.getClipboardHistory = async () => {
  let clipboardStore = await getClipboardStore()

  let clipboardHistory = (await clipboardStore.get(
    "history"
  )) as ClipboardItem[]

  return clipboardHistory
}

global.removeClipboardItem = async (itemId: string) => {
  let clipboardStore = await getClipboardStore()
  let clipboardHistory = (await clipboardStore.get(
    "history"
  )) as ClipboardItem[]

  const index = clipboardHistory.findIndex(
    ({ id }) => itemId === id
  )
  if (index > -1) {
    clipboardHistory.splice(index, 1)
  }

  await clipboardStore.set("history", clipboardHistory)

  send(Channel.CLIPBOARD_SYNC_HISTORY)
}

global.clearClipboardHistory = async () => {
  let clipboardStore = await getClipboardStore()
  await clipboardStore.set("history", [])

  send(Channel.CLIPBOARD_SYNC_HISTORY)
}

global.submit = async (value: any) => {
  global.send(Channel.VALUE_SUBMITTED, value)
  if (global.__kitPromptSubject) {
    global.__kitPromptSubject.next({
      channel: Channel.VALUE_SUBMITTED,
      state: {
        ...(global.__kitPromptState || {
          input: "",
        }),
        value,
      },
    })
  }
}

global.wait = async (time: number) => {
  return new Promise(res =>
    setTimeout(() => {
      res()
    }, time)
  )
}

global.setDescription = async (description: string) => {
  await global.sendWait(
    Channel.SET_DESCRIPTION,
    description
  )
}

global.setName = async (name: string) => {
  await global.sendWait(Channel.SET_NAME, name)
}

global.setTextareaValue = (value: string) => {
  global.send(Channel.SET_TEXTAREA_VALUE, value)
}

global.appKeystroke = (data: KeyData) => {
  global.send(Channel.SEND_KEYSTROKE, {
    keyCode: keyCodeFromKey(data?.key),
    ...data,
  })
}

global.setLoading = (loading: boolean) => {
  global.send(Channel.SET_LOADING, loading)
}

global.setProgress = (progress: number) => {
  global.send(Channel.SET_PROGRESS, progress)
}

global.setRunning = (running: boolean) => {
  global.send(Channel.SET_RUNNING, running)
}

const loadingList = [
  "$",
  "applescript",
  "download",
  "exec",
  "fetch",
  "get",
  "patch",
  "post",
  "put",
  "del",
  "wait",
  "say",
  "playAudioFile",
]

// Patches global methods in `loadingList` to toggle loading state on call: checks method existence, wraps to toggle `setLoading(true)` pre-call and `setLoading(false)` post-call.

for (const method of loadingList) {
  if (global.hasOwnProperty(method)) {
    const originalMethod = global[method]
    global[method] = function (...args: any[]) {
      setLoading(true)
      const result = originalMethod.apply(this, args)
      return Promise.resolve(result).finally(() =>
        setLoading(false)
      )
    }
  }
}

global.Key = Key

global.mainScript = async (
  input: string = "",
  tab: string
) => {
  if (arg?.keyword) delete arg.keyword
  if (arg?.fn) delete arg.fn
  preload(getMainScriptPath())
  setPlaceholder("Script Kit")
  setInput(input || "")
  global.args = []
  global.flags = {}
  if (process.env.KIT_CONTEXT === "app") {
    process.removeAllListeners("message")
    clearAllTimeouts()
    clearAllIntervals()
    let m = run(getMainScriptPath(), `--input`, input)
    if (tab) {
      await wait(200)
      setTab(tab)
    }

    setTimeout(() => {
      focus()
    }, 200)
    await m
  }
}

let getFileInfo = async (filePath: string) => {
  return applescript(`
  set aFile to (POSIX file "${filePath}") as alias
  info for aFile    
  `)
}

let verifyFullDiskAccess = async () => {
  return global.sendWait(Channel.VERIFY_FULL_DISK_ACCESS)
}

type uzPathConfig = PromptConfig & {
  startPath?: string
  onlyDirs?: boolean
}

global.getEditorHistory = async () => {
  return (
    await global.getDataFromApp(Channel.GET_EDITOR_HISTORY)
  )?.state?.editorHistory
}

global.setFocused = (id: string) => {
  send(Channel.SET_FOCUSED, id)
}

global.keyboard = {
  type: async (...textOrKeys: (string | Key)[]) => {
    await sendWaitLong(Channel.KEYBOARD_TYPE, textOrKeys, 0)
  },
  typeDelayed: async (config: {
    rate: number
    textOrKeys: string | Key[]
  }) => {
    await sendWaitLong(
      Channel.KEYBOARD_TYPE_RATE,
      {
        rate: config?.rate || 600,
        textOrKeys: config.textOrKeys,
      },
      0
    )
  },
  pressKey: async (...keys: Key[]) => {
    await sendWait(Channel.KEYBOARD_PRESS_KEY, keys)
  },
  releaseKey: async (...keys: Key[]) => {
    await sendWait(Channel.KEYBOARD_RELEASE_KEY, keys)
  },
  config: async config => {
    send(Channel.KEYBOARD_CONFIG, config)
  },
  tap: async (...keys: Key[]) => {
    await keyboard.pressKey(...keys)
    await keyboard.releaseKey(...keys)
  },
}

global.mouse = {
  leftClick: async () => {
    await sendWait(Channel.MOUSE_LEFT_CLICK)
  },
  rightClick: async () => {
    await sendWait(Channel.MOUSE_RIGHT_CLICK)
  },
  move: async points => {
    await sendWaitLong(Channel.MOUSE_MOVE, points)
  },
  setPosition: async position => {
    await sendWait(Channel.MOUSE_SET_POSITION, position)
  },
}

global.clipboard = {
  readText: async () => {
    return await sendWait(Channel.CLIPBOARD_READ_TEXT)
  },
  readHTML: async () => {
    return await sendWait(Channel.CLIPBOARD_READ_HTML)
  },
  readImage: async () => {
    let tmpPath = await sendWait(
      Channel.CLIPBOARD_READ_IMAGE
    )
    return await readFile(tmpPath)
  },
  readRTF: async () => {
    return await sendWait(Channel.CLIPBOARD_READ_RTF)
  },
  readBookmark: async () => {
    return await sendWait(Channel.CLIPBOARD_READ_BOOKMARK)
  },
  readFindText: async () => {
    return await sendWait(Channel.CLIPBOARD_READ_FIND_TEXT)
  },
  writeText: async (text: string) => {
    return await sendWait(
      Channel.CLIPBOARD_WRITE_TEXT,
      text
    )
  },
  writeHTML: async (html: string) => {
    return await sendWait(
      Channel.CLIPBOARD_WRITE_HTML,
      html
    )
  },
  writeImage: async (image: Buffer) => {
    let imagePath = tmpPath(`${uuid()}.png`)
    await writeFile(imagePath, image)
    return await sendWait(
      Channel.CLIPBOARD_WRITE_IMAGE,
      imagePath
    )
  },
  writeRTF: async (rtf: string) => {
    return await sendWait(Channel.CLIPBOARD_WRITE_RTF, rtf)
  },
  writeBookmark: async (bookmark: {
    url: string
    title: string
  }) => {
    return await sendWait(
      Channel.CLIPBOARD_WRITE_BOOKMARK,
      bookmark
    )
  },
  writeFindText: async (findText: string) => {
    return await sendWait(
      Channel.CLIPBOARD_WRITE_FIND_TEXT,
      findText
    )
  },

  writeBuffer: async (type: string, buffer: Buffer) => {
    return await sendWait(Channel.CLIPBOARD_WRITE_BUFFER, { type, buffer })
  },

  clear: async () => {
    return await sendWait(Channel.CLIPBOARD_CLEAR)
  },
}

global.setStatus = async (status: KitStatus) => {
  await sendWait(Channel.SET_STATUS, status)
}

/**
 * Sets the theme for the application.
 * @param theme A string containing CSS variables that define the theme.
 *
 * The theme string should be in the following format:
 *
 * ```css
 * html {
 *   --color-text: #ffffffff;
 *   --color-primary: #fbbf24ff;
 *   --color-secondary: #343434ff;
 *   --color-background: #0f0f0fff;
 *   --ui-bg-opacity: 0.05;
 *   --ui-border-opacity: 0.15;
 *
 *   --mono-font: JetBrains Mono;
 *   --sans-font: ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji',
 *     'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
 *   --serif-font: 'ui-serif', 'Georgia', 'Cambria', '"Times New Roman"', 'Times',
 *     'serif';
 * }
 * ```
 *
 * This allows for customization of colors, opacities, and fonts used in the application.
 */
global.setTheme = async (theme: string) => {
  let processedTheme = processPlatformSpecificTheme(theme)
  await sendWait(Channel.SET_THEME, processedTheme)
}

global.setScriptTheme = async (theme: string) => {
  let processedTheme = processPlatformSpecificTheme(theme)
  await sendWait(Channel.SET_TEMP_THEME, processedTheme)
}

global.setAlwaysOnTop = (alwaysOnTop: boolean) => {
  return sendWait(Channel.SET_ALWAYS_ON_TOP, alwaysOnTop)
}

global.focus = () => {
  return sendWait(Channel.FOCUS)
}

delete process.env?.["ELECTRON_RUN_AS_NODE"]
delete global?.env?.["ELECTRON_RUN_AS_NODE"]

type ExtraLib = { content: string; filePath: string }

let addNodeLibs = async () => {
  let extraLibs: ExtraLib[] = []
  let nodeTypesDir = kitPath(
    "node_modules",
    "@types",
    "node"
  )
  let nodeDirents = await readdir(nodeTypesDir, {
    withFileTypes: true,
  })

  for await (let dirent of nodeDirents) {
    if (dirent.isDirectory()) {
      let { name } = dirent
      let subDirent = await readdir(
        path.resolve(nodeTypesDir, name),
        {
          withFileTypes: true,
        }
      )

      for await (let sub of subDirent) {
        if (sub.isFile() && sub.name.endsWith(".d.ts")) {
          let filePath = path.resolve(
            nodeTypesDir,
            name,
            sub.name
          )
          let content = await readFile(filePath, "utf8")
          extraLibs.push({
            content,
            filePath: `file:///${name}/${sub.name}`,
          })
        }
      }
    } else {
      let { name } = dirent
      if (name.endsWith("d.ts")) {
        let content = await readFile(
          kitPath("node_modules", "@types", "node", name),
          "utf8"
        )
        extraLibs.push({
          content,
          filePath: `file:///${name}`,
        })
      }
    }
  }

  return extraLibs
}

let addKitLibs = async (): Promise<ExtraLib[]> => {
  let extraLibs: ExtraLib[] = []
  //   let utilsContent = await readFile(
  //     kitPath("core", "utils.d.ts"),
  //     "utf8"
  //   )
  //   let enumsContent = await readFile(
  //     kitPath("core", "enum.d.ts"),
  //     "utf8"
  //   )
  //   extraLibs.push({
  //     content: `declare module "@johnlindquist/kit" {
  //       ${utilsContent}
  //       ${enumsContent}
  // }`,
  //     filePath: `file:///node_modules/@types/@johnlindquist/kit/index.d.ts`,
  //   })
  let kitCoreDir = kitPath("core")
  let kitCoreTypes = await readdir(kitCoreDir)

  for await (let t of kitCoreTypes.filter(t =>
    t.endsWith(".d.ts")
  )) {
    let content = await readFile(kitPath("core", t), "utf8")

    extraLibs.push({
      content,
      filePath: `file:///core/${t}`,
    })
  }

  let kitTypesDir = kitPath("types")
  let kitTypes = await readdir(kitTypesDir)

  for await (let t of kitTypes) {
    let content = await readFile(
      kitPath("types", t),
      "utf8"
    )

    extraLibs.push({
      content,
      filePath: `file:///types/${t}`,
    })
  }

  // let globalTypesDir = kitPath(
  //   "node_modules",
  //   "@johnlindquist",
  //   "globals",
  //   "types"
  // )

  // let globalTypeDirs = (
  //   await readdir(globalTypesDir, { withFileTypes: true })
  // ).filter(dir => dir.isDirectory())

  // for await (let { name } of globalTypeDirs) {
  //   let content = await readFile(
  //     kitPath(
  //       "src",
  //       "@johnlindquist",
  //       "globals",
  //       "types",
  //       name,
  //       "index.d.ts"
  //     ),
  //     "utf8"
  //   )

  //   // let filePath = `file:///node_modules/@johnlindquist/globals/${name}/index.d.ts`
  //   let filePath = `file:///node_modules/@johnlindquist/globals/${name}/index.d.ts`

  // extraLibs.push({
  //   content,
  //   filePath,
  // })
  // }

  // node_modules/@johnlindquist/globals/types/index.d.ts
  // let globalsIndexContent = await readFile(
  //   kitPath(
  //     "node_modules",
  //     "@johnlindquist",
  //     "globals",
  //     "types",
  //     "index.d.ts"
  //   ),
  //   "utf8"
  // )

  //   globalsIndexContent = `declare module "@johnlindquist/globals" {
  // ${globalsIndexContent}
  //   }`

  // extraLibs.push({
  //   content: globalsIndexContent,
  //   filePath: `file:///node_modules/@johnlindquist/globals/index.d.ts`,
  // })

  let content = await readFile(
    kitPath("editor", "types", "kit-editor.d.ts"),
    "utf8"
  )
  extraLibs.push({
    content,
    filePath: `file:///kit.d.ts`,
  })

  let shelljsContent = await readFile(
    kitPath(
      "node_modules",
      "@types",
      "shelljs",
      "index.d.ts"
    ),
    "utf8"
  )

  extraLibs.push({
    content: shelljsContent,
    filePath: `file:///node_modules/@types/shelljs/index.d.ts`,
  })

  // let reactContent = await readFile(
  //   kitPath(
  //     "node_modules",
  //     "@types",
  //     "react",
  //     "index.d.ts"
  //   ),
  //   "utf8"
  // )

  // extraLibs.push({
  //   content: reactContent,
  //   filePath: `react`,
  // })

  let nodeNotifierContent = await readFile(
    kitPath(
      "node_modules",
      "@types",
      "node-notifier",
      "index.d.ts"
    ),
    "utf8"
  )

  extraLibs.push({
    content: nodeNotifierContent,
    filePath: `file:///node_modules/@types/node-notifier/index.d.ts`,
  })

  // let trashContent = await readFile(
  //   kitPath("node_modules", "trash", "index.d.ts"),
  //   "utf8"
  // )

  // extraLibs.push({
  //   content: trashContent,
  //   filePath: `file:///node_modules/@types/trash/index.d.ts`,
  // })

  return extraLibs
}

global.getExtraLibs = async (): Promise<ExtraLib[]> => {
  let nodeLibs = []
  try {
    nodeLibs = await addNodeLibs()
  } catch (error) {
    warn(error)
  }

  let kitLibs = []
  try {
    kitLibs = await addKitLibs()
  } catch (error) {
    warn(error)
  }
  return [...nodeLibs, ...kitLibs]
}

global.setShortcuts = async shortcuts => {
  shortcuts = shortcuts.map(shortcut => {
    if (shortcut.key) {
      shortcut.key = shortcut.key.toLowerCase()
    }
    return shortcut
  })
  if (global.__currentPromptConfig) {
    for (let shortcut of global.__currentPromptConfig
      ?.shortcuts || []) {
      if (shortcut.key) {
        shortcut.key = shortcut.key.toLowerCase()
        global.__kitActionsMap.delete(shortcut.name)
      }
    }

    for (let shortcut of shortcuts || []) {
      if (shortcut?.name && shortcut?.onPress) {
        if (shortcut.key) {
          shortcut.key = shortcut.key.toLowerCase()
          global.__kitActionsMap.set(
            shortcut.name,
            shortcut
          )
        }
      }
    }

    global.__currentPromptConfig.shortcuts = shortcuts
  }
  await sendWait(Channel.SET_SHORTCUTS, shortcuts)
}

global.getAppState = async () => {
  return await sendWait(Channel.GET_APP_STATE)
}

global.__kitAddErrorListeners = () => {
  if (process.listenerCount("unhandledRejection") === 0) {
    process.prependOnceListener(
      "unhandledRejection",
      async error => {
        global.warn(
          `Running error action because of unhandledRejection`,
          { error }
        )
        await errorPrompt(error as Error)
      }
    )
  }

  if (process.listenerCount("uncaughtException") === 0) {
    process.prependOnceListener(
      "uncaughtException",
      async error => {
        global.warn(
          `Running error action because of uncaughtException`,
          { error }
        )
        await errorPrompt(error as Error)
      }
    )
  }
}

global.__kitAddErrorListeners()

let __kit__registeredShortcuts = new Map()
global.__kit__onShortcutPressed = async (
  input: string,
  state: AppState
) => {
  let callback = __kit__registeredShortcuts.get(input)
  if (callback) callback(input, state)
}

global.registerShortcut = async (
  shortcut: string,
  callback: () => void
) => {
  if (process?.send) {
    let result = await sendWait(
      Channel.REGISTER_GLOBAL_SHORTCUT,
      shortcut
    )

    // log({ result })
    if (!result) {
      warn(
        `Shortcut ${shortcut} failed to register. Ending process. 😰`
      )
      exit()
    }
    let messageHandler = (data: any) => {
      if (
        data.channel === Channel.GLOBAL_SHORTCUT_PRESSED &&
        data.value === shortcut
      ) {
        callback()
      }
    }
    __kit__registeredShortcuts.set(shortcut, messageHandler)
    process.on("message", messageHandler)
    process.once("beforeExit", () => {
      global.unregisterShortcut(shortcut)
    })
  }
}

global.unregisterShortcut = async (shortcut: string) => {
  sendWait(Channel.UNREGISTER_GLOBAL_SHORTCUT, shortcut)
  let messageHandler =
    __kit__registeredShortcuts.get(shortcut)
  if (messageHandler) {
    process.off("message", messageHandler)
    __kit__registeredShortcuts.delete(shortcut)
  }
}

global.startDrag = async (
  filePath: string,
  iconPath: string
) => {
  await sendWait(Channel.START_DRAG, { filePath, iconPath })
}

global.eyeDropper = async () => {
  return await sendWaitLong(Channel.GET_COLOR)
}

global.getTypedText = async () => {
  return await sendWait(Channel.GET_TYPED_TEXT)
}

/**
 * @experimental - API, types, etc TBD
 *
 */
global.toast = async (text: string, options = {}) => {
  return await sendWait(Channel.TOAST, {
    text,
    options,
  })
}

let beginMicStream = () => {
  global.mic.stream = undefined
  global.mic.stream = new Readable({
    read() { },
  })

  if (
    !process.listeners("message").includes(micStreamHandler)
  ) {
    process.on("message", micStreamHandler)
  }
}

let endMicStream = debounce((stop = true) => {
  if (stop) send(Channel.STOP_MIC)
  if (global.mic.stream) {
    global.mic.stream.push(null)
    setImmediate(() => {
      global.mic.stream.removeAllListeners()
      setImmediate(() => {
        global.mic.stream = undefined
        process.off("message", micStreamHandler)
      })
    })
  }
}, 100)

let micStreamHandler = (message: AppMessage) => {
  if (message.channel === Channel.MIC_STREAM) {
    // Push the data into the stream
    if (message?.state?.value) {
      const isBuffer = Buffer.isBuffer(message.state?.value)
      const buffer = isBuffer
        ? message.state?.value
        : Buffer.from(message.state?.value)

      if (global.mic.stream) global.mic.stream.push(buffer)
    }
  }

  if (message.channel === Channel.ABANDON) {
    endMicStream(false)
  }
}
global.mic = (async (config: MicConfig = {}) => {
  // Create a Readable stream on the fly
  beginMicStream()

  let tmpFilePath = await global.kitPrompt({
    ui: UI.mic,
    enter: "Stop",
    width: PROMPT.WIDTH.BASE,
    height: PROMPT.HEIGHT.BASE,
    resize: true,
    shortcuts: [
      escapeShortcut,
      {
        key: `${cmd}+i`,
        name: "Select Mic",
        onPress: async () => {
          await run(kitPath("cli", "select-mic.js"))
          await mainScript()
        },
        bar: "right",
      },

      closeShortcut,
    ],

    timeSlice: 200,
    filePath: tmpPath(
      `mic-${global.formatDate(new Date(), "yyyy-MM-dd_HH-mm-ss")}.webm`
    ),
    ...config,
  })

  endMicStream()

  return await readFile(tmpFilePath)
}) as any // TODO: Fix global implementation to better match exported types

global.mic.stream = undefined

global.mic.start = async (config: MicConfig) => {
  beginMicStream()
  let filePath = tmpPath(
    `${global.formatDate(
      new Date(),
      "yyyy-MM-dd_HH-mm-ss"
    )}.webm`
  )
  await global.sendWait(Channel.START_MIC, {
    filePath,
    ...config,
    dot: true,
  })

  return filePath
}

global.mic.stop = async () => {
  endMicStream(false)
  let result = await sendWait(Channel.STOP_MIC)
  let filePath = result?.state?.value

  return await readFile(filePath)
}

global.webcam = async (options?: PromptConfig) => {
  return await global.kitPrompt({
    ui: UI.webcam,
    enter: "Capture",
    resize: true,
    width: PROMPT.WIDTH.BASE,
    height: PROMPT.HEIGHT.BASE,
    shortcuts: [
      escapeShortcut,
      {
        key: `${cmd}+i`,
        name: "Select Webcam",
        onPress: async () => {
          await run(kitPath("cli", "select-webcam.js"))
          await mainScript()
        },
        bar: "right",
      },
      closeShortcut,
    ],
    ...options,
  })
}

global.getMediaDevices = async () => {
  let appMessage = await sendWait(Channel.GET_DEVICES)
  let devices = appMessage?.state?.value?.map(d => {
    return {
      name: d.label,
      description: d.kind,
      group: d.kind,
      value: d,
      ...d,
    }
  })

  return devices
}

global.clearTimestamps = async () => {
  return await sendWait(Channel.CLEAR_TIMESTAMPS)
}

global.removeTimestamp = async (id: string) => {
  return await sendWait(Channel.REMOVE_TIMESTAMP, id)
}

global.toggleAllSelectedChoices = async () => {
  return await sendWait(Channel.TOGGLE_ALL_SELECTED_CHOICES)
}

global.setSelectedChoices = async (choices: Choice[]) => {
  return await sendWait(
    Channel.SET_SELECTED_CHOICES,
    choices
  )
}

global.getTheme = async () => {
  return await sendWait(Channel.GET_THEME)
}

global.prompt = {
  closeActions: async () => {
    return await sendWait(Channel.CLOSE_ACTIONS)
  },
  openActions: async () => {
    return await sendWait(Channel.OPEN_ACTIONS)
  },
  close: () => {
    return exit()
  },
  setInput: (input: string) => {
    return global.setInput(input)
  },
  focus: () => {
    return global.focus()
  },
  blur: () => {
    return global.blur()
  },
  hide: () => {
    return global.hide()
  },
}

global.screenshot = async (
  displayId?: number,
  bounds?: Rectangle
) => {
  let config: ScreenshotConfig = {}
  if (displayId) config.displayId = displayId
  if (bounds) config.bounds = bounds
  let screenShotTmpPath = await sendWait(
    Channel.SCREENSHOT,
    config,
    5000
  )
  return await readFile(screenShotTmpPath)
}

global.notify = async options => {
  if (typeof options === "string") {
    options = { title: options }
  }
  await sendWait(Channel.NOTIFY, options)
}