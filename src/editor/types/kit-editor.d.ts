import type { MarkedFunction } from "../../types/globals.ts"

declare module "@johnlindquist/kit" {
  import type { ChildProcess } from "node:child_process"
  import type {
    ProcessType,
    UI,
    Mode,
  } from "../core/enum.js"

  export interface Choice<Value = any> {
    name: string
    value?: Value
    description?: string
    focused?: string
    img?: string
    icon?: string
    html?: string
    hasPreview?: boolean
    preview?:
    | string
    | ((
      input: string,
      state: AppState
    ) => string | Promise<string>)
    previewPath?: string
    previewLang?: string
    id?: string
    shortcode?: string
    trigger?: string
    keyword?: string
    className?: string
    nameClassName?: string
    tagClassName?: string
    focusedClassName?: string
    descriptionClassName?: string
    nameHTML?: string
    tag?: string
    shortcut?: string
    drag?:
    | {
      format?: string
      data?: string
    }
    | string
    onFocus?: (
      input: string,
      state: AppState
    ) => string | Promise<string>
    onSubmit?: (
      input: string,
      state: AppState
    ) => void | Symbol | Promise<void | Symbol>
    enter?: string
    disableSubmit?: boolean
    info?: boolean
    exclude?: boolean
    width?: number
    height?: number
    skip?: boolean
    miss?: boolean
    pass?: boolean | string
    group?: string
    userGrouped?: boolean
    choices?: (Omit<Choice<any>, "choices"> | string)[]
    hideWithoutInput?: boolean
    ignoreFlags?: boolean
    selected?: boolean
    actions?: Action[]
    exact?: boolean
    recent?: boolean
  }

  export interface ScoredChoice {
    item: Choice<{ id: string; name: string; value: any }>
    score: number
    matches: {
      [key: string]: [number, number][]
    }
    _: string
  }

  export interface ScriptPathInfo {
    command: string
    filePath: string
    kenv: string
    id: string
    icon?: string
    timestamp?: number
    needsDebugger?: boolean
    compileStamp?: number
    compileMessage?: string
  }

  export interface ScriptMetadata {
    shebang?: string
    name?: string
    menu?: string
    description?: string
    shortcut?: string
    shortcode?: string
    trigger?: string
    friendlyShortcut?: string
    alias?: string
    author?: string
    twitter?: string
    github?: string
    social?: string
    social_url?: string
    exclude?: boolean
    schedule?: string
    system?: string
    watch?: string
    background?: boolean | "auto"
    type: ProcessType
    timeout?: number
    tabs?: string[]
    tag?: string
    log?: boolean
    hasFlags?: boolean
    cmd?: string
    option?: string
    ctrl?: string
    shift?: string
    hasPreview?: boolean
    logo?: string
    snippet?: string
    snippetdelay?: number
    index?: string
    template?: boolean
    "color-text"?: string
    "color-primary"?: string
    "color-secondary"?: string
    "color-background"?: string
    opacity?: string
    preview?: Choice["preview"]
    previewPath?: string
    debug?: boolean
    cache?: boolean
    note?: string
    group?: string
    keyword?: string
    enter?: string
    recent?: boolean
    img?: string
    postfix?: string
  }

  export type Script = ScriptMetadata &
    ScriptPathInfo &
    Choice

  export type Scriptlet = Script & {
    group: string
    inputs: string[]
    tool: "kit" | "open" | "paste" | string
    scriptlet: string
    value: Script
    cwd?: string
    prepend?: string
    append?: string
    term?: undefined | boolean
  }

  export type Snippet = Script & {
    group: "Snippets"
    text: string
  }

  export type PromptBounds = {
    x?: number
    y?: number
    width?: number
    height?: number
  }

  // export type PromptState = "collapsed" | "expanded"

  export type PromptDb = {
    screens: {
      [screenId: string]: {
        [script: string]: PromptBounds
      }
    }
  }

  export type InputType =
    | "button"
    | "checkbox"
    | "color"
    | "date"
    | "datetime-local"
    | "email"
    | "file"
    | "hidden"
    | "image"
    | "month"
    | "number"
    | "password"
    | "radio"
    | "range"
    | "reset"
    | "search"
    | "submit"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week"

  export type Shortcut = {
    id?: string
    key: string
    name?: string
    value?: any
    onPress?: (
      input: string,
      state: AppState
    ) => unknown | Promise<unknown>
    bar?: "right" | "left" | ""
    flag?: string
    visible?: boolean
    condition?: (choice: any) => boolean
  }

  export interface PromptData {
    id: string
    key: string
    scriptPath: string
    description: string
    flags: FlagsObject
    hasPreview: boolean
    keepPreview?: boolean
    hint: string
    input: string
    inputRegex: string
    kitArgs: string[]
    kitScript: string
    mode: Mode
    name: string
    placeholder: string
    preview: string
    previewWidthPercent: number
    panel: string
    secret: boolean
    selected: string
    strict: boolean
    tabs: string[]
    tabIndex: number
    type: InputType
    ui: UI
    resize: boolean
    placeholderOnly: boolean
    scripts: boolean
    shortcodes: { [key: string]: any }
    defaultChoiceId: string
    focusedId: string
    footer: string
    env: any
    shortcuts: Shortcut[]
    enter: string
    choicesType:
    | "string"
    | "array"
    | "function"
    | "async"
    | "null"
    x: number
    y: number
    width: number
    height: number
    itemHeight: number
    inputHeight: number
    defaultValue: string
    focused: string
    formData?: any
    html?: string
    theme?: any
    alwaysOnTop?: boolean
    cwd?: string
    hasOnNoChoices?: boolean
    inputCommandChars?: string[]
    inputClassName?: string
    headerClassName?: string
    footerClassName?: string
    containerClassName?: string
    preload?: boolean
    css?: string
    preventCollapse?: boolean
    hideOnEscape?: boolean
    keyword?: string
    multiple?: boolean
    searchKeys?: string[]
    show?: boolean
    scriptlet?: boolean
    actionsConfig?: ActionsConfig
  }

  export type GenerateChoices = (
    input: string
  ) => Choice<any>[] | Promise<Choice<any>[]>

  export type GenerateActions = (
    input: string
  ) => Action[] | Promise<Action[]>

  export type Choices<Value> = (
    | (string | Choice)[]
    | Choice<Value>[]
    | (() => Choice<Value>[])
    | (() => Promise<Choice<Value>[]>)
    | Promise<Choice<any>[]>
    | GenerateChoices
  ) & {
    preload?: boolean
  }

  export type Preview =
    | string
    | void
    | (() => string)
    | (() => void)
    | (() => Promise<string>)
    | (() => Promise<void>)
    | ((input: string) => string)
    | ((input: string) => void)
    | ((input: string) => Promise<any>)
    | ((input: string) => Promise<void>)

  export type Actions =
    | Action[]
    | (() => Action[])
    | (() => Promise<Action[]>)
    | Promise<Action[]>
    | GenerateActions

  export type Panel =
    | string
    | void
    | (() => string)
    | (() => void)
    | (() => Promise<string>)
    | (() => Promise<void>)
    | ((input: string) => string)
    | ((input: string) => void)
    | ((input: string) => Promise<any>)
    | ((input: string) => Promise<void>)

  export type FlagsWithKeys = {
    [key: string]: {
      shortcut?: string
      name?: string
      group?: string
      description?: string
      bar?: "left" | "right" | ""
      flag?: string
      preview?: Choice["preview"]
      hasAction?: boolean
    }
  } & {
    sortChoicesKey?: string[]
    order?: string[]
  }
  export type FlagsObject = FlagsWithKeys | boolean
  export type ActionsConfig = {
    name?: string
    placeholder?: string
    active?: string
  }

  export type Action = {
    name: string
    description?: string
    value?: any
    shortcut?: string
    group?: string
    flag?: string
    visible?: boolean
    enter?: string
    onAction?: ChannelHandler
    condition?: Shortcut["condition"]
    close?: boolean
    index?: number
  }

  export interface AppState {
    input?: string
    actionsInput?: string
    inputChanged?: boolean
    flaggedValue?: any
    flag?: string
    tab?: string
    tabIndex?: number
    value?: any
    index?: number
    focused?: Choice
    history?: Script[]
    modifiers?: string[]
    count?: number
    name?: string
    description?: string
    script?: Script
    submitted?: boolean
    shortcut?: string
    paste?: string
    cursor?: number
    preview?: string
    keyword?: string
    mode?: Mode
    ui?: UI
    multiple?: boolean
    selected?: any[]
    action?: Action
  }

  export type ChannelHandler = (
    input?: string,
    state?: AppState
  ) => void | Promise<void>

  export type SubmitHandler = (
    input?: string,
    state?: AppState
  ) => void | Symbol | Promise<void | Symbol>

  export type PromptConfig = {
    validate?: (
      input: string
    ) => boolean | string | Promise<boolean | string>
    choices?: Choices<any> | Panel
    actions?: Action[] | Panel
    initialChoices?: Choices<any> | Panel
    html?: string
    formData?: any
    className?: string
    flags?: FlagsObject
    actions?: Action[]
    preview?:
    | string
    | ((
      input: string,
      state: AppState
    ) =>
      | string
      | Promise<string>
      | void
      | Promise<void>)
    panel?: string | (() => string | Promise<string>)
    onNoChoices?: ChannelHandler
    onEscape?: ChannelHandler
    onAbandon?: ChannelHandler
    onBack?: ChannelHandler
    onForward?: ChannelHandler
    onUp?: ChannelHandler
    onDown?: ChannelHandler
    onLeft?: ChannelHandler
    onRight?: ChannelHandler
    onTab?: ChannelHandler
    onKeyword?: ChannelHandler
    onInput?: ChannelHandler
    onActionsInput?: ChannelHandler
    onChange?: ChannelHandler
    onBlur?: ChannelHandler
    onSelected?: ChannelHandler
    onChoiceFocus?: ChannelHandler
    onMessageFocus?: ChannelHandler
    onPaste?: ChannelHandler
    onDrop?: ChannelHandler
    onDragEnter?: ChannelHandler
    onDragLeave?: ChannelHandler
    onDragOver?: ChannelHandler
    onMenuToggle?: ChannelHandler
    onInit?: ChannelHandler
    onSubmit?: SubmitHandler
    onValidationFailed?: ChannelHandler
    onAudioData?: ChannelHandler
    debounceInput?: number
    debounceChoiceFocus?: number
    keyword?: string
    shortcodes?: {
      [key: string]: any
    }
    env?: any
    shortcuts?: Shortcut[]
    show?: boolean
    grid?: boolean
    columns?: number
    columnWidth?: number
    rowHeight?: number
    gridGap?: number
    gridPadding?: number
  } & Partial<
    Omit<
      PromptData,
      "choices" | "id" | "script" | "preview"
    >
  >

  export type CronExpression =
    | `${string} ${string} ${string} ${string} ${string}`
    | `${string} ${string} ${string} ${string} ${string} ${string}`

  export interface Metadata {
    /**
     * Specifies the name of the script as it appears in the Script Kit interface.
     * If not provided, the file name will be used.
     */
    name?: string
    /** Provides a brief description of the script's functionality. */
    description?: string
    /** The string displayed in the Enter button */
    enter?: string
    /** Defines an alternative search term to find this script */
    alias?: string
    /** Defines the path to an image to be used for the script */
    image?: string
    /** Defines a global keyboard shortcut to trigger the script. */
    shortcut?: string
    /**
     * Similar to {@link trigger}, defines a string that, when typed in the main menu
     * followed by a space, immediately executes the script.
     */
    shortcode?: string
    /**
     * Similar to {@link shortcode}, defines a string that, when typed in the main menu,
     * immediately executes the script.
     */
    trigger?: string
    /** @deprecated Use `expand` instead. Designates the script as a text expansion snippet and specifies the trigger text. */
    snippet?: string
    /** Designates the script as a text expansion snippet and specifies the trigger text. */
    expand?: string
    /** Associates a keyword with the script for easier discovery in the main menu. */
    keyword?: string
    /** Indicates that user input in the main menu should be passed as an argument to the script. */
    pass?: boolean
    /** Assigns the script to a specific group for organization in the main menu. */
    group?: string
    /** Excludes the script from appearing in the main menu. */
    exclude?: boolean
    /** Specifies a file or directory to watch for changes, triggering the script upon modifications. */
    watch?: string
    /** Indicates whether to disable logs */
    log?: boolean
    /** Designates the script as a background process, running continuously in the background. */
    background?: boolean | "auto"
    /** Defines the number of seconds after which the script will be terminated */
    timeout?: number
    /** Associates the script with system events such as sleep, wake, or shutdown. */
    system?:
    | "suspend"
    | "resume"
    | "on-ac"
    | "on-battery"
    | "shutdown"
    | "lock-screen"
    | "unlock-screen"
    | "user-did-become-active"
    | "user-did-resign-active"

    /** Specifies a cron expression for scheduling the script to run at specific times or intervals. */
    schedule?: CronExpression
  }

  export interface ProcessInfo {
    pid: number
    scriptPath: string
    child: ChildProcess
    type: ProcessType
    values: any[]
    date: number
  }
  /*!-----------------------------------------------------------
   * Copyright (c) Microsoft Corporation. All rights reserved.
   * Type definitions for monaco-editor
   * Released under the MIT license
   *-----------------------------------------------------------*/
  /*---------------------------------------------------------------------------------------------
   *  Copyright (c) Microsoft Corporation. All rights reserved.
   *  Licensed under the MIT License. See License.txt in the project root for license information.
   *--------------------------------------------------------------------------------------------*/

  declare global {
    let MonacoEnvironment: Environment | undefined
  }

  export type Thenable<T> = PromiseLike<T>

  export interface Environment {
    globalAPI?: boolean
    baseUrl?: string
    getWorker?(workerId: string, label: string): any
    getWorkerUrl?(workerId: string, label: string): string
  }

  export interface IDisposable {
    dispose(): void
  }

  export interface IEvent<T> {
    (listener: (e: T) => any, thisArg?: any): IDisposable
  }

  /**
   * A helper that allows to emit and listen to typed events
   */
  export class Emitter<T> {
    constructor()
    readonly event: IEvent<T>
    fire(event: T): void
    dispose(): void
  }

  export enum MarkerTag {
    Unnecessary = 1,
    Deprecated = 2,
  }

  export enum MarkerSeverity {
    Hint = 1,
    Info = 2,
    Warning = 4,
    Error = 8,
  }

  export class CancellationTokenSource {
    constructor(parent?: CancellationToken)
    get token(): CancellationToken
    cancel(): void
    dispose(cancel?: boolean): void
  }

  export interface CancellationToken {
    /**
     * A flag signalling is cancellation has been requested.
     */
    readonly isCancellationRequested: boolean
    /**
     * An event which fires when cancellation is requested. This event
     * only ever fires `once` as cancellation can only happen once. Listeners
     * that are registered after cancellation will be called (next event loop run),
     * but also only once.
     *
     * @event
     */
    readonly onCancellationRequested: (
      listener: (e: any) => any,
      thisArgs?: any,
      disposables?: IDisposable[]
    ) => IDisposable
  }
  /**
   * Uniform Resource Identifier (Uri) http://tools.ietf.org/html/rfc3986.
   * This class is a simple parser which creates the basic component parts
   * (http://tools.ietf.org/html/rfc3986#section-3) with minimal validation
   * and encoding.
   *
   * ```txt
   *       foo://example.com:8042/over/there?name=ferret#nose
   *       \_/   \______________/\_________/ \_________/ \__/
   *        |           |            |            |        |
   *     scheme     authority       path        query   fragment
   *        |   _____________________|__
   *       / \ /                        \
   *       urn:example:animal:ferret:nose
   * ```
   */
  export class Uri implements UriComponents {
    static isUri(thing: any): thing is Uri
    /**
     * scheme is the 'http' part of 'http://www.msft.com/some/path?query#fragment'.
     * The part before the first colon.
     */
    readonly scheme: string
    /**
     * authority is the 'www.msft.com' part of 'http://www.msft.com/some/path?query#fragment'.
     * The part between the first double slashes and the next slash.
     */
    readonly authority: string
    /**
     * path is the '/some/path' part of 'http://www.msft.com/some/path?query#fragment'.
     */
    readonly path: string
    /**
     * query is the 'query' part of 'http://www.msft.com/some/path?query#fragment'.
     */
    readonly query: string
    /**
     * fragment is the 'fragment' part of 'http://www.msft.com/some/path?query#fragment'.
     */
    readonly fragment: string
    /**
     * Returns a string representing the corresponding file system path of this Uri.
     * Will handle UNC paths, normalizes windows drive letters to lower-case, and uses the
     * platform specific path separator.
     *
     * * Will *not* validate the path for invalid characters and semantics.
     * * Will *not* look at the scheme of this Uri.
     * * The result shall *not* be used for display purposes but for accessing a file on disk.
     *
     *
     * The *difference* to `Uri#path` is the use of the platform specific separator and the handling
     * of UNC paths. See the below sample of a file-uri with an authority (UNC path).
     *
     * ```ts
        const u = Uri.parse('file://server/c$/folder/file.txt')
        u.authority === 'server'
        u.path === '/shares/c$/file.txt'
        u.fsPath === '\\server\c$\folder\file.txt'
    ```
     *
     * Using `Uri#path` to read a file (using fs-apis) would not be enough because parts of the path,
     * namely the server name, would be missing. Therefore `Uri#fsPath` exists - it's sugar to ease working
     * with URIs that represent files on disk (`file` scheme).
     */
    get fsPath(): string
    with(change: {
      scheme?: string
      authority?: string | null
      path?: string | null
      query?: string | null
      fragment?: string | null
    }): Uri
    /**
     * Creates a new Uri from a string, e.g. `http://www.msft.com/some/path`,
     * `file:///usr/home`, or `scheme:with/path`.
     *
     * @param value A string which represents an Uri (see `Uri#toString`).
     */
    static parse(value: string, _strict?: boolean): Uri
    /**
     * Creates a new Uri from a file system path, e.g. `c:\my\files`,
     * `/usr/home`, or `\\server\share\some\path`.
     *
     * The *difference* between `Uri#parse` and `Uri#file` is that the latter treats the argument
     * as path, not as stringified-uri. E.g. `Uri.file(path)` is **not the same as**
     * `Uri.parse('file://' + path)` because the path might contain characters that are
     * interpreted (# and ?). See the following sample:
     * ```ts
    const good = Uri.file('/coding/c#/project1');
    good.scheme === 'file';
    good.path === '/coding/c#/project1';
    good.fragment === '';
    const bad = Uri.parse('file://' + '/coding/c#/project1');
    bad.scheme === 'file';
    bad.path === '/coding/c'; // path is now broken
    bad.fragment === '/project1';
    ```
     *
     * @param path A file system path (see `Uri#fsPath`)
     */
    static file(path: string): Uri
    static from(components: {
      scheme: string
      authority?: string
      path?: string
      query?: string
      fragment?: string
    }): Uri
    /**
     * Join a Uri path with path fragments and normalizes the resulting path.
     *
     * @param uri The input Uri.
     * @param pathFragment The path fragment to add to the Uri path.
     * @returns The resulting Uri.
     */
    static joinPath(
      uri: Uri,
      ...pathFragment: string[]
    ): Uri
    /**
     * Creates a string representation for this Uri. It's guaranteed that calling
     * `Uri.parse` with the result of this function creates an Uri which is equal
     * to this Uri.
     *
     * * The result shall *not* be used for display purposes but for externalization or transport.
     * * The result will be encoded using the percentage encoding and encoding happens mostly
     * ignore the scheme-specific encoding rules.
     *
     * @param skipEncoding Do not encode the result, default is `false`
     */
    toString(skipEncoding?: boolean): string
    toJSON(): UriComponents
    static revive(data: UriComponents | Uri): Uri
    static revive(
      data: UriComponents | Uri | undefined
    ): Uri | undefined
    static revive(
      data: UriComponents | Uri | null
    ): Uri | null
    static revive(
      data: UriComponents | Uri | undefined | null
    ): Uri | undefined | null
  }

  export interface UriComponents {
    scheme: string
    authority: string
    path: string
    query: string
    fragment: string
  }

  /**
   * Virtual Key Codes, the value does not hold any inherent meaning.
   * Inspired somewhat from https://msdn.microsoft.com/en-us/library/windows/desktop/dd375731(v=vs.85).aspx
   * But these are "more general", as they should work across browsers & OS`s.
   */
  export enum KeyCode {
    DependsOnKbLayout = -1,
    /**
     * Placed first to cover the 0 value of the enum.
     */
    Unknown = 0,
    Backspace = 1,
    Tab = 2,
    Enter = 3,
    Shift = 4,
    Ctrl = 5,
    Alt = 6,
    PauseBreak = 7,
    CapsLock = 8,
    Escape = 9,
    Space = 10,
    PageUp = 11,
    PageDown = 12,
    End = 13,
    Home = 14,
    LeftArrow = 15,
    UpArrow = 16,
    RightArrow = 17,
    DownArrow = 18,
    Insert = 19,
    Delete = 20,
    KEY_0 = 21,
    KEY_1 = 22,
    KEY_2 = 23,
    KEY_3 = 24,
    KEY_4 = 25,
    KEY_5 = 26,
    KEY_6 = 27,
    KEY_7 = 28,
    KEY_8 = 29,
    KEY_9 = 30,
    KEY_A = 31,
    KEY_B = 32,
    KEY_C = 33,
    KEY_D = 34,
    KEY_E = 35,
    KEY_F = 36,
    KEY_G = 37,
    KEY_H = 38,
    KEY_I = 39,
    KEY_J = 40,
    KEY_K = 41,
    KEY_L = 42,
    KEY_M = 43,
    KEY_N = 44,
    KEY_O = 45,
    KEY_P = 46,
    KEY_Q = 47,
    KEY_R = 48,
    KEY_S = 49,
    KEY_T = 50,
    KEY_U = 51,
    KEY_V = 52,
    KEY_W = 53,
    KEY_X = 54,
    KEY_Y = 55,
    KEY_Z = 56,
    Meta = 57,
    ContextMenu = 58,
    F1 = 59,
    F2 = 60,
    F3 = 61,
    F4 = 62,
    F5 = 63,
    F6 = 64,
    F7 = 65,
    F8 = 66,
    F9 = 67,
    F10 = 68,
    F11 = 69,
    F12 = 70,
    F13 = 71,
    F14 = 72,
    F15 = 73,
    F16 = 74,
    F17 = 75,
    F18 = 76,
    F19 = 77,
    NumLock = 78,
    ScrollLock = 79,
    /**
     * Used for miscellaneous characters; it can vary by keyboard.
     * For the US standard keyboard, the ';:' key
     */
    US_SEMICOLON = 80,
    /**
     * For any country/region, the '+' key
     * For the US standard keyboard, the '=+' key
     */
    US_EQUAL = 81,
    /**
     * For any country/region, the ',' key
     * For the US standard keyboard, the ',<' key
     */
    US_COMMA = 82,
    /**
     * For any country/region, the '-' key
     * For the US standard keyboard, the '-_' key
     */
    US_MINUS = 83,
    /**
     * For any country/region, the '.' key
     * For the US standard keyboard, the '.>' key
     */
    US_DOT = 84,
    /**
     * Used for miscellaneous characters; it can vary by keyboard.
     * For the US standard keyboard, the '/?' key
     */
    US_SLASH = 85,
    /**
     * Used for miscellaneous characters; it can vary by keyboard.
     * For the US standard keyboard, the '`~' key
     */
    US_BACKTICK = 86,
    /**
     * Used for miscellaneous characters; it can vary by keyboard.
     * For the US standard keyboard, the '[{' key
     */
    US_OPEN_SQUARE_BRACKET = 87,
    /**
     * Used for miscellaneous characters; it can vary by keyboard.
     * For the US standard keyboard, the '\|' key
     */
    US_BACKSLASH = 88,
    /**
     * Used for miscellaneous characters; it can vary by keyboard.
     * For the US standard keyboard, the ']}' key
     */
    US_CLOSE_SQUARE_BRACKET = 89,
    /**
     * Used for miscellaneous characters; it can vary by keyboard.
     * For the US standard keyboard, the ''"' key
     */
    US_QUOTE = 90,
    /**
     * Used for miscellaneous characters; it can vary by keyboard.
     */
    OEM_8 = 91,
    /**
     * Either the angle bracket key or the backslash key on the RT 102-key keyboard.
     */
    OEM_102 = 92,
    NUMPAD_0 = 93,
    NUMPAD_1 = 94,
    NUMPAD_2 = 95,
    NUMPAD_3 = 96,
    NUMPAD_4 = 97,
    NUMPAD_5 = 98,
    NUMPAD_6 = 99,
    NUMPAD_7 = 100,
    NUMPAD_8 = 101,
    NUMPAD_9 = 102,
    NUMPAD_MULTIPLY = 103,
    NUMPAD_ADD = 104,
    NUMPAD_SEPARATOR = 105,
    NUMPAD_SUBTRACT = 106,
    NUMPAD_DECIMAL = 107,
    NUMPAD_DIVIDE = 108,
    /**
     * Cover all key codes when IME is processing input.
     */
    KEY_IN_COMPOSITION = 109,
    ABNT_C1 = 110,
    ABNT_C2 = 111,
    /**
     * Placed last to cover the length of the enum.
     * Please do not depend on this value!
     */
    MAX_VALUE = 112,
  }
  export class KeyMod {
    static readonly CtrlCmd: number
    static readonly Shift: number
    static readonly Alt: number
    static readonly WinCtrl: number
    static chord(
      firstPart: number,
      secondPart: number
    ): number
  }

  export interface IMarkdownString {
    readonly value: string
    readonly isTrusted?: boolean
    readonly supportThemeIcons?: boolean
    uris?: {
      [href: string]: UriComponents
    }
  }

  export interface IKeyboardEvent {
    readonly _standardKeyboardEventBrand: true
    readonly browserEvent: any
    readonly target: any
    readonly ctrlKey: boolean
    readonly shiftKey: boolean
    readonly altKey: boolean
    readonly metaKey: boolean
    readonly keyCode: KeyCode
    readonly code: string
    equals(keybinding: number): boolean
    preventDefault(): void
    stopPropagation(): void
  }
  export interface IMouseEvent {
    readonly browserEvent: any
    readonly leftButton: boolean
    readonly middleButton: boolean
    readonly rightButton: boolean
    readonly buttons: number
    readonly target: any
    readonly detail: number
    readonly posx: number
    readonly posy: number
    readonly ctrlKey: boolean
    readonly shiftKey: boolean
    readonly altKey: boolean
    readonly metaKey: boolean
    readonly timestamp: number
    preventDefault(): void
    stopPropagation(): void
  }

  export interface IScrollEvent {
    readonly scrollTop: number
    readonly scrollLeft: number
    readonly scrollWidth: number
    readonly scrollHeight: number
    readonly scrollTopChanged: boolean
    readonly scrollLeftChanged: boolean
    readonly scrollWidthChanged: boolean
    readonly scrollHeightChanged: boolean
  }
  /**
   * A position in the editor. This interface is suitable for serialization.
   */
  export interface IPosition {
    /**
     * line number (starts at 1)
     */
    readonly lineNumber: number
    /**
     * column (the first character in a line is between column 1 and column 2)
     */
    readonly column: number
  }

  /**
   * A position in the editor.
   */
  export class Position {
    /**
     * line number (starts at 1)
     */
    readonly lineNumber: number
    /**
     * column (the first character in a line is between column 1 and column 2)
     */
    readonly column: number
    constructor(lineNumber: number, column: number)
    /**
     * Create a new position from this position.
     *
     * @param newLineNumber new line number
     * @param newColumn new column
     */
    with(
      newLineNumber?: number,
      newColumn?: number
    ): Position
    /**
     * Derive a new position from this position.
     *
     * @param deltaLineNumber line number delta
     * @param deltaColumn column delta
     */
    delta(
      deltaLineNumber?: number,
      deltaColumn?: number
    ): Position
    /**
     * Test if this position equals other position
     */
    equals(other: IPosition): boolean
    /**
     * Test if position `a` equals position `b`
     */
    static equals(
      a: IPosition | null,
      b: IPosition | null
    ): boolean
    /**
     * Test if this position is before other position.
     * If the two positions are equal, the result will be false.
     */
    isBefore(other: IPosition): boolean
    /**
     * Test if position `a` is before position `b`.
     * If the two positions are equal, the result will be false.
     */
    static isBefore(a: IPosition, b: IPosition): boolean
    /**
     * Test if this position is before other position.
     * If the two positions are equal, the result will be true.
     */
    isBeforeOrEqual(other: IPosition): boolean
    /**
     * Test if position `a` is before position `b`.
     * If the two positions are equal, the result will be true.
     */
    static isBeforeOrEqual(
      a: IPosition,
      b: IPosition
    ): boolean
    /**
     * A function that compares positions, useful for sorting
     */
    static compare(a: IPosition, b: IPosition): number
    /**
     * Clone this position.
     */
    clone(): Position
    /**
     * Convert to a human-readable representation.
     */
    toString(): string
    /**
     * Create a `Position` from an `IPosition`.
     */
    static lift(pos: IPosition): Position
    /**
     * Test if `obj` is an `IPosition`.
     */
    static isIPosition(obj: any): obj is IPosition
  }

  /**
   * A range in the editor. This interface is suitable for serialization.
   */
  export interface IRange {
    /**
     * Line number on which the range starts (starts at 1).
     */
    readonly startLineNumber: number
    /**
     * Column on which the range starts in line `startLineNumber` (starts at 1).
     */
    readonly startColumn: number
    /**
     * Line number on which the range ends.
     */
    readonly endLineNumber: number
    /**
     * Column on which the range ends in line `endLineNumber`.
     */
    readonly endColumn: number
  }

  /**
   * A range in the editor. (startLineNumber,startColumn) is <= (endLineNumber,endColumn)
   */
  export class Range {
    /**
     * Line number on which the range starts (starts at 1).
     */
    readonly startLineNumber: number
    /**
     * Column on which the range starts in line `startLineNumber` (starts at 1).
     */
    readonly startColumn: number
    /**
     * Line number on which the range ends.
     */
    readonly endLineNumber: number
    /**
     * Column on which the range ends in line `endLineNumber`.
     */
    readonly endColumn: number
    constructor(
      startLineNumber: number,
      startColumn: number,
      endLineNumber: number,
      endColumn: number
    )
    /**
     * Test if this range is empty.
     */
    isEmpty(): boolean
    /**
     * Test if `range` is empty.
     */
    static isEmpty(range: IRange): boolean
    /**
     * Test if position is in this range. If the position is at the edges, will return true.
     */
    containsPosition(position: IPosition): boolean
    /**
     * Test if `position` is in `range`. If the position is at the edges, will return true.
     */
    static containsPosition(
      range: IRange,
      position: IPosition
    ): boolean
    /**
     * Test if range is in this range. If the range is equal to this range, will return true.
     */
    containsRange(range: IRange): boolean
    /**
     * Test if `otherRange` is in `range`. If the ranges are equal, will return true.
     */
    static containsRange(
      range: IRange,
      otherRange: IRange
    ): boolean
    /**
     * Test if `range` is strictly in this range. `range` must start after and end before this range for the result to be true.
     */
    strictContainsRange(range: IRange): boolean
    /**
     * Test if `otherRange` is strinctly in `range` (must start after, and end before). If the ranges are equal, will return false.
     */
    static strictContainsRange(
      range: IRange,
      otherRange: IRange
    ): boolean
    /**
     * A reunion of the two ranges.
     * The smallest position will be used as the start point, and the largest one as the end point.
     */
    plusRange(range: IRange): Range
    /**
     * A reunion of the two ranges.
     * The smallest position will be used as the start point, and the largest one as the end point.
     */
    static plusRange(a: IRange, b: IRange): Range
    /**
     * A intersection of the two ranges.
     */
    intersectRanges(range: IRange): Range | null
    /**
     * A intersection of the two ranges.
     */
    static intersectRanges(
      a: IRange,
      b: IRange
    ): Range | null
    /**
     * Test if this range equals other.
     */
    equalsRange(other: IRange | null): boolean
    /**
     * Test if range `a` equals `b`.
     */
    static equalsRange(
      a: IRange | null,
      b: IRange | null
    ): boolean
    /**
     * Return the end position (which will be after or equal to the start position)
     */
    getEndPosition(): Position
    /**
     * Return the end position (which will be after or equal to the start position)
     */
    static getEndPosition(range: IRange): Position
    /**
     * Return the start position (which will be before or equal to the end position)
     */
    getStartPosition(): Position
    /**
     * Return the start position (which will be before or equal to the end position)
     */
    static getStartPosition(range: IRange): Position
    /**
     * Transform to a user presentable string representation.
     */
    toString(): string
    /**
     * Create a new range using this range's start position, and using endLineNumber and endColumn as the end position.
     */
    setEndPosition(
      endLineNumber: number,
      endColumn: number
    ): Range
    /**
     * Create a new range using this range's end position, and using startLineNumber and startColumn as the start position.
     */
    setStartPosition(
      startLineNumber: number,
      startColumn: number
    ): Range
    /**
     * Create a new empty range using this range's start position.
     */
    collapseToStart(): Range
    /**
     * Create a new empty range using this range's start position.
     */
    static collapseToStart(range: IRange): Range
    static fromPositions(
      start: IPosition,
      end?: IPosition
    ): Range
    /**
     * Create a `Range` from an `IRange`.
     */
    static lift(range: undefined | null): null
    static lift(range: IRange): Range
    /**
     * Test if `obj` is an `IRange`.
     */
    static isIRange(obj: any): obj is IRange
    /**
     * Test if the two ranges are touching in any way.
     */
    static areIntersectingOrTouching(
      a: IRange,
      b: IRange
    ): boolean
    /**
     * Test if the two ranges are intersecting. If the ranges are touching it returns true.
     */
    static areIntersecting(a: IRange, b: IRange): boolean
    /**
     * A function that compares ranges, useful for sorting ranges
     * It will first compare ranges on the startPosition and then on the endPosition
     */
    static compareRangesUsingStarts(
      a: IRange | null | undefined,
      b: IRange | null | undefined
    ): number
    /**
     * A function that compares ranges, useful for sorting ranges
     * It will first compare ranges on the endPosition and then on the startPosition
     */
    static compareRangesUsingEnds(
      a: IRange,
      b: IRange
    ): number
    /**
     * Test if the range spans multiple lines.
     */
    static spansMultipleLines(range: IRange): boolean
  }

  /**
   * A selection in the editor.
   * The selection is a range that has an orientation.
   */
  export interface ISelection {
    /**
     * The line number on which the selection has started.
     */
    readonly selectionStartLineNumber: number
    /**
     * The column on `selectionStartLineNumber` where the selection has started.
     */
    readonly selectionStartColumn: number
    /**
     * The line number on which the selection has ended.
     */
    readonly positionLineNumber: number
    /**
     * The column on `positionLineNumber` where the selection has ended.
     */
    readonly positionColumn: number
  }

  /**
   * A selection in the editor.
   * The selection is a range that has an orientation.
   */
  export class Selection extends Range {
    /**
     * The line number on which the selection has started.
     */
    readonly selectionStartLineNumber: number
    /**
     * The column on `selectionStartLineNumber` where the selection has started.
     */
    readonly selectionStartColumn: number
    /**
     * The line number on which the selection has ended.
     */
    readonly positionLineNumber: number
    /**
     * The column on `positionLineNumber` where the selection has ended.
     */
    readonly positionColumn: number
    constructor(
      selectionStartLineNumber: number,
      selectionStartColumn: number,
      positionLineNumber: number,
      positionColumn: number
    )
    /**
     * Transform to a human-readable representation.
     */
    toString(): string
    /**
     * Test if equals other selection.
     */
    equalsSelection(other: ISelection): boolean
    /**
     * Test if the two selections are equal.
     */
    static selectionsEqual(
      a: ISelection,
      b: ISelection
    ): boolean
    /**
     * Get directions (LTR or RTL).
     */
    getDirection(): SelectionDirection
    /**
     * Create a new selection with a different `positionLineNumber` and `positionColumn`.
     */
    setEndPosition(
      endLineNumber: number,
      endColumn: number
    ): Selection
    /**
     * Get the position at `positionLineNumber` and `positionColumn`.
     */
    getPosition(): Position
    /**
     * Create a new selection with a different `selectionStartLineNumber` and `selectionStartColumn`.
     */
    setStartPosition(
      startLineNumber: number,
      startColumn: number
    ): Selection
    /**
     * Create a `Selection` from one or two positions
     */
    static fromPositions(
      start: IPosition,
      end?: IPosition
    ): Selection
    /**
     * Create a `Selection` from an `ISelection`.
     */
    static liftSelection(sel: ISelection): Selection
    /**
     * `a` equals `b`.
     */
    static selectionsArrEqual(
      a: ISelection[],
      b: ISelection[]
    ): boolean
    /**
     * Test if `obj` is an `ISelection`.
     */
    static isISelection(obj: any): obj is ISelection
    /**
     * Create with a direction.
     */
    static createWithDirection(
      startLineNumber: number,
      startColumn: number,
      endLineNumber: number,
      endColumn: number,
      direction: SelectionDirection
    ): Selection
  }

  /**
   * The direction of a selection.
   */
  export enum SelectionDirection {
    /**
     * The selection starts above where it ends.
     */
    LTR = 0,
    /**
     * The selection starts below where it ends.
     */
    RTL = 1,
  }

  export class Token {
    _tokenBrand: void
    readonly offset: number
    readonly type: string
    readonly language: string
    constructor(
      offset: number,
      type: string,
      language: string
    )
    toString(): string
  }

  export namespace editor {
    export interface IDiffNavigator {
      canNavigate(): boolean
      next(): void
      previous(): void
      dispose(): void
    }

    /**
     * Create a new editor under `domElement`.
     * `domElement` should be empty (not contain other dom nodes).
     * The editor will read the size of `domElement`.
     */
    export function create(
      domElement: any,
      options?: IStandaloneEditorConstructionOptions,
      override?: IEditorOverrideServices
    ): IStandaloneCodeEditor

    /**
     * Emitted when an editor is created.
     * Creating a diff editor might cause this listener to be invoked with the two editors.
     * @event
     */
    export function onDidCreateEditor(
      listener: (codeEditor: ICodeEditor) => void
    ): IDisposable

    /**
     * Create a new diff editor under `domElement`.
     * `domElement` should be empty (not contain other dom nodes).
     * The editor will read the size of `domElement`.
     */
    export function createDiffEditor(
      domElement: any,
      options?: IDiffEditorConstructionOptions,
      override?: IEditorOverrideServices
    ): IStandaloneDiffEditor

    export interface IDiffNavigatorOptions {
      readonly followsCaret?: boolean
      readonly ignoreCharChanges?: boolean
      readonly alwaysRevealFirst?: boolean
    }

    export function createDiffNavigator(
      diffEditor: IStandaloneDiffEditor,
      opts?: IDiffNavigatorOptions
    ): IDiffNavigator

    /**
     * Create a new editor model.
     * You can specify the language that should be set for this model or let the language be inferred from the `uri`.
     */
    export function createModel(
      value: string,
      language?: string,
      uri?: Uri
    ): ITextModel

    /**
     * Change the language for a model.
     */
    export function setModelLanguage(
      model: ITextModel,
      languageId: string
    ): void

    /**
     * Set the markers for a model.
     */
    export function setModelMarkers(
      model: ITextModel,
      owner: string,
      markers: IMarkerData[]
    ): void

    /**
     * Get markers for owner and/or resource
     *
     * @returns list of markers
     */
    export function getModelMarkers(filter: {
      owner?: string
      resource?: Uri
      take?: number
    }): IMarker[]

    /**
     * Emitted when markers change for a model.
     * @event
     */
    export function onDidChangeMarkers(
      listener: (e: readonly Uri[]) => void
    ): IDisposable

    /**
     * Get the model that has `uri` if it exists.
     */
    export function getModel(uri: Uri): ITextModel | null

    /**
     * Get all the created models.
     */
    export function getModels(): ITextModel[]

    /**
     * Emitted when a model is created.
     * @event
     */
    export function onDidCreateModel(
      listener: (model: ITextModel) => void
    ): IDisposable

    /**
     * Emitted right before a model is disposed.
     * @event
     */
    export function onWillDisposeModel(
      listener: (model: ITextModel) => void
    ): IDisposable

    /**
     * Emitted when a different language is set to a model.
     * @event
     */
    export function onDidChangeModelLanguage(
      listener: (e: {
        readonly model: ITextModel
        readonly oldLanguage: string
      }) => void
    ): IDisposable

    /**
     * Create a new web any that has model syncing capabilities built in.
     * Specify an AMD module to load that will `create` an object that will be proxied.
     */
    export function createWebWorker<T>(
      opts: IWebWorkerOptions
    ): MonacoWebWorker<T>

    /**
     * Colorize the contents of `domNode` using attribute `data-lang`.
     */
    export function colorizeElement(
      domNode: any,
      options: IColorizerElementOptions
    ): Promise<void>

    /**
     * Colorize `text` using language `languageId`.
     */
    export function colorize(
      text: string,
      languageId: string,
      options: IColorizerOptions
    ): Promise<string>

    /**
     * Colorize a line in a model.
     */
    export function colorizeModelLine(
      model: ITextModel,
      lineNumber: number,
      tabSize?: number
    ): string

    /**
     * Tokenize `text` using language `languageId`
     */
    export function tokenize(
      text: string,
      languageId: string
    ): Token[][]

    /**
     * Define a new theme or update an existing theme.
     */
    export function defineTheme(
      themeName: string,
      themeData: IStandaloneThemeData
    ): void

    /**
     * Switches to a theme.
     */
    export function setTheme(themeName: string): void

    /**
     * Clears all cached font measurements and triggers re-measurement.
     */
    export function remeasureFonts(): void

    /**
     * Register a command.
     */
    export function registerCommand(
      id: string,
      handler: (accessor: any, ...args: any[]) => void
    ): IDisposable

    export type BuiltinTheme = "vs" | "vs-dark" | "hc-black"

    export interface IStandaloneThemeData {
      base: BuiltinTheme
      inherit: boolean
      rules: ITokenThemeRule[]
      encodedTokensColors?: string[]
      colors: IColors
    }

    export type IColors = {
      [colorId: string]: string
    }

    export interface ITokenThemeRule {
      token: string
      foreground?: string
      background?: string
      fontStyle?: string
    }

    /**
     * A web any that can provide a proxy to an arbitrary file.
     */
    export interface MonacoWebWorker<T> {
      /**
       * Terminate the web any, thus invalidating the returned proxy.
       */
      dispose(): void
      /**
       * Get a proxy to the arbitrary loaded code.
       */
      getProxy(): Promise<T>
      /**
       * Synchronize (send) the models at `resources` to the web any,
       * making them available in the monaco.worker.getMirrorModels().
       */
      withSyncedResources(resources: Uri[]): Promise<T>
    }

    export interface IWebWorkerOptions {
      /**
       * The AMD moduleId to load.
       * It should export a function `create` that should return the exported proxy.
       */
      moduleId: string
      /**
       * The data to send over when calling create on the module.
       */
      createData?: any
      /**
       * A label to be used to identify the web any for debugging purposes.
       */
      label?: string
      /**
       * An object that can be used by the web any to make calls back to the main thread.
       */
      host?: any
      /**
       * Keep idle models.
       * Defaults to false, which means that idle models will stop syncing after a while.
       */
      keepIdleModels?: boolean
    }

    /**
     * Description of an action contribution
     */
    export interface IActionDescriptor {
      /**
       * An unique identifier of the contributed action.
       */
      id: string
      /**
       * A label of the action that will be presented to the user.
       */
      label: string
      /**
       * Precondition rule.
       */
      precondition?: string
      /**
       * An array of keybindings for the action.
       */
      keybindings?: number[]
      /**
       * The keybinding rule (condition on top of precondition).
       */
      keybindingContext?: string
      /**
       * Control if the action should show up in the context menu and where.
       * The context menu of the editor has these default:
       *   navigation - The navigation group comes first in all cases.
       *   1_modification - This group comes next and contains commands that modify your code.
       *   9_cutcopypaste - The last default group with the basic editing commands.
       * You can also create your own group.
       * Defaults to null (don't show in context menu).
       */
      contextMenuGroupId?: string
      /**
       * Control the order in the context menu group.
       */
      contextMenuOrder?: number
      /**
       * Method that will be executed when the action is triggered.
       * @param editor The editor instance is passed in as a convenience
       */
      run(
        editor: ICodeEditor,
        ...args: any[]
      ): void | Promise<void>
    }

    /**
     * Options which apply for all editors.
     */
    export interface IGlobalEditorOptions {
      /**
       * The number of spaces a tab is equal to.
       * This setting is overridden based on the file contents when `detectIndentation` is on.
       * Defaults to 4.
       */
      tabSize?: number
      /**
       * Insert spaces when pressing `Tab`.
       * This setting is overridden based on the file contents when `detectIndentation` is on.
       * Defaults to true.
       */
      insertSpaces?: boolean
      /**
       * Controls whether `tabSize` and `insertSpaces` will be automatically detected when a file is opened based on the file contents.
       * Defaults to true.
       */
      detectIndentation?: boolean
      /**
       * Remove trailing auto inserted whitespace.
       * Defaults to true.
       */
      trimAutoWhitespace?: boolean
      /**
       * Special handling for large files to disable certain memory intensive features.
       * Defaults to true.
       */
      largeFileOptimizations?: boolean
      /**
       * Controls whether completions should be computed based on words in the document.
       * Defaults to true.
       */
      wordBasedSuggestions?: boolean
      /**
       * Controls whether word based completions should be included from opened documents of the same language or any language.
       */
      wordBasedSuggestionsOnlySameLanguage?: boolean
      /**
       * Controls whether the semanticHighlighting is shown for the languages that support it.
       * true: semanticHighlighting is enabled for all themes
       * false: semanticHighlighting is disabled for all themes
       * 'configuredByTheme': semanticHighlighting is controlled by the current color theme's semanticHighlighting setting.
       * Defaults to 'byTheme'.
       */
      "semanticHighlighting.enabled"?:
      | true
      | false
      | "configuredByTheme"
      /**
       * Keep peek editors open even when double clicking their content or when hitting `Escape`.
       * Defaults to false.
       */
      stablePeek?: boolean
      /**
       * Lines above this length will not be tokenized for performance reasons.
       * Defaults to 20000.
       */
      maxTokenizationLineLength?: number
      /**
       * Theme to be used for rendering.
       * The current out-of-the-box available themes are: 'vs' (default), 'vs-dark', 'hc-black'.
       * You can create custom themes via `monaco.editor.defineTheme`.
       * To switch a theme, use `monaco.editor.setTheme`.
       * **NOTE**: The theme might be overwritten if the OS is in high contrast mode, unless `autoDetectHighContrast` is set to false.
       */
      theme?: string
      /**
       * If enabled, will automatically change to high contrast theme if the OS is using a high contrast theme.
       * Defaults to true.
       */
      autoDetectHighContrast?: boolean
    }

    /**
     * The options to create an editor.
     */
    export interface IStandaloneEditorConstructionOptions
      extends IEditorConstructionOptions,
      IGlobalEditorOptions {
      /**
       * The initial model associated with this code editor.
       */
      model?: ITextModel | null
      /**
       * The initial value of the auto created model in the editor.
       * To not create automatically a model, use `model: null`.
       */
      value?: string
      /**
       * The initial language of the auto created model in the editor.
       * To not create automatically a model, use `model: null`.
       */
      language?: string
      /**
       * Initial theme to be used for rendering.
       * The current out-of-the-box available themes are: 'vs' (default), 'vs-dark', 'hc-black'.
       * You can create custom themes via `monaco.editor.defineTheme`.
       * To switch a theme, use `monaco.editor.setTheme`.
       * **NOTE**: The theme might be overwritten if the OS is in high contrast mode, unless `autoDetectHighContrast` is set to false.
       */
      theme?: string
      /**
       * If enabled, will automatically change to high contrast theme if the OS is using a high contrast theme.
       * Defaults to true.
       */
      autoDetectHighContrast?: boolean
      /**
       * An URL to open when Ctrl+H (Windows and Linux) or Cmd+H (OSX) is pressed in
       * the accessibility help dialog in the editor.
       *
       * Defaults to "https://go.microsoft.com/fwlink/?linkid=852450"
       */
      accessibilityHelpUrl?: string
    }

    /**
     * The options to create a diff editor.
     */
    export interface IDiffEditorConstructionOptions
      extends IDiffEditorOptions {
      /**
       * Initial theme to be used for rendering.
       * The current out-of-the-box available themes are: 'vs' (default), 'vs-dark', 'hc-black'.
       * You can create custom themes via `monaco.editor.defineTheme`.
       * To switch a theme, use `monaco.editor.setTheme`.
       * **NOTE**: The theme might be overwritten if the OS is in high contrast mode, unless `autoDetectHighContrast` is set to false.
       */
      theme?: string
      /**
       * If enabled, will automatically change to high contrast theme if the OS is using a high contrast theme.
       * Defaults to true.
       */
      autoDetectHighContrast?: boolean
    }

    export interface IStandaloneCodeEditor
      extends ICodeEditor {
      updateOptions(
        newOptions: IEditorOptions & IGlobalEditorOptions
      ): void
      addCommand(
        keybinding: number,
        handler: ICommandHandler,
        context?: string
      ): string | null
      createContextKey<T>(
        key: string,
        defaultValue: T
      ): IContextKey<T>
      addAction(descriptor: IActionDescriptor): IDisposable
    }

    export interface IStandaloneDiffEditor
      extends IDiffEditor {
      addCommand(
        keybinding: number,
        handler: ICommandHandler,
        context?: string
      ): string | null
      createContextKey<T>(
        key: string,
        defaultValue: T
      ): IContextKey<T>
      addAction(descriptor: IActionDescriptor): IDisposable
      getOriginalEditor(): IStandaloneCodeEditor
      getModifiedEditor(): IStandaloneCodeEditor
    }
    export interface ICommandHandler {
      (...args: any[]): void
    }

    export interface IContextKey<T> {
      set(value: T): void
      reset(): void
      get(): T | undefined
    }

    export interface IEditorOverrideServices {
      [index: string]: any
    }

    export interface IMarker {
      owner: string
      resource: Uri
      severity: MarkerSeverity
      code?:
      | string
      | {
        value: string
        target: Uri
      }
      message: string
      source?: string
      startLineNumber: number
      startColumn: number
      endLineNumber: number
      endColumn: number
      relatedInformation?: IRelatedInformation[]
      tags?: MarkerTag[]
    }

    /**
     * A structure defining a problem/warning/etc.
     */
    export interface IMarkerData {
      code?:
      | string
      | {
        value: string
        target: Uri
      }
      severity: MarkerSeverity
      message: string
      source?: string
      startLineNumber: number
      startColumn: number
      endLineNumber: number
      endColumn: number
      relatedInformation?: IRelatedInformation[]
      tags?: MarkerTag[]
    }

    /**
     *
     */
    export interface IRelatedInformation {
      resource: Uri
      message: string
      startLineNumber: number
      startColumn: number
      endLineNumber: number
      endColumn: number
    }

    export interface IColorizerOptions {
      tabSize?: number
    }

    export interface IColorizerElementOptions
      extends IColorizerOptions {
      theme?: string
      mimeType?: string
    }

    export enum ScrollbarVisibility {
      Auto = 1,
      Hidden = 2,
      Visible = 3,
    }

    export interface ThemeColor {
      id: string
    }

    /**
     * Vertical Lane in the overview ruler of the editor.
     */
    export enum OverviewRulerLane {
      Left = 1,
      Center = 2,
      Right = 4,
      Full = 7,
    }

    /**
     * Position in the minimap to render the decoration.
     */
    export enum MinimapPosition {
      Inline = 1,
      Gutter = 2,
    }

    export interface IDecorationOptions {
      /**
       * CSS color to render.
       * e.g.: rgba(100, 100, 100, 0.5) or a color from the color registry
       */
      color: string | ThemeColor | undefined
      /**
       * CSS color to render.
       * e.g.: rgba(100, 100, 100, 0.5) or a color from the color registry
       */
      darkColor?: string | ThemeColor
    }

    /**
     * Options for rendering a model decoration in the overview ruler.
     */
    export interface IModelDecorationOverviewRulerOptions
      extends IDecorationOptions {
      /**
       * The position in the overview ruler.
       */
      position: OverviewRulerLane
    }

    /**
     * Options for rendering a model decoration in the overview ruler.
     */
    export interface IModelDecorationMinimapOptions
      extends IDecorationOptions {
      /**
       * The position in the overview ruler.
       */
      position: MinimapPosition
    }

    /**
     * Options for a model decoration.
     */
    export interface IModelDecorationOptions {
      /**
       * Customize the growing behavior of the decoration when typing at the edges of the decoration.
       * Defaults to TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges
       */
      stickiness?: TrackedRangeStickiness
      /**
       * CSS class name describing the decoration.
       */
      className?: string | null
      /**
       * Message to be rendered when hovering over the glyph margin decoration.
       */
      glyphMarginHoverMessage?:
      | IMarkdownString
      | IMarkdownString[]
      | null
      /**
       * Array of MarkdownString to render as the decoration message.
       */
      hoverMessage?:
      | IMarkdownString
      | IMarkdownString[]
      | null
      /**
       * Should the decoration expand to encompass a whole line.
       */
      isWholeLine?: boolean
      /**
       * Specifies the stack order of a decoration.
       * A decoration with greater stack order is always in front of a decoration with a lower stack order.
       */
      zIndex?: number
      /**
       * If set, render this decoration in the overview ruler.
       */
      overviewRuler?: IModelDecorationOverviewRulerOptions | null
      /**
       * If set, render this decoration in the minimap.
       */
      minimap?: IModelDecorationMinimapOptions | null
      /**
       * If set, the decoration will be rendered in the glyph margin with this CSS class name.
       */
      glyphMarginClassName?: string | null
      /**
       * If set, the decoration will be rendered in the lines decorations with this CSS class name.
       */
      linesDecorationsClassName?: string | null
      /**
       * If set, the decoration will be rendered in the lines decorations with this CSS class name, but only for the first line in case of line wrapping.
       */
      firstLineDecorationClassName?: string | null
      /**
       * If set, the decoration will be rendered in the margin (covering its full width) with this CSS class name.
       */
      marginClassName?: string | null
      /**
       * If set, the decoration will be rendered inline with the text with this CSS class name.
       * Please use this only for CSS rules that must impact the text. For example, use `className`
       * to have a background color decoration.
       */
      inlineClassName?: string | null
      /**
       * If there is an `inlineClassName` which affects letter spacing.
       */
      inlineClassNameAffectsLetterSpacing?: boolean
      /**
       * If set, the decoration will be rendered before the text with this CSS class name.
       */
      beforeContentClassName?: string | null
      /**
       * If set, the decoration will be rendered after the text with this CSS class name.
       */
      afterContentClassName?: string | null
    }

    /**
     * New model decorations.
     */
    export interface IModelDeltaDecoration {
      /**
       * Range that this decoration covers.
       */
      range: IRange
      /**
       * Options associated with this decoration.
       */
      options: IModelDecorationOptions
    }

    /**
     * A decoration in the model.
     */
    export interface IModelDecoration {
      /**
       * Identifier for a decoration.
       */
      readonly id: string
      /**
       * Identifier for a decoration's owner.
       */
      readonly ownerId: number
      /**
       * Range that this decoration covers.
       */
      readonly range: Range
      /**
       * Options associated with this decoration.
       */
      readonly options: IModelDecorationOptions
    }

    /**
     * Word inside a model.
     */
    export interface IWordAtPosition {
      /**
       * The word.
       */
      readonly word: string
      /**
       * The column where the word starts.
       */
      readonly startColumn: number
      /**
       * The column where the word ends.
       */
      readonly endColumn: number
    }

    /**
     * End of line character preference.
     */
    export enum EndOfLinePreference {
      /**
       * Use the end of line character identified in the text buffer.
       */
      TextDefined = 0,
      /**
       * Use line feed (\n) as the end of line character.
       */
      LF = 1,
      /**
       * Use carriage return and line feed (\r\n) as the end of line character.
       */
      CRLF = 2,
    }

    /**
     * The default end of line to use when instantiating models.
     */
    export enum DefaultEndOfLine {
      /**
       * Use line feed (\n) as the end of line character.
       */
      LF = 1,
      /**
       * Use carriage return and line feed (\r\n) as the end of line character.
       */
      CRLF = 2,
    }

    /**
     * End of line character preference.
     */
    export enum EndOfLineSequence {
      /**
       * Use line feed (\n) as the end of line character.
       */
      LF = 0,
      /**
       * Use carriage return and line feed (\r\n) as the end of line character.
       */
      CRLF = 1,
    }

    /**
     * A single edit operation, that acts as a simple replace.
     * i.e. Replace text at `range` with `text` in model.
     */
    export interface ISingleEditOperation {
      /**
       * The range to replace. This can be empty to emulate a simple insert.
       */
      range: IRange
      /**
       * The text to replace with. This can be null to emulate a simple delete.
       */
      text: string | null
      /**
       * This indicates that this operation has "insert" semantics.
       * i.e. forceMoveMarkers = true => if `range` is collapsed, all markers at the position will be moved.
       */
      forceMoveMarkers?: boolean
    }

    /**
     * A single edit operation, that has an identifier.
     */
    export interface IIdentifiedSingleEditOperation {
      /**
       * The range to replace. This can be empty to emulate a simple insert.
       */
      range: IRange
      /**
       * The text to replace with. This can be null to emulate a simple delete.
       */
      text: string | null
      /**
       * This indicates that this operation has "insert" semantics.
       * i.e. forceMoveMarkers = true => if `range` is collapsed, all markers at the position will be moved.
       */
      forceMoveMarkers?: boolean
    }

    export interface IValidEditOperation {
      /**
       * The range to replace. This can be empty to emulate a simple insert.
       */
      range: Range
      /**
       * The text to replace with. This can be empty to emulate a simple delete.
       */
      text: string
    }

    /**
     * A callback that can compute the cursor state after applying a series of edit operations.
     */
    export interface ICursorStateComputer {
      /**
       * A callback that can compute the resulting cursors state after some edit operations have been executed.
       */
      (inverseEditOperations: IValidEditOperation[]):
        | Selection[]
        | null
    }

    export class TextModelResolvedOptions {
      _textModelResolvedOptionsBrand: void
      readonly tabSize: number
      readonly indentSize: number
      readonly insertSpaces: boolean
      readonly defaultEOL: DefaultEndOfLine
      readonly trimAutoWhitespace: boolean
    }

    export interface ITextModelUpdateOptions {
      tabSize?: number
      indentSize?: number
      insertSpaces?: boolean
      trimAutoWhitespace?: boolean
    }

    export class FindMatch {
      _findMatchBrand: void
      readonly range: Range
      readonly matches: string[] | null
    }

    /**
     * Describes the behavior of decorations when typing/editing near their edges.
     * Note: Please do not edit the values, as they very carefully match `DecorationRangeBehavior`
     */
    export enum TrackedRangeStickiness {
      AlwaysGrowsWhenTypingAtEdges = 0,
      NeverGrowsWhenTypingAtEdges = 1,
      GrowsOnlyWhenTypingBefore = 2,
      GrowsOnlyWhenTypingAfter = 3,
    }

    /**
     * A model.
     */
    export interface ITextModel {
      /**
       * Gets the resource associated with this editor model.
       */
      readonly uri: Uri
      /**
       * A unique identifier associated with this model.
       */
      readonly id: string
      /**
       * Get the resolved options for this model.
       */
      getOptions(): TextModelResolvedOptions
      /**
       * Get the current version id of the model.
       * Anytime a change happens to the model (even undo/redo),
       * the version id is incremented.
       */
      getVersionId(): number
      /**
       * Get the alternative version id of the model.
       * This alternative version id is not always incremented,
       * it will return the same values in the case of undo-redo.
       */
      getAlternativeVersionId(): number
      /**
       * Replace the entire text buffer value contained in this model.
       */
      setValue(newValue: string): void
      /**
       * Get the text stored in this model.
       * @param eol The end of line character preference. Defaults to `EndOfLinePreference.TextDefined`.
       * @param preserverBOM Preserve a BOM character if it was detected when the model was constructed.
       * @return The text.
       */
      getValue(
        eol?: EndOfLinePreference,
        preserveBOM?: boolean
      ): string
      /**
       * Get the length of the text stored in this model.
       */
      getValueLength(
        eol?: EndOfLinePreference,
        preserveBOM?: boolean
      ): number
      /**
       * Get the text in a certain range.
       * @param range The range describing what text to get.
       * @param eol The end of line character preference. This will only be used for multiline ranges. Defaults to `EndOfLinePreference.TextDefined`.
       * @return The text.
       */
      getValueInRange(
        range: IRange,
        eol?: EndOfLinePreference
      ): string
      /**
       * Get the length of text in a certain range.
       * @param range The range describing what text length to get.
       * @return The text length.
       */
      getValueLengthInRange(range: IRange): number
      /**
       * Get the character count of text in a certain range.
       * @param range The range describing what text length to get.
       */
      getCharacterCountInRange(range: IRange): number
      /**
       * Get the number of lines in the model.
       */
      getLineCount(): number
      /**
       * Get the text for a certain line.
       */
      getLineContent(lineNumber: number): string
      /**
       * Get the text length for a certain line.
       */
      getLineLength(lineNumber: number): number
      /**
       * Get the text for all lines.
       */
      getLinesContent(): string[]
      /**
       * Get the end of line sequence predominantly used in the text buffer.
       * @return EOL char sequence (e.g.: '\n' or '\r\n').
       */
      getEOL(): string
      /**
       * Get the end of line sequence predominantly used in the text buffer.
       */
      getEndOfLineSequence(): EndOfLineSequence
      /**
       * Get the minimum legal column for line at `lineNumber`
       */
      getLineMinColumn(lineNumber: number): number
      /**
       * Get the maximum legal column for line at `lineNumber`
       */
      getLineMaxColumn(lineNumber: number): number
      /**
       * Returns the column before the first non whitespace character for line at `lineNumber`.
       * Returns 0 if line is empty or contains only whitespace.
       */
      getLineFirstNonWhitespaceColumn(
        lineNumber: number
      ): number
      /**
       * Returns the column after the last non whitespace character for line at `lineNumber`.
       * Returns 0 if line is empty or contains only whitespace.
       */
      getLineLastNonWhitespaceColumn(
        lineNumber: number
      ): number
      /**
       * Create a valid position,
       */
      validatePosition(position: IPosition): Position
      /**
       * Advances the given position by the given offset (negative offsets are also accepted)
       * and returns it as a new valid position.
       *
       * If the offset and position are such that their combination goes beyond the beginning or
       * end of the model, throws an exception.
       *
       * If the offset is such that the new position would be in the middle of a multi-byte
       * line terminator, throws an exception.
       */
      modifyPosition(
        position: IPosition,
        offset: number
      ): Position
      /**
       * Create a valid range.
       */
      validateRange(range: IRange): Range
      /**
       * Converts the position to a zero-based offset.
       *
       * The position will be [adjusted](#TextDocument.validatePosition).
       *
       * @param position A position.
       * @return A valid zero-based offset.
       */
      getOffsetAt(position: IPosition): number
      /**
       * Converts a zero-based offset to a position.
       *
       * @param offset A zero-based offset.
       * @return A valid [position](#Position).
       */
      getPositionAt(offset: number): Position
      /**
       * Get a range covering the entire model
       */
      getFullModelRange(): Range
      /**
       * Returns if the model was disposed or not.
       */
      isDisposed(): boolean
      /**
       * Search the model.
       * @param searchString The string used to search. If it is a regular expression, set `isRegex` to true.
       * @param searchOnlyEditableRange Limit the searching to only search inside the editable range of the model.
       * @param isRegex Used to indicate that `searchString` is a regular expression.
       * @param matchCase Force the matching to match lower/upper case exactly.
       * @param wordSeparators Force the matching to match entire words only. Pass null otherwise.
       * @param captureMatches The result will contain the captured groups.
       * @param limitResultCount Limit the number of results
       * @return The ranges where the matches are. It is empty if not matches have been found.
       */
      findMatches(
        searchString: string,
        searchOnlyEditableRange: boolean,
        isRegex: boolean,
        matchCase: boolean,
        wordSeparators: string | null,
        captureMatches: boolean,
        limitResultCount?: number
      ): FindMatch[]
      /**
       * Search the model.
       * @param searchString The string used to search. If it is a regular expression, set `isRegex` to true.
       * @param searchScope Limit the searching to only search inside these ranges.
       * @param isRegex Used to indicate that `searchString` is a regular expression.
       * @param matchCase Force the matching to match lower/upper case exactly.
       * @param wordSeparators Force the matching to match entire words only. Pass null otherwise.
       * @param captureMatches The result will contain the captured groups.
       * @param limitResultCount Limit the number of results
       * @return The ranges where the matches are. It is empty if no matches have been found.
       */
      findMatches(
        searchString: string,
        searchScope: IRange | IRange[],
        isRegex: boolean,
        matchCase: boolean,
        wordSeparators: string | null,
        captureMatches: boolean,
        limitResultCount?: number
      ): FindMatch[]
      /**
       * Search the model for the next match. Loops to the beginning of the model if needed.
       * @param searchString The string used to search. If it is a regular expression, set `isRegex` to true.
       * @param searchStart Start the searching at the specified position.
       * @param isRegex Used to indicate that `searchString` is a regular expression.
       * @param matchCase Force the matching to match lower/upper case exactly.
       * @param wordSeparators Force the matching to match entire words only. Pass null otherwise.
       * @param captureMatches The result will contain the captured groups.
       * @return The range where the next match is. It is null if no next match has been found.
       */
      findNextMatch(
        searchString: string,
        searchStart: IPosition,
        isRegex: boolean,
        matchCase: boolean,
        wordSeparators: string | null,
        captureMatches: boolean
      ): FindMatch | null
      /**
       * Search the model for the previous match. Loops to the end of the model if needed.
       * @param searchString The string used to search. If it is a regular expression, set `isRegex` to true.
       * @param searchStart Start the searching at the specified position.
       * @param isRegex Used to indicate that `searchString` is a regular expression.
       * @param matchCase Force the matching to match lower/upper case exactly.
       * @param wordSeparators Force the matching to match entire words only. Pass null otherwise.
       * @param captureMatches The result will contain the captured groups.
       * @return The range where the previous match is. It is null if no previous match has been found.
       */
      findPreviousMatch(
        searchString: string,
        searchStart: IPosition,
        isRegex: boolean,
        matchCase: boolean,
        wordSeparators: string | null,
        captureMatches: boolean
      ): FindMatch | null
      /**
       * Get the language associated with this model.
       */
      getModeId(): string
      /**
       * Get the word under or besides `position`.
       * @param position The position to look for a word.
       * @return The word under or besides `position`. Might be null.
       */
      getWordAtPosition(
        position: IPosition
      ): IWordAtPosition | null
      /**
       * Get the word under or besides `position` trimmed to `position`.column
       * @param position The position to look for a word.
       * @return The word under or besides `position`. Will never be null.
       */
      getWordUntilPosition(
        position: IPosition
      ): IWordAtPosition
      /**
       * Perform a minimum amount of operations, in order to transform the decorations
       * identified by `oldDecorations` to the decorations described by `newDecorations`
       * and returns the new identifiers associated with the resulting decorations.
       *
       * @param oldDecorations Array containing previous decorations identifiers.
       * @param newDecorations Array describing what decorations should result after the call.
       * @param ownerId Identifies the editor id in which these decorations should appear. If no `ownerId` is provided, the decorations will appear in all editors that attach this model.
       * @return An array containing the new decorations identifiers.
       */
      deltaDecorations(
        oldDecorations: string[],
        newDecorations: IModelDeltaDecoration[],
        ownerId?: number
      ): string[]
      /**
       * Get the options associated with a decoration.
       * @param id The decoration id.
       * @return The decoration options or null if the decoration was not found.
       */
      getDecorationOptions(
        id: string
      ): IModelDecorationOptions | null
      /**
       * Get the range associated with a decoration.
       * @param id The decoration id.
       * @return The decoration range or null if the decoration was not found.
       */
      getDecorationRange(id: string): Range | null
      /**
       * Gets all the decorations for the line `lineNumber` as an array.
       * @param lineNumber The line number
       * @param ownerId If set, it will ignore decorations belonging to other owners.
       * @param filterOutValidation If set, it will ignore decorations specific to validation (i.e. warnings, errors).
       * @return An array with the decorations
       */
      getLineDecorations(
        lineNumber: number,
        ownerId?: number,
        filterOutValidation?: boolean
      ): IModelDecoration[]
      /**
       * Gets all the decorations for the lines between `startLineNumber` and `endLineNumber` as an array.
       * @param startLineNumber The start line number
       * @param endLineNumber The end line number
       * @param ownerId If set, it will ignore decorations belonging to other owners.
       * @param filterOutValidation If set, it will ignore decorations specific to validation (i.e. warnings, errors).
       * @return An array with the decorations
       */
      getLinesDecorations(
        startLineNumber: number,
        endLineNumber: number,
        ownerId?: number,
        filterOutValidation?: boolean
      ): IModelDecoration[]
      /**
       * Gets all the decorations in a range as an array. Only `startLineNumber` and `endLineNumber` from `range` are used for filtering.
       * So for now it returns all the decorations on the same line as `range`.
       * @param range The range to search in
       * @param ownerId If set, it will ignore decorations belonging to other owners.
       * @param filterOutValidation If set, it will ignore decorations specific to validation (i.e. warnings, errors).
       * @return An array with the decorations
       */
      getDecorationsInRange(
        range: IRange,
        ownerId?: number,
        filterOutValidation?: boolean
      ): IModelDecoration[]
      /**
       * Gets all the decorations as an array.
       * @param ownerId If set, it will ignore decorations belonging to other owners.
       * @param filterOutValidation If set, it will ignore decorations specific to validation (i.e. warnings, errors).
       */
      getAllDecorations(
        ownerId?: number,
        filterOutValidation?: boolean
      ): IModelDecoration[]
      /**
       * Gets all the decorations that should be rendered in the overview ruler as an array.
       * @param ownerId If set, it will ignore decorations belonging to other owners.
       * @param filterOutValidation If set, it will ignore decorations specific to validation (i.e. warnings, errors).
       */
      getOverviewRulerDecorations(
        ownerId?: number,
        filterOutValidation?: boolean
      ): IModelDecoration[]
      /**
       * Normalize a string containing whitespace according to indentation rules (converts to spaces or to tabs).
       */
      normalizeIndentation(str: string): string
      /**
       * Change the options of this model.
       */
      updateOptions(newOpts: ITextModelUpdateOptions): void
      /**
       * Detect the indentation options for this model from its content.
       */
      detectIndentation(
        defaultInsertSpaces: boolean,
        defaultTabSize: number
      ): void
      /**
       * Close the current undo-redo any.
       * This offers a way to create an undo/redo stop point.
       */
      pushStackElement(): void
      /**
       * Open the current undo-redo any.
       * This offers a way to remove the current undo/redo stop point.
       */
      popStackElement(): void
      /**
       * Push edit operations, basically editing the model. This is the preferred way
       * of editing the model. The edit operations will land on the undo stack.
       * @param beforeCursorState The cursor state before the edit operations. This cursor state will be returned when `undo` or `redo` are invoked.
       * @param editOperations The edit operations.
       * @param cursorStateComputer A callback that can compute the resulting cursors state after the edit operations have been executed.
       * @return The cursor state returned by the `cursorStateComputer`.
       */
      pushEditOperations(
        beforeCursorState: Selection[] | null,
        editOperations: IIdentifiedSingleEditOperation[],
        cursorStateComputer: ICursorStateComputer
      ): Selection[] | null
      /**
       * Change the end of line sequence. This is the preferred way of
       * changing the eol sequence. This will land on the undo stack.
       */
      pushEOL(eol: EndOfLineSequence): void
      /**
       * Edit the model without adding the edits to the undo stack.
       * This can have dire consequences on the undo stack! See @pushEditOperations for the preferred way.
       * @param operations The edit operations.
       * @return If desired, the inverse edit operations, that, when applied, will bring the model back to the previous state.
       */
      applyEdits(
        operations: IIdentifiedSingleEditOperation[]
      ): void
      applyEdits(
        operations: IIdentifiedSingleEditOperation[],
        computeUndoEdits: false
      ): void
      applyEdits(
        operations: IIdentifiedSingleEditOperation[],
        computeUndoEdits: true
      ): IValidEditOperation[]
      /**
       * Change the end of line sequence without recording in the undo stack.
       * This can have dire consequences on the undo stack! See @pushEOL for the preferred way.
       */
      setEOL(eol: EndOfLineSequence): void
      /**
       * An event emitted when the contents of the model have changed.
       * @event
       */
      onDidChangeContent(
        listener: (e: IModelContentChangedEvent) => void
      ): IDisposable
      /**
       * An event emitted when decorations of the model have changed.
       * @event
       */
      onDidChangeDecorations(
        listener: (e: IModelDecorationsChangedEvent) => void
      ): IDisposable
      /**
       * An event emitted when the model options have changed.
       * @event
       */
      onDidChangeOptions(
        listener: (e: IModelOptionsChangedEvent) => void
      ): IDisposable
      /**
       * An event emitted when the language associated with the model has changed.
       * @event
       */
      onDidChangeLanguage(
        listener: (e: IModelLanguageChangedEvent) => void
      ): IDisposable
      /**
       * An event emitted when the language configuration associated with the model has changed.
       * @event
       */
      onDidChangeLanguageConfiguration(
        listener: (
          e: IModelLanguageConfigurationChangedEvent
        ) => void
      ): IDisposable
      /**
       * An event emitted when the model has been attached to the first editor or detached from the last editor.
       * @event
       */
      onDidChangeAttached(listener: () => void): IDisposable
      /**
       * An event emitted right before disposing the model.
       * @event
       */
      onWillDispose(listener: () => void): IDisposable
      /**
       * Destroy this model. This will unbind the model from the mode
       * and make all necessary clean-up to release this object to the GC.
       */
      dispose(): void
      /**
       * Returns if this model is attached to an editor or not.
       */
      isAttachedToEditor(): boolean
    }

    /**
     * A builder and helper for edit operations for a command.
     */
    export interface IEditOperationBuilder {
      /**
       * Add a new edit operation (a replace operation).
       * @param range The range to replace (delete). May be empty to represent a simple insert.
       * @param text The text to replace with. May be null to represent a simple delete.
       */
      addEditOperation(
        range: IRange,
        text: string | null,
        forceMoveMarkers?: boolean
      ): void
      /**
       * Add a new edit operation (a replace operation).
       * The inverse edits will be accessible in `ICursorStateComputerData.getInverseEditOperations()`
       * @param range The range to replace (delete). May be empty to represent a simple insert.
       * @param text The text to replace with. May be null to represent a simple delete.
       */
      addTrackedEditOperation(
        range: IRange,
        text: string | null,
        forceMoveMarkers?: boolean
      ): void
      /**
       * Track `selection` when applying edit operations.
       * A best effort will be made to not grow/expand the selection.
       * An empty selection will clamp to a nearby character.
       * @param selection The selection to track.
       * @param trackPreviousOnEmpty If set, and the selection is empty, indicates whether the selection
       *           should clamp to the previous or the next character.
       * @return A unique identifier.
       */
      trackSelection(
        selection: Selection,
        trackPreviousOnEmpty?: boolean
      ): string
    }

    /**
     * A helper for computing cursor state after a command.
     */
    export interface ICursorStateComputerData {
      /**
       * Get the inverse edit operations of the added edit operations.
       */
      getInverseEditOperations(): IValidEditOperation[]
      /**
       * Get a previously tracked selection.
       * @param id The unique identifier returned by `trackSelection`.
       * @return The selection.
       */
      getTrackedSelection(id: string): Selection
    }

    /**
     * A command that modifies text / cursor state on a model.
     */
    export interface ICommand {
      /**
       * Get the edit operations needed to execute this command.
       * @param model The model the command will execute on.
       * @param builder A helper to collect the needed edit operations and to track selections.
       */
      getEditOperations(
        model: ITextModel,
        builder: IEditOperationBuilder
      ): void
      /**
       * Compute the cursor state after the edit operations were applied.
       * @param model The model the command has executed on.
       * @param helper A helper to get inverse edit operations and to get previously tracked selections.
       * @return The cursor state after the command executed.
       */
      computeCursorState(
        model: ITextModel,
        helper: ICursorStateComputerData
      ): Selection
    }

    /**
     * A model for the diff editor.
     */
    export interface IDiffEditorModel {
      /**
       * Original model.
       */
      original: ITextModel
      /**
       * Modified model.
       */
      modified: ITextModel
    }

    /**
     * An event describing that an editor has had its model reset (i.e. `editor.setModel()`).
     */
    export interface IModelChangedEvent {
      /**
       * The `uri` of the previous model or null.
       */
      readonly oldModelUrl: Uri | null
      /**
       * The `uri` of the new model or null.
       */
      readonly newModelUrl: Uri | null
    }

    export interface IDimension {
      width: number
      height: number
    }

    /**
     * A change
     */
    export interface IChange {
      readonly originalStartLineNumber: number
      readonly originalEndLineNumber: number
      readonly modifiedStartLineNumber: number
      readonly modifiedEndLineNumber: number
    }

    /**
     * A character level change.
     */
    export interface ICharChange extends IChange {
      readonly originalStartColumn: number
      readonly originalEndColumn: number
      readonly modifiedStartColumn: number
      readonly modifiedEndColumn: number
    }

    /**
     * A line change
     */
    export interface ILineChange extends IChange {
      readonly charChanges: ICharChange[] | undefined
    }

    export interface IContentSizeChangedEvent {
      readonly contentWidth: number
      readonly contentHeight: number
      readonly contentWidthChanged: boolean
      readonly contentHeightChanged: boolean
    }

    export interface INewScrollPosition {
      scrollLeft?: number
      scrollTop?: number
    }

    export interface IEditorAction {
      readonly id: string
      readonly label: string
      readonly alias: string
      isSupported(): boolean
      run(): Promise<void>
    }

    export type IEditorModel = ITextModel | IDiffEditorModel

    /**
     * A (serializable) state of the cursors.
     */
    export interface ICursorState {
      inSelectionMode: boolean
      selectionStart: IPosition
      position: IPosition
    }

    /**
     * A (serializable) state of the view.
     */
    export interface IViewState {
      /** written by previous versions */
      scrollTop?: number
      /** written by previous versions */
      scrollTopWithoutViewZones?: number
      scrollLeft: number
      firstPosition: IPosition
      firstPositionDeltaTop: number
    }

    /**
     * A (serializable) state of the code editor.
     */
    export interface ICodeEditorViewState {
      cursorState: ICursorState[]
      viewState: IViewState
      contributionsState: {
        [id: string]: any
      }
    }

    /**
     * (Serializable) View state for the diff editor.
     */
    export interface IDiffEditorViewState {
      original: ICodeEditorViewState | null
      modified: ICodeEditorViewState | null
    }

    /**
     * An editor view state.
     */
    export type IEditorViewState =
      | ICodeEditorViewState
      | IDiffEditorViewState

    export enum ScrollType {
      Smooth = 0,
      Immediate = 1,
    }

    /**
     * An editor.
     */
    export interface IEditor {
      /**
       * An event emitted when the editor has been disposed.
       * @event
       */
      onDidDispose(listener: () => void): IDisposable
      /**
       * Dispose the editor.
       */
      dispose(): void
      /**
       * Get a unique id for this editor instance.
       */
      getId(): string
      /**
       * Get the editor type. Please see `EditorType`.
       * This is to avoid an instanceof check
       */
      getEditorType(): string
      /**
       * Update the editor's options after the editor has been created.
       */
      updateOptions(newOptions: IEditorOptions): void
      /**
       * Instructs the editor to remeasure its container. This method should
       * be called when the container of the editor gets resized.
       *
       * If a dimension is passed in, the passed in value will be used.
       */
      layout(dimension?: IDimension): void
      /**
       * Brings browser focus to the editor text
       */
      focus(): void
      /**
       * Returns true if the text inside this editor is focused (i.e. cursor is blinking).
       */
      hasTextFocus(): boolean
      /**
       * Returns all actions associated with this editor.
       */
      getSupportedActions(): IEditorAction[]
      /**
       * Saves current view state of the editor in a serializable object.
       */
      saveViewState(): IEditorViewState | null
      /**
       * Restores the view state of the editor from a serializable object generated by `saveViewState`.
       */
      restoreViewState(state: IEditorViewState): void
      /**
       * Given a position, returns a column number that takes tab-widths into account.
       */
      getVisibleColumnFromPosition(
        position: IPosition
      ): number
      /**
       * Returns the primary position of the cursor.
       */
      getPosition(): Position | null
      /**
       * Set the primary position of the cursor. This will remove any secondary cursors.
       * @param position New primary cursor's position
       */
      setPosition(position: IPosition): void
      /**
       * Scroll vertically as necessary and reveal a line.
       */
      revealLine(
        lineNumber: number,
        scrollType?: ScrollType
      ): void
      /**
       * Scroll vertically as necessary and reveal a line centered vertically.
       */
      revealLineInCenter(
        lineNumber: number,
        scrollType?: ScrollType
      ): void
      /**
       * Scroll vertically as necessary and reveal a line centered vertically only if it lies outside the viewport.
       */
      revealLineInCenterIfOutsideViewport(
        lineNumber: number,
        scrollType?: ScrollType
      ): void
      /**
       * Scroll vertically as necessary and reveal a line close to the top of the viewport,
       * optimized for viewing a code definition.
       */
      revealLineNearTop(
        lineNumber: number,
        scrollType?: ScrollType
      ): void
      /**
       * Scroll vertically or horizontally as necessary and reveal a position.
       */
      revealPosition(
        position: IPosition,
        scrollType?: ScrollType
      ): void
      /**
       * Scroll vertically or horizontally as necessary and reveal a position centered vertically.
       */
      revealPositionInCenter(
        position: IPosition,
        scrollType?: ScrollType
      ): void
      /**
       * Scroll vertically or horizontally as necessary and reveal a position centered vertically only if it lies outside the viewport.
       */
      revealPositionInCenterIfOutsideViewport(
        position: IPosition,
        scrollType?: ScrollType
      ): void
      /**
       * Scroll vertically or horizontally as necessary and reveal a position close to the top of the viewport,
       * optimized for viewing a code definition.
       */
      revealPositionNearTop(
        position: IPosition,
        scrollType?: ScrollType
      ): void
      /**
       * Returns the primary selection of the editor.
       */
      getSelection(): Selection | null
      /**
       * Returns all the selections of the editor.
       */
      getSelections(): Selection[] | null
      /**
       * Set the primary selection of the editor. This will remove any secondary cursors.
       * @param selection The new selection
       */
      setSelection(selection: IRange): void
      /**
       * Set the primary selection of the editor. This will remove any secondary cursors.
       * @param selection The new selection
       */
      setSelection(selection: Range): void
      /**
       * Set the primary selection of the editor. This will remove any secondary cursors.
       * @param selection The new selection
       */
      setSelection(selection: ISelection): void
      /**
       * Set the primary selection of the editor. This will remove any secondary cursors.
       * @param selection The new selection
       */
      setSelection(selection: Selection): void
      /**
       * Set the selections for all the cursors of the editor.
       * Cursors will be removed or added, as necessary.
       */
      setSelections(selections: readonly ISelection[]): void
      /**
       * Scroll vertically as necessary and reveal lines.
       */
      revealLines(
        startLineNumber: number,
        endLineNumber: number,
        scrollType?: ScrollType
      ): void
      /**
       * Scroll vertically as necessary and reveal lines centered vertically.
       */
      revealLinesInCenter(
        lineNumber: number,
        endLineNumber: number,
        scrollType?: ScrollType
      ): void
      /**
       * Scroll vertically as necessary and reveal lines centered vertically only if it lies outside the viewport.
       */
      revealLinesInCenterIfOutsideViewport(
        lineNumber: number,
        endLineNumber: number,
        scrollType?: ScrollType
      ): void
      /**
       * Scroll vertically as necessary and reveal lines close to the top of the viewport,
       * optimized for viewing a code definition.
       */
      revealLinesNearTop(
        lineNumber: number,
        endLineNumber: number,
        scrollType?: ScrollType
      ): void
      /**
       * Scroll vertically or horizontally as necessary and reveal a range.
       */
      revealRange(
        range: IRange,
        scrollType?: ScrollType
      ): void
      /**
       * Scroll vertically or horizontally as necessary and reveal a range centered vertically.
       */
      revealRangeInCenter(
        range: IRange,
        scrollType?: ScrollType
      ): void
      /**
       * Scroll vertically or horizontally as necessary and reveal a range at the top of the viewport.
       */
      revealRangeAtTop(
        range: IRange,
        scrollType?: ScrollType
      ): void
      /**
       * Scroll vertically or horizontally as necessary and reveal a range centered vertically only if it lies outside the viewport.
       */
      revealRangeInCenterIfOutsideViewport(
        range: IRange,
        scrollType?: ScrollType
      ): void
      /**
       * Scroll vertically or horizontally as necessary and reveal a range close to the top of the viewport,
       * optimized for viewing a code definition.
       */
      revealRangeNearTop(
        range: IRange,
        scrollType?: ScrollType
      ): void
      /**
       * Scroll vertically or horizontally as necessary and reveal a range close to the top of the viewport,
       * optimized for viewing a code definition. Only if it lies outside the viewport.
       */
      revealRangeNearTopIfOutsideViewport(
        range: IRange,
        scrollType?: ScrollType
      ): void
      /**
       * Directly trigger a handler or an editor action.
       * @param source The source of the call.
       * @param handlerId The id of the handler or the id of a contribution.
       * @param payload Extra data to be sent to the handler.
       */
      trigger(
        source: string | null | undefined,
        handlerId: string,
        payload: any
      ): void
      /**
       * Gets the current model attached to this editor.
       */
      getModel(): IEditorModel | null
      /**
       * Sets the current model attached to this editor.
       * If the previous model was created by the editor via the value key in the options
       * literal object, it will be destroyed. Otherwise, if the previous model was set
       * via setModel, or the model key in the options literal object, the previous model
       * will not be destroyed.
       * It is safe to call setModel(null) to simply detach the current model from the editor.
       */
      setModel(model: IEditorModel | null): void
    }

    /**
     * An editor contribution that gets created every time a new editor gets created and gets disposed when the editor gets disposed.
     */
    export interface IEditorContribution {
      /**
       * Dispose this contribution.
       */
      dispose(): void
      /**
       * Store view state.
       */
      saveViewState?(): any
      /**
       * Restore view state.
       */
      restoreViewState?(state: any): void
    }

    /**
     * The type of the `IEditor`.
     */
    export const EditorType: {
      ICodeEditor: string
      IDiffEditor: string
    }

    /**
     * An event describing that the current mode associated with a model has changed.
     */
    export interface IModelLanguageChangedEvent {
      /**
       * Previous language
       */
      readonly oldLanguage: string
      /**
       * New language
       */
      readonly newLanguage: string
    }

    /**
     * An event describing that the language configuration associated with a model has changed.
     */
    export interface IModelLanguageConfigurationChangedEvent { }

    export interface IModelContentChange {
      /**
       * The range that got replaced.
       */
      readonly range: IRange
      /**
       * The offset of the range that got replaced.
       */
      readonly rangeOffset: number
      /**
       * The length of the range that got replaced.
       */
      readonly rangeLength: number
      /**
       * The new text for the range.
       */
      readonly text: string
    }

    /**
     * An event describing a change in the text of a model.
     */
    export interface IModelContentChangedEvent {
      readonly changes: IModelContentChange[]
      /**
       * The (new) end-of-line character.
       */
      readonly eol: string
      /**
       * The new version id the model has transitioned to.
       */
      readonly versionId: number
      /**
       * Flag that indicates that this event was generated while undoing.
       */
      readonly isUndoing: boolean
      /**
       * Flag that indicates that this event was generated while redoing.
       */
      readonly isRedoing: boolean
      /**
       * Flag that indicates that all decorations were lost with this edit.
       * The model has been reset to a new value.
       */
      readonly isFlush: boolean
    }

    /**
     * An event describing that model decorations have changed.
     */
    export interface IModelDecorationsChangedEvent {
      readonly affectsMinimap: boolean
      readonly affectsOverviewRuler: boolean
    }

    export interface IModelOptionsChangedEvent {
      readonly tabSize: boolean
      readonly indentSize: boolean
      readonly insertSpaces: boolean
      readonly trimAutoWhitespace: boolean
    }

    /**
     * Describes the reason the cursor has changed its position.
     */
    export enum CursorChangeReason {
      /**
       * Unknown or not set.
       */
      NotSet = 0,
      /**
       * A `model.setValue()` was called.
       */
      ContentFlush = 1,
      /**
       * The `model` has been changed outside of this cursor and the cursor recovers its position from associated markers.
       */
      RecoverFromMarkers = 2,
      /**
       * There was an explicit user gesture.
       */
      Explicit = 3,
      /**
       * There was a Paste.
       */
      Paste = 4,
      /**
       * There was an Undo.
       */
      Undo = 5,
      /**
       * There was a Redo.
       */
      Redo = 6,
    }

    /**
     * An event describing that the cursor position has changed.
     */
    export interface ICursorPositionChangedEvent {
      /**
       * Primary cursor's position.
       */
      readonly position: Position
      /**
       * Secondary cursors' position.
       */
      readonly secondaryPositions: Position[]
      /**
       * Reason.
       */
      readonly reason: CursorChangeReason
      /**
       * Source of the call that caused the event.
       */
      readonly source: string
    }

    /**
     * An event describing that the cursor selection has changed.
     */
    export interface ICursorSelectionChangedEvent {
      /**
       * The primary selection.
       */
      readonly selection: Selection
      /**
       * The secondary selections.
       */
      readonly secondarySelections: Selection[]
      /**
       * The model version id.
       */
      readonly modelVersionId: number
      /**
       * The old selections.
       */
      readonly oldSelections: Selection[] | null
      /**
       * The model version id the that `oldSelections` refer to.
       */
      readonly oldModelVersionId: number
      /**
       * Source of the call that caused the event.
       */
      readonly source: string
      /**
       * Reason.
       */
      readonly reason: CursorChangeReason
    }

    export enum AccessibilitySupport {
      /**
       * This should be the browser case where it is not known if a screen reader is attached or no.
       */
      Unknown = 0,
      Disabled = 1,
      Enabled = 2,
    }

    /**
     * Configuration options for auto closing quotes and brackets
     */
    export type EditorAutoClosingStrategy =
      | "always"
      | "languageDefined"
      | "beforeWhitespace"
      | "never"

    /**
     * Configuration options for auto wrapping quotes and brackets
     */
    export type EditorAutoSurroundStrategy =
      | "languageDefined"
      | "quotes"
      | "brackets"
      | "never"

    /**
     * Configuration options for typing over closing quotes or brackets
     */
    export type EditorAutoClosingEditStrategy =
      | "always"
      | "auto"
      | "never"

    /**
     * Configuration options for auto indentation in the editor
     */
    export enum EditorAutoIndentStrategy {
      None = 0,
      Keep = 1,
      Brackets = 2,
      Advanced = 3,
      Full = 4,
    }

    /**
     * Configuration options for the editor.
     */
    export interface IEditorOptions {
      /**
       * This editor is used inside a diff editor.
       */
      inDiffEditor?: boolean
      /**
       * The aria label for the editor's textarea (when it is focused).
       */
      ariaLabel?: string
      /**
       * The `tabindex` property of the editor's textarea
       */
      tabIndex?: number
      /**
       * Render vertical lines at the specified columns.
       * Defaults to empty array.
       */
      rulers?: (number | IRulerOption)[]
      /**
       * A string containing the word separators used when doing word navigation.
       * Defaults to `~!@#$%^&*()-=+[{]}\\|;:\'",.<>/?
       */
      wordSeparators?: string
      /**
       * Enable Linux primary clipboard.
       * Defaults to true.
       */
      selectionClipboard?: boolean
      /**
       * Control the rendering of line numbers.
       * If it is a function, it will be invoked when rendering a line number and the return value will be rendered.
       * Otherwise, if it is a truey, line numbers will be rendered normally (equivalent of using an identity function).
       * Otherwise, line numbers will not be rendered.
       * Defaults to `on`.
       */
      lineNumbers?: LineNumbersType
      /**
       * Controls the minimal number of visible leading and trailing lines surrounding the cursor.
       * Defaults to 0.
       */
      cursorSurroundingLines?: number
      /**
       * Controls when `cursorSurroundingLines` should be enforced
       * Defaults to `default`, `cursorSurroundingLines` is not enforced when cursor position is changed
       * by mouse.
       */
      cursorSurroundingLinesStyle?: "default" | "all"
      /**
       * Render last line number when the file ends with a newline.
       * Defaults to true.
       */
      renderFinalNewline?: boolean
      /**
       * Remove unusual line terminators like LINE SEPARATOR (LS), PARAGRAPH SEPARATOR (PS).
       * Defaults to 'prompt'.
       */
      unusualLineTerminators?: "auto" | "off" | "prompt"
      /**
       * Should the corresponding line be selected when clicking on the line number?
       * Defaults to true.
       */
      selectOnLineNumbers?: boolean
      /**
       * Control the width of line numbers, by reserving horizontal space for rendering at least an amount of digits.
       * Defaults to 5.
       */
      lineNumbersMinChars?: number
      /**
       * Enable the rendering of the glyph margin.
       * Defaults to true in vscode and to false in monaco-editor.
       */
      glyphMargin?: boolean
      /**
       * The width reserved for line decorations (in px).
       * Line decorations are placed between line numbers and the editor content.
       * You can pass in a string in the format floating point followed by "ch". e.g. 1.3ch.
       * Defaults to 10.
       */
      lineDecorationsWidth?: number | string
      /**
       * When revealing the cursor, a virtual padding (px) is added to the cursor, turning it into a rectangle.
       * This virtual padding ensures that the cursor gets revealed before hitting the edge of the viewport.
       * Defaults to 30 (px).
       */
      revealHorizontalRightPadding?: number
      /**
       * Render the editor selection with rounded borders.
       * Defaults to true.
       */
      roundedSelection?: boolean
      /**
       * Class name to be added to the editor.
       */
      extraEditorClassName?: string
      /**
       * Should the editor be read only. See also `domReadOnly`.
       * Defaults to false.
       */
      readOnly?: boolean
      /**
       * Should the textarea used for input use the DOM `readonly` attribute.
       * Defaults to false.
       */
      domReadOnly?: boolean
      /**
       * Enable linked editing.
       * Defaults to false.
       */
      linkedEditing?: boolean
      /**
       * deprecated, use linkedEditing instead
       */
      renameOnType?: boolean
      /**
       * Should the editor render validation decorations.
       * Defaults to editable.
       */
      renderValidationDecorations?:
      | "editable"
      | "on"
      | "off"
      /**
       * Control the behavior and rendering of the scrollbars.
       */
      scrollbar?: IEditorScrollbarOptions
      /**
       * Control the behavior and rendering of the minimap.
       */
      minimap?: IEditorMinimapOptions
      /**
       * Control the behavior of the find widget.
       */
      find?: IEditorFindOptions
      /**
       * Display overflow widgets as `fixed`.
       * Defaults to `false`.
       */
      fixedOverflowWidgets?: boolean
      /**
       * The number of vertical lanes the overview ruler should render.
       * Defaults to 3.
       */
      overviewRulerLanes?: number
      /**
       * Controls if a border should be drawn around the overview ruler.
       * Defaults to `true`.
       */
      overviewRulerBorder?: boolean
      /**
       * Control the cursor animation style, possible values are 'blink', 'smooth', 'phase', 'expand' and 'solid'.
       * Defaults to 'blink'.
       */
      cursorBlinking?:
      | "blink"
      | "smooth"
      | "phase"
      | "expand"
      | "solid"
      /**
       * Zoom the font in the editor when using the mouse wheel in combination with holding Ctrl.
       * Defaults to false.
       */
      mouseWheelZoom?: boolean
      /**
       * Control the mouse pointer style, either 'text' or 'default' or 'copy'
       * Defaults to 'text'
       */
      mouseStyle?: "text" | "default" | "copy"
      /**
       * Enable smooth caret animation.
       * Defaults to false.
       */
      cursorSmoothCaretAnimation?: boolean
      /**
       * Control the cursor style, either 'block' or 'line'.
       * Defaults to 'line'.
       */
      cursorStyle?:
      | "line"
      | "block"
      | "underline"
      | "line-thin"
      | "block-outline"
      | "underline-thin"
      /**
       * Control the width of the cursor when cursorStyle is set to 'line'
       */
      cursorWidth?: number
      /**
       * Enable font ligatures.
       * Defaults to false.
       */
      fontLigatures?: boolean | string
      /**
       * Disable the use of `transform: translate3d(0px, 0px, 0px)` for the editor margin and lines layers.
       * The usage of `transform: translate3d(0px, 0px, 0px)` acts as a hint for browsers to create an extra layer.
       * Defaults to false.
       */
      disableLayerHinting?: boolean
      /**
       * Disable the optimizations for monospace fonts.
       * Defaults to false.
       */
      disableMonospaceOptimizations?: boolean
      /**
       * Should the cursor be hidden in the overview ruler.
       * Defaults to false.
       */
      hideCursorInOverviewRuler?: boolean
      /**
       * Enable that scrolling can go one screen size after the last line.
       * Defaults to true.
       */
      scrollBeyondLastLine?: boolean
      /**
       * Enable that scrolling can go beyond the last column by a number of columns.
       * Defaults to 5.
       */
      scrollBeyondLastColumn?: number
      /**
       * Enable that the editor animates scrolling to a position.
       * Defaults to false.
       */
      smoothScrolling?: boolean
      /**
       * Enable that the editor will install an interval to check if its container dom node size has changed.
       * Enabling this might have a severe performance impact.
       * Defaults to false.
       */
      automaticLayout?: boolean
      /**
       * Control the wrapping of the editor.
       * When `wordWrap` = "off", the lines will never wrap.
       * When `wordWrap` = "on", the lines will wrap at the viewport width.
       * When `wordWrap` = "wordWrapColumn", the lines will wrap at `wordWrapColumn`.
       * When `wordWrap` = "bounded", the lines will wrap at min(viewport width, wordWrapColumn).
       * Defaults to "off".
       */
      wordWrap?: "off" | "on" | "wordWrapColumn" | "bounded"
      /**
       * Override the `wordWrap` setting.
       */
      wordWrapOverride1?: "off" | "on" | "inherit"
      /**
       * Override the `wordWrapOverride1` setting.
       */
      wordWrapOverride2?: "off" | "on" | "inherit"
      /**
       * Control the wrapping of the editor.
       * When `wordWrap` = "off", the lines will never wrap.
       * When `wordWrap` = "on", the lines will wrap at the viewport width.
       * When `wordWrap` = "wordWrapColumn", the lines will wrap at `wordWrapColumn`.
       * When `wordWrap` = "bounded", the lines will wrap at min(viewport width, wordWrapColumn).
       * Defaults to 80.
       */
      wordWrapColumn?: number
      /**
       * Control indentation of wrapped lines. Can be: 'none', 'same', 'indent' or 'deepIndent'.
       * Defaults to 'same' in vscode and to 'none' in monaco-editor.
       */
      wrappingIndent?:
      | "none"
      | "same"
      | "indent"
      | "deepIndent"
      /**
       * Controls the wrapping strategy to use.
       * Defaults to 'simple'.
       */
      wrappingStrategy?: "simple" | "advanced"
      /**
       * Configure word wrapping characters. A break will be introduced before these characters.
       * Defaults to '([{‘"〈《「『【〔（［｛｢£¥＄￡￥+＋'.
       */
      wordWrapBreakBeforeCharacters?: string
      /**
       * Configure word wrapping characters. A break will be introduced after these characters.
       * Defaults to ' \t})]?|/&.,;¢°′″‰℃、。｡､￠，．：；？！％・･ゝゞヽヾーァィゥェォッャュョヮヵヶぁぃぅぇぉっゃゅょゎゕゖㇰㇱㇲㇳㇴㇵㇶㇷㇸㇹㇺㇻㇼㇽㇾㇿ々〻ｧｨｩｪｫｬｭｮｯｰ"〉》」』】〕）］｝｣'.
       */
      wordWrapBreakAfterCharacters?: string
      /**
       * Performance guard: Stop rendering a line after x characters.
       * Defaults to 10000.
       * Use -1 to never stop rendering
       */
      stopRenderingLineAfter?: number
      /**
       * Configure the editor's hover.
       */
      hover?: IEditorHoverOptions
      /**
       * Enable detecting links and making them clickable.
       * Defaults to true.
       */
      links?: boolean
      /**
       * Enable inline color decorators and color picker rendering.
       */
      colorDecorators?: boolean
      /**
       * Control the behaviour of comments in the editor.
       */
      comments?: IEditorCommentsOptions
      /**
       * Enable custom contextmenu.
       * Defaults to true.
       */
      contextmenu?: boolean
      /**
       * A multiplier to be used on the `deltaX` and `deltaY` of mouse wheel scroll events.
       * Defaults to 1.
       */
      mouseWheelScrollSensitivity?: number
      /**
       * FastScrolling mulitplier speed when pressing `Alt`
       * Defaults to 5.
       */
      fastScrollSensitivity?: number
      /**
       * Enable that the editor scrolls only the predominant axis. Prevents horizontal drift when scrolling vertically on a trackpad.
       * Defaults to true.
       */
      scrollPredominantAxis?: boolean
      /**
       * Enable that the selection with the mouse and keys is doing column selection.
       * Defaults to false.
       */
      columnSelection?: boolean
      /**
       * The modifier to be used to add multiple cursors with the mouse.
       * Defaults to 'alt'
       */
      multiCursorModifier?: "ctrlCmd" | "alt"
      /**
       * Merge overlapping selections.
       * Defaults to true
       */
      multiCursorMergeOverlapping?: boolean
      /**
       * Configure the behaviour when pasting a text with the line count equal to the cursor count.
       * Defaults to 'spread'.
       */
      multiCursorPaste?: "spread" | "full"
      /**
       * Configure the editor's accessibility support.
       * Defaults to 'auto'. It is best to leave this to 'auto'.
       */
      accessibilitySupport?: "auto" | "off" | "on"
      /**
       * Controls the number of lines in the editor that can be read out by a screen reader
       */
      accessibilityPageSize?: number
      /**
       * Suggest options.
       */
      suggest?: ISuggestOptions
      inlineSuggest?: IInlineSuggestOptions
      /**
       * Smart select options.
       */
      smartSelect?: ISmartSelectOptions
      /**
       *
       */
      gotoLocation?: IGotoLocationOptions
      /**
       * Enable quick suggestions (shadow suggestions)
       * Defaults to true.
       */
      quickSuggestions?: boolean | IQuickSuggestionsOptions
      /**
       * Quick suggestions show delay (in ms)
       * Defaults to 10 (ms)
       */
      quickSuggestionsDelay?: number
      /**
       * Controls the spacing around the editor.
       */
      padding?: IEditorPaddingOptions
      /**
       * Parameter hint options.
       */
      parameterHints?: IEditorParameterHintOptions
      /**
       * Options for auto closing brackets.
       * Defaults to language defined behavior.
       */
      autoClosingBrackets?: EditorAutoClosingStrategy
      /**
       * Options for auto closing quotes.
       * Defaults to language defined behavior.
       */
      autoClosingQuotes?: EditorAutoClosingStrategy
      /**
       * Options for pressing backspace near quotes or bracket pairs.
       */
      autoClosingDelete?: EditorAutoClosingEditStrategy
      /**
       * Options for typing over closing quotes or brackets.
       */
      autoClosingOvertype?: EditorAutoClosingEditStrategy
      /**
       * Options for auto surrounding.
       * Defaults to always allowing auto surrounding.
       */
      autoSurround?: EditorAutoSurroundStrategy
      /**
       * Controls whether the editor should automatically adjust the indentation when users type, paste, move or indent lines.
       * Defaults to advanced.
       */
      autoIndent?:
      | "none"
      | "keep"
      | "brackets"
      | "advanced"
      | "full"
      /**
       * Emulate selection behaviour of tab characters when using spaces for indentation.
       * This means selection will stick to tab stops.
       */
      stickyTabStops?: boolean
      /**
       * Enable format on type.
       * Defaults to false.
       */
      formatOnType?: boolean
      /**
       * Enable format on paste.
       * Defaults to false.
       */
      formatOnPaste?: boolean
      /**
       * Controls if the editor should allow to move selections via drag and drop.
       * Defaults to false.
       */
      dragAndDrop?: boolean
      /**
       * Enable the suggestion box to pop-up on trigger characters.
       * Defaults to true.
       */
      suggestOnTriggerCharacters?: boolean
      /**
       * Accept suggestions on ENTER.
       * Defaults to 'on'.
       */
      acceptSuggestionOnEnter?: "on" | "smart" | "off"
      /**
       * Accept suggestions on provider defined characters.
       * Defaults to true.
       */
      acceptSuggestionOnCommitCharacter?: boolean
      /**
       * Enable snippet suggestions. Default to 'true'.
       */
      snippetSuggestions?:
      | "top"
      | "bottom"
      | "inline"
      | "none"
      /**
       * Copying without a selection copies the current line.
       */
      emptySelectionClipboard?: boolean
      /**
       * Syntax highlighting is copied.
       */
      copyWithSyntaxHighlighting?: boolean
      /**
       * The history mode for suggestions.
       */
      suggestSelection?:
      | "first"
      | "recentlyUsed"
      | "recentlyUsedByPrefix"
      /**
       * The font size for the suggest widget.
       * Defaults to the editor font size.
       */
      suggestFontSize?: number
      /**
       * The line height for the suggest widget.
       * Defaults to the editor line height.
       */
      suggestLineHeight?: number
      /**
       * Enable tab completion.
       */
      tabCompletion?: "on" | "off" | "onlySnippets"
      /**
       * Enable selection highlight.
       * Defaults to true.
       */
      selectionHighlight?: boolean
      /**
       * Enable semantic occurrences highlight.
       * Defaults to true.
       */
      occurrencesHighlight?: boolean
      /**
       * Show code lens
       * Defaults to true.
       */
      codeLens?: boolean
      /**
       * Code lens font family. Defaults to editor font family.
       */
      codeLensFontFamily?: string
      /**
       * Code lens font size. Default to 90% of the editor font size
       */
      codeLensFontSize?: number
      /**
       * Control the behavior and rendering of the code action lightbulb.
       */
      lightbulb?: IEditorLightbulbOptions
      /**
       * Timeout for running code actions on save.
       */
      codeActionsOnSaveTimeout?: number
      /**
       * Enable code folding.
       * Defaults to true.
       */
      folding?: boolean
      /**
       * Selects the folding strategy. 'auto' uses the strategies contributed for the current document, 'indentation' uses the indentation based folding strategy.
       * Defaults to 'auto'.
       */
      foldingStrategy?: "auto" | "indentation"
      /**
       * Enable highlight for folded regions.
       * Defaults to true.
       */
      foldingHighlight?: boolean
      /**
       * Controls whether the fold actions in the gutter stay always visible or hide unless the mouse is over the gutter.
       * Defaults to 'mouseover'.
       */
      showFoldingControls?: "always" | "mouseover"
      /**
       * Controls whether clicking on the empty content after a folded line will unfold the line.
       * Defaults to false.
       */
      unfoldOnClickAfterEndOfLine?: boolean
      /**
       * Enable highlighting of matching brackets.
       * Defaults to 'always'.
       */
      matchBrackets?: "never" | "near" | "always"
      /**
       * Enable rendering of whitespace.
       * Defaults to none.
       */
      renderWhitespace?:
      | "none"
      | "boundary"
      | "selection"
      | "trailing"
      | "all"
      /**
       * Enable rendering of control characters.
       * Defaults to false.
       */
      renderControlCharacters?: boolean
      /**
       * Enable rendering of indent guides.
       * Defaults to true.
       */
      renderIndentGuides?: boolean
      /**
       * Enable highlighting of the active indent guide.
       * Defaults to true.
       */
      highlightActiveIndentGuide?: boolean
      /**
       * Enable rendering of current line highlight.
       * Defaults to all.
       */
      renderLineHighlight?:
      | "none"
      | "gutter"
      | "line"
      | "all"
      /**
       * Control if the current line highlight should be rendered only the editor is focused.
       * Defaults to false.
       */
      renderLineHighlightOnlyWhenFocus?: boolean
      /**
       * Inserting and deleting whitespace follows tab stops.
       */
      useTabStops?: boolean
      /**
       * The font family
       */
      fontFamily?: string
      /**
       * The font weight
       */
      fontWeight?: string
      /**
       * The font size
       */
      fontSize?: number
      /**
       * The line height
       */
      lineHeight?: number
      /**
       * The letter spacing
       */
      letterSpacing?: number
      /**
       * Controls fading out of unused variables.
       */
      showUnused?: boolean
      /**
       * Controls whether to focus the inline editor in the peek widget by default.
       * Defaults to false.
       */
      peekWidgetDefaultFocus?: "tree" | "editor"
      /**
       * Controls whether the definition link opens any in the peek widget.
       * Defaults to false.
       */
      definitionLinkOpensInPeek?: boolean
      /**
       * Controls strikethrough deprecated variables.
       */
      showDeprecated?: boolean
      /**
       * Control the behavior and rendering of the inline hints.
       */
      inlayHints?: IEditorInlayHintsOptions
      /**
       * Control if the editor should use shadow DOM.
       */
      useShadowDOM?: boolean
    }

    /**
     * Configuration options for the diff editor.
     */
    export interface IDiffEditorOptions
      extends IEditorOptions {
      /**
       * Allow the user to resize the diff editor split view.
       * Defaults to true.
       */
      enableSplitViewResizing?: boolean
      /**
       * Render the differences in two side-by-side editors.
       * Defaults to true.
       */
      renderSideBySide?: boolean
      /**
       * Timeout in milliseconds after which diff computation is cancelled.
       * Defaults to 5000.
       */
      maxComputationTime?: number
      /**
       * Compute the diff by ignoring leading/trailing whitespace
       * Defaults to true.
       */
      ignoreTrimWhitespace?: boolean
      /**
       * Render +/- indicators for added/deleted changes.
       * Defaults to true.
       */
      renderIndicators?: boolean
      /**
       * Original model should be editable?
       * Defaults to false.
       */
      originalEditable?: boolean
      /**
       * Should the diff editor enable code lens?
       * Defaults to false.
       */
      diffCodeLens?: boolean
      /**
       * Is the diff editor inside another editor
       * Defaults to false
       */
      isInEmbeddedEditor?: boolean
      /**
       * Is the diff editor should render overview ruler
       * Defaults to true
       */
      renderOverviewRuler?: boolean
      /**
       * Control the wrapping of the diff editor.
       */
      diffWordWrap?: "off" | "on" | "inherit"
      /**
       * Aria label for original editor.
       */
      originalAriaLabel?: string
      /**
       * Aria label for modifed editor.
       */
      modifiedAriaLabel?: string
    }

    /**
     * An event describing that the configuration of the editor has changed.
     */
    export class ConfigurationChangedEvent {
      hasChanged(id: EditorOption): boolean
    }

    /**
     * All computed editor options.
     */
    export interface IComputedEditorOptions {
      get<T extends EditorOption>(
        id: T
      ): FindComputedEditorOptionValueById<T>
    }

    export interface IEditorOption<
      K1 extends EditorOption,
      V
    > {
      readonly id: K1
      readonly name: string
      defaultValue: V
    }

    /**
     * Configuration options for editor comments
     */
    export interface IEditorCommentsOptions {
      /**
       * Insert a space after the line comment token and inside the block comments tokens.
       * Defaults to true.
       */
      insertSpace?: boolean
      /**
       * Ignore empty lines when inserting line comments.
       * Defaults to true.
       */
      ignoreEmptyLines?: boolean
    }

    export type EditorCommentsOptions = Readonly<
      Required<IEditorCommentsOptions>
    >

    /**
     * The kind of animation in which the editor's cursor should be rendered.
     */
    export enum TextEditorCursorBlinkingStyle {
      /**
       * Hidden
       */
      Hidden = 0,
      /**
       * Blinking
       */
      Blink = 1,
      /**
       * Blinking with smooth fading
       */
      Smooth = 2,
      /**
       * Blinking with prolonged filled state and smooth fading
       */
      Phase = 3,
      /**
       * Expand collapse animation on the y axis
       */
      Expand = 4,
      /**
       * No-Blinking
       */
      Solid = 5,
    }

    /**
     * The style in which the editor's cursor should be rendered.
     */
    export enum TextEditorCursorStyle {
      /**
       * As a vertical line (sitting between two characters).
       */
      Line = 1,
      /**
       * As a block (sitting on top of a character).
       */
      Block = 2,
      /**
       * As a horizontal line (sitting under a character).
       */
      Underline = 3,
      /**
       * As a thin vertical line (sitting between two characters).
       */
      LineThin = 4,
      /**
       * As an outlined block (sitting on top of a character).
       */
      BlockOutline = 5,
      /**
       * As a thin horizontal line (sitting under a character).
       */
      UnderlineThin = 6,
    }

    /**
     * Configuration options for editor find widget
     */
    export interface IEditorFindOptions {
      /**
       * Controls whether the cursor should move to find matches while typing.
       */
      cursorMoveOnType?: boolean
      /**
       * Controls if we seed search string in the Find Widget with editor selection.
       */
      seedSearchStringFromSelection?: boolean
      /**
       * Controls if Find in Selection flag is turned on in the editor.
       */
      autoFindInSelection?: "never" | "always" | "multiline"
      addExtraSpaceOnTop?: boolean
      /**
       * Controls whether the search automatically restarts from the beginning (or the end) when no further matches can be found
       */
      loop?: boolean
    }

    export type EditorFindOptions = Readonly<
      Required<IEditorFindOptions>
    >

    export type GoToLocationValues =
      | "peek"
      | "gotoAndPeek"
      | "goto"

    /**
     * Configuration options for go to location
     */
    export interface IGotoLocationOptions {
      multiple?: GoToLocationValues
      multipleDefinitions?: GoToLocationValues
      multipleTypeDefinitions?: GoToLocationValues
      multipleDeclarations?: GoToLocationValues
      multipleImplementations?: GoToLocationValues
      multipleReferences?: GoToLocationValues
      alternativeDefinitionCommand?: string
      alternativeTypeDefinitionCommand?: string
      alternativeDeclarationCommand?: string
      alternativeImplementationCommand?: string
      alternativeReferenceCommand?: string
    }

    export type GoToLocationOptions = Readonly<
      Required<IGotoLocationOptions>
    >

    /**
     * Configuration options for editor hover
     */
    export interface IEditorHoverOptions {
      /**
       * Enable the hover.
       * Defaults to true.
       */
      enabled?: boolean
      /**
       * Delay for showing the hover.
       * Defaults to 300.
       */
      delay?: number
      /**
       * Is the hover sticky such that it can be clicked and its contents selected?
       * Defaults to true.
       */
      sticky?: boolean
    }

    export type EditorHoverOptions = Readonly<
      Required<IEditorHoverOptions>
    >

    /**
     * A description for the overview ruler position.
     */
    export interface OverviewRulerPosition {
      /**
       * Width of the overview ruler
       */
      readonly width: number
      /**
       * Height of the overview ruler
       */
      readonly height: number
      /**
       * Top position for the overview ruler
       */
      readonly top: number
      /**
       * Right position for the overview ruler
       */
      readonly right: number
    }

    export enum RenderMinimap {
      None = 0,
      Text = 1,
      Blocks = 2,
    }

    /**
     * The internal layout details of the editor.
     */
    export interface EditorLayoutInfo {
      /**
       * Full editor width.
       */
      readonly width: number
      /**
       * Full editor height.
       */
      readonly height: number
      /**
       * Left position for the glyph margin.
       */
      readonly glyphMarginLeft: number
      /**
       * The width of the glyph margin.
       */
      readonly glyphMarginWidth: number
      /**
       * Left position for the line numbers.
       */
      readonly lineNumbersLeft: number
      /**
       * The width of the line numbers.
       */
      readonly lineNumbersWidth: number
      /**
       * Left position for the line decorations.
       */
      readonly decorationsLeft: number
      /**
       * The width of the line decorations.
       */
      readonly decorationsWidth: number
      /**
       * Left position for the content (actual text)
       */
      readonly contentLeft: number
      /**
       * The width of the content (actual text)
       */
      readonly contentWidth: number
      /**
       * Layout information for the minimap
       */
      readonly minimap: EditorMinimapLayoutInfo
      /**
       * The number of columns (of typical characters) fitting on a viewport line.
       */
      readonly viewportColumn: number
      readonly isWordWrapMinified: boolean
      readonly isViewportWrapping: boolean
      readonly wrappingColumn: number
      /**
       * The width of the vertical scrollbar.
       */
      readonly verticalScrollbarWidth: number
      /**
       * The height of the horizontal scrollbar.
       */
      readonly horizontalScrollbarHeight: number
      /**
       * The position of the overview ruler.
       */
      readonly overviewRuler: OverviewRulerPosition
    }

    /**
     * The internal layout details of the editor.
     */
    export interface EditorMinimapLayoutInfo {
      readonly renderMinimap: RenderMinimap
      readonly minimapLeft: number
      readonly minimapWidth: number
      readonly minimapHeightIsEditorHeight: boolean
      readonly minimapIsSampling: boolean
      readonly minimapScale: number
      readonly minimapLineHeight: number
      readonly minimapCanvasInnerWidth: number
      readonly minimapCanvasInnerHeight: number
      readonly minimapCanvasOuterWidth: number
      readonly minimapCanvasOuterHeight: number
    }

    /**
     * Configuration options for editor lightbulb
     */
    export interface IEditorLightbulbOptions {
      /**
       * Enable the lightbulb code action.
       * Defaults to true.
       */
      enabled?: boolean
    }

    export type EditorLightbulbOptions = Readonly<
      Required<IEditorLightbulbOptions>
    >

    /**
     * Configuration options for editor inlayHints
     */
    export interface IEditorInlayHintsOptions {
      /**
       * Enable the inline hints.
       * Defaults to true.
       */
      enabled?: boolean
      /**
       * Font size of inline hints.
       * Default to 90% of the editor font size.
       */
      fontSize?: number
      /**
       * Font family of inline hints.
       * Defaults to editor font family.
       */
      fontFamily?: string
    }

    export type EditorInlayHintsOptions = Readonly<
      Required<IEditorInlayHintsOptions>
    >

    /**
     * Configuration options for editor minimap
     */
    export interface IEditorMinimapOptions {
      /**
       * Enable the rendering of the minimap.
       * Defaults to true.
       */
      enabled?: boolean
      /**
       * Control the side of the minimap in editor.
       * Defaults to 'right'.
       */
      side?: "right" | "left"
      /**
       * Control the minimap rendering mode.
       * Defaults to 'actual'.
       */
      size?: "proportional" | "fill" | "fit"
      /**
       * Control the rendering of the minimap slider.
       * Defaults to 'mouseover'.
       */
      showSlider?: "always" | "mouseover"
      /**
       * Render the actual text on a line (as opposed to color blocks).
       * Defaults to true.
       */
      renderCharacters?: boolean
      /**
       * Limit the width of the minimap to render at most a certain number of columns.
       * Defaults to 120.
       */
      maxColumn?: number
      /**
       * Relative size of the font in the minimap. Defaults to 1.
       */
      scale?: number
    }

    export type EditorMinimapOptions = Readonly<
      Required<IEditorMinimapOptions>
    >

    /**
     * Configuration options for editor padding
     */
    export interface IEditorPaddingOptions {
      /**
       * Spacing between top edge of editor and first line.
       */
      top?: number
      /**
       * Spacing between bottom edge of editor and last line.
       */
      bottom?: number
    }

    export interface InternalEditorPaddingOptions {
      readonly top: number
      readonly bottom: number
    }

    /**
     * Configuration options for parameter hints
     */
    export interface IEditorParameterHintOptions {
      /**
       * Enable parameter hints.
       * Defaults to true.
       */
      enabled?: boolean
      /**
       * Enable cycling of parameter hints.
       * Defaults to false.
       */
      cycle?: boolean
    }

    export type InternalParameterHintOptions = Readonly<
      Required<IEditorParameterHintOptions>
    >

    /**
     * Configuration options for quick suggestions
     */
    export interface IQuickSuggestionsOptions {
      other?: boolean
      comments?: boolean
      strings?: boolean
    }

    export type ValidQuickSuggestionsOptions =
      | boolean
      | Readonly<Required<IQuickSuggestionsOptions>>

    export type LineNumbersType =
      | "on"
      | "off"
      | "relative"
      | "interval"
      | ((lineNumber: number) => string)

    export enum RenderLineNumbersType {
      Off = 0,
      On = 1,
      Relative = 2,
      Interval = 3,
      Custom = 4,
    }

    export interface InternalEditorRenderLineNumbersOptions {
      readonly renderType: RenderLineNumbersType
      readonly renderFn:
      | ((lineNumber: number) => string)
      | null
    }

    export interface IRulerOption {
      readonly column: number
      readonly color: string | null
    }

    /**
     * Configuration options for editor scrollbars
     */
    export interface IEditorScrollbarOptions {
      /**
       * The size of arrows (if displayed).
       * Defaults to 11.
       */
      arrowSize?: number
      /**
       * Render vertical scrollbar.
       * Defaults to 'auto'.
       */
      vertical?: "auto" | "visible" | "hidden"
      /**
       * Render horizontal scrollbar.
       * Defaults to 'auto'.
       */
      horizontal?: "auto" | "visible" | "hidden"
      /**
       * Cast horizontal and vertical shadows when the content is scrolled.
       * Defaults to true.
       */
      useShadows?: boolean
      /**
       * Render arrows at the top and bottom of the vertical scrollbar.
       * Defaults to false.
       */
      verticalHasArrows?: boolean
      /**
       * Render arrows at the left and right of the horizontal scrollbar.
       * Defaults to false.
       */
      horizontalHasArrows?: boolean
      /**
       * Listen to mouse wheel events and react to them by scrolling.
       * Defaults to true.
       */
      handleMouseWheel?: boolean
      /**
       * Always consume mouse wheel events (always call preventDefault() and stopPropagation() on the browser events).
       * Defaults to true.
       */
      alwaysConsumeMouseWheel?: boolean
      /**
       * Height in pixels for the horizontal scrollbar.
       * Defaults to 10 (px).
       */
      horizontalScrollbarSize?: number
      /**
       * Width in pixels for the vertical scrollbar.
       * Defaults to 10 (px).
       */
      verticalScrollbarSize?: number
      /**
       * Width in pixels for the vertical slider.
       * Defaults to `verticalScrollbarSize`.
       */
      verticalSliderSize?: number
      /**
       * Height in pixels for the horizontal slider.
       * Defaults to `horizontalScrollbarSize`.
       */
      horizontalSliderSize?: number
      /**
       * Scroll gutter clicks move by page vs jump to position.
       * Defaults to false.
       */
      scrollByPage?: boolean
    }

    export interface InternalEditorScrollbarOptions {
      readonly arrowSize: number
      readonly vertical: ScrollbarVisibility
      readonly horizontal: ScrollbarVisibility
      readonly useShadows: boolean
      readonly verticalHasArrows: boolean
      readonly horizontalHasArrows: boolean
      readonly handleMouseWheel: boolean
      readonly alwaysConsumeMouseWheel: boolean
      readonly horizontalScrollbarSize: number
      readonly horizontalSliderSize: number
      readonly verticalScrollbarSize: number
      readonly verticalSliderSize: number
      readonly scrollByPage: boolean
    }

    export interface IInlineSuggestOptions {
      /**
       * Enable or disable the rendering of automatic inline completions.
       */
      enabled?: boolean
    }

    export type InternalInlineSuggestOptions = Readonly<
      Required<IInlineSuggestOptions>
    >

    /**
     * Configuration options for editor suggest widget
     */
    export interface ISuggestOptions {
      /**
       * Overwrite word ends on accept. Default to false.
       */
      insertMode?: "insert" | "replace"
      /**
       * Enable graceful matching. Defaults to true.
       */
      filterGraceful?: boolean
      /**
       * Prevent quick suggestions when a snippet is active. Defaults to true.
       */
      snippetsPreventQuickSuggestions?: boolean
      /**
       * Favors words that appear close to the cursor.
       */
      localityBonus?: boolean
      /**
       * Enable using global storage for remembering suggestions.
       */
      shareSuggestSelections?: boolean
      /**
       * Enable or disable icons in suggestions. Defaults to true.
       */
      showIcons?: boolean
      /**
       * Enable or disable the suggest status bar.
       */
      showStatusBar?: boolean
      /**
       * Enable or disable the rendering of the suggestion preview.
       */
      preview?: boolean
      /**
       * Show details inline with the label. Defaults to true.
       */
      showInlineDetails?: boolean
      /**
       * Show method-suggestions.
       */
      showMethods?: boolean
      /**
       * Show function-suggestions.
       */
      showFunctions?: boolean
      /**
       * Show constructor-suggestions.
       */
      showConstructors?: boolean
      /**
       * Show deprecated-suggestions.
       */
      showDeprecated?: boolean
      /**
       * Show field-suggestions.
       */
      showFields?: boolean
      /**
       * Show variable-suggestions.
       */
      showVariables?: boolean
      /**
       * Show class-suggestions.
       */
      showClasses?: boolean
      /**
       * Show struct-suggestions.
       */
      showStructs?: boolean
      /**
       * Show interface-suggestions.
       */
      showInterfaces?: boolean
      /**
       * Show module-suggestions.
       */
      showModules?: boolean
      /**
       * Show property-suggestions.
       */
      showProperties?: boolean
      /**
       * Show event-suggestions.
       */
      showEvents?: boolean
      /**
       * Show operator-suggestions.
       */
      showOperators?: boolean
      /**
       * Show unit-suggestions.
       */
      showUnits?: boolean
      /**
       * Show value-suggestions.
       */
      showValues?: boolean
      /**
       * Show constant-suggestions.
       */
      showConstants?: boolean
      /**
       * Show enum-suggestions.
       */
      showEnums?: boolean
      /**
       * Show enumMember-suggestions.
       */
      showEnumMembers?: boolean
      /**
       * Show keyword-suggestions.
       */
      showKeywords?: boolean
      /**
       * Show text-suggestions.
       */
      showWords?: boolean
      /**
       * Show color-suggestions.
       */
      showColors?: boolean
      /**
       * Show file-suggestions.
       */
      showFiles?: boolean
      /**
       * Show reference-suggestions.
       */
      showReferences?: boolean
      /**
       * Show folder-suggestions.
       */
      showFolders?: boolean
      /**
       * Show typeParameter-suggestions.
       */
      showTypeParameters?: boolean
      /**
       * Show issue-suggestions.
       */
      showIssues?: boolean
      /**
       * Show user-suggestions.
       */
      showUsers?: boolean
      /**
       * Show snippet-suggestions.
       */
      showSnippets?: boolean
    }

    export type InternalSuggestOptions = Readonly<
      Required<ISuggestOptions>
    >

    export interface ISmartSelectOptions {
      selectLeadingAndTrailingWhitespace?: boolean
    }

    export type SmartSelectOptions = Readonly<
      Required<ISmartSelectOptions>
    >

    /**
     * Describes how to indent wrapped lines.
     */
    export enum WrappingIndent {
      /**
       * No indentation => wrapped lines begin at column 1.
       */
      None = 0,
      /**
       * Same => wrapped lines get the same indentation as the parent.
       */
      Same = 1,
      /**
       * Indent => wrapped lines get +1 indentation toward the parent.
       */
      Indent = 2,
      /**
       * DeepIndent => wrapped lines get +2 indentation toward the parent.
       */
      DeepIndent = 3,
    }

    export interface EditorWrappingInfo {
      readonly isDominatedByLongLines: boolean
      readonly isWordWrapMinified: boolean
      readonly isViewportWrapping: boolean
      readonly wrappingColumn: number
    }

    export enum EditorOption {
      acceptSuggestionOnCommitCharacter = 0,
      acceptSuggestionOnEnter = 1,
      accessibilitySupport = 2,
      accessibilityPageSize = 3,
      ariaLabel = 4,
      autoClosingBrackets = 5,
      autoClosingDelete = 6,
      autoClosingOvertype = 7,
      autoClosingQuotes = 8,
      autoIndent = 9,
      automaticLayout = 10,
      autoSurround = 11,
      codeLens = 12,
      codeLensFontFamily = 13,
      codeLensFontSize = 14,
      colorDecorators = 15,
      columnSelection = 16,
      comments = 17,
      contextmenu = 18,
      copyWithSyntaxHighlighting = 19,
      cursorBlinking = 20,
      cursorSmoothCaretAnimation = 21,
      cursorStyle = 22,
      cursorSurroundingLines = 23,
      cursorSurroundingLinesStyle = 24,
      cursorWidth = 25,
      disableLayerHinting = 26,
      disableMonospaceOptimizations = 27,
      domReadOnly = 28,
      dragAndDrop = 29,
      emptySelectionClipboard = 30,
      extraEditorClassName = 31,
      fastScrollSensitivity = 32,
      find = 33,
      fixedOverflowWidgets = 34,
      folding = 35,
      foldingStrategy = 36,
      foldingHighlight = 37,
      unfoldOnClickAfterEndOfLine = 38,
      fontFamily = 39,
      fontInfo = 40,
      fontLigatures = 41,
      fontSize = 42,
      fontWeight = 43,
      formatOnPaste = 44,
      formatOnType = 45,
      glyphMargin = 46,
      gotoLocation = 47,
      hideCursorInOverviewRuler = 48,
      highlightActiveIndentGuide = 49,
      hover = 50,
      inDiffEditor = 51,
      inlineSuggest = 52,
      letterSpacing = 53,
      lightbulb = 54,
      lineDecorationsWidth = 55,
      lineHeight = 56,
      lineNumbers = 57,
      lineNumbersMinChars = 58,
      linkedEditing = 59,
      links = 60,
      matchBrackets = 61,
      minimap = 62,
      mouseStyle = 63,
      mouseWheelScrollSensitivity = 64,
      mouseWheelZoom = 65,
      multiCursorMergeOverlapping = 66,
      multiCursorModifier = 67,
      multiCursorPaste = 68,
      occurrencesHighlight = 69,
      overviewRulerBorder = 70,
      overviewRulerLanes = 71,
      padding = 72,
      parameterHints = 73,
      peekWidgetDefaultFocus = 74,
      definitionLinkOpensInPeek = 75,
      quickSuggestions = 76,
      quickSuggestionsDelay = 77,
      readOnly = 78,
      renameOnType = 79,
      renderControlCharacters = 80,
      renderIndentGuides = 81,
      renderFinalNewline = 82,
      renderLineHighlight = 83,
      renderLineHighlightOnlyWhenFocus = 84,
      renderValidationDecorations = 85,
      renderWhitespace = 86,
      revealHorizontalRightPadding = 87,
      roundedSelection = 88,
      rulers = 89,
      scrollbar = 90,
      scrollBeyondLastColumn = 91,
      scrollBeyondLastLine = 92,
      scrollPredominantAxis = 93,
      selectionClipboard = 94,
      selectionHighlight = 95,
      selectOnLineNumbers = 96,
      showFoldingControls = 97,
      showUnused = 98,
      snippetSuggestions = 99,
      smartSelect = 100,
      smoothScrolling = 101,
      stickyTabStops = 102,
      stopRenderingLineAfter = 103,
      suggest = 104,
      suggestFontSize = 105,
      suggestLineHeight = 106,
      suggestOnTriggerCharacters = 107,
      suggestSelection = 108,
      tabCompletion = 109,
      tabIndex = 110,
      unusualLineTerminators = 111,
      useShadowDOM = 112,
      useTabStops = 113,
      wordSeparators = 114,
      wordWrap = 115,
      wordWrapBreakAfterCharacters = 116,
      wordWrapBreakBeforeCharacters = 117,
      wordWrapColumn = 118,
      wordWrapOverride1 = 119,
      wordWrapOverride2 = 120,
      wrappingIndent = 121,
      wrappingStrategy = 122,
      showDeprecated = 123,
      inlayHints = 124,
      editorClassName = 125,
      pixelRatio = 126,
      tabFocusMode = 127,
      layoutInfo = 128,
      wrappingInfo = 129,
    }
    export const EditorOptions: {
      acceptSuggestionOnCommitCharacter: IEditorOption<
        EditorOption.acceptSuggestionOnCommitCharacter,
        boolean
      >
      acceptSuggestionOnEnter: IEditorOption<
        EditorOption.acceptSuggestionOnEnter,
        "on" | "off" | "smart"
      >
      accessibilitySupport: IEditorOption<
        EditorOption.accessibilitySupport,
        AccessibilitySupport
      >
      accessibilityPageSize: IEditorOption<
        EditorOption.accessibilityPageSize,
        number
      >
      ariaLabel: IEditorOption<
        EditorOption.ariaLabel,
        string
      >
      autoClosingBrackets: IEditorOption<
        EditorOption.autoClosingBrackets,
        | "always"
        | "languageDefined"
        | "beforeWhitespace"
        | "never"
      >
      autoClosingDelete: IEditorOption<
        EditorOption.autoClosingDelete,
        "always" | "never" | "auto"
      >
      autoClosingOvertype: IEditorOption<
        EditorOption.autoClosingOvertype,
        "always" | "never" | "auto"
      >
      autoClosingQuotes: IEditorOption<
        EditorOption.autoClosingQuotes,
        | "always"
        | "languageDefined"
        | "beforeWhitespace"
        | "never"
      >
      autoIndent: IEditorOption<
        EditorOption.autoIndent,
        EditorAutoIndentStrategy
      >
      automaticLayout: IEditorOption<
        EditorOption.automaticLayout,
        boolean
      >
      autoSurround: IEditorOption<
        EditorOption.autoSurround,
        "languageDefined" | "never" | "quotes" | "brackets"
      >
      stickyTabStops: IEditorOption<
        EditorOption.stickyTabStops,
        boolean
      >
      codeLens: IEditorOption<
        EditorOption.codeLens,
        boolean
      >
      codeLensFontFamily: IEditorOption<
        EditorOption.codeLensFontFamily,
        string
      >
      codeLensFontSize: IEditorOption<
        EditorOption.codeLensFontSize,
        number
      >
      colorDecorators: IEditorOption<
        EditorOption.colorDecorators,
        boolean
      >
      columnSelection: IEditorOption<
        EditorOption.columnSelection,
        boolean
      >
      comments: IEditorOption<
        EditorOption.comments,
        EditorCommentsOptions
      >
      contextmenu: IEditorOption<
        EditorOption.contextmenu,
        boolean
      >
      copyWithSyntaxHighlighting: IEditorOption<
        EditorOption.copyWithSyntaxHighlighting,
        boolean
      >
      cursorBlinking: IEditorOption<
        EditorOption.cursorBlinking,
        TextEditorCursorBlinkingStyle
      >
      cursorSmoothCaretAnimation: IEditorOption<
        EditorOption.cursorSmoothCaretAnimation,
        boolean
      >
      cursorStyle: IEditorOption<
        EditorOption.cursorStyle,
        TextEditorCursorStyle
      >
      cursorSurroundingLines: IEditorOption<
        EditorOption.cursorSurroundingLines,
        number
      >
      cursorSurroundingLinesStyle: IEditorOption<
        EditorOption.cursorSurroundingLinesStyle,
        "default" | "all"
      >
      cursorWidth: IEditorOption<
        EditorOption.cursorWidth,
        number
      >
      disableLayerHinting: IEditorOption<
        EditorOption.disableLayerHinting,
        boolean
      >
      disableMonospaceOptimizations: IEditorOption<
        EditorOption.disableMonospaceOptimizations,
        boolean
      >
      domReadOnly: IEditorOption<
        EditorOption.domReadOnly,
        boolean
      >
      dragAndDrop: IEditorOption<
        EditorOption.dragAndDrop,
        boolean
      >
      emptySelectionClipboard: IEditorOption<
        EditorOption.emptySelectionClipboard,
        boolean
      >
      extraEditorClassName: IEditorOption<
        EditorOption.extraEditorClassName,
        string
      >
      fastScrollSensitivity: IEditorOption<
        EditorOption.fastScrollSensitivity,
        number
      >
      find: IEditorOption<
        EditorOption.find,
        EditorFindOptions
      >
      fixedOverflowWidgets: IEditorOption<
        EditorOption.fixedOverflowWidgets,
        boolean
      >
      folding: IEditorOption<EditorOption.folding, boolean>
      foldingStrategy: IEditorOption<
        EditorOption.foldingStrategy,
        "auto" | "indentation"
      >
      foldingHighlight: IEditorOption<
        EditorOption.foldingHighlight,
        boolean
      >
      unfoldOnClickAfterEndOfLine: IEditorOption<
        EditorOption.unfoldOnClickAfterEndOfLine,
        boolean
      >
      fontFamily: IEditorOption<
        EditorOption.fontFamily,
        string
      >
      fontInfo: IEditorOption<
        EditorOption.fontInfo,
        FontInfo
      >
      fontLigatures2: IEditorOption<
        EditorOption.fontLigatures,
        string
      >
      fontSize: IEditorOption<EditorOption.fontSize, number>
      fontWeight: IEditorOption<
        EditorOption.fontWeight,
        string
      >
      formatOnPaste: IEditorOption<
        EditorOption.formatOnPaste,
        boolean
      >
      formatOnType: IEditorOption<
        EditorOption.formatOnType,
        boolean
      >
      glyphMargin: IEditorOption<
        EditorOption.glyphMargin,
        boolean
      >
      gotoLocation: IEditorOption<
        EditorOption.gotoLocation,
        GoToLocationOptions
      >
      hideCursorInOverviewRuler: IEditorOption<
        EditorOption.hideCursorInOverviewRuler,
        boolean
      >
      highlightActiveIndentGuide: IEditorOption<
        EditorOption.highlightActiveIndentGuide,
        boolean
      >
      hover: IEditorOption<
        EditorOption.hover,
        EditorHoverOptions
      >
      inDiffEditor: IEditorOption<
        EditorOption.inDiffEditor,
        boolean
      >
      letterSpacing: IEditorOption<
        EditorOption.letterSpacing,
        number
      >
      lightbulb: IEditorOption<
        EditorOption.lightbulb,
        EditorLightbulbOptions
      >
      lineDecorationsWidth: IEditorOption<
        EditorOption.lineDecorationsWidth,
        string | number
      >
      lineHeight: IEditorOption<
        EditorOption.lineHeight,
        number
      >
      lineNumbers: IEditorOption<
        EditorOption.lineNumbers,
        InternalEditorRenderLineNumbersOptions
      >
      lineNumbersMinChars: IEditorOption<
        EditorOption.lineNumbersMinChars,
        number
      >
      linkedEditing: IEditorOption<
        EditorOption.linkedEditing,
        boolean
      >
      links: IEditorOption<EditorOption.links, boolean>
      matchBrackets: IEditorOption<
        EditorOption.matchBrackets,
        "always" | "never" | "near"
      >
      minimap: IEditorOption<
        EditorOption.minimap,
        EditorMinimapOptions
      >
      mouseStyle: IEditorOption<
        EditorOption.mouseStyle,
        "default" | "text" | "copy"
      >
      mouseWheelScrollSensitivity: IEditorOption<
        EditorOption.mouseWheelScrollSensitivity,
        number
      >
      mouseWheelZoom: IEditorOption<
        EditorOption.mouseWheelZoom,
        boolean
      >
      multiCursorMergeOverlapping: IEditorOption<
        EditorOption.multiCursorMergeOverlapping,
        boolean
      >
      multiCursorModifier: IEditorOption<
        EditorOption.multiCursorModifier,
        "altKey" | "metaKey" | "ctrlKey"
      >
      multiCursorPaste: IEditorOption<
        EditorOption.multiCursorPaste,
        "spread" | "full"
      >
      occurrencesHighlight: IEditorOption<
        EditorOption.occurrencesHighlight,
        boolean
      >
      overviewRulerBorder: IEditorOption<
        EditorOption.overviewRulerBorder,
        boolean
      >
      overviewRulerLanes: IEditorOption<
        EditorOption.overviewRulerLanes,
        number
      >
      padding: IEditorOption<
        EditorOption.padding,
        InternalEditorPaddingOptions
      >
      parameterHints: IEditorOption<
        EditorOption.parameterHints,
        InternalParameterHintOptions
      >
      peekWidgetDefaultFocus: IEditorOption<
        EditorOption.peekWidgetDefaultFocus,
        "tree" | "editor"
      >
      definitionLinkOpensInPeek: IEditorOption<
        EditorOption.definitionLinkOpensInPeek,
        boolean
      >
      quickSuggestions: IEditorOption<
        EditorOption.quickSuggestions,
        ValidQuickSuggestionsOptions
      >
      quickSuggestionsDelay: IEditorOption<
        EditorOption.quickSuggestionsDelay,
        number
      >
      readOnly: IEditorOption<
        EditorOption.readOnly,
        boolean
      >
      renameOnType: IEditorOption<
        EditorOption.renameOnType,
        boolean
      >
      renderControlCharacters: IEditorOption<
        EditorOption.renderControlCharacters,
        boolean
      >
      renderIndentGuides: IEditorOption<
        EditorOption.renderIndentGuides,
        boolean
      >
      renderFinalNewline: IEditorOption<
        EditorOption.renderFinalNewline,
        boolean
      >
      renderLineHighlight: IEditorOption<
        EditorOption.renderLineHighlight,
        "all" | "line" | "none" | "gutter"
      >
      renderLineHighlightOnlyWhenFocus: IEditorOption<
        EditorOption.renderLineHighlightOnlyWhenFocus,
        boolean
      >
      renderValidationDecorations: IEditorOption<
        EditorOption.renderValidationDecorations,
        "on" | "off" | "editable"
      >
      renderWhitespace: IEditorOption<
        EditorOption.renderWhitespace,
        | "all"
        | "none"
        | "boundary"
        | "selection"
        | "trailing"
      >
      revealHorizontalRightPadding: IEditorOption<
        EditorOption.revealHorizontalRightPadding,
        number
      >
      roundedSelection: IEditorOption<
        EditorOption.roundedSelection,
        boolean
      >
      rulers: IEditorOption<EditorOption.rulers, {}>
      scrollbar: IEditorOption<
        EditorOption.scrollbar,
        InternalEditorScrollbarOptions
      >
      scrollBeyondLastColumn: IEditorOption<
        EditorOption.scrollBeyondLastColumn,
        number
      >
      scrollBeyondLastLine: IEditorOption<
        EditorOption.scrollBeyondLastLine,
        boolean
      >
      scrollPredominantAxis: IEditorOption<
        EditorOption.scrollPredominantAxis,
        boolean
      >
      selectionClipboard: IEditorOption<
        EditorOption.selectionClipboard,
        boolean
      >
      selectionHighlight: IEditorOption<
        EditorOption.selectionHighlight,
        boolean
      >
      selectOnLineNumbers: IEditorOption<
        EditorOption.selectOnLineNumbers,
        boolean
      >
      showFoldingControls: IEditorOption<
        EditorOption.showFoldingControls,
        "always" | "mouseover"
      >
      showUnused: IEditorOption<
        EditorOption.showUnused,
        boolean
      >
      showDeprecated: IEditorOption<
        EditorOption.showDeprecated,
        boolean
      >
      inlayHints: IEditorOption<
        EditorOption.inlayHints,
        any
      >
      snippetSuggestions: IEditorOption<
        EditorOption.snippetSuggestions,
        "none" | "top" | "bottom" | "inline"
      >
      smartSelect: IEditorOption<
        EditorOption.smartSelect,
        any
      >
      smoothScrolling: IEditorOption<
        EditorOption.smoothScrolling,
        boolean
      >
      stopRenderingLineAfter: IEditorOption<
        EditorOption.stopRenderingLineAfter,
        number
      >
      suggest: IEditorOption<
        EditorOption.suggest,
        InternalSuggestOptions
      >
      inlineSuggest: IEditorOption<
        EditorOption.inlineSuggest,
        any
      >
      suggestFontSize: IEditorOption<
        EditorOption.suggestFontSize,
        number
      >
      suggestLineHeight: IEditorOption<
        EditorOption.suggestLineHeight,
        number
      >
      suggestOnTriggerCharacters: IEditorOption<
        EditorOption.suggestOnTriggerCharacters,
        boolean
      >
      suggestSelection: IEditorOption<
        EditorOption.suggestSelection,
        "first" | "recentlyUsed" | "recentlyUsedByPrefix"
      >
      tabCompletion: IEditorOption<
        EditorOption.tabCompletion,
        "on" | "off" | "onlySnippets"
      >
      tabIndex: IEditorOption<EditorOption.tabIndex, number>
      unusualLineTerminators: IEditorOption<
        EditorOption.unusualLineTerminators,
        "auto" | "off" | "prompt"
      >
      useShadowDOM: IEditorOption<
        EditorOption.useShadowDOM,
        boolean
      >
      useTabStops: IEditorOption<
        EditorOption.useTabStops,
        boolean
      >
      wordSeparators: IEditorOption<
        EditorOption.wordSeparators,
        string
      >
      wordWrap: IEditorOption<
        EditorOption.wordWrap,
        "on" | "off" | "wordWrapColumn" | "bounded"
      >
      wordWrapBreakAfterCharacters: IEditorOption<
        EditorOption.wordWrapBreakAfterCharacters,
        string
      >
      wordWrapBreakBeforeCharacters: IEditorOption<
        EditorOption.wordWrapBreakBeforeCharacters,
        string
      >
      wordWrapColumn: IEditorOption<
        EditorOption.wordWrapColumn,
        number
      >
      wordWrapOverride1: IEditorOption<
        EditorOption.wordWrapOverride1,
        "on" | "off" | "inherit"
      >
      wordWrapOverride2: IEditorOption<
        EditorOption.wordWrapOverride2,
        "on" | "off" | "inherit"
      >
      wrappingIndent: IEditorOption<
        EditorOption.wrappingIndent,
        WrappingIndent
      >
      wrappingStrategy: IEditorOption<
        EditorOption.wrappingStrategy,
        "simple" | "advanced"
      >
      editorClassName: IEditorOption<
        EditorOption.editorClassName,
        string
      >
      pixelRatio: IEditorOption<
        EditorOption.pixelRatio,
        number
      >
      tabFocusMode: IEditorOption<
        EditorOption.tabFocusMode,
        boolean
      >
      layoutInfo: IEditorOption<
        EditorOption.layoutInfo,
        EditorLayoutInfo
      >
      wrappingInfo: IEditorOption<
        EditorOption.wrappingInfo,
        EditorWrappingInfo
      >
    }

    type EditorOptionsType = typeof EditorOptions

    type FindEditorOptionsKeyById<T extends EditorOption> =
      {
        [K in keyof EditorOptionsType]: EditorOptionsType[K]["id"] extends T
        ? K
        : never
      }[keyof EditorOptionsType]

    type ComputedEditorOptionValue<
      T extends IEditorOption<any, any>
    > = T extends IEditorOption<any, infer R> ? R : never

    export type FindComputedEditorOptionValueById<
      T extends EditorOption
    > = NonNullable<
      ComputedEditorOptionValue<
        EditorOptionsType[FindEditorOptionsKeyById<T>]
      >
    >

    /**
     * A view zone is a full horizontal rectangle that 'pushes' text down.
     * The editor reserves space for view zones when rendering.
     */
    export interface IViewZone {
      /**
       * The line number after which this zone should appear.
       * Use 0 to place a view zone before the first line number.
       */
      afterLineNumber: number
      /**
       * The column after which this zone should appear.
       * If not set, the maxLineColumn of `afterLineNumber` will be used.
       */
      afterColumn?: number
      /**
       * Suppress mouse down events.
       * If set, the editor will attach a mouse down listener to the view zone and .preventDefault on it.
       * Defaults to false
       */
      suppressMouseDown?: boolean
      /**
       * The height in lines of the view zone.
       * If specified, `heightInPx` will be used instead of this.
       * If neither `heightInPx` nor `heightInLines` is specified, a default of `heightInLines` = 1 will be chosen.
       */
      heightInLines?: number
      /**
       * The height in px of the view zone.
       * If this is set, the editor will give preference to it rather than `heightInLines` above.
       * If neither `heightInPx` nor `heightInLines` is specified, a default of `heightInLines` = 1 will be chosen.
       */
      heightInPx?: number
      /**
       * The minimum width in px of the view zone.
       * If this is set, the editor will ensure that the scroll width is >= than this value.
       */
      minWidthInPx?: number
      /**
       * The dom node of the view zone
       */
      domNode: any
      /**
       * An optional dom node for the view zone that will be placed in the margin area.
       */
      marginDomNode?: any | null
      /**
       * Callback which gives the relative top of the view zone as it appears (taking scrolling into account).
       */
      onDomNodeTop?: (top: number) => void
      /**
       * Callback which gives the height in pixels of the view zone.
       */
      onComputedHeight?: (height: number) => void
    }

    /**
     * An accessor that allows for zones to be added or removed.
     */
    export interface IViewZoneChangeAccessor {
      /**
       * Create a new view zone.
       * @param zone Zone to create
       * @return A unique identifier to the view zone.
       */
      addZone(zone: IViewZone): string
      /**
       * Remove a zone
       * @param id A unique identifier to the view zone, as returned by the `addZone` call.
       */
      removeZone(id: string): void
      /**
       * Change a zone's position.
       * The editor will rescan the `afterLineNumber` and `afterColumn` properties of a view zone.
       */
      layoutZone(id: string): void
    }

    /**
     * A positioning preference for rendering content widgets.
     */
    export enum ContentWidgetPositionPreference {
      /**
       * Place the content widget exactly at a position
       */
      EXACT = 0,
      /**
       * Place the content widget above a position
       */
      ABOVE = 1,
      /**
       * Place the content widget below a position
       */
      BELOW = 2,
    }

    /**
     * A position for rendering content widgets.
     */
    export interface IContentWidgetPosition {
      /**
       * Desired position for the content widget.
       * `preference` will also affect the placement.
       */
      position: IPosition | null
      /**
       * Optionally, a range can be provided to further
       * define the position of the content widget.
       */
      range?: IRange | null
      /**
       * Placement preference for position, in order of preference.
       */
      preference: ContentWidgetPositionPreference[]
    }

    /**
     * A content widget renders inline with the text and can be easily placed 'near' an editor position.
     */
    export interface IContentWidget {
      /**
       * Render this content widget in a location where it could overflow the editor's view dom node.
       */
      allowEditorOverflow?: boolean
      suppressMouseDown?: boolean
      /**
       * Get a unique identifier of the content widget.
       */
      getId(): string
      /**
       * Get the dom node of the content widget.
       */
      getDomNode(): any
      /**
       * Get the placement of the content widget.
       * If null is returned, the content widget will be placed off screen.
       */
      getPosition(): IContentWidgetPosition | null
      /**
       * Optional function that is invoked before rendering
       * the content widget. If a dimension is returned the editor will
       * attempt to use it.
       */
      beforeRender?(): IDimension | null
      /**
       * Optional function that is invoked after rendering the content
       * widget. Is being invoked with the selected position preference
       * or `null` if not rendered.
       */
      afterRender?(
        position: ContentWidgetPositionPreference | null
      ): void
    }

    /**
     * A positioning preference for rendering overlay widgets.
     */
    export enum OverlayWidgetPositionPreference {
      /**
       * Position the overlay widget in the top right corner
       */
      TOP_RIGHT_CORNER = 0,
      /**
       * Position the overlay widget in the bottom right corner
       */
      BOTTOM_RIGHT_CORNER = 1,
      /**
       * Position the overlay widget in the top center
       */
      TOP_CENTER = 2,
    }

    /**
     * A position for rendering overlay widgets.
     */
    export interface IOverlayWidgetPosition {
      /**
       * The position preference for the overlay widget.
       */
      preference: OverlayWidgetPositionPreference | null
    }

    /**
     * An overlay widgets renders on top of the text.
     */
    export interface IOverlayWidget {
      /**
       * Get a unique identifier of the overlay widget.
       */
      getId(): string
      /**
       * Get the dom node of the overlay widget.
       */
      getDomNode(): any
      /**
       * Get the placement of the overlay widget.
       * If null is returned, the overlay widget is responsible to place itself.
       */
      getPosition(): IOverlayWidgetPosition | null
    }

    /**
     * Type of hit any with the mouse in the editor.
     */
    export enum MouseTargetType {
      /**
       * Mouse is on top of an unknown any.
       */
      UNKNOWN = 0,
      /**
       * Mouse is on top of the textarea used for input.
       */
      TEXTAREA = 1,
      /**
       * Mouse is on top of the glyph margin
       */
      GUTTER_GLYPH_MARGIN = 2,
      /**
       * Mouse is on top of the line numbers
       */
      GUTTER_LINE_NUMBERS = 3,
      /**
       * Mouse is on top of the line decorations
       */
      GUTTER_LINE_DECORATIONS = 4,
      /**
       * Mouse is on top of the whitespace left in the gutter by a view zone.
       */
      GUTTER_VIEW_ZONE = 5,
      /**
       * Mouse is on top of text in the content.
       */
      CONTENT_TEXT = 6,
      /**
       * Mouse is on top of empty space in the content (e.g. after line text or below last line)
       */
      CONTENT_EMPTY = 7,
      /**
       * Mouse is on top of a view zone in the content.
       */
      CONTENT_VIEW_ZONE = 8,
      /**
       * Mouse is on top of a content widget.
       */
      CONTENT_WIDGET = 9,
      /**
       * Mouse is on top of the decorations overview ruler.
       */
      OVERVIEW_RULER = 10,
      /**
       * Mouse is on top of a scrollbar.
       */
      SCROLLBAR = 11,
      /**
       * Mouse is on top of an overlay widget.
       */
      OVERLAY_WIDGET = 12,
      /**
       * Mouse is outside of the editor.
       */
      OUTSIDE_EDITOR = 13,
    }

    /**
     * Target hit with the mouse in the editor.
     */
    export interface IMouseTarget {
      /**
       * The target any
       */
      readonly any: any | null
      /**
       * The target type
       */
      readonly type: MouseTargetType
      /**
       * The 'approximate' editor position
       */
      readonly position: Position | null
      /**
       * Desired mouse column (e.g. when position.column gets clamped to text length -- clicking after text on a line).
       */
      readonly mouseColumn: number
      /**
       * The 'approximate' editor range
       */
      readonly range: Range | null
      /**
       * Some extra detail.
       */
      readonly detail: any
    }

    /**
     * A mouse event originating from the editor.
     */
    export interface IEditorMouseEvent {
      readonly event: IMouseEvent
      readonly target: IMouseTarget
    }

    export interface IPartialEditorMouseEvent {
      readonly event: IMouseEvent
      readonly target: IMouseTarget | null
    }

    /**
     * A paste event originating from the editor.
     */
    export interface IPasteEvent {
      readonly range: Range
      readonly mode: string | null
    }

    export interface IEditorConstructionOptions
      extends IEditorOptions {
      /**
       * The initial editor dimension (to avoid measuring the container).
       */
      dimension?: IDimension
      /**
       * Place overflow widgets inside an external DOM node.
       * Defaults to an internal DOM node.
       */
      overflowWidgetsDomNode?: any
    }

    export interface IDiffEditorConstructionOptions
      extends IDiffEditorOptions {
      /**
       * The initial editor dimension (to avoid measuring the container).
       */
      dimension?: IDimension
      /**
       * Place overflow widgets inside an external DOM node.
       * Defaults to an internal DOM node.
       */
      overflowWidgetsDomNode?: any
    }

    /**
     * A rich code editor.
     */
    export interface ICodeEditor extends IEditor {
      /**
       * An event emitted when the content of the current model has changed.
       * @event
       */
      onDidChangeModelContent(
        listener: (e: IModelContentChangedEvent) => void
      ): IDisposable
      /**
       * An event emitted when the language of the current model has changed.
       * @event
       */
      onDidChangeModelLanguage(
        listener: (e: IModelLanguageChangedEvent) => void
      ): IDisposable
      /**
       * An event emitted when the language configuration of the current model has changed.
       * @event
       */
      onDidChangeModelLanguageConfiguration(
        listener: (
          e: IModelLanguageConfigurationChangedEvent
        ) => void
      ): IDisposable
      /**
       * An event emitted when the options of the current model has changed.
       * @event
       */
      onDidChangeModelOptions(
        listener: (e: IModelOptionsChangedEvent) => void
      ): IDisposable
      /**
       * An event emitted when the configuration of the editor has changed. (e.g. `editor.updateOptions()`)
       * @event
       */
      onDidChangeConfiguration(
        listener: (e: ConfigurationChangedEvent) => void
      ): IDisposable
      /**
       * An event emitted when the cursor position has changed.
       * @event
       */
      onDidChangeCursorPosition(
        listener: (e: ICursorPositionChangedEvent) => void
      ): IDisposable
      /**
       * An event emitted when the cursor selection has changed.
       * @event
       */
      onDidChangeCursorSelection(
        listener: (e: ICursorSelectionChangedEvent) => void
      ): IDisposable
      /**
       * An event emitted when the model of this editor has changed (e.g. `editor.setModel()`).
       * @event
       */
      onDidChangeModel(
        listener: (e: IModelChangedEvent) => void
      ): IDisposable
      /**
       * An event emitted when the decorations of the current model have changed.
       * @event
       */
      onDidChangeModelDecorations(
        listener: (e: IModelDecorationsChangedEvent) => void
      ): IDisposable
      /**
       * An event emitted when the text inside this editor gained focus (i.e. cursor starts blinking).
       * @event
       */
      onDidFocusEditorText(
        listener: () => void
      ): IDisposable
      /**
       * An event emitted when the text inside this editor lost focus (i.e. cursor stops blinking).
       * @event
       */
      onDidBlurEditorText(listener: () => void): IDisposable
      /**
       * An event emitted when the text inside this editor or an editor widget gained focus.
       * @event
       */
      onDidFocusEditorWidget(
        listener: () => void
      ): IDisposable
      /**
       * An event emitted when the text inside this editor or an editor widget lost focus.
       * @event
       */
      onDidBlurEditorWidget(
        listener: () => void
      ): IDisposable
      /**
       * An event emitted after composition has started.
       */
      onDidCompositionStart(
        listener: () => void
      ): IDisposable
      /**
       * An event emitted after composition has ended.
       */
      onDidCompositionEnd(listener: () => void): IDisposable
      /**
       * An event emitted when editing failed because the editor is read-only.
       * @event
       */
      onDidAttemptReadOnlyEdit(
        listener: () => void
      ): IDisposable
      /**
       * An event emitted when users paste text in the editor.
       * @event
       */
      onDidPaste(
        listener: (e: IPasteEvent) => void
      ): IDisposable
      /**
       * An event emitted on a "mouseup".
       * @event
       */
      onMouseUp(
        listener: (e: IEditorMouseEvent) => void
      ): IDisposable
      /**
       * An event emitted on a "mousedown".
       * @event
       */
      onMouseDown(
        listener: (e: IEditorMouseEvent) => void
      ): IDisposable
      /**
       * An event emitted on a "contextmenu".
       * @event
       */
      onContextMenu(
        listener: (e: IEditorMouseEvent) => void
      ): IDisposable
      /**
       * An event emitted on a "mousemove".
       * @event
       */
      onMouseMove(
        listener: (e: IEditorMouseEvent) => void
      ): IDisposable
      /**
       * An event emitted on a "mouseleave".
       * @event
       */
      onMouseLeave(
        listener: (e: IPartialEditorMouseEvent) => void
      ): IDisposable
      /**
       * An event emitted on a "keyup".
       * @event
       */
      onKeyUp(
        listener: (e: IKeyboardEvent) => void
      ): IDisposable
      /**
       * An event emitted on a "keydown".
       * @event
       */
      onKeyDown(
        listener: (e: IKeyboardEvent) => void
      ): IDisposable
      /**
       * An event emitted when the layout of the editor has changed.
       * @event
       */
      onDidLayoutChange(
        listener: (e: EditorLayoutInfo) => void
      ): IDisposable
      /**
       * An event emitted when the content width or content height in the editor has changed.
       * @event
       */
      onDidContentSizeChange(
        listener: (e: IContentSizeChangedEvent) => void
      ): IDisposable
      /**
       * An event emitted when the scroll in the editor has changed.
       * @event
       */
      onDidScrollChange(
        listener: (e: IScrollEvent) => void
      ): IDisposable
      /**
       * Saves current view state of the editor in a serializable object.
       */
      saveViewState(): ICodeEditorViewState | null
      /**
       * Restores the view state of the editor from a serializable object generated by `saveViewState`.
       */
      restoreViewState(state: ICodeEditorViewState): void
      /**
       * Returns true if the text inside this editor or an editor widget has focus.
       */
      hasWidgetFocus(): boolean
      /**
       * Get a contribution of this editor.
       * @id Unique identifier of the contribution.
       * @return The contribution or null if contribution not found.
       */
      getContribution<T extends IEditorContribution>(
        id: string
      ): T
      /**
       * Type the getModel() of IEditor.
       */
      getModel(): ITextModel | null
      /**
       * Sets the current model attached to this editor.
       * If the previous model was created by the editor via the value key in the options
       * literal object, it will be destroyed. Otherwise, if the previous model was set
       * via setModel, or the model key in the options literal object, the previous model
       * will not be destroyed.
       * It is safe to call setModel(null) to simply detach the current model from the editor.
       */
      setModel(model: ITextModel | null): void
      /**
       * Gets all the editor computed options.
       */
      getOptions(): IComputedEditorOptions
      /**
       * Gets a specific editor option.
       */
      getOption<T extends EditorOption>(
        id: T
      ): FindComputedEditorOptionValueById<T>
      /**
       * Returns the editor's configuration (without any validation or defaults).
       */
      getRawOptions(): IEditorOptions
      /**
       * Get value of the current model attached to this editor.
       * @see {@link ITextModel.getValue}
       */
      getValue(options?: {
        preserveBOM: boolean
        lineEnding: string
      }): string
      /**
       * Set the value of the current model attached to this editor.
       * @see {@link ITextModel.setValue}
       */
      setValue(newValue: string): void
      /**
       * Get the width of the editor's content.
       * This is information that is "erased" when computing `scrollWidth = Math.max(contentWidth, width)`
       */
      getContentWidth(): number
      /**
       * Get the scrollWidth of the editor's viewport.
       */
      getScrollWidth(): number
      /**
       * Get the scrollLeft of the editor's viewport.
       */
      getScrollLeft(): number
      /**
       * Get the height of the editor's content.
       * This is information that is "erased" when computing `scrollHeight = Math.max(contentHeight, height)`
       */
      getContentHeight(): number
      /**
       * Get the scrollHeight of the editor's viewport.
       */
      getScrollHeight(): number
      /**
       * Get the scrollTop of the editor's viewport.
       */
      getScrollTop(): number
      /**
       * Change the scrollLeft of the editor's viewport.
       */
      setScrollLeft(
        newScrollLeft: number,
        scrollType?: ScrollType
      ): void
      /**
       * Change the scrollTop of the editor's viewport.
       */
      setScrollTop(
        newScrollTop: number,
        scrollType?: ScrollType
      ): void
      /**
       * Change the scroll position of the editor's viewport.
       */
      setScrollPosition(
        position: INewScrollPosition,
        scrollType?: ScrollType
      ): void
      /**
       * Get an action that is a contribution to this editor.
       * @id Unique identifier of the contribution.
       * @return The action or null if action not found.
       */
      getAction(id: string): IEditorAction
      /**
       * Execute a command on the editor.
       * The edits will land on the undo-redo stack, but no "undo stop" will be pushed.
       * @param source The source of the call.
       * @param command The command to execute
       */
      executeCommand(
        source: string | null | undefined,
        command: ICommand
      ): void
      /**
       * Create an "undo stop" in the undo-redo stack.
       */
      pushUndoStop(): boolean
      /**
       * Remove the "undo stop" in the undo-redo stack.
       */
      popUndoStop(): boolean
      /**
       * Execute edits on the editor.
       * The edits will land on the undo-redo stack, but no "undo stop" will be pushed.
       * @param source The source of the call.
       * @param edits The edits to execute.
       * @param endCursorState Cursor state after the edits were applied.
       */
      executeEdits(
        source: string | null | undefined,
        edits: IIdentifiedSingleEditOperation[],
        endCursorState?: ICursorStateComputer | Selection[]
      ): boolean
      /**
       * Execute multiple (concomitant) commands on the editor.
       * @param source The source of the call.
       * @param command The commands to execute
       */
      executeCommands(
        source: string | null | undefined,
        commands: (ICommand | null)[]
      ): void
      /**
       * Get all the decorations on a line (filtering out decorations from other editors).
       */
      getLineDecorations(
        lineNumber: number
      ): IModelDecoration[] | null
      /**
       * All decorations added through this call will get the ownerId of this editor.
       * @see {@link ITextModel.deltaDecorations}
       */
      deltaDecorations(
        oldDecorations: string[],
        newDecorations: IModelDeltaDecoration[]
      ): string[]
      /**
       * Get the layout info for the editor.
       */
      getLayoutInfo(): EditorLayoutInfo
      /**
       * Returns the ranges that are currently visible.
       * Does not account for horizontal scrolling.
       */
      getVisibleRanges(): Range[]
      /**
       * Get the vertical position (top offset) for the line w.r.t. to the first line.
       */
      getTopForLineNumber(lineNumber: number): number
      /**
       * Get the vertical position (top offset) for the position w.r.t. to the first line.
       */
      getTopForPosition(
        lineNumber: number,
        column: number
      ): number
      /**
       * Returns the editor's container dom node
       */
      getContainerDomNode(): any
      /**
       * Returns the editor's dom node
       */
      getDomNode(): any | null
      /**
       * Add a content widget. Widgets must have unique ids, otherwise they will be overwritten.
       */
      addContentWidget(widget: IContentWidget): void
      /**
       * Layout/Reposition a content widget. This is a ping to the editor to call widget.getPosition()
       * and update appropriately.
       */
      layoutContentWidget(widget: IContentWidget): void
      /**
       * Remove a content widget.
       */
      removeContentWidget(widget: IContentWidget): void
      /**
       * Add an overlay widget. Widgets must have unique ids, otherwise they will be overwritten.
       */
      addOverlayWidget(widget: IOverlayWidget): void
      /**
       * Layout/Reposition an overlay widget. This is a ping to the editor to call widget.getPosition()
       * and update appropriately.
       */
      layoutOverlayWidget(widget: IOverlayWidget): void
      /**
       * Remove an overlay widget.
       */
      removeOverlayWidget(widget: IOverlayWidget): void
      /**
       * Change the view zones. View zones are lost when a new model is attached to the editor.
       */
      changeViewZones(
        callback: (
          accessor: IViewZoneChangeAccessor
        ) => void
      ): void
      /**
       * Get the horizontal position (left offset) for the column w.r.t to the beginning of the line.
       * This method works only if the line `lineNumber` is currently rendered (in the editor's viewport).
       * Use this method with caution.
       */
      getOffsetForColumn(
        lineNumber: number,
        column: number
      ): number
      /**
       * Force an editor render now.
       */
      render(forceRedraw?: boolean): void
      /**
       * Get the hit test target at coordinates `clientX` and `clientY`.
       * The coordinates are relative to the top-left of the viewport.
       *
       * @returns Hit test target or null if the coordinates fall outside the editor or the editor has no model.
       */
      getTargetAtClientPoint(
        clientX: number,
        clientY: number
      ): IMouseTarget | null
      /**
       * Get the visible position for `position`.
       * The result position takes scrolling into account and is relative to the top left corner of the editor.
       * Explanation 1: the results of this method will change for the same `position` if the user scrolls the editor.
       * Explanation 2: the results of this method will not change if the container of the editor gets repositioned.
       * Warning: the results of this method are inaccurate for positions that are outside the current editor viewport.
       */
      getScrolledVisiblePosition(position: IPosition): {
        top: number
        left: number
        height: number
      } | null
      /**
       * Apply the same font settings as the editor to `target`.
       */
      applyFontInfo(target: any): void
    }

    /**
     * Information about a line in the diff editor
     */
    export interface IDiffLineInformation {
      readonly equivalentLineNumber: number
    }

    /**
     * A rich diff editor.
     */
    export interface IDiffEditor extends IEditor {
      /**
       * @see {@link ICodeEditor.getDomNode}
       */
      getDomNode(): any
      /**
       * An event emitted when the diff information computed by this diff editor has been updated.
       * @event
       */
      onDidUpdateDiff(listener: () => void): IDisposable
      /**
       * Saves current view state of the editor in a serializable object.
       */
      saveViewState(): IDiffEditorViewState | null
      /**
       * Restores the view state of the editor from a serializable object generated by `saveViewState`.
       */
      restoreViewState(state: IDiffEditorViewState): void
      /**
       * Type the getModel() of IEditor.
       */
      getModel(): IDiffEditorModel | null
      /**
       * Sets the current model attached to this editor.
       * If the previous model was created by the editor via the value key in the options
       * literal object, it will be destroyed. Otherwise, if the previous model was set
       * via setModel, or the model key in the options literal object, the previous model
       * will not be destroyed.
       * It is safe to call setModel(null) to simply detach the current model from the editor.
       */
      setModel(model: IDiffEditorModel | null): void
      /**
       * Get the `original` editor.
       */
      getOriginalEditor(): ICodeEditor
      /**
       * Get the `modified` editor.
       */
      getModifiedEditor(): ICodeEditor
      /**
       * Get the computed diff information.
       */
      getLineChanges(): ILineChange[] | null
      /**
       * Get information based on computed diff about a line number from the original model.
       * If the diff computation is not finished or the model is missing, will return null.
       */
      getDiffLineInformationForOriginal(
        lineNumber: number
      ): IDiffLineInformation | null
      /**
       * Get information based on computed diff about a line number from the modified model.
       * If the diff computation is not finished or the model is missing, will return null.
       */
      getDiffLineInformationForModified(
        lineNumber: number
      ): IDiffLineInformation | null
      /**
       * Update the editor's options after the editor has been created.
       */
      updateOptions(newOptions: IDiffEditorOptions): void
    }

    export class FontInfo extends BareFontInfo {
      readonly _editorStylingBrand: void
      readonly version: number
      readonly isTrusted: boolean
      readonly isMonospace: boolean
      readonly typicalHalfwidthCharacterWidth: number
      readonly typicalFullwidthCharacterWidth: number
      readonly canUseHalfwidthRightwardsArrow: boolean
      readonly spaceWidth: number
      readonly middotWidth: number
      readonly wsmiddotWidth: number
      readonly maxDigitWidth: number
    }

    export class BareFontInfo {
      readonly _bareFontInfoBrand: void
      readonly zoomLevel: number
      readonly pixelRatio: number
      readonly fontFamily: string
      readonly fontWeight: string
      readonly fontSize: number
      readonly fontFeatureSettings: string
      readonly lineHeight: number
      readonly letterSpacing: number
    }

    //compatibility:
    export type IReadOnlyModel = ITextModel
    export type IModel = ITextModel
  }

  export namespace languages {
    /**
     * Register information about a new language.
     */
    export function register(
      language: ILanguageExtensionPoint
    ): void

    /**
     * Get the information of all the registered languages.
     */
    export function getLanguages(): ILanguageExtensionPoint[]

    export function getEncodedLanguageId(
      languageId: string
    ): number

    /**
     * An event emitted when a language is first time needed (e.g. a model has it set).
     * @event
     */
    export function onLanguage(
      languageId: string,
      callback: () => void
    ): IDisposable

    /**
     * Set the editing configuration for a language.
     */
    export function setLanguageConfiguration(
      languageId: string,
      configuration: LanguageConfiguration
    ): IDisposable

    /**
     * A token.
     */
    export interface IToken {
      startIndex: number
      scopes: string
    }

    /**
     * The result of a line tokenization.
     */
    export interface ILineTokens {
      /**
       * The list of tokens on the line.
       */
      tokens: IToken[]
      /**
       * The tokenization end state.
       * A pointer will be held to this and the object should not be modified by the tokenizer after the pointer is returned.
       */
      endState: IState
    }

    /**
     * The result of a line tokenization.
     */
    export interface IEncodedLineTokens {
      /**
       * The tokens on the line in a binary, encoded format. Each token occupies two array indices. For token i:
       *  - at offset 2*i => startIndex
       *  - at offset 2*i + 1 => metadata
       * Meta data is in binary format:
       * - -------------------------------------------
       *     3322 2222 2222 1111 1111 1100 0000 0000
       *     1098 7654 3210 9876 5432 1098 7654 3210
       * - -------------------------------------------
       *     bbbb bbbb bfff ffff ffFF FTTT LLLL LLLL
       * - -------------------------------------------
       *  - L = EncodedLanguageId (8 bits): Use `getEncodedLanguageId` to get the encoded ID of a language.
       *  - T = StandardTokenType (3 bits): Other = 0, Comment = 1, String = 2, RegEx = 4.
       *  - F = FontStyle (3 bits): None = 0, Italic = 1, Bold = 2, Underline = 4.
       *  - f = foreground ColorId (9 bits)
       *  - b = background ColorId (9 bits)
       *  - The color value for each colorId is defined in IStandaloneThemeData.customTokenColors:
       * e.g. colorId = 1 is stored in IStandaloneThemeData.customTokenColors[1]. Color id = 0 means no color,
       * id = 1 is for the default foreground color, id = 2 for the default background.
       */
      tokens: Uint32Array
      /**
       * The tokenization end state.
       * A pointer will be held to this and the object should not be modified by the tokenizer after the pointer is returned.
       */
      endState: IState
    }

    /**
     * A "manual" provider of tokens.
     */
    export interface TokensProvider {
      /**
       * The initial state of a language. Will be the state passed in to tokenize the first line.
       */
      getInitialState(): IState
      /**
       * Tokenize a line given the state at the beginning of the line.
       */
      tokenize(line: string, state: IState): ILineTokens
    }

    /**
     * A "manual" provider of tokens, returning tokens in a binary form.
     */
    export interface EncodedTokensProvider {
      /**
       * The initial state of a language. Will be the state passed in to tokenize the first line.
       */
      getInitialState(): IState
      /**
       * Tokenize a line given the state at the beginning of the line.
       */
      tokenizeEncoded(
        line: string,
        state: IState
      ): IEncodedLineTokens
      /**
       * Tokenize a line given the state at the beginning of the line.
       */
      tokenize?(line: string, state: IState): ILineTokens
    }

    /**
     * Change the color map that is used for token colors.
     * Supported formats (hex): #RRGGBB, $RRGGBBAA, #RGB, #RGBA
     */
    export function setColorMap(
      colorMap: string[] | null
    ): void

    /**
     * Set the tokens provider for a language (manual implementation).
     */
    export function setTokensProvider(
      languageId: string,
      provider:
        | TokensProvider
        | EncodedTokensProvider
        | Thenable<TokensProvider | EncodedTokensProvider>
    ): IDisposable

    /**
     * Set the tokens provider for a language (monarch implementation).
     */
    export function setMonarchTokensProvider(
      languageId: string,
      languageDef:
        | IMonarchLanguage
        | Thenable<IMonarchLanguage>
    ): IDisposable

    /**
     * Register a reference provider (used by e.g. reference search).
     */
    export function registerReferenceProvider(
      languageId: string,
      provider: ReferenceProvider
    ): IDisposable

    /**
     * Register a rename provider (used by e.g. rename symbol).
     */
    export function registerRenameProvider(
      languageId: string,
      provider: RenameProvider
    ): IDisposable

    /**
     * Register a signature help provider (used by e.g. parameter hints).
     */
    export function registerSignatureHelpProvider(
      languageId: string,
      provider: SignatureHelpProvider
    ): IDisposable

    /**
     * Register a hover provider (used by e.g. editor hover).
     */
    export function registerHoverProvider(
      languageId: string,
      provider: HoverProvider
    ): IDisposable

    /**
     * Register a document symbol provider (used by e.g. outline).
     */
    export function registerDocumentSymbolProvider(
      languageId: string,
      provider: DocumentSymbolProvider
    ): IDisposable

    /**
     * Register a document highlight provider (used by e.g. highlight occurrences).
     */
    export function registerDocumentHighlightProvider(
      languageId: string,
      provider: DocumentHighlightProvider
    ): IDisposable

    /**
     * Register an linked editing range provider.
     */
    export function registerLinkedEditingRangeProvider(
      languageId: string,
      provider: LinkedEditingRangeProvider
    ): IDisposable

    /**
     * Register a definition provider (used by e.g. go to definition).
     */
    export function registerDefinitionProvider(
      languageId: string,
      provider: DefinitionProvider
    ): IDisposable

    /**
     * Register a implementation provider (used by e.g. go to implementation).
     */
    export function registerImplementationProvider(
      languageId: string,
      provider: ImplementationProvider
    ): IDisposable

    /**
     * Register a type definition provider (used by e.g. go to type definition).
     */
    export function registerTypeDefinitionProvider(
      languageId: string,
      provider: TypeDefinitionProvider
    ): IDisposable

    /**
     * Register a code lens provider (used by e.g. inline code lenses).
     */
    export function registerCodeLensProvider(
      languageId: string,
      provider: CodeLensProvider
    ): IDisposable

    /**
     * Register a code action provider (used by e.g. quick fix).
     */
    export function registerCodeActionProvider(
      languageId: string,
      provider: CodeActionProvider
    ): IDisposable

    /**
     * Register a formatter that can handle only entire models.
     */
    export function registerDocumentFormattingEditProvider(
      languageId: string,
      provider: DocumentFormattingEditProvider
    ): IDisposable

    /**
     * Register a formatter that can handle a range inside a model.
     */
    export function registerDocumentRangeFormattingEditProvider(
      languageId: string,
      provider: DocumentRangeFormattingEditProvider
    ): IDisposable

    /**
     * Register a formatter than can do formatting as the user types.
     */
    export function registerOnTypeFormattingEditProvider(
      languageId: string,
      provider: OnTypeFormattingEditProvider
    ): IDisposable

    /**
     * Register a link provider that can find links in text.
     */
    export function registerLinkProvider(
      languageId: string,
      provider: LinkProvider
    ): IDisposable

    /**
     * Register a completion item provider (use by e.g. suggestions).
     */
    export function registerCompletionItemProvider(
      languageId: string,
      provider: CompletionItemProvider
    ): IDisposable

    /**
     * Register a document color provider (used by Color Picker, Color Decorator).
     */
    export function registerColorProvider(
      languageId: string,
      provider: DocumentColorProvider
    ): IDisposable

    /**
     * Register a folding range provider
     */
    export function registerFoldingRangeProvider(
      languageId: string,
      provider: FoldingRangeProvider
    ): IDisposable

    /**
     * Register a declaration provider
     */
    export function registerDeclarationProvider(
      languageId: string,
      provider: DeclarationProvider
    ): IDisposable

    /**
     * Register a selection range provider
     */
    export function registerSelectionRangeProvider(
      languageId: string,
      provider: SelectionRangeProvider
    ): IDisposable

    /**
     * Register a document semantic tokens provider
     */
    export function registerDocumentSemanticTokensProvider(
      languageId: string,
      provider: DocumentSemanticTokensProvider
    ): IDisposable

    /**
     * Register a document range semantic tokens provider
     */
    export function registerDocumentRangeSemanticTokensProvider(
      languageId: string,
      provider: DocumentRangeSemanticTokensProvider
    ): IDisposable

    /**
     * Register an inline completions provider.
     */
    export function registerInlineCompletionsProvider(
      languageId: string,
      provider: InlineCompletionsProvider
    ): IDisposable

    /**
     * Contains additional diagnostic information about the context in which
     * a [code action](#CodeActionProvider.provideCodeActions) is run.
     */
    export interface CodeActionContext {
      /**
       * An array of diagnostics.
       */
      readonly markers: editor.IMarkerData[]
      /**
       * Requested kind of actions to return.
       */
      readonly only?: string
    }

    /**
     * The code action interface defines the contract between extensions and
     * the [light bulb](https://code.visualstudio.com/docs/editor/editingevolved#_code-action) feature.
     */
    export interface CodeActionProvider {
      /**
       * Provide commands for the given document and range.
       */
      provideCodeActions(
        model: editor.ITextModel,
        range: Range,
        context: CodeActionContext,
        token: CancellationToken
      ): ProviderResult<CodeActionList>
    }

    /**
     * Describes how comments for a language work.
     */
    export interface CommentRule {
      /**
       * The line comment token, like `// this is a comment`
       */
      lineComment?: string | null
      /**
       * The block comment character pair, like `/* block comment *&#47;`
       */
      blockComment?: CharacterPair | null
    }

    /**
     * The language configuration interface defines the contract between extensions and
     * various editor features, like automatic bracket insertion, automatic indentation etc.
     */
    export interface LanguageConfiguration {
      /**
       * The language's comment settings.
       */
      comments?: CommentRule
      /**
       * The language's brackets.
       * This configuration implicitly affects pressing Enter around these brackets.
       */
      brackets?: CharacterPair[]
      /**
       * The language's word definition.
       * If the language supports Unicode identifiers (e.g. JavaScript), it is preferable
       * to provide a word definition that uses exclusion of known separators.
       * e.g.: A regex that matches anything except known separators (and dot is allowed to occur in a floating point number):
       *   /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g
       */
      wordPattern?: RegExp
      /**
       * The language's indentation settings.
       */
      indentationRules?: IndentationRule
      /**
       * The language's rules to be evaluated when pressing Enter.
       */
      onEnterRules?: OnEnterRule[]
      /**
       * The language's auto closing pairs. The 'close' character is automatically inserted with the
       * 'open' character is typed. If not set, the configured brackets will be used.
       */
      autoClosingPairs?: IAutoClosingPairConditional[]
      /**
       * The language's surrounding pairs. When the 'open' character is typed on a selection, the
       * selected string is surrounded by the open and close characters. If not set, the autoclosing pairs
       * settings will be used.
       */
      surroundingPairs?: IAutoClosingPair[]
      /**
       * Defines what characters must be after the cursor for bracket or quote autoclosing to occur when using the \'languageDefined\' autoclosing setting.
       *
       * This is typically the set of characters which can not start an expression, such as whitespace, closing brackets, non-unary operators, etc.
       */
      autoCloseBefore?: string
      /**
       * The language's folding rules.
       */
      folding?: FoldingRules
      /**
       * **Deprecated** Do not use.
       *
       * @deprecated Will be replaced by a better API soon.
       */
      __electricCharacterSupport?: {
        docComment?: IDocComment
      }
    }

    /**
     * Describes indentation rules for a language.
     */
    export interface IndentationRule {
      /**
       * If a line matches this pattern, then all the lines after it should be unindented once (until another rule matches).
       */
      decreaseIndentPattern: RegExp
      /**
       * If a line matches this pattern, then all the lines after it should be indented once (until another rule matches).
       */
      increaseIndentPattern: RegExp
      /**
       * If a line matches this pattern, then **only the next line** after it should be indented once.
       */
      indentNextLinePattern?: RegExp | null
      /**
       * If a line matches this pattern, then its indentation should not be changed and it should not be evaluated against the other rules.
       */
      unIndentedLinePattern?: RegExp | null
    }

    /**
     * Describes language specific folding markers such as '#region' and '#endregion'.
     * The start and end regexes will be tested against the contents of all lines and must be designed efficiently:
     * - the regex should start with '^'
     * - regexp flags (i, g) are ignored
     */
    export interface FoldingMarkers {
      start: RegExp
      end: RegExp
    }

    /**
     * Describes folding rules for a language.
     */
    export interface FoldingRules {
      /**
       * Used by the indentation based strategy to decide whether empty lines belong to the previous or the next block.
       * A language adheres to the off-side rule if blocks in that language are expressed by their indentation.
       * See [wikipedia](https://en.wikipedia.org/wiki/Off-side_rule) for more information.
       * If not set, `false` is used and empty lines belong to the previous block.
       */
      offSide?: boolean
      /**
       * Region markers used by the language.
       */
      markers?: FoldingMarkers
    }

    /**
     * Describes a rule to be evaluated when pressing Enter.
     */
    export interface OnEnterRule {
      /**
       * This rule will only execute if the text before the cursor matches this regular expression.
       */
      beforeText: RegExp
      /**
       * This rule will only execute if the text after the cursor matches this regular expression.
       */
      afterText?: RegExp
      /**
       * This rule will only execute if the text above the this line matches this regular expression.
       */
      previousLineText?: RegExp
      /**
       * The action to execute.
       */
      action: EnterAction
    }

    /**
     * Definition of documentation comments (e.g. Javadoc/JSdoc)
     */
    export interface IDocComment {
      /**
       * The string that starts a doc comment (e.g. '/**')
       */
      open: string
      /**
       * The string that appears on the last line and closes the doc comment (e.g. ' * /').
       */
      close?: string
    }

    /**
     * A tuple of two characters, like a pair of
     * opening and closing brackets.
     */
    export type CharacterPair = [string, string]

    export interface IAutoClosingPair {
      open: string
      close: string
    }

    export interface IAutoClosingPairConditional
      extends IAutoClosingPair {
      notIn?: string[]
    }

    /**
     * Describes what to do with the indentation when pressing Enter.
     */
    export enum IndentAction {
      /**
       * Insert new line and copy the previous line's indentation.
       */
      None = 0,
      /**
       * Insert new line and indent once (relative to the previous line's indentation).
       */
      Indent = 1,
      /**
       * Insert two new lines:
       *  - the first one indented which will hold the cursor
       *  - the second one at the same indentation level
       */
      IndentOutdent = 2,
      /**
       * Insert new line and outdent once (relative to the previous line's indentation).
       */
      Outdent = 3,
    }

    /**
     * Describes what to do when pressing Enter.
     */
    export interface EnterAction {
      /**
       * Describe what to do with the indentation.
       */
      indentAction: IndentAction
      /**
       * Describes text to be appended after the new line and after the indentation.
       */
      appendText?: string
      /**
       * Describes the number of characters to remove from the new line's indentation.
       */
      removeText?: number
    }

    /**
     * The state of the tokenizer between two lines.
     * It is useful to store flags such as in multiline comment, etc.
     * The model will clone the previous line's state and pass it in to tokenize the next line.
     */
    export interface IState {
      clone(): IState
      equals(other: IState): boolean
    }

    /**
     * A provider result represents the values a provider, like the {@link HoverProvider},
     * may return. For once this is the actual result type `T`, like `Hover`, or a thenable that resolves
     * to that type `T`. In addition, `null` and `undefined` can be returned - either directly or from a
     * thenable.
     */
    export type ProviderResult<T> =
      | T
      | undefined
      | null
      | Thenable<T | undefined | null>

    /**
     * A hover represents additional information for a symbol or word. Hovers are
     * rendered in a tooltip-like widget.
     */
    export interface Hover {
      /**
       * The contents of this hover.
       */
      contents: IMarkdownString[]
      /**
       * The range to which this hover applies. When missing, the
       * editor will use the range at the current position or the
       * current position itself.
       */
      range?: IRange
    }

    /**
     * The hover provider interface defines the contract between extensions and
     * the [hover](https://code.visualstudio.com/docs/editor/intellisense)-feature.
     */
    export interface HoverProvider {
      /**
       * Provide a hover for the given position and document. Multiple hovers at the same
       * position will be merged by the editor. A hover can have a range which defaults
       * to the word range at the position when omitted.
       */
      provideHover(
        model: editor.ITextModel,
        position: Position,
        token: CancellationToken
      ): ProviderResult<Hover>
    }

    export enum CompletionItemKind {
      Method = 0,
      Function = 1,
      Constructor = 2,
      Field = 3,
      Variable = 4,
      Class = 5,
      Struct = 6,
      Interface = 7,
      Module = 8,
      Property = 9,
      Event = 10,
      Operator = 11,
      Unit = 12,
      Value = 13,
      Constant = 14,
      Enum = 15,
      EnumMember = 16,
      Keyword = 17,
      Text = 18,
      Color = 19,
      File = 20,
      Reference = 21,
      Customcolor = 22,
      Folder = 23,
      TypeParameter = 24,
      User = 25,
      Issue = 26,
      Snippet = 27,
    }

    export interface CompletionItemLabel {
      /**
       * The function or variable. Rendered leftmost.
       */
      name: string
      /**
       * The parameters without the return type. Render after `name`.
       */
      parameters?: string
      /**
       * The fully qualified name, like package name or file path. Rendered after `signature`.
       */
      qualifier?: string
      /**
       * The return-type of a function or type of a property/variable. Rendered rightmost.
       */
      type?: string
    }

    export enum CompletionItemTag {
      Deprecated = 1,
    }

    export enum CompletionItemInsertTextRule {
      /**
       * Adjust whitespace/indentation of multiline insert texts to
       * match the current line indentation.
       */
      KeepWhitespace = 1,
      /**
       * `insertText` is a snippet.
       */
      InsertAsSnippet = 4,
    }

    /**
     * A completion item represents a text snippet that is
     * proposed to complete text that is being typed.
     */
    export interface CompletionItem {
      /**
       * The label of this completion item. By default
       * this is also the text that is inserted when selecting
       * this completion.
       */
      label: string | CompletionItemLabel
      /**
       * The kind of this completion item. Based on the kind
       * an icon is chosen by the editor.
       */
      kind: CompletionItemKind
      /**
       * A modifier to the `kind` which affect how the item
       * is rendered, e.g. Deprecated is rendered with a strikeout
       */
      tags?: ReadonlyArray<CompletionItemTag>
      /**
       * A human-readable string with additional information
       * about this item, like type or symbol information.
       */
      detail?: string
      /**
       * A human-readable string that represents a doc-comment.
       */
      documentation?: string | IMarkdownString
      /**
       * A string that should be used when comparing this item
       * with other items. When `falsy` the {@link CompletionItem.label label}
       * is used.
       */
      sortText?: string
      /**
       * A string that should be used when filtering a set of
       * completion items. When `falsy` the {@link CompletionItem.label label}
       * is used.
       */
      filterText?: string
      /**
       * Select this item when showing. *Note* that only one completion item can be selected and
       * that the editor decides which item that is. The rule is that the *first* item of those
       * that match best is selected.
       */
      preselect?: boolean
      /**
       * A string or snippet that should be inserted in a document when selecting
       * this completion.
       * is used.
       */
      insertText: string
      /**
       * Addition rules (as bitmask) that should be applied when inserting
       * this completion.
       */
      insertTextRules?: CompletionItemInsertTextRule
      /**
       * A range of text that should be replaced by this completion item.
       *
       * Defaults to a range from the start of the {@link TextDocument.getWordRangeAtPosition current word} to the
       * current position.
       *
       * *Note:* The range must be a {@link Range.isSingleLine single line} and it must
       * {@link Range.contains contain} the position at which completion has been {@link CompletionItemProvider.provideCompletionItems requested}.
       */
      range:
      | IRange
      | {
        insert: IRange
        replace: IRange
      }
      /**
       * An optional set of characters that when pressed while this completion is active will accept it first and
       * then type that character. *Note* that all commit characters should have `length=1` and that superfluous
       * characters will be ignored.
       */
      commitCharacters?: string[]
      /**
       * An optional array of additional text edits that are applied when
       * selecting this completion. Edits must not overlap with the main edit
       * nor with themselves.
       */
      additionalTextEdits?: editor.ISingleEditOperation[]
      /**
       * A command that should be run upon acceptance of this item.
       */
      command?: Command
    }

    export interface CompletionList {
      suggestions: CompletionItem[]
      incomplete?: boolean
      dispose?(): void
    }

    /**
     * How a suggest provider was triggered.
     */
    export enum CompletionTriggerKind {
      Invoke = 0,
      TriggerCharacter = 1,
      TriggerForIncompleteCompletions = 2,
    }

    /**
     * Contains additional information about the context in which
     * {@link CompletionItemProvider.provideCompletionItems completion provider} is triggered.
     */
    export interface CompletionContext {
      /**
       * How the completion was triggered.
       */
      triggerKind: CompletionTriggerKind
      /**
       * Character that triggered the completion item provider.
       *
       * `undefined` if provider was not triggered by a character.
       */
      triggerCharacter?: string
    }

    /**
     * The completion item provider interface defines the contract between extensions and
     * the [IntelliSense](https://code.visualstudio.com/docs/editor/intellisense).
     *
     * When computing *complete* completion items is expensive, providers can optionally implement
     * the `resolveCompletionItem`-function. In that case it is enough to return completion
     * items with a {@link CompletionItem.label label} from the
     * {@link CompletionItemProvider.provideCompletionItems provideCompletionItems}-function. Subsequently,
     * when a completion item is shown in the UI and gains focus this provider is asked to resolve
     * the item, like adding {@link CompletionItem.documentation doc-comment} or {@link CompletionItem.detail details}.
     */
    export interface CompletionItemProvider {
      triggerCharacters?: string[]
      /**
       * Provide completion items for the given position and document.
       */
      provideCompletionItems(
        model: editor.ITextModel,
        position: Position,
        context: CompletionContext,
        token: CancellationToken
      ): ProviderResult<CompletionList>
      /**
       * Given a completion item fill in more data, like {@link CompletionItem.documentation doc-comment}
       * or {@link CompletionItem.detail details}.
       *
       * The editor will only resolve a completion item once.
       */
      resolveCompletionItem?(
        item: CompletionItem,
        token: CancellationToken
      ): ProviderResult<CompletionItem>
    }

    /**
     * How an {@link InlineCompletionsProvider inline completion provider} was triggered.
     */
    export enum InlineCompletionTriggerKind {
      /**
       * Completion was triggered automatically while editing.
       * It is sufficient to return a single completion item in this case.
       */
      Automatic = 0,
      /**
       * Completion was triggered explicitly by a user gesture.
       * Return multiple completion items to enable cycling through them.
       */
      Explicit = 1,
    }

    export interface InlineCompletionContext {
      /**
       * How the completion was triggered.
       */
      readonly triggerKind: InlineCompletionTriggerKind
    }

    export interface InlineCompletion {
      /**
       * The text to insert.
       * If the text contains a line break, the range must end at the end of a line.
       * If existing text should be replaced, the existing text must be a prefix of the text to insert.
       */
      readonly text: string
      /**
       * The range to replace.
       * Must begin and end on the same line.
       */
      readonly range?: IRange
      readonly command?: Command
    }

    export interface InlineCompletions<
      TItem extends InlineCompletion = InlineCompletion
    > {
      readonly items: readonly TItem[]
    }

    export interface InlineCompletionsProvider<
      T extends InlineCompletions = InlineCompletions
    > {
      provideInlineCompletions(
        model: editor.ITextModel,
        position: Position,
        context: InlineCompletionContext,
        token: CancellationToken
      ): ProviderResult<T>
      /**
       * Will be called when an item is shown.
       */
      handleItemDidShow?(
        completions: T,
        item: T["items"][number]
      ): void
      /**
       * Will be called when a completions list is no longer in use and can be garbage-collected.
       */
      freeInlineCompletions(completions: T): void
    }

    export interface CodeAction {
      title: string
      command?: Command
      edit?: WorkspaceEdit
      diagnostics?: editor.IMarkerData[]
      kind?: string
      isPreferred?: boolean
      disabled?: string
    }

    export interface CodeActionList extends IDisposable {
      readonly actions: ReadonlyArray<CodeAction>
    }

    /**
     * Represents a parameter of a callable-signature. A parameter can
     * have a label and a doc-comment.
     */
    export interface ParameterInformation {
      /**
       * The label of this signature. Will be shown in
       * the UI.
       */
      label: string | [number, number]
      /**
       * The human-readable doc-comment of this signature. Will be shown
       * in the UI but can be omitted.
       */
      documentation?: string | IMarkdownString
    }

    /**
     * Represents the signature of something callable. A signature
     * can have a label, like a function-name, a doc-comment, and
     * a set of parameters.
     */
    export interface SignatureInformation {
      /**
       * The label of this signature. Will be shown in
       * the UI.
       */
      label: string
      /**
       * The human-readable doc-comment of this signature. Will be shown
       * in the UI but can be omitted.
       */
      documentation?: string | IMarkdownString
      /**
       * The parameters of this signature.
       */
      parameters: ParameterInformation[]
      /**
       * Index of the active parameter.
       *
       * If provided, this is used in place of `SignatureHelp.activeSignature`.
       */
      activeParameter?: number
    }

    /**
     * Signature help represents the signature of something
     * callable. There can be multiple signatures but only one
     * active and only one active parameter.
     */
    export interface SignatureHelp {
      /**
       * One or more signatures.
       */
      signatures: SignatureInformation[]
      /**
       * The active signature.
       */
      activeSignature: number
      /**
       * The active parameter of the active signature.
       */
      activeParameter: number
    }

    export interface SignatureHelpResult
      extends IDisposable {
      value: SignatureHelp
    }

    export enum SignatureHelpTriggerKind {
      Invoke = 1,
      TriggerCharacter = 2,
      ContentChange = 3,
    }

    export interface SignatureHelpContext {
      readonly triggerKind: SignatureHelpTriggerKind
      readonly triggerCharacter?: string
      readonly isRetrigger: boolean
      readonly activeSignatureHelp?: SignatureHelp
    }

    /**
     * The signature help provider interface defines the contract between extensions and
     * the [parameter hints](https://code.visualstudio.com/docs/editor/intellisense)-feature.
     */
    export interface SignatureHelpProvider {
      readonly signatureHelpTriggerCharacters?: ReadonlyArray<string>
      readonly signatureHelpRetriggerCharacters?: ReadonlyArray<string>
      /**
       * Provide help for the signature at the given position and document.
       */
      provideSignatureHelp(
        model: editor.ITextModel,
        position: Position,
        token: CancellationToken,
        context: SignatureHelpContext
      ): ProviderResult<SignatureHelpResult>
    }

    /**
     * A document highlight kind.
     */
    export enum DocumentHighlightKind {
      /**
       * A textual occurrence.
       */
      Text = 0,
      /**
       * Read-access of a symbol, like reading a variable.
       */
      Read = 1,
      /**
       * Write-access of a symbol, like writing to a variable.
       */
      Write = 2,
    }

    /**
     * A document highlight is a range inside a text document which deserves
     * special attention. Usually a document highlight is visualized by changing
     * the background color of its range.
     */
    export interface DocumentHighlight {
      /**
       * The range this highlight applies to.
       */
      range: IRange
      /**
       * The highlight kind, default is {@link DocumentHighlightKind.Text text}.
       */
      kind?: DocumentHighlightKind
    }

    /**
     * The document highlight provider interface defines the contract between extensions and
     * the word-highlight-feature.
     */
    export interface DocumentHighlightProvider {
      /**
       * Provide a set of document highlights, like all occurrences of a variable or
       * all exit-points of a function.
       */
      provideDocumentHighlights(
        model: editor.ITextModel,
        position: Position,
        token: CancellationToken
      ): ProviderResult<DocumentHighlight[]>
    }

    /**
     * The linked editing range provider interface defines the contract between extensions and
     * the linked editing feature.
     */
    export interface LinkedEditingRangeProvider {
      /**
       * Provide a list of ranges that can be edited together.
       */
      provideLinkedEditingRanges(
        model: editor.ITextModel,
        position: Position,
        token: CancellationToken
      ): ProviderResult<LinkedEditingRanges>
    }

    /**
     * Represents a list of ranges that can be edited together along with a word pattern to describe valid contents.
     */
    export interface LinkedEditingRanges {
      /**
       * A list of ranges that can be edited together. The ranges must have
       * identical length and text content. The ranges cannot overlap
       */
      ranges: IRange[]
      /**
       * An optional word pattern that describes valid contents for the given ranges.
       * If no pattern is provided, the language configuration's word pattern will be used.
       */
      wordPattern?: RegExp
    }

    /**
     * Value-object that contains additional information when
     * requesting references.
     */
    export interface ReferenceContext {
      /**
       * Include the declaration of the current symbol.
       */
      includeDeclaration: boolean
    }

    /**
     * The reference provider interface defines the contract between extensions and
     * the [find references](https://code.visualstudio.com/docs/editor/editingevolved#_peek)-feature.
     */
    export interface ReferenceProvider {
      /**
       * Provide a set of project-wide references for the given position and document.
       */
      provideReferences(
        model: editor.ITextModel,
        position: Position,
        context: ReferenceContext,
        token: CancellationToken
      ): ProviderResult<Location[]>
    }

    /**
     * Represents a location inside a resource, such as a line
     * inside a text file.
     */
    export interface Location {
      /**
       * The resource identifier of this location.
       */
      uri: Uri
      /**
       * The document range of this locations.
       */
      range: IRange
    }

    export interface LocationLink {
      /**
       * A range to select where this link originates from.
       */
      originSelectionRange?: IRange
      /**
       * The target uri this link points to.
       */
      uri: Uri
      /**
       * The full range this link points to.
       */
      range: IRange
      /**
       * A range to select this link points to. Must be contained
       * in `LocationLink.range`.
       */
      targetSelectionRange?: IRange
    }

    export type Definition =
      | Location
      | Location[]
      | LocationLink[]

    /**
     * The definition provider interface defines the contract between extensions and
     * the [go to definition](https://code.visualstudio.com/docs/editor/editingevolved#_go-to-definition)
     * and peek definition features.
     */
    export interface DefinitionProvider {
      /**
       * Provide the definition of the symbol at the given position and document.
       */
      provideDefinition(
        model: editor.ITextModel,
        position: Position,
        token: CancellationToken
      ): ProviderResult<Definition | LocationLink[]>
    }

    /**
     * The definition provider interface defines the contract between extensions and
     * the [go to definition](https://code.visualstudio.com/docs/editor/editingevolved#_go-to-definition)
     * and peek definition features.
     */
    export interface DeclarationProvider {
      /**
       * Provide the declaration of the symbol at the given position and document.
       */
      provideDeclaration(
        model: editor.ITextModel,
        position: Position,
        token: CancellationToken
      ): ProviderResult<Definition | LocationLink[]>
    }

    /**
     * The implementation provider interface defines the contract between extensions and
     * the go to implementation feature.
     */
    export interface ImplementationProvider {
      /**
       * Provide the implementation of the symbol at the given position and document.
       */
      provideImplementation(
        model: editor.ITextModel,
        position: Position,
        token: CancellationToken
      ): ProviderResult<Definition | LocationLink[]>
    }

    /**
     * The type definition provider interface defines the contract between extensions and
     * the go to type definition feature.
     */
    export interface TypeDefinitionProvider {
      /**
       * Provide the type definition of the symbol at the given position and document.
       */
      provideTypeDefinition(
        model: editor.ITextModel,
        position: Position,
        token: CancellationToken
      ): ProviderResult<Definition | LocationLink[]>
    }

    /**
     * A symbol kind.
     */
    export enum SymbolKind {
      File = 0,
      Module = 1,
      Namespace = 2,
      Package = 3,
      Class = 4,
      Method = 5,
      Property = 6,
      Field = 7,
      Constructor = 8,
      Enum = 9,
      Interface = 10,
      Function = 11,
      Variable = 12,
      Constant = 13,
      String = 14,
      Number = 15,
      Boolean = 16,
      Array = 17,
      Object = 18,
      Key = 19,
      Null = 20,
      EnumMember = 21,
      Struct = 22,
      Event = 23,
      Operator = 24,
      TypeParameter = 25,
    }

    export enum SymbolTag {
      Deprecated = 1,
    }

    export interface DocumentSymbol {
      name: string
      detail: string
      kind: SymbolKind
      tags: ReadonlyArray<SymbolTag>
      containerName?: string
      range: IRange
      selectionRange: IRange
      children?: DocumentSymbol[]
    }

    /**
     * The document symbol provider interface defines the contract between extensions and
     * the [go to symbol](https://code.visualstudio.com/docs/editor/editingevolved#_go-to-symbol)-feature.
     */
    export interface DocumentSymbolProvider {
      displayName?: string
      /**
       * Provide symbol information for the given document.
       */
      provideDocumentSymbols(
        model: editor.ITextModel,
        token: CancellationToken
      ): ProviderResult<DocumentSymbol[]>
    }

    export type TextEdit = {
      range: IRange
      text: string
      eol?: editor.EndOfLineSequence
    }

    /**
     * Interface used to format a model
     */
    export interface FormattingOptions {
      /**
       * Size of a tab in spaces.
       */
      tabSize: number
      /**
       * Prefer spaces over tabs.
       */
      insertSpaces: boolean
    }

    /**
     * The document formatting provider interface defines the contract between extensions and
     * the formatting-feature.
     */
    export interface DocumentFormattingEditProvider {
      readonly displayName?: string
      /**
       * Provide formatting edits for a whole document.
       */
      provideDocumentFormattingEdits(
        model: editor.ITextModel,
        options: FormattingOptions,
        token: CancellationToken
      ): ProviderResult<TextEdit[]>
    }

    /**
     * The document formatting provider interface defines the contract between extensions and
     * the formatting-feature.
     */
    export interface DocumentRangeFormattingEditProvider {
      readonly displayName?: string
      /**
       * Provide formatting edits for a range in a document.
       *
       * The given range is a hint and providers can decide to format a smaller
       * or larger range. Often this is done by adjusting the start and end
       * of the range to full syntax nodes.
       */
      provideDocumentRangeFormattingEdits(
        model: editor.ITextModel,
        range: Range,
        options: FormattingOptions,
        token: CancellationToken
      ): ProviderResult<TextEdit[]>
    }

    /**
     * The document formatting provider interface defines the contract between extensions and
     * the formatting-feature.
     */
    export interface OnTypeFormattingEditProvider {
      autoFormatTriggerCharacters: string[]
      /**
       * Provide formatting edits after a character has been typed.
       *
       * The given position and character should hint to the provider
       * what range the position to expand to, like find the matching `{`
       * when `}` has been entered.
       */
      provideOnTypeFormattingEdits(
        model: editor.ITextModel,
        position: Position,
        ch: string,
        options: FormattingOptions,
        token: CancellationToken
      ): ProviderResult<TextEdit[]>
    }

    /**
     * A link inside the editor.
     */
    export interface ILink {
      range: IRange
      url?: Uri | string
      tooltip?: string
    }

    export interface ILinksList {
      links: ILink[]
      dispose?(): void
    }

    /**
     * A provider of links.
     */
    export interface LinkProvider {
      provideLinks(
        model: editor.ITextModel,
        token: CancellationToken
      ): ProviderResult<ILinksList>
      resolveLink?: (
        link: ILink,
        token: CancellationToken
      ) => ProviderResult<ILink>
    }

    /**
     * A color in RGBA format.
     */
    export interface IColor {
      /**
       * The red component in the range [0-1].
       */
      readonly red: number
      /**
       * The green component in the range [0-1].
       */
      readonly green: number
      /**
       * The blue component in the range [0-1].
       */
      readonly blue: number
      /**
       * The alpha component in the range [0-1].
       */
      readonly alpha: number
    }

    /**
     * String representations for a color
     */
    export interface IColorPresentation {
      /**
       * The label of this color presentation. It will be shown on the color
       * picker header. By default this is also the text that is inserted when selecting
       * this color presentation.
       */
      label: string
      /**
       * An {@link TextEdit edit} which is applied to a document when selecting
       * this presentation for the color.
       */
      textEdit?: TextEdit
      /**
       * An optional array of additional {@link TextEdit text edits} that are applied when
       * selecting this color presentation.
       */
      additionalTextEdits?: TextEdit[]
    }

    /**
     * A color range is a range in a text model which represents a color.
     */
    export interface IColorInformation {
      /**
       * The range within the model.
       */
      range: IRange
      /**
       * The color represented in this range.
       */
      color: IColor
    }

    /**
     * A provider of colors for editor models.
     */
    export interface DocumentColorProvider {
      /**
       * Provides the color ranges for a specific model.
       */
      provideDocumentColors(
        model: editor.ITextModel,
        token: CancellationToken
      ): ProviderResult<IColorInformation[]>
      /**
       * Provide the string representations for a color.
       */
      provideColorPresentations(
        model: editor.ITextModel,
        colorInfo: IColorInformation,
        token: CancellationToken
      ): ProviderResult<IColorPresentation[]>
    }

    export interface SelectionRange {
      range: IRange
    }

    export interface SelectionRangeProvider {
      /**
       * Provide ranges that should be selected from the given position.
       */
      provideSelectionRanges(
        model: editor.ITextModel,
        positions: Position[],
        token: CancellationToken
      ): ProviderResult<SelectionRange[][]>
    }

    export interface FoldingContext { }

    /**
     * A provider of folding ranges for editor models.
     */
    export interface FoldingRangeProvider {
      /**
       * An optional event to signal that the folding ranges from this provider have changed.
       */
      onDidChange?: IEvent<this>
      /**
       * Provides the folding ranges for a specific model.
       */
      provideFoldingRanges(
        model: editor.ITextModel,
        context: FoldingContext,
        token: CancellationToken
      ): ProviderResult<FoldingRange[]>
    }

    export interface FoldingRange {
      /**
       * The one-based start line of the range to fold. The folded area starts after the line's last character.
       */
      start: number
      /**
       * The one-based end line of the range to fold. The folded area ends with the line's last character.
       */
      end: number
      /**
       * Describes the {@link FoldingRangeKind Kind} of the folding range such as {@link FoldingRangeKind.Comment Comment} or
       * {@link FoldingRangeKind.Region Region}. The kind is used to categorize folding ranges and used by commands
       * like 'Fold all comments'. See
       * {@link FoldingRangeKind} for an enumeration of standardized kinds.
       */
      kind?: FoldingRangeKind
    }

    export class FoldingRangeKind {
      value: string
      /**
       * Kind for folding range representing a comment. The value of the kind is 'comment'.
       */
      static readonly Comment: FoldingRangeKind
      /**
       * Kind for folding range representing a import. The value of the kind is 'imports'.
       */
      static readonly Imports: FoldingRangeKind
      /**
       * Kind for folding range representing regions (for example marked by `#region`, `#endregion`).
       * The value of the kind is 'region'.
       */
      static readonly Region: FoldingRangeKind
      /**
       * Creates a new {@link FoldingRangeKind}.
       *
       * @param value of the kind.
       */
      constructor(value: string)
    }

    export interface WorkspaceEditMetadata {
      needsConfirmation: boolean
      label: string
      description?: string
    }

    export interface WorkspaceFileEditOptions {
      overwrite?: boolean
      ignoreIfNotExists?: boolean
      ignoreIfExists?: boolean
      recursive?: boolean
      copy?: boolean
      folder?: boolean
      skipTrashBin?: boolean
      maxSize?: number
    }

    export interface WorkspaceFileEdit {
      oldUri?: Uri
      newUri?: Uri
      options?: WorkspaceFileEditOptions
      metadata?: WorkspaceEditMetadata
    }

    export interface WorkspaceTextEdit {
      resource: Uri
      edit: TextEdit
      modelVersionId?: number
      metadata?: WorkspaceEditMetadata
    }

    export interface WorkspaceEdit {
      edits: Array<WorkspaceTextEdit | WorkspaceFileEdit>
    }

    export interface Rejection {
      rejectReason?: string
    }

    export interface RenameLocation {
      range: IRange
      text: string
    }

    export interface RenameProvider {
      provideRenameEdits(
        model: editor.ITextModel,
        position: Position,
        newName: string,
        token: CancellationToken
      ): ProviderResult<WorkspaceEdit & Rejection>
      resolveRenameLocation?(
        model: editor.ITextModel,
        position: Position,
        token: CancellationToken
      ): ProviderResult<RenameLocation & Rejection>
    }

    export interface Command {
      id: string
      title: string
      tooltip?: string
      arguments?: any[]
    }

    export interface CodeLens {
      range: IRange
      id?: string
      command?: Command
    }

    export interface CodeLensList {
      lenses: CodeLens[]
      dispose(): void
    }

    export interface CodeLensProvider {
      onDidChange?: IEvent<this>
      provideCodeLenses(
        model: editor.ITextModel,
        token: CancellationToken
      ): ProviderResult<CodeLensList>
      resolveCodeLens?(
        model: editor.ITextModel,
        codeLens: CodeLens,
        token: CancellationToken
      ): ProviderResult<CodeLens>
    }

    export enum InlayHintKind {
      Other = 0,
      Type = 1,
      Parameter = 2,
    }

    export interface InlayHint {
      text: string
      position: IPosition
      kind: InlayHintKind
      whitespaceBefore?: boolean
      whitespaceAfter?: boolean
    }

    export interface InlayHintsProvider {
      onDidChangeInlayHints?: IEvent<void> | undefined
      provideInlayHints(
        model: editor.ITextModel,
        range: Range,
        token: CancellationToken
      ): ProviderResult<InlayHint[]>
    }

    export interface SemanticTokensLegend {
      readonly tokenTypes: string[]
      readonly tokenModifiers: string[]
    }

    export interface SemanticTokens {
      readonly resultId?: string
      readonly data: Uint32Array
    }

    export interface SemanticTokensEdit {
      readonly start: number
      readonly deleteCount: number
      readonly data?: Uint32Array
    }

    export interface SemanticTokensEdits {
      readonly resultId?: string
      readonly edits: SemanticTokensEdit[]
    }

    export interface DocumentSemanticTokensProvider {
      onDidChange?: IEvent<void>
      getLegend(): SemanticTokensLegend
      provideDocumentSemanticTokens(
        model: editor.ITextModel,
        lastResultId: string | null,
        token: CancellationToken
      ): ProviderResult<
        SemanticTokens | SemanticTokensEdits
      >
      releaseDocumentSemanticTokens(
        resultId: string | undefined
      ): void
    }

    export interface DocumentRangeSemanticTokensProvider {
      getLegend(): SemanticTokensLegend
      provideDocumentRangeSemanticTokens(
        model: editor.ITextModel,
        range: Range,
        token: CancellationToken
      ): ProviderResult<SemanticTokens>
    }

    export interface ILanguageExtensionPoint {
      id: string
      extensions?: string[]
      filenames?: string[]
      filenamePatterns?: string[]
      firstLine?: string
      aliases?: string[]
      mimetypes?: string[]
      configuration?: Uri
    }
    /**
     * A Monarch language definition
     */
    export interface IMonarchLanguage {
      /**
       * map from string to ILanguageRule[]
       */
      tokenizer: {
        [name: string]: IMonarchLanguageRule[]
      }
      /**
       * is the language case insensitive?
       */
      ignoreCase?: boolean
      /**
       * is the language unicode-aware? (i.e., /\u{1D306}/)
       */
      unicode?: boolean
      /**
       * if no match in the tokenizer assign this token class (default 'source')
       */
      defaultToken?: string
      /**
       * for example [['{','}','delimiter.curly']]
       */
      brackets?: IMonarchLanguageBracket[]
      /**
       * start symbol in the tokenizer (by default the first entry is used)
       */
      start?: string
      /**
       * attach this to every token class (by default '.' + name)
       */
      tokenPostfix?: string
      /**
       * include line feeds (in the form of a \n character) at the end of lines
       * Defaults to false
       */
      includeLF?: boolean
      /**
       * Other keys that can be referred to by the tokenizer.
       */
      [key: string]: any
    }

    /**
     * A rule is either a regular expression and an action
     * 		shorthands: [reg,act] == { regex: reg, action: act}
     *		and       : [reg,act,nxt] == { regex: reg, action: act{ next: nxt }}
     */
    export type IShortMonarchLanguageRule1 = [
      string | RegExp,
      IMonarchLanguageAction
    ]

    export type IShortMonarchLanguageRule2 = [
      string | RegExp,
      IMonarchLanguageAction,
      string
    ]

    export interface IExpandedMonarchLanguageRule {
      /**
       * match tokens
       */
      regex?: string | RegExp
      /**
       * action to take on match
       */
      action?: IMonarchLanguageAction
      /**
       * or an include rule. include all rules from the included state
       */
      include?: string
    }

    export type IMonarchLanguageRule =
      | IShortMonarchLanguageRule1
      | IShortMonarchLanguageRule2
      | IExpandedMonarchLanguageRule

    /**
     * An action is either an array of actions...
     * ... or a case statement with guards...
     * ... or a basic action with a token value.
     */
    export type IShortMonarchLanguageAction = string

    export interface IExpandedMonarchLanguageAction {
      /**
       * array of actions for each parenthesized match group
       */
      group?: IMonarchLanguageAction[]
      /**
       * map from string to ILanguageAction
       */
      cases?: Object
      /**
       * token class (ie. css class) (or "@brackets" or "@rematch")
       */
      token?: string
      /**
       * the next state to push, or "@push", "@pop", "@popall"
       */
      next?: string
      /**
       * switch to this state
       */
      switchTo?: string
      /**
       * go back n characters in the stream
       */
      goBack?: number
      /**
       * @open or @close
       */
      bracket?: string
      /**
       * switch to embedded language (using the mimetype) or get out using "@pop"
       */
      nextEmbedded?: string
      /**
       * log a message to the browser console window
       */
      log?: string
    }

    export type IMonarchLanguageAction =
      | IShortMonarchLanguageAction
      | IExpandedMonarchLanguageAction
      | IShortMonarchLanguageAction[]
      | IExpandedMonarchLanguageAction[]

    /**
     * This interface can be shortened as an array, ie. ['{','}','delimiter.curly']
     */
    export interface IMonarchLanguageBracket {
      /**
       * open bracket
       */
      open: string
      /**
       * closing bracket
       */
      close: string
      /**
       * token class
       */
      token: string
    }
  }

  export namespace any {
    export interface IMirrorTextModel {
      readonly version: number
    }

    export interface IMirrorModel extends IMirrorTextModel {
      readonly uri: Uri
      readonly version: number
      getValue(): string
    }

    export interface IWorkerContext<H = undefined> {
      /**
       * A proxy to the main thread host object.
       */
      host: H
      /**
       * Get all available mirror models in this any.
       */
      getMirrorModels(): IMirrorModel[]
    }
  }

  //dtsv=3

  /*---------------------------------------------------------------------------------------------
   *  Copyright (c) Microsoft Corporation. All rights reserved.
   *  Licensed under the MIT License. See License.txt in the project root for license information.
   *--------------------------------------------------------------------------------------------*/

  export namespace languages.typescript {
    export enum ModuleKind {
      None = 0,
      CommonJS = 1,
      AMD = 2,
      UMD = 3,
      System = 4,
      ES2015 = 5,
      ESNext = 99,
    }
    export enum JsxEmit {
      None = 0,
      Preserve = 1,
      React = 2,
      ReactNative = 3,
      ReactJSX = 4,
      ReactJSXDev = 5,
    }
    export enum NewLineKind {
      CarriageReturnLineFeed = 0,
      LineFeed = 1,
    }
    export enum ScriptTarget {
      ES3 = 0,
      ES5 = 1,
      ES2015 = 2,
      ES2016 = 3,
      ES2017 = 4,
      ES2018 = 5,
      ES2019 = 6,
      ES2020 = 7,
      ESNext = 99,
      JSON = 100,
      Latest = 99,
    }
    export enum ModuleResolutionKind {
      Classic = 1,
      NodeJs = 2,
    }
    interface MapLike<T> {
      [index: string]: T
    }
    type CompilerOptionsValue =
      | string
      | number
      | boolean
      | (string | number)[]
      | string[]
      | MapLike<string[]>
      | null
      | undefined
    interface CompilerOptions {
      allowJs?: boolean
      allowSyntheticDefaultImports?: boolean
      allowUmdGlobalAccess?: boolean
      allowUnreachableCode?: boolean
      allowUnusedLabels?: boolean
      alwaysStrict?: boolean
      baseUrl?: string
      charset?: string
      checkJs?: boolean
      declaration?: boolean
      declarationMap?: boolean
      emitDeclarationOnly?: boolean
      declarationDir?: string
      disableSizeLimit?: boolean
      disableSourceOfProjectReferenceRedirect?: boolean
      downlevelIteration?: boolean
      emitBOM?: boolean
      emitDecoratorMetadata?: boolean
      experimentalDecorators?: boolean
      forceConsistentCasingInFileNames?: boolean
      importHelpers?: boolean
      inlineSourceMap?: boolean
      inlineSources?: boolean
      isolatedModules?: boolean
      jsx?: JsxEmit
      keyofStringsOnly?: boolean
      lib?: string[]
      locale?: string
      mapRoot?: string
      maxNodeModuleJsDepth?: number
      module?: ModuleKind
      moduleResolution?: ModuleResolutionKind
      newLine?: NewLineKind
      noEmit?: boolean
      noEmitHelpers?: boolean
      noEmitOnError?: boolean
      noErrorTruncation?: boolean
      noFallthroughCasesInSwitch?: boolean
      noImplicitAny?: boolean
      noImplicitReturns?: boolean
      noImplicitThis?: boolean
      noStrictGenericChecks?: boolean
      noUnusedLocals?: boolean
      noUnusedParameters?: boolean
      noImplicitUseStrict?: boolean
      noLib?: boolean
      noResolve?: boolean
      out?: string
      outDir?: string
      outFile?: string
      paths?: MapLike<string[]>
      preserveConstEnums?: boolean
      preserveSymlinks?: boolean
      project?: string
      reactNamespace?: string
      jsxFactory?: string
      composite?: boolean
      removeComments?: boolean
      rootDir?: string
      rootDirs?: string[]
      skipLibCheck?: boolean
      skipDefaultLibCheck?: boolean
      sourceMap?: boolean
      sourceRoot?: string
      strict?: boolean
      strictFunctionTypes?: boolean
      strictBindCallApply?: boolean
      strictNullChecks?: boolean
      strictPropertyInitialization?: boolean
      stripInternal?: boolean
      suppressExcessPropertyErrors?: boolean
      suppressImplicitAnyIndexErrors?: boolean
      target?: ScriptTarget
      traceResolution?: boolean
      resolveJsonModule?: boolean
      types?: string[]
      /** Paths used to compute primary types search locations */
      typeRoots?: string[]
      esModuleInterop?: boolean
      useDefineForClassFields?: boolean
      [option: string]: CompilerOptionsValue | undefined
    }
    export interface DiagnosticsOptions {
      noSemanticValidation?: boolean
      noSyntaxValidation?: boolean
      noSuggestionDiagnostics?: boolean
      /**
       * Limit diagnostic computation to only visible files.
       * Defaults to false.
       */
      onlyVisible?: boolean
      diagnosticCodesToIgnore?: number[]
    }
    export interface anyOptions {
      /** A full HTTP path to a JavaScript file which adds a function `customTSWorkerFactory` to the self inside a web-worker */
      customWorkerPath?: string
    }
    interface IExtraLib {
      content: string
      version: number
    }
    export interface IExtraLibs {
      [path: string]: IExtraLib
    }
    /**
     * A linked list of formatted diagnostic messages to be used as part of a multiline message.
     * It is built from the bottom up, leaving the head to be the "main" diagnostic.
     */
    interface DiagnosticMessageChain {
      messageText: string
      /** Diagnostic category: warning = 0, error = 1, suggestion = 2, message = 3 */
      category: 0 | 1 | 2 | 3
      code: number
      next?: DiagnosticMessageChain[]
    }
    export interface Diagnostic
      extends DiagnosticRelatedInformation {
      /** May store more in future. For now, this will simply be `true` to indicate when a diagnostic is an unused-identifier diagnostic. */
      reportsUnnecessary?: {}
      reportsDeprecated?: {}
      source?: string
      relatedInformation?: DiagnosticRelatedInformation[]
    }
    export interface DiagnosticRelatedInformation {
      /** Diagnostic category: warning = 0, error = 1, suggestion = 2, message = 3 */
      category: 0 | 1 | 2 | 3
      code: number
      /** TypeScriptWorker removes all but the `fileName` property to avoid serializing circular JSON structures. */
      file:
      | {
        fileName: string
      }
      | undefined
      start: number | undefined
      length: number | undefined
      messageText: string | DiagnosticMessageChain
    }
    interface EmitOutput {
      outputFiles: OutputFile[]
      emitSkipped: boolean
    }
    interface OutputFile {
      name: string
      writeByteOrderMark: boolean
      text: string
    }
    export interface LanguageServiceDefaults {
      /**
       * Event fired when compiler options or diagnostics options are changed.
       */
      readonly onDidChange: IEvent<void>
      /**
       * Event fired when extra libraries registered with the language service change.
       */
      readonly onDidExtraLibsChange: IEvent<void>
      readonly anyOptions: anyOptions
      /**
       * Get the current extra libs registered with the language service.
       */
      getExtraLibs(): IExtraLibs
      /**
       * Add an additional source file to the language service. Use this
       * for typescript (definition) files that won't be loaded as editor
       * documents, like `jquery.d.ts`.
       *
       * @param content The file content
       * @param filePath An optional file path
       * @returns A disposable which will remove the file from the
       * language service upon disposal.
       */
      addExtraLib(
        content: string,
        filePath?: string
      ): IDisposable
      /**
       * Remove all existing extra libs and set the additional source
       * files to the language service. Use this for typescript definition
       * files that won't be loaded as editor documents, like `jquery.d.ts`.
       * @param libs An array of entries to register.
       */
      setExtraLibs(
        libs: {
          content: string
          filePath?: string
        }[]
      ): void
      /**
       * Get current TypeScript compiler options for the language service.
       */
      getCompilerOptions(): CompilerOptions
      /**
       * Set TypeScript compiler options.
       */
      setCompilerOptions(options: CompilerOptions): void
      /**
       * Get the current diagnostics options for the language service.
       */
      getDiagnosticsOptions(): DiagnosticsOptions
      /**
       * Configure whether syntactic and/or semantic validation should
       * be performed
       */
      setDiagnosticsOptions(
        options: DiagnosticsOptions
      ): void
      /**
       * Configure webworker options
       */
      setWorkerOptions(options: anyOptions): void
      /**
       * No-op.
       */
      setMaximumWorkerIdleTime(value: number): void
      /**
       * Configure if all existing models should be eagerly sync'd
       * to the any on start or restart.
       */
      setEagerModelSync(value: boolean): void
      /**
       * Get the current setting for whether all existing models should be eagerly sync'd
       * to the any on start or restart.
       */
      getEagerModelSync(): boolean
    }
    export interface TypeScriptWorker {
      /**
       * Get diagnostic messages for any syntax issues in the given file.
       */
      getSyntacticDiagnostics(
        fileName: string
      ): Promise<Diagnostic[]>
      /**
       * Get diagnostic messages for any semantic issues in the given file.
       */
      getSemanticDiagnostics(
        fileName: string
      ): Promise<Diagnostic[]>
      /**
       * Get diagnostic messages for any suggestions related to the given file.
       */
      getSuggestionDiagnostics(
        fileName: string
      ): Promise<Diagnostic[]>
      /**
       * Get the content of a given file.
       */
      getScriptText(
        fileName: string
      ): Promise<string | undefined>
      /**
       * Get diagnostic messages related to the current compiler options.
       * @param fileName Not used
       */
      getCompilerOptionsDiagnostics(
        fileName: string
      ): Promise<Diagnostic[]>
      /**
       * Get code completions for the given file and position.
       * @returns `Promise<typescript.CompletionInfo | undefined>`
       */
      getCompletionsAtPosition(
        fileName: string,
        position: number
      ): Promise<any | undefined>
      /**
       * Get code completion details for the given file, position, and entry.
       * @returns `Promise<typescript.CompletionEntryDetails | undefined>`
       */
      getCompletionEntryDetails(
        fileName: string,
        position: number,
        entry: string
      ): Promise<any | undefined>
      /**
       * Get signature help items for the item at the given file and position.
       * @returns `Promise<typescript.SignatureHelpItems | undefined>`
       */
      getSignatureHelpItems(
        fileName: string,
        position: number,
        options: any
      ): Promise<any | undefined>
      /**
       * Get quick info for the item at the given position in the file.
       * @returns `Promise<typescript.QuickInfo | undefined>`
       */
      getQuickInfoAtPosition(
        fileName: string,
        position: number
      ): Promise<any | undefined>
      /**
       * Get other ranges which are related to the item at the given position in the file (often used for highlighting).
       * @returns `Promise<ReadonlyArray<typescript.ReferenceEntry> | undefined>`
       */
      getOccurrencesAtPosition(
        fileName: string,
        position: number
      ): Promise<ReadonlyArray<any> | undefined>
      /**
       * Get the definition of the item at the given position in the file.
       * @returns `Promise<ReadonlyArray<typescript.DefinitionInfo> | undefined>`
       */
      getDefinitionAtPosition(
        fileName: string,
        position: number
      ): Promise<ReadonlyArray<any> | undefined>
      /**
       * Get references to the item at the given position in the file.
       * @returns `Promise<typescript.ReferenceEntry[] | undefined>`
       */
      getReferencesAtPosition(
        fileName: string,
        position: number
      ): Promise<any[] | undefined>
      /**
       * Get outline entries for the item at the given position in the file.
       * @returns `Promise<typescript.NavigationBarItem[]>`
       */
      getNavigationBarItems(
        fileName: string
      ): Promise<any[]>
      /**
       * Get changes which should be applied to format the given file.
       * @param options `typescript.FormatCodeOptions`
       * @returns `Promise<typescript.TextChange[]>`
       */
      getFormattingEditsForDocument(
        fileName: string,
        options: any
      ): Promise<any[]>
      /**
       * Get changes which should be applied to format the given range in the file.
       * @param options `typescript.FormatCodeOptions`
       * @returns `Promise<typescript.TextChange[]>`
       */
      getFormattingEditsForRange(
        fileName: string,
        start: number,
        end: number,
        options: any
      ): Promise<any[]>
      /**
       * Get formatting changes which should be applied after the given keystroke.
       * @param options `typescript.FormatCodeOptions`
       * @returns `Promise<typescript.TextChange[]>`
       */
      getFormattingEditsAfterKeystroke(
        fileName: string,
        postion: number,
        ch: string,
        options: any
      ): Promise<any[]>
      /**
       * Get other occurrences which should be updated when renaming the item at the given file and position.
       * @returns `Promise<readonly typescript.RenameLocation[] | undefined>`
       */
      findRenameLocations(
        fileName: string,
        positon: number,
        findInStrings: boolean,
        findInComments: boolean,
        providePrefixAndSuffixTextForRename: boolean
      ): Promise<readonly any[] | undefined>
      /**
       * Get edits which should be applied to rename the item at the given file and position (or a failure reason).
       * @param options `typescript.RenameInfoOptions`
       * @returns `Promise<typescript.RenameInfo>`
       */
      getRenameInfo(
        fileName: string,
        positon: number,
        options: any
      ): Promise<any>
      /**
       * Get transpiled output for the given file.
       * @returns `typescript.EmitOutput`
       */
      getEmitOutput(fileName: string): Promise<EmitOutput>
      /**
       * Get possible code fixes at the given position in the file.
       * @param formatOptions `typescript.FormatCodeOptions`
       * @returns `Promise<ReadonlyArray<typescript.CodeFixAction>>`
       */
      getCodeFixesAtPosition(
        fileName: string,
        start: number,
        end: number,
        errorCodes: number[],
        formatOptions: any
      ): Promise<ReadonlyArray<any>>
    }
    export const typescriptVersion: string
    export const typescriptDefaults: LanguageServiceDefaults
    export const javascriptDefaults: LanguageServiceDefaults
    export const getTypeScriptWorker: () => Promise<
      (...uris: Uri[]) => Promise<TypeScriptWorker>
    >
    export const getJavaScriptWorker: () => Promise<
      (...uris: Uri[]) => Promise<TypeScriptWorker>
    >
  }

  /*---------------------------------------------------------------------------------------------
   *  Copyright (c) Microsoft Corporation. All rights reserved.
   *  Licensed under the MIT License. See License.txt in the project root for license information.
   *--------------------------------------------------------------------------------------------*/

  export namespace languages.css {
    export interface Options {
      readonly validate?: boolean
      readonly lint?: {
        readonly compatibleVendorPrefixes?:
        | "ignore"
        | "warning"
        | "error"
        readonly vendorPrefix?:
        | "ignore"
        | "warning"
        | "error"
        readonly duplicateProperties?:
        | "ignore"
        | "warning"
        | "error"
        readonly emptyRules?: "ignore" | "warning" | "error"
        readonly importStatement?:
        | "ignore"
        | "warning"
        | "error"
        readonly boxModel?: "ignore" | "warning" | "error"
        readonly universalSelector?:
        | "ignore"
        | "warning"
        | "error"
        readonly zeroUnits?: "ignore" | "warning" | "error"
        readonly fontFaceProperties?:
        | "ignore"
        | "warning"
        | "error"
        readonly hexColorLength?:
        | "ignore"
        | "warning"
        | "error"
        readonly argumentsInColorFunction?:
        | "ignore"
        | "warning"
        | "error"
        readonly unknownProperties?:
        | "ignore"
        | "warning"
        | "error"
        readonly ieHack?: "ignore" | "warning" | "error"
        readonly unknownVendorSpecificProperties?:
        | "ignore"
        | "warning"
        | "error"
        readonly propertyIgnoredDueToDisplay?:
        | "ignore"
        | "warning"
        | "error"
        readonly important?: "ignore" | "warning" | "error"
        readonly float?: "ignore" | "warning" | "error"
        readonly idSelector?: "ignore" | "warning" | "error"
      }
      /**
       * Configures the CSS data types known by the langauge service.
       */
      readonly data?: CSSDataConfiguration
    }
    export interface ModeConfiguration {
      /**
       * Defines whether the built-in completionItemProvider is enabled.
       */
      readonly completionItems?: boolean
      /**
       * Defines whether the built-in hoverProvider is enabled.
       */
      readonly hovers?: boolean
      /**
       * Defines whether the built-in documentSymbolProvider is enabled.
       */
      readonly documentSymbols?: boolean
      /**
       * Defines whether the built-in definitions provider is enabled.
       */
      readonly definitions?: boolean
      /**
       * Defines whether the built-in references provider is enabled.
       */
      readonly references?: boolean
      /**
       * Defines whether the built-in references provider is enabled.
       */
      readonly documentHighlights?: boolean
      /**
       * Defines whether the built-in rename provider is enabled.
       */
      readonly rename?: boolean
      /**
       * Defines whether the built-in color provider is enabled.
       */
      readonly colors?: boolean
      /**
       * Defines whether the built-in foldingRange provider is enabled.
       */
      readonly foldingRanges?: boolean
      /**
       * Defines whether the built-in diagnostic provider is enabled.
       */
      readonly diagnostics?: boolean
      /**
       * Defines whether the built-in selection range provider is enabled.
       */
      readonly selectionRanges?: boolean
    }
    export interface LanguageServiceDefaults {
      readonly languageId: string
      readonly onDidChange: IEvent<LanguageServiceDefaults>
      readonly modeConfiguration: ModeConfiguration
      readonly options: Options
      setOptions(options: Options): void
      setModeConfiguration(
        modeConfiguration: ModeConfiguration
      ): void
      /** @deprecated Use options instead */
      readonly diagnosticsOptions: DiagnosticsOptions
      /** @deprecated Use setOptions instead */
      setDiagnosticsOptions(
        options: DiagnosticsOptions
      ): void
    }
    /** @deprecated Use Options instead */
    export type DiagnosticsOptions = Options
    export const cssDefaults: LanguageServiceDefaults
    export const scssDefaults: LanguageServiceDefaults
    export const lessDefaults: LanguageServiceDefaults
    export interface CSSDataConfiguration {
      /**
       * Defines whether the standard CSS properties, at-directives, pseudoClasses and pseudoElements are shown.
       */
      useDefaultDataProvider?: boolean
      /**
       * Provides a set of custom data providers.
       */
      dataProviders?: {
        [providerId: string]: CSSDataV1
      }
    }
    /**
     * Custom CSS properties, at-directives, pseudoClasses and pseudoElements
     * https://github.com/microsoft/vscode-css-languageservice/blob/main/docs/customData.md
     */
    export interface CSSDataV1 {
      version: 1 | 1.1
      properties?: IPropertyData[]
      atDirectives?: IAtDirectiveData[]
      pseudoClasses?: IPseudoClassData[]
      pseudoElements?: IPseudoElementData[]
    }
    export type EntryStatus =
      | "standard"
      | "experimental"
      | "nonstandard"
      | "obsolete"
    export interface IReference {
      name: string
      url: string
    }
    export interface IPropertyData {
      name: string
      description?: string | MarkupContent
      browsers?: string[]
      restrictions?: string[]
      status?: EntryStatus
      syntax?: string
      values?: IValueData[]
      references?: IReference[]
      relevance?: number
    }
    export interface IAtDirectiveData {
      name: string
      description?: string | MarkupContent
      browsers?: string[]
      status?: EntryStatus
      references?: IReference[]
    }
    export interface IPseudoClassData {
      name: string
      description?: string | MarkupContent
      browsers?: string[]
      status?: EntryStatus
      references?: IReference[]
    }
    export interface IPseudoElementData {
      name: string
      description?: string | MarkupContent
      browsers?: string[]
      status?: EntryStatus
      references?: IReference[]
    }
    export interface IValueData {
      name: string
      description?: string | MarkupContent
      browsers?: string[]
      status?: EntryStatus
      references?: IReference[]
    }
    export interface MarkupContent {
      kind: MarkupKind
      value: string
    }
    export type MarkupKind = "plaintext" | "markdown"
  }

  /*---------------------------------------------------------------------------------------------
   *  Copyright (c) Microsoft Corporation. All rights reserved.
   *  Licensed under the MIT License. See License.txt in the project root for license information.
   *--------------------------------------------------------------------------------------------*/

  export namespace languages.json {
    export interface DiagnosticsOptions {
      /**
       * If set, the validator will be enabled and perform syntax and schema based validation,
       * unless `DiagnosticsOptions.schemaValidation` is set to `ignore`.
       */
      readonly validate?: boolean
      /**
       * If set, comments are tolerated. If set to false, syntax errors will be emitted for comments.
       * `DiagnosticsOptions.allowComments` will override this setting.
       */
      readonly allowComments?: boolean
      /**
       * A list of known schemas and/or associations of schemas to file names.
       */
      readonly schemas?: {
        /**
         * The URI of the schema, which is also the identifier of the schema.
         */
        readonly uri: string
        /**
         * A list of glob patterns that describe for which file URIs the JSON schema will be used.
         * '*' and '**' wildcards are supported. Exclusion patterns start with '!'.
         * For example '*.schema.json', 'package.json', '!foo*.schema.json', 'foo/**\/BADRESP.json'.
         * A match succeeds when there is at least one pattern matching and last matching pattern does not start with '!'.
         */
        readonly fileMatch?: string[]
        /**
         * The schema for the given URI.
         */
        readonly schema?: any
      }[]
      /**
       *  If set, the schema service would load schema content on-demand with 'fetch' if available
       */
      readonly enableSchemaRequest?: boolean
      /**
       * The severity of problems from schema validation. If set to 'ignore', schema validation will be skipped. If not set, 'warning' is used.
       */
      readonly schemaValidation?: SeverityLevel
      /**
       * The severity of problems that occurred when resolving and loading schemas. If set to 'ignore', schema resolving problems are not reported. If not set, 'warning' is used.
       */
      readonly schemaRequest?: SeverityLevel
      /**
       * The severity of reported trailing commas. If not set, trailing commas will be reported as errors.
       */
      readonly trailingCommas?: SeverityLevel
      /**
       * The severity of reported comments. If not set, 'DiagnosticsOptions.allowComments' defines whether comments are ignored or reported as errors.
       */
      readonly comments?: SeverityLevel
    }
    export type SeverityLevel =
      | "error"
      | "warning"
      | "ignore"
    export interface ModeConfiguration {
      /**
       * Defines whether the built-in documentFormattingEdit provider is enabled.
       */
      readonly documentFormattingEdits?: boolean
      /**
       * Defines whether the built-in documentRangeFormattingEdit provider is enabled.
       */
      readonly documentRangeFormattingEdits?: boolean
      /**
       * Defines whether the built-in completionItemProvider is enabled.
       */
      readonly completionItems?: boolean
      /**
       * Defines whether the built-in hoverProvider is enabled.
       */
      readonly hovers?: boolean
      /**
       * Defines whether the built-in documentSymbolProvider is enabled.
       */
      readonly documentSymbols?: boolean
      /**
       * Defines whether the built-in tokens provider is enabled.
       */
      readonly tokens?: boolean
      /**
       * Defines whether the built-in color provider is enabled.
       */
      readonly colors?: boolean
      /**
       * Defines whether the built-in foldingRange provider is enabled.
       */
      readonly foldingRanges?: boolean
      /**
       * Defines whether the built-in diagnostic provider is enabled.
       */
      readonly diagnostics?: boolean
      /**
       * Defines whether the built-in selection range provider is enabled.
       */
      readonly selectionRanges?: boolean
    }
    export interface LanguageServiceDefaults {
      readonly languageId: string
      readonly onDidChange: IEvent<LanguageServiceDefaults>
      readonly diagnosticsOptions: DiagnosticsOptions
      readonly modeConfiguration: ModeConfiguration
      setDiagnosticsOptions(
        options: DiagnosticsOptions
      ): void
      setModeConfiguration(
        modeConfiguration: ModeConfiguration
      ): void
    }
    export const jsonDefaults: LanguageServiceDefaults
  }

  /*---------------------------------------------------------------------------------------------
   *  Copyright (c) Microsoft Corporation. All rights reserved.
   *  Licensed under the MIT License. See License.txt in the project root for license information.
   *--------------------------------------------------------------------------------------------*/

  export namespace languages.html {
    export interface HTMLFormatConfiguration {
      readonly tabSize: number
      readonly insertSpaces: boolean
      readonly wrapLineLength: number
      readonly unformatted: string
      readonly contentUnformatted: string
      readonly indentInnerHtml: boolean
      readonly preserveNewLines: boolean
      readonly maxPreserveNewLines: number
      readonly indentHandlebars: boolean
      readonly endWithNewline: boolean
      readonly extraLiners: string
      readonly wrapAttributes:
      | "auto"
      | "force"
      | "force-aligned"
      | "force-expand-multiline"
    }
    export interface CompletionConfiguration {
      readonly [providerId: string]: boolean
    }
    export interface Options {
      /**
       * If set, comments are tolerated. If set to false, syntax errors will be emitted for comments.
       */
      readonly format?: HTMLFormatConfiguration
      /**
       * A list of known schemas and/or associations of schemas to file names.
       */
      readonly suggest?: CompletionConfiguration
      /**
       * Configures the HTML data types known by the HTML langauge service.
       */
      readonly data?: HTMLDataConfiguration
    }
    export interface ModeConfiguration {
      /**
       * Defines whether the built-in completionItemProvider is enabled.
       */
      readonly completionItems?: boolean
      /**
       * Defines whether the built-in hoverProvider is enabled.
       */
      readonly hovers?: boolean
      /**
       * Defines whether the built-in documentSymbolProvider is enabled.
       */
      readonly documentSymbols?: boolean
      /**
       * Defines whether the built-in definitions provider is enabled.
       */
      readonly links?: boolean
      /**
       * Defines whether the built-in references provider is enabled.
       */
      readonly documentHighlights?: boolean
      /**
       * Defines whether the built-in rename provider is enabled.
       */
      readonly rename?: boolean
      /**
       * Defines whether the built-in color provider is enabled.
       */
      readonly colors?: boolean
      /**
       * Defines whether the built-in foldingRange provider is enabled.
       */
      readonly foldingRanges?: boolean
      /**
       * Defines whether the built-in diagnostic provider is enabled.
       */
      readonly diagnostics?: boolean
      /**
       * Defines whether the built-in selection range provider is enabled.
       */
      readonly selectionRanges?: boolean
      /**
       * Defines whether the built-in documentFormattingEdit provider is enabled.
       */
      readonly documentFormattingEdits?: boolean
      /**
       * Defines whether the built-in documentRangeFormattingEdit provider is enabled.
       */
      readonly documentRangeFormattingEdits?: boolean
    }
    export interface LanguageServiceDefaults {
      readonly languageId: string
      readonly modeConfiguration: ModeConfiguration
      readonly onDidChange: IEvent<LanguageServiceDefaults>
      readonly options: Options
      setOptions(options: Options): void
      setModeConfiguration(
        modeConfiguration: ModeConfiguration
      ): void
    }
    export const htmlLanguageService: LanguageServiceRegistration
    export const htmlDefaults: LanguageServiceDefaults
    export const handlebarLanguageService: LanguageServiceRegistration
    export const handlebarDefaults: LanguageServiceDefaults
    export const razorLanguageService: LanguageServiceRegistration
    export const razorDefaults: LanguageServiceDefaults
    export interface LanguageServiceRegistration
      extends IDisposable {
      readonly defaults: LanguageServiceDefaults
    }
    /**
     * Registers a new HTML language service for the languageId.
     * Note: 'html', 'handlebar' and 'razor' are registered by default.
     *
     * Use this method to register additional language ids with a HTML service.
     * The language server has to be registered before an editor model is opened.
     */
    export function registerHTMLLanguageService(
      languageId: string,
      options?: Options,
      modeConfiguration?: ModeConfiguration
    ): LanguageServiceRegistration
    export interface HTMLDataConfiguration {
      /**
       * Defines whether the standard HTML tags and attributes are shown
       */
      readonly useDefaultDataProvider?: boolean
      /**
       * Provides a set of custom data providers.
       */
      readonly dataProviders?: {
        [providerId: string]: HTMLDataV1
      }
    }
    /**
     * Custom HTML tags attributes and attribute values
     * https://github.com/microsoft/vscode-html-languageservice/blob/main/docs/customData.md
     */
    export interface HTMLDataV1 {
      readonly version: 1 | 1.1
      readonly tags?: ITagData[]
      readonly globalAttributes?: IAttributeData[]
      readonly valueSets?: IValueSet[]
    }
    export interface IReference {
      readonly name: string
      readonly url: string
    }
    export interface ITagData {
      readonly name: string
      readonly description?: string | MarkupContent
      readonly attributes: IAttributeData[]
      readonly references?: IReference[]
    }
    export interface IAttributeData {
      readonly name: string
      readonly description?: string | MarkupContent
      readonly valueSet?: string
      readonly values?: IValueData[]
      readonly references?: IReference[]
    }
    export interface IValueData {
      readonly name: string
      readonly description?: string | MarkupContent
      readonly references?: IReference[]
    }
    export interface IValueSet {
      readonly name: string
      readonly values: IValueData[]
    }
    export interface MarkupContent {
      readonly kind: MarkupKind
      readonly value: string
    }
    export type MarkupKind = "plaintext" | "markdown"
  }
  export interface Size {
    // Docs: https://electronjs.org/docs/api/structures/size

    height: number
    width: number
  }

  export interface Point {
    // Docs: https://electronjs.org/docs/api/structures/point

    x: number
    y: number
  }

  export interface Rectangle {
    // Docs: https://electronjs.org/docs/api/structures/rectangle

    /**
     * The height of the rectangle (must be an integer).
     */
    height: number
    /**
     * The width of the rectangle (must be an integer).
     */
    width: number
    /**
     * The x coordinate of the origin of the rectangle (must be an integer).
     */
    x: number
    /**
     * The y coordinate of the origin of the rectangle (must be an integer).
     */
    y: number
  }

  export interface Display {
    // Docs: https://electronjs.org/docs/api/structures/display

    /**
     * Can be `available`, `unavailable`, `unknown`.
     */
    accelerometerSupport:
    | "available"
    | "unavailable"
    | "unknown"
    /**
     * the bounds of the display in DIP points.
     */
    bounds: Rectangle
    /**
     * The number of bits per pixel.
     */
    colorDepth: number
    /**
     *  represent a color space (three-dimensional object which contains all realizable
     * color combinations) for the purpose of color conversions
     */
    colorSpace: string
    /**
     * The number of bits per color component.
     */
    depthPerComponent: number
    /**
     * The display refresh rate.
     */
    displayFrequency: number
    /**
     * Unique identifier associated with the display.
     */
    id: number
    /**
     * `true` for an internal display and `false` for an external display
     */
    internal: boolean
    /**
     * Whether or not the display is a monochrome display.
     */
    monochrome: boolean
    /**
     * Can be 0, 90, 180, 270, represents screen rotation in clock-wise degrees.
     */
    rotation: number
    /**
     * Output device's pixel scale factor.
     */
    scaleFactor: number
    size: Size
    /**
     * Can be `available`, `unavailable`, `unknown`.
     */
    touchSupport: "available" | "unavailable" | "unknown"
    /**
     * the work area of the display in DIP points.
     */
    workArea: Rectangle
    workAreaSize: Size
  }

  interface BrowserWindowConstructorOptions {
    /**
     * Window's width in pixels. Default is `800`.
     */
    width?: number
    /**
     * Window's height in pixels. Default is `600`.
     */
    height?: number
    /**
     * (**required** if y is used) Window's left offset from screen. Default is to
     * center the window.
     */
    x?: number
    /**
     * (**required** if x is used) Window's top offset from screen. Default is to
     * center the window.
     */
    y?: number
    /**
     * The `width` and `height` would be used as web page's size, which means the
     * actual window's size will include window frame's size and be slightly larger.
     * Default is `false`.
     */
    useContentSize?: boolean
    /**
     * Show window in the center of the screen.
     */
    center?: boolean
    /**
     * Window's minimum width. Default is `0`.
     */
    minWidth?: number
    /**
     * Window's minimum height. Default is `0`.
     */
    minHeight?: number
    /**
     * Window's maximum width. Default is no limit.
     */
    maxWidth?: number
    /**
     * Window's maximum height. Default is no limit.
     */
    maxHeight?: number
    /**
     * Whether window is resizable. Default is `true`.
     */
    resizable?: boolean
    /**
     * Whether window is movable. This is not implemented on Linux. Default is `true`.
     */
    movable?: boolean
    /**
     * Whether window is minimizable. This is not implemented on Linux. Default is
     * `true`.
     */
    minimizable?: boolean
    /**
     * Whether window is maximizable. This is not implemented on Linux. Default is
     * `true`.
     */
    maximizable?: boolean
    /**
     * Whether window is closable. This is not implemented on Linux. Default is `true`.
     */
    closable?: boolean
    /**
     * Whether the window can be focused. Default is `true`. On Windows setting
     * `focusable: false` also implies setting `skipTaskbar: true`. On Linux setting
     * `focusable: false` makes the window stop interacting with wm, so the window will
     * always stay on top in all workspaces.
     */
    focusable?: boolean
    /**
     * Whether the window should always stay on top of other windows. Default is
     * `false`.
     */
    alwaysOnTop?: boolean
    /**
     * Whether the window should show in fullscreen. When explicitly set to `false` the
     * fullscreen button will be hidden or disabled on macOS. Default is `false`.
     */
    fullscreen?: boolean
    /**
     * Whether the window can be put into fullscreen mode. On macOS, also whether the
     * maximize/zoom button should toggle full screen mode or maximize window. Default
     * is `true`.
     */
    fullscreenable?: boolean
    /**
     * Use pre-Lion fullscreen on macOS. Default is `false`.
     */
    simpleFullscreen?: boolean
    /**
     * Whether to show the window in taskbar. Default is `false`.
     */
    skipTaskbar?: boolean
    /**
     * Whether the window is in kiosk mode. Default is `false`.
     */
    kiosk?: boolean
    /**
     * Default window title. Default is `"Electron"`. If the HTML tag `<title>` is
     * defined in the HTML file loaded by `loadURL()`, this property will be ignored.
     */
    title?: string
    /**
     * The window icon. On Windows it is recommended to use `ICO` icons to get best
     * visual effects, you can also leave it undefined so the executable's icon will be
     * used.
     */
    icon?: string
    /**
     * Whether window should be shown when created. Default is `true`.
     */
    show?: boolean
    /**
     * Whether the renderer should be active when `show` is `false` and it has just
     * been created.  In order for `document.visibilityState` to work correctly on
     * first load with `show: false` you should set this to `false`.  Setting this to
     * `false` will cause the `ready-to-show` event to not fire.  Default is `true`.
     */
    paintWhenInitiallyHidden?: boolean
    /**
     * Specify `false` to create a frameless window. Default is `true`.
     */
    frame?: boolean

    /**
     * Whether this is a modal window. This only works when the window is a child
     * window. Default is `false`.
     */
    modal?: boolean
    /**
     * Whether clicking an inactive window will also click through to the web contents.
     * Default is `false` on macOS. This option is not configurable on other platforms.
     */
    acceptFirstMouse?: boolean
    /**
     * Whether to hide cursor when typing. Default is `false`.
     */
    disableAutoHideCursor?: boolean
    /**
     * Auto hide the menu bar unless the `Alt` key is pressed. Default is `false`.
     */
    autoHideMenuBar?: boolean
    /**
     * Enable the window to be resized larger than screen. Only relevant for macOS, as
     * other OSes allow larger-than-screen windows by default. Default is `false`.
     */
    enableLargerThanScreen?: boolean
    /**
     * Window's background color as a hexadecimal value, like `#66CD00` or `#FFF` or
     * `#80FFFFFF` (alpha in #AARRGGBB format is supported if `transparent` is set to
     * `true`). Default is `#FFF` (white).
     */
    backgroundColor?: string
    /**
     * Whether window should have a shadow. Default is `true`.
     */
    hasShadow?: boolean
    /**
     * Set the initial opacity of the window, between 0.0 (fully transparent) and 1.0
     * (fully opaque). This is only implemented on Windows and macOS.
     */
    opacity?: number
    /**
     * Forces using dark theme for the window, only works on some GTK+3 desktop
     * environments. Default is `false`.
     */
    darkTheme?: boolean
    /**
     * Makes the window transparent. Default is `false`. On Windows, does not work
     * unless the window is frameless.
     */
    transparent?: boolean
    /**
     * The type of window, default is normal window. See more about this below.
     */
    type?: string
    /**
     * Specify how the material appearance should reflect window activity state on
     * macOS. Must be used with the `vibrancy` property. Possible values are:
     */
    visualEffectState?:
    | "followWindow"
    | "active"
    | "inactive"
    /**
     * The style of window title bar. Default is `default`. Possible values are:
     *
     * @platform darwin,win32
     */
    titleBarStyle?:
    | "default"
    | "hidden"
    | "hiddenInset"
    | "customButtonsOnHover"
    /**
     * Set a custom position for the traffic light buttons in frameless windows.
     */
    trafficLightPosition?: Point
    /**
     * Whether frameless window should have rounded corners on macOS. Default is
     * `true`.
     */
    roundedCorners?: boolean
    /**
     * Shows the title in the title bar in full screen mode on macOS for `hiddenInset`
     * titleBarStyle. Default is `false`.
     *
     * @deprecated
     */
    fullscreenWindowTitle?: boolean
    /**
     * Use `WS_THICKFRAME` style for frameless windows on Windows, which adds standard
     * window frame. Setting it to `false` will remove window shadow and window
     * animations. Default is `true`.
     */
    thickFrame?: boolean
    /**
     * Add a type of vibrancy effect to the window, only on macOS. Can be
     * `appearance-based`, `light`, `dark`, `titlebar`, `selection`, `menu`, `popover`,
     * `sidebar`, `medium-light`, `ultra-dark`, `header`, `sheet`, `window`, `hud`,
     * `fullscreen-ui`, `tooltip`, `content`, `under-window`, or `under-page`. Please
     * note that `appearance-based`, `light`, `dark`, `medium-light`, and `ultra-dark`
     * are deprecated and have been removed in macOS Catalina (10.15).
     */
    vibrancy?:
    | "appearance-based"
    | "light"
    | "dark"
    | "titlebar"
    | "selection"
    | "menu"
    | "popover"
    | "sidebar"
    | "medium-light"
    | "ultra-dark"
    | "header"
    | "sheet"
    | "window"
    | "hud"
    | "fullscreen-ui"
    | "tooltip"
    | "content"
    | "under-window"
    | "under-page"
    /**
     * Controls the behavior on macOS when option-clicking the green stoplight button
     * on the toolbar or by clicking the Window > Zoom menu item. If `true`, the window
     * will grow to the preferred width of the web page when zoomed, `false` will cause
     * it to zoom to the width of the screen. This will also affect the behavior when
     * calling `maximize()` directly. Default is `false`.
     */
    zoomToPageWidth?: boolean
    /**
     * Tab group name, allows opening the window as a native tab on macOS 10.12+.
     * Windows with the same tabbing identifier will be grouped together. This also
     * adds a native new tab button to your window's tab bar and allows your `app` and
     * window to receive the `new-window-for-tab` event.
     */
    tabbingIdentifier?: string
    /**
     * Settings of web page's features.
     */
    webPreferences?: WebPreferences
    /**
     *  When using a frameless window in conjuction with
     * `win.setWindowButtonVisibility(true)` on macOS or using a `titleBarStyle` so
     * that the standard window controls ("traffic lights" on macOS) are visible, this
     * property enables the Window Controls Overlay JavaScript APIs and CSS Environment
     * Variables. Specifying `true` will result in an overlay with default system
     * colors. Default is `false`.
     */
    titleBarOverlay?: TitleBarOverlay | boolean
  }

  interface TitleBarOverlay {
    /**
     * The CSS color of the Window Controls Overlay when enabled. Default is the system
     * color.
     *
     * @platform win32
     */
    color?: string
    /**
     * The CSS color of the symbols on the Window Controls Overlay when enabled.
     * Default is the system color.
     *
     * @platform win32
     */
    symbolColor?: string
    /**
     * The height of the title bar and Window Controls Overlay in pixels. Default is
     * system height.
     *
     * @platform darwin,win32
     */
    height?: number
  }

  interface WebPreferences {
    /**
     * Whether to enable DevTools. If it is set to `false`, can not use
     * `BrowserWindow.webContents.openDevTools()` to open DevTools. Default is `true`.
     */
    devTools?: boolean
    /**
     * Whether node integration is enabled. Default is `false`.
     */
    nodeIntegration?: boolean
    /**
     * Whether node integration is enabled in web workers. Default is `false`. More
     * about this can be found in Multithreading.
     */
    nodeIntegrationInWorker?: boolean
    /**
     * Experimental option for enabling Node.js support in sub-frames such as iframes
     * and child windows. All your preloads will load for every iframe, you can use
     * `process.isMainFrame` to determine if you are in the main frame or not.
     */
    nodeIntegrationInSubFrames?: boolean
    /**
     * Specifies a script that will be loaded before other scripts run in the page.
     * This script will always have access to node APIs no matter whether node
     * integration is turned on or off. The value should be the absolute file path to
     * the script. When node integration is turned off, the preload script can
     * reintroduce Node global symbols back to the global scope. See example here.
     */
    preload?: string
    /**
     * If set, this will sandbox the renderer associated with the window, making it
     * compatible with the Chromium OS-level sandbox and disabling the Node.js engine.
     * This is not the same as the `nodeIntegration` option and the APIs available to
     * the preload script are more limited. Read more about the option here.
     */
    sandbox?: boolean
    /**
     * Sets the session used by the page. Instead of passing the Session object
     * directly, you can also choose to use the `partition` option instead, which
     * accepts a partition string. When both `session` and `partition` are provided,
     * `session` will be preferred. Default is the default session.
     */

    partition?: string
    /**
     * The default zoom factor of the page, `3.0` represents `300%`. Default is `1.0`.
     */
    zoomFactor?: number
    /**
     * Enables JavaScript support. Default is `true`.
     */
    javascript?: boolean
    /**
     * When `false`, it will disable the same-origin policy (usually using testing
     * websites by people), and set `allowRunningInsecureContent` to `true` if this
     * options has not been set by user. Default is `true`.
     */
    webSecurity?: boolean
    /**
     * Allow an https page to run JavaScript, CSS or plugins from http URLs. Default is
     * `false`.
     */
    allowRunningInsecureContent?: boolean
    /**
     * Enables image support. Default is `true`.
     */
    images?: boolean
    /**
     * Specifies how to run image animations (E.g. GIFs).  Can be `animate`,
     * `animateOnce` or `noAnimation`.  Default is `animate`.
     */
    imageAnimationPolicy?:
    | "animate"
    | "animateOnce"
    | "noAnimation"
    /**
     * Make TextArea elements resizable. Default is `true`.
     */
    textAreasAreResizable?: boolean
    /**
     * Enables WebGL support. Default is `true`.
     */
    webgl?: boolean
    /**
     * Whether plugins should be enabled. Default is `false`.
     */
    plugins?: boolean
    /**
     * Enables Chromium's experimental features. Default is `false`.
     */
    experimentalFeatures?: boolean
    /**
     * Enables scroll bounce (rubber banding) effect on macOS. Default is `false`.
     *
     * @platform darwin
     */
    scrollBounce?: boolean
    /**
     * A list of feature strings separated by `,`, like `CSSVariables,KeyboardEventKey`
     * to enable. The full list of supported feature strings can be found in the
     * RuntimeEnabledFeatures.json5 file.
     */
    enableBlinkFeatures?: string
    /**
     * A list of feature strings separated by `,`, like `CSSVariables,KeyboardEventKey`
     * to disable. The full list of supported feature strings can be found in the
     * RuntimeEnabledFeatures.json5 file.
     */
    disableBlinkFeatures?: string
    /**
     * Sets the default font for the font-family.
     */
    defaultFontFamily?: DefaultFontFamily
    /**
     * Defaults to `16`.
     */
    defaultFontSize?: number
    /**
     * Defaults to `13`.
     */
    defaultMonospaceFontSize?: number
    /**
     * Defaults to `0`.
     */
    minimumFontSize?: number
    /**
     * Defaults to `ISO-8859-1`.
     */
    defaultEncoding?: string
    /**
     * Whether to throttle animations and timers when the page becomes background. This
     * also affects the Page Visibility API. Defaults to `true`.
     */
    backgroundThrottling?: boolean
    /**
     * Whether to enable offscreen rendering for the browser window. Defaults to
     * `false`. See the offscreen rendering tutorial for more details.
     */
    offscreen?: boolean
    /**
     * Whether to run Electron APIs and the specified `preload` script in a separate
     * JavaScript context. Defaults to `true`. The context that the `preload` script
     * runs in will only have access to its own dedicated `document` and `window`
     * globals, as well as its own set of JavaScript builtins (`Array`, `Object`,
     * `JSON`, etc.), which are all invisible to the loaded content. The Electron API
     * will only be available in the `preload` script and not the loaded page. This
     * option should be used when loading potentially untrusted remote content to
     * ensure the loaded content cannot tamper with the `preload` script and any
     * Electron APIs being used.  This option uses the same technique used by Chrome
     * Content Scripts.  You can access this context in the dev tools by selecting the
     * 'Electron Isolated Context' entry in the combo box at the top of the Console
     * tab.
     */
    contextIsolation?: boolean
    /**
     * Whether to enable the `<webview>` tag. Defaults to `false`. **Note:** The
     * `preload` script configured for the `<webview>` will have node integration
     * enabled when it is executed so you should ensure remote/untrusted content is not
     * able to create a `<webview>` tag with a possibly malicious `preload` script. You
     * can use the `will-attach-webview` event on webContents to strip away the
     * `preload` script and to validate or alter the `<webview>`'s initial settings.
     */
    webviewTag?: boolean
    /**
     * A list of strings that will be appended to `process.argv` in the renderer
     * process of this app.  Useful for passing small bits of data down to renderer
     * process preload scripts.
     */
    additionalArguments?: string[]
    /**
     * Whether to enable browser style consecutive dialog protection. Default is
     * `false`.
     */
    safeDialogs?: boolean
    /**
     * The message to display when consecutive dialog protection is triggered. If not
     * defined the default message would be used, note that currently the default
     * message is in English and not localized.
     */
    safeDialogsMessage?: string
    /**
     * Whether to disable dialogs completely. Overrides `safeDialogs`. Default is
     * `false`.
     */
    disableDialogs?: boolean
    /**
     * Whether dragging and dropping a file or link onto the page causes a navigation.
     * Default is `false`.
     */
    navigateOnDragDrop?: boolean
    /**
     * Autoplay policy to apply to content in the window, can be
     * `no-user-gesture-required`, `user-gesture-required`,
     * `document-user-activation-required`. Defaults to `no-user-gesture-required`.
     */
    autoplayPolicy?:
    | "no-user-gesture-required"
    | "user-gesture-required"
    | "document-user-activation-required"
    /**
     * Whether to prevent the window from resizing when entering HTML Fullscreen.
     * Default is `false`.
     */
    disableHtmlFullscreenWindowResize?: boolean
    /**
     * An alternative title string provided only to accessibility tools such as screen
     * readers. This string is not directly visible to users.
     */
    accessibleTitle?: string
    /**
     * Whether to enable the builtin spellchecker. Default is `true`.
     */
    spellcheck?: boolean
    /**
     * Whether to enable the WebSQL api. Default is `true`.
     */
    enableWebSQL?: boolean
    /**
     * Enforces the v8 code caching policy used by blink. Accepted values are
     */
    v8CacheOptions?:
    | "none"
    | "code"
    | "bypassHeatCheck"
    | "bypassHeatCheckAndEagerCompile"
    /**
     * Whether to enable preferred size mode. The preferred size is the minimum size
     * needed to contain the layout of the document—without requiring scrolling.
     * Enabling this will cause the `preferred-size-changed` event to be emitted on the
     * `WebContents` when the preferred size changes. Default is `false`.
     */
    enablePreferredSizeMode?: boolean
  }

  interface DefaultFontFamily {
    /**
     * Defaults to `Times New Roman`.
     */
    standard?: string
    /**
     * Defaults to `Times New Roman`.
     */
    serif?: string
    /**
     * Defaults to `Arial`.
     */
    sansSerif?: string
    /**
     * Defaults to `Courier New`.
     */
    monospace?: string
    /**
     * Defaults to `Script`.
     */
    cursive?: string
    /**
     * Defaults to `Impact`.
     */
    fantasy?: string
  }
  export type kenvEnv = {
    KIT_AUTO_INSTALL?: string | undefined
    KIT_AUTO_UPDATE?: string | undefined
    KIT_BACKGROUND_COLOR?: string | undefined
    KIT_BACKGROUND_MATERIAL?: string | undefined
    KIT_CACHE_PROMPT?: string | undefined
    KIT_CLIPBOARD?: string | undefined
    KIT_CONVERT_KEY?: string | undefined
    KIT_CWD?: string | undefined
    KIT_DEBUG_PROMPT?: string | undefined
    KIT_DOCK?: string | undefined
    KIT_ALLOWED_ORIGINS?: string | undefined
    KIT_ALWAYS_ON_TOP?: string | undefined
    KIT_AUTO_UPDATE?: string | undefined
    KIT_BACKGROUND_THROTTLE?: string | undefined
    KIT_SHADOW?: string | undefined
    KIT_BLUR?: string | undefined
    KIT_GPU?: string | undefined
    KIT_FRAME?: string | undefined
    KIT_TRANSPARENT?: string | undefined
    KIT_DISPLAY?: string | undefined
    KIT_EMOJI_SHORTCUT?: string | undefined
    KIT_IDLE_PROCESSES?: string | undefined
    KIT_KEYBOARD?: string | undefined
    KIT_MAIN_SCRIPT?: string | undefined
    KIT_MAIN_SHORTCUT?: string | undefined
    KIT_MAIN_SHORTCUT_RETURN_FOCUS?: string | undefined
    KIT_MIC?: string | undefined
    KIT_MEASURE?: string | undefined
    KIT_MONO_FONT?: string | undefined
    KIT_NO_PREVIEW?: string | undefined
    KIT_OPEN_AT_LOGIN?: string | undefined
    KIT_OPEN_IN?: string | undefined
    KIT_PROMPT_INITIAL_HIDE_TIMEOUT?: string | undefined
    KIT_PROMPT_INITIAL_SHOW?: string | undefined
    KIT_PROMPT_INITIAL_X?: string | undefined
    KIT_PROMPT_INITIAL_Y?: string | undefined
    KIT_SANS_FONT?: string | undefined
    KIT_SEARCH_DEBOUNCE?: string | undefined
    KIT_SERIF_FONT?: string | undefined
    KIT_STDIO?: string | undefined
    KIT_SUSPEND_WATCHERS?: string | undefined
    KIT_TELEMETRY?: string | undefined
    KIT_TERM_FONT?: string | undefined
    KIT_THEME_DARK?: string | undefined
    KIT_THEME_LIGHT?: string | undefined
    KIT_TRANSPARENT?: string | undefined
    KIT_TRAY?: string | undefined
    KIT_TYPED_LIMIT?: string | undefined
    KIT_TYPING_RATE?: string | undefined
    KIT_WEBCAM?: string | undefined
    KIT_WIDTH?: string | undefined
    KIT_WINDOWS_PRERENDER_SHOW_INACTIVE_TIMEOUT?:
    | string
    | undefined
    KIT_WINDOWS_PRERENDER_TIMEOUT?: string | undefined
    KIT_SEARCH_MIN_SCORE?: string | undefined
    KIT_SEARCH_MAX_ITERATIONS?: string | undefined
    KIT_USE_KIT_NODE_PATH?: string | undefined
  }
  import type { GlobalsApi } from "../../globals/index.js"
  import type { AppApi } from "./kitapp"
  import type { KitApi, Run } from "./kit"
  import type { PackagesApi } from "./packages"
  import type { PlatformApi } from "./platform"
  import type { ProAPI } from "./pro"

  export type GlobalApi = Omit<GlobalsApi, "path"> &
    KitApi &
    PackagesApi &
    PlatformApi &
    AppApi &
    ProAPI

  declare global {
    var kit: GlobalApi & Run

    namespace NodeJS {
      interface Global extends GlobalApi { }
    }
  }

  export * from "./core"
  export * from "../core/utils"

  export default kit

  export declare enum EventType {
    EVENT_KEY_PRESSED = 4,
    EVENT_KEY_RELEASED = 5,
    EVENT_MOUSE_CLICKED = 6,
    EVENT_MOUSE_PRESSED = 7,
    EVENT_MOUSE_RELEASED = 8,
    EVENT_MOUSE_MOVED = 9,
    EVENT_MOUSE_WHEEL = 11,
  }
  export interface UiohookKeyboardEvent {
    type:
    | EventType.EVENT_KEY_PRESSED
    | EventType.EVENT_KEY_RELEASED
    time: number
    altKey: boolean
    ctrlKey: boolean
    metaKey: boolean
    shiftKey: boolean
    keycode: number
    key: string
    text: string
  }
  export interface UiohookMouseEvent {
    type:
    | EventType.EVENT_MOUSE_CLICKED
    | EventType.EVENT_MOUSE_MOVED
    | EventType.EVENT_MOUSE_PRESSED
    | EventType.EVENT_MOUSE_RELEASED
    time: number
    altKey: boolean
    ctrlKey: boolean
    metaKey: boolean
    shiftKey: boolean
    x: number
    y: number
    button: unknown
    clicks: number
  }
  export interface UiohookWheelEvent {
    type: EventType.EVENT_MOUSE_WHEEL
    time: number
    altKey: boolean
    ctrlKey: boolean
    metaKey: boolean
    shiftKey: boolean
    x: number
    y: number
    clicks: number
    amount: number
    direction: WheelDirection
    rotation: number
  }
  export declare enum WheelDirection {
    VERTICAL = 3,
    HORIZONTAL = 4,
  }
  export declare const UiohookKey: {
    readonly Backspace: 14
    readonly Tab: 15
    readonly Enter: 28
    readonly CapsLock: 58
    readonly Escape: 1
    readonly Space: 57
    readonly PageUp: 3657
    readonly PageDown: 3665
    readonly End: 3663
    readonly Home: 3655
    readonly ArrowLeft: 57419
    readonly ArrowUp: 57416
    readonly ArrowRight: 57421
    readonly ArrowDown: 57424
    readonly Insert: 3666
    readonly Delete: 3667
    readonly 0: 11
    readonly 1: 2
    readonly 2: 3
    readonly 3: 4
    readonly 4: 5
    readonly 5: 6
    readonly 6: 7
    readonly 7: 8
    readonly 8: 9
    readonly 9: 10
    readonly A: 30
    readonly B: 48
    readonly C: 46
    readonly D: 32
    readonly E: 18
    readonly F: 33
    readonly G: 34
    readonly H: 35
    readonly I: 23
    readonly J: 36
    readonly K: 37
    readonly L: 38
    readonly M: 50
    readonly N: 49
    readonly O: 24
    readonly P: 25
    readonly Q: 16
    readonly R: 19
    readonly S: 31
    readonly T: 20
    readonly U: 22
    readonly V: 47
    readonly W: 17
    readonly X: 45
    readonly Y: 21
    readonly Z: 44
    readonly Numpad0: 82
    readonly Numpad1: 79
    readonly Numpad2: 80
    readonly Numpad3: 81
    readonly Numpad4: 75
    readonly Numpad5: 76
    readonly Numpad6: 77
    readonly Numpad7: 71
    readonly Numpad8: 72
    readonly Numpad9: 73
    readonly NumpadMultiply: 55
    readonly NumpadAdd: 78
    readonly NumpadSubtract: 74
    readonly NumpadDecimal: 83
    readonly NumpadDivide: 3637
    readonly NumpadEnd: number
    readonly NumpadArrowDown: number
    readonly NumpadPageDown: number
    readonly NumpadArrowLeft: number
    readonly NumpadArrowRight: number
    readonly NumpadHome: number
    readonly NumpadArrowUp: number
    readonly NumpadPageUp: number
    readonly NumpadInsert: number
    readonly NumpadDelete: number
    readonly F1: 59
    readonly F2: 60
    readonly F3: 61
    readonly F4: 62
    readonly F5: 63
    readonly F6: 64
    readonly F7: 65
    readonly F8: 66
    readonly F9: 67
    readonly F10: 68
    readonly F11: 87
    readonly F12: 88
    readonly F13: 91
    readonly F14: 92
    readonly F15: 93
    readonly F16: 99
    readonly F17: 100
    readonly F18: 101
    readonly F19: 102
    readonly F20: 103
    readonly F21: 104
    readonly F22: 105
    readonly F23: 106
    readonly F24: 107
    readonly Semicolon: 39
    readonly Equal: 13
    readonly Comma: 51
    readonly Minus: 12
    readonly Period: 52
    readonly Slash: 53
    readonly Backquote: 41
    readonly BracketLeft: 26
    readonly Backslash: 43
    readonly BracketRight: 27
    readonly Quote: 40
    readonly Ctrl: 29
    readonly CtrlRight: 3613
    readonly Alt: 56
    readonly AltRight: 3640
    readonly Shift: 42
    readonly ShiftRight: 54
    readonly Meta: 3675
    readonly MetaRight: 3676
    readonly NumLock: 69
    readonly ScrollLock: 70
    readonly PrintScreen: 3639
  }
  declare interface UiohookNapi {
    on(
      event: "input",
      listener: (
        e:
          | UiohookKeyboardEvent
          | UiohookMouseEvent
          | UiohookWheelEvent
      ) => void
    ): this
    on(
      event: "keydown",
      listener: (e: UiohookKeyboardEvent) => void
    ): this
    on(
      event: "keyup",
      listener: (e: UiohookKeyboardEvent) => void
    ): this
    on(
      event: "mousedown",
      listener: (e: UiohookMouseEvent) => void
    ): this
    on(
      event: "mouseup",
      listener: (e: UiohookMouseEvent) => void
    ): this
    on(
      event: "mousemove",
      listener: (e: UiohookMouseEvent) => void
    ): this
    on(
      event: "click",
      listener: (e: UiohookMouseEvent) => void
    ): this
    on(
      event: "wheel",
      listener: (e: UiohookWheelEvent) => void
    ): this
  }
  declare class UiohookNapi extends EventEmitter {
    private handler
    start(): void
    stop(): void
    keyTap(key: number, modifiers?: number[]): void
    keyToggle(key: number, toggle: "down" | "up"): void
  }
  export declare const uIOhook: UiohookNapi

  import type {
    format,
    formatDistanceToNow,
  } from "../../utils/date.js"
  import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods"
  import type {
    Action,
    Choice,
    Choices,
    FlagsObject,
    ActionsConfig,
    Panel,
    Preview,
    PromptConfig,
    ScoredChoice,
    Script,
    Shortcut,
  } from "./core"

  import type { ConfigOptions, Options } from "quick-score"

  export interface Arg {
    [key: string]: any
    <T = string>(
      placeholderOrConfig?: string | PromptConfig,
      choicesOrPanel?: Choices<T> | Panel,
      actionsOrPreview?: Action[] | Preview
    ): Promise<T>
  }

  export type Select = <T = any[]>(
    placeholderOrConfig: string | PromptConfig,
    choices?: Choices<T>,
    actions?: Action[]
  ) => Promise<T>

  export type Grid = <T = any[]>(
    placeholderOrConfig: string | PromptConfig,
    choices: Choices<T>,
    actions?: Action[]
  ) => Promise<T>

  export interface EnvConfig extends PromptConfig {
    reset?: boolean
  }
  export interface Env {
    (
      envKey: string,
      promptConfig?:
        | string
        | EnvConfig
        | (() => Promise<string>)
    ): Promise<string>
    [key: string]: any
  }

  export interface Args extends Array<string> { }

  export type UpdateArgs = (args: string[]) => void

  export type PathFn = (...pathParts: string[]) => string

  export type Inspect = (
    data: any,
    extension?: string
  ) => Promise<void>

  export type Store = (
    key: string,
    initialData?: any
  ) => Promise<InstanceType<typeof import("keyv").default>>

  export type DB = <T = any>(
    dataOrKeyOrPath?: string | T | (() => Promise<T>),
    data?: T | (() => Promise<T>),
    fromCache?: boolean
  ) => Promise<
    T extends string
    ? {
      write: () => Promise<void>
      read: () => Promise<any>
      data: any
      [key: string]: any
    }
    : {
      write: () => Promise<void>
      read: () => Promise<T>
      data: any
    } & T
  >

  export type OnTab = (
    name: string,
    fn: (input?: string) => void | Promise<void>
  ) => void

  export interface Trace {
    enabled: boolean
    begin: (
      fields: Parameters<
        InstanceType<
          typeof import("chrome-trace-event").Tracer
        >["begin"]
      >[0]
    ) => void
    end: (
      fields: Parameters<
        InstanceType<
          typeof import("chrome-trace-event").Tracer
        >["end"]
      >[0]
    ) => void
    instant: (
      fields: Parameters<
        InstanceType<
          typeof import("chrome-trace-event").Tracer
        >["instantEvent"]
      >[0]
    ) => void
    flush: () => void
  }

  export type KitModuleLoader = (
    packageName: string,
    ...moduleArgs: string[]
  ) => Promise<any>
  export type Edit = (
    file: string,
    dir?: string,
    line?: string | number,
    col?: string | number
  ) => Promise<void>

  export type Browse = (
    url: string
  ) => ReturnType<typeof import("@johnlindquist/open")>

  export type Wait = (
    time: number,
    submitValue?: any
  ) => Promise<void>

  export type IsCheck = (file: string) => Promise<boolean>

  export type PathResolver = (
    dir: string
  ) => (...pathParts: string[]) => string

  export type GetScripts = (
    fromCache?: boolean
  ) => Promise<Script[]>

  export type FlagFn = (
    flags: FlagsObject,
    options?: ActionsConfig
  ) => void
  export type ActionsFn = (
    actions: Action[],
    options?: ActionsConfig
  ) => void
  export type PrepFlags = (
    flags: FlagsObject
  ) => FlagsObject
  export type Flags = {
    [key: string]: boolean | string
    cmd?: boolean | string
    ctrl?: boolean | string
    shift?: boolean | string
    option?: boolean | string
    alt?: boolean | string
  }

  export type SelectKitEditor = (
    reset: boolean
  ) => Promise<string>

  export interface SelectScript {
    (
      message?: string,
      fromCache?: boolean,
      xf?: (x: Script[]) => Script[]
    ): Promise<Script>
    (
      message: PromptConfig,
      fromCache?: boolean,
      xf?: (x: Script[]) => Script[]
    ): Promise<Script | string>
  }

  export interface Kenv {
    name: string
    dirPath: string
  }
  export type SelectKenv = (
    config?: PromptConfig,
    ignorePattern?: RegExp
  ) => Promise<Kenv>

  export type Highlight = (
    markdown: string,
    containerClass?: string,
    injectStyles?: string
  ) => Promise<string>

  interface PathConfig extends PromptConfig {
    startPath?: string
    onlyDirs?: boolean
    showHidden?: boolean
  }

  type PathPicker = (
    config?: string | PathConfig,
    actions?: Action[]
  ) => Promise<string>
  export type PathSelector = typeof import("path") &
    PathPicker

  type GistOptions = {
    fileName?: string
    description?: string
    isPublic?: boolean
  }
  export type CreateGist = (
    content: string,
    options?: GistOptions
  ) => Promise<
    RestEndpointMethodTypes["gists"]["create"]["response"]["data"]
  >

  export type SetShortcuts = (
    shortcuts: Shortcut[]
  ) => Promise<void>
  export interface KitApi {
    path: PathSelector
    db: DB

    wait: Wait

    checkProcess: (processId: number) => string

    /**
     * @example
     * ```
     * let pathToProject =  await home("projects", "my-code-project")
     * // /Users/johnlindquist/projects/my-code-project
     * ```
     */
    home: PathFn
    isFile: IsCheck
    isDir: IsCheck
    isBin: IsCheck
    createPathResolver: PathResolver
    /**
     * @example
     * ```
     * let value =  await arg()
     * ```
     */
    arg: Arg
    select: Select
    mini: Arg
    micro: Arg
    /**
     * @example
     * ```
     * // Reads from .env or prompts if not set
     * let SOME_ENV_VAR = await env("SOME_ENV_VAR")
     * ```
     */
    env: Env
    argOpts: string[]

    kitPath: PathFn
    kenvPath: PathFn
    /**
     * Generate a path `~/.kenv/tmp/{command}/...parts`
     *
     * @example
     * ```
     * tmpPath("taco.txt") // ~/.kenv/tmp/command/taco.txt
     * ```
     */
    tmpPath: PathFn
    kenvTmpPath: PathFn

    inspect: Inspect

    onTab: OnTab

    attemptImport: KitModuleLoader
    npm: KitModuleLoader
    setup: KitModuleLoader

    edit: Edit
    browse: Browse

    args: Args
    updateArgs: UpdateArgs

    kitScript: string

    terminal: (script: string) => Promise<string>
    iterm: (iterm: string) => Promise<string>
    hyper: (hyper: string) => Promise<string>

    onTabs: {
      name: string
      fn: (input?: string) => void | Promise<any>
    }[]
    onTabIndex: number

    kitPrevChoices: Choices<any>

    getScripts: GetScripts

    memoryMap: Map<string, any>

    selectKitEditor: SelectKitEditor

    run: Run

    flag: Flags
    setFlags: FlagFn
    prepFlags: PrepFlags
    selectScript: SelectScript
    selectKenv: SelectKenv
    highlight: Highlight
    projectPath: PathFn
    createGist: CreateGist
    setShortcuts: SetShortcuts
    isWin: boolean
    isMac: boolean
    isLinux: boolean
    cmd: "cmd" | "ctrl"
    formatDate: typeof format
    formatDateToNow: typeof formatDistanceToNow
  }

  interface KeyValue {
    [key: string]: any
  }

  export type Run = (
    command?: string,
    ...args: string[]
  ) => Promise<any>

  type Utils = typeof import("../core/utils")

  declare global {
    var path: PathSelector
    var edit: Edit
    var browse: Browse

    var kitPath: PathFn
    var kenvPath: PathFn
    var tmpPath: PathFn
    var kenvTmpPath: PathFn

    var attemptImport: KitModuleLoader
    /** @deprecated Use standard or dynamic imports instead. */
    var npm: KitModuleLoader
    var npmInstall: (packageName: string) => Promise<void>
    var installMissingPackage: (
      packageName: string
    ) => Promise<void>
    var run: Run
    var setup: KitModuleLoader

    var env: Env
    var arg: Arg
    var select: Select
    var grid: Grid
    var basePrompt: Arg
    var mini: Arg
    var micro: Arg
    var onTab: OnTab
    var args: Args

    var updateArgs: UpdateArgs
    var argOpts: string[]

    var wait: Wait

    var home: PathFn
    var isFile: IsCheck
    var isDir: IsCheck
    var isBin: IsCheck
    var createPathResolver: PathResolver

    var inspect: Inspect

    var db: DB
    var store: Store

    var memoryMap: Map<string, any>

    var onTabIndex: number

    var selectKitEditor: SelectKitEditor

    var getScripts: GetScripts
    var blur: () => Promise<void>
    var flag: Flags
    var actionFlag: string
    var setFlags: FlagFn
    var setActions: ActionsFn
    var openActions: () => Promise<void>
    var closeActions: () => Promise<void>
    var setFlagValue: (value: any) => Promise<void>
    var prepFlags: PrepFlags

    var selectScript: SelectScript
    var selectKenv: SelectKenv
    var highlight: Highlight

    var terminal: (script: string) => Promise<string>
    var iterm: (iterm: string) => Promise<string>
    var hyper: (hyper: string) => Promise<string>
    var projectPath: PathFn
    var clearAllTimeouts: () => void
    var clearAllIntervals: () => void
    var createGist: CreateGist
    var setShortcuts: SetShortcuts
    var isWin: boolean
    var isMac: boolean
    var isLinux: boolean
    var cmd: "cmd" | "ctrl"
    var formatDate: typeof format
    var formatDateToNow: typeof formatDistanceToNow

    var debounce: Utils["debounce"]
    var sortBy: Utils["sortBy"]
    var isUndefined: Utils["isUndefined"]
    var isString: Utils["isString"]

    var createChoiceSearch: (
      choices: Choice[],
      config: Partial<Options & ConfigOptions>
    ) => Promise<(query: string) => ScoredChoice[]>

    var setScoredChoices: (
      scoredChoices: ScoredChoice[]
    ) => Promise<void>

    var groupChoices: (
      choices: Choice[],
      options?: {
        groupKey?: string
        missingGroupName?: string
        order?: string[]
        sortChoicesKey?: (string | boolean)[]
        recentKey?: string
        recentLimit?: number
        excludeGroups?: string[]
      }
    ) => Choice[]

    var formatChoices: (
      choices: Choice[],
      className?: string
    ) => Choice[]

    var preload: (scriptPath?: string) => void

    var setSelectedChoices: (
      choices: Choice[]
    ) => Promise<void>
    var toggleAllSelectedChoices: () => Promise<void>
    var trace: Trace

    type Metadata = import("./core").Metadata
    var metadata: Metadata
  }

  import type { editor } from "./editor.api"

  import type core from "./core/enum"

  import type { KeyEnum } from "../core/keyboard.js"
  import type { AppDb } from "../core/db.js"

  import type {
    BrowserWindowConstructorOptions,
    Display,
    Rectangle,
  } from "./electron"

  import type { Trash } from "./packages"
  import type { marked } from "@johnlindquist/globals/types/marked"
  import type { ChildProcess } from "node:child_process"
  import type {
    UiohookKeyboardEvent,
    UiohookMouseEvent,
    UiohookWheelEvent,
  } from "./io"
  import type { FileSearchOptions } from "./platform"

  import type { NotificationConstructorOptions } from "./notify"

  export type Status = (typeof statuses)[number]

  export interface AppMessage {
    channel: Channel
    pid: number
    newPid?: number
    state: AppState
    widgetId?: number
    promptId: string
    env?: Record<string, string>
  }

  export interface Config {
    imagePath: string
    deleteSnippet: boolean
  }

  export interface BaseMessage {
    text: string
    position: string
    type: string
  }

  // Todo: Implement more methods and fix types accordingly
  export interface IMessage extends BaseMessage {
    id: string | number
    title: string
    focus: boolean
    date: number | Date
    dateString?: string
    avatar?: string
    titleColor: string
    forwarded: boolean
    replyButton: boolean
    removeButton: boolean
    status: "waiting" | "sent" | "received" | "read"
    copiableDate?: boolean
    retracted: boolean
    className?: string
    renderHTML?: boolean
  }

  export type Message = string | Partial<IMessage>

  export type Notify = (
    options: NotificationConstructorOptions
  ) => Promise<void>

  export type Chat = ((
    config?: PromptConfig,
    actions?: Action[]
  ) => Promise<Message[]>) & {
    addMessage?: (message: Message) => void
    setMessage?: (index: number, message: Message) => void
    getMessages?: () => Promise<BaseMessage[]>
    setMessages?: (messages: Message[]) => Promise<void>
    pushToken?: (token: string) => Promise<void>
  }

  interface ToastOptions {
    /**
     * Pause the timer when the mouse hover the toast.
     * `Default: true`
     */
    pauseOnHover?: boolean
    /**
     * Pause the toast when the window loses focus.
     * `Default: true`
     */
    pauseOnFocusLoss?: boolean
    /**
     * Remove the toast when clicked.
     * `Default: true`
     */
    closeOnClick?: boolean
    /**
     * Set the delay in ms to close the toast automatically.
     * Use `false` to prevent the toast from closing.
     * `Default: 5000`
     */
    autoClose?: number | false
    /**
     * Hide or show the progress bar.
     * `Default: false`
     */
    hideProgressBar?: boolean
    /**
     * Allow toast to be draggable
     * `Default: 'touch'`
     */
    draggable?: boolean | "mouse" | "touch"
    /**
     * The percentage of the toast's width it takes for a drag to dismiss a toast
     * `Default: 80`
     */
    draggablePercent?: number
  }
  export type Toast = (
    toast: string,
    options?: ToastOptions
  ) => void

  export type Prompt = {
    closeActions(): Promise<void>
    close(): Promise<void>
    openActions(): Promise<void>
    setInput(input: string): Promise<void>
    focus(): Promise<void>
    blur(): Promise<void>
    hide(): Promise<void>
  }

  export type Mic = ((
    config?: MicConfig
  ) => Promise<Buffer>) & {
    stop?: () => Promise<Buffer>
    start?: (config?: MicConfig) => Promise<string>
    stream?: Readable
  }

  export type WebCam = (
    config?: PromptConfig
  ) => Promise<string>

  export type Speech = (
    config?: PromptConfig
  ) => Promise<string>

  export type Screenshot = (
    displayId?: number,
    bounds?: ScreenShotBounds
  ) => Promise<Buffer>

  export type GetMediaDevices = () => Promise<
    MediaDeviceInfo[]
  >

  export type GetTypedText = () => Promise<string>

  export type Find = (
    placeholderOrConfig?: string | PromptConfig,
    options?: FileSearchOptions
  ) => Promise<string>

  export type Editor = ((
    config?: EditorConfig & { hint?: string },
    actions?: Action[]
  ) => Promise<string>) & {
    setSuggestions?: (
      suggestions: string[]
    ) => Promise<void>
    setConfig?: (config: EditorConfig) => Promise<void>
    append?: (text: string) => Promise<void>
    getSelection?: () => Promise<{
      text: string
      start: number
      end: number
    }>
    getCursorOffset?: () => Promise<number>
    moveCursor?: (offset: number) => Promise<void>
    insertText?: (text: string) => Promise<void>
    // setCodeHint?: (hint: string) => Promise<void>
  }

  export interface EditorProps {
    options: EditorConfig
    height: number
    width: number
  }

  export type EditorOptions =
    editor.IStandaloneEditorConstructionOptions & {
      file?: string
      footer?: string
      scrollTo?: "top" | "center" | "bottom"
      hint?: string
      onInput?: PromptConfig["onInput"]
      onEscape?: PromptConfig["onEscape"]
      onAbandon?: PromptConfig["onAbandon"]
      onPaste?: PromptConfig["onPaste"]
      onBlur?: PromptConfig["onBlur"]
      onDrop?: PromptConfig["onDrop"]
      extraLibs?: { content: string; filePath: string }[]
      template?: string
      suggestions?: string[]
      actions?: Action[]
    }

  export type EditorConfig =
    | string
    | (PromptConfig & EditorOptions)

  export type MicConfig = PromptConfig & {
    filePath?: string
    timeSlice?: number
  }

  export interface TextareaConfig extends PromptConfig {
    value?: string
  }

  export type EditorRef = editor.IStandaloneCodeEditor

  export type PromptBounds = {
    x: number
    y: number
    width: number
    height: number
  }

  export type PromptDb = {
    screens: {
      [screenId: string]: {
        [scriptId: string]: PromptBounds
      }
    }
  }

  export type TextArea = (
    placeholderOrOptions?: string | TextareaConfig
  ) => Promise<string | void>

  export type Drop = (
    placeholder?: string | PromptConfig,
    actions?: Action[]
  ) => Promise<any>
  export type Template = (
    template: string,
    config?: EditorConfig,
    actions?: Action[]
  ) => Promise<string>
  export type OldForm = (
    html?:
      | string
      | {
        html?: string
        hint?: string
      },
    formData?: any
  ) => Promise<any>

  export type Form = (
    html: string | PromptConfig,
    formData?: any,
    actions?: Action[]
  ) => Promise<any>

  type Field =
    | {
      label?: string
      placeholder?: string
      value?: string
      type?: string
      required?: boolean
      min?: number
      max?: number
      step?: number
      pattern?: string
      [key: string]: string | boolean | number
    }
    | string

  export type Fields = (
    fields: Field[] | (PromptConfig & { fields: Field[] }),
    actions?: Action[]
  ) => Promise<string[]>

  export type AudioOptions = {
    filePath: string
    playbackRate?: number
  }

  type EmojiObject = {
    activeSkinTone: string
    emoji: string
    names: string[]
    unified: string
    unifiedWithoutSkinTone: string
  }

  export type Emoji = (
    config?: PromptConfig
  ) => Promise<EmojiObject>

  export interface DivConfig extends PromptConfig {
    html: string
    placeholder?: string
    hint?: string
    footer?: string
  }

  export type Div = (
    html?: string | DivConfig,
    containerClass?: string
  ) => Promise<any>

  export interface KeyData {
    key: KeyEnum
    keyCode: string
    command: boolean
    shift: boolean
    option: boolean
    control: boolean
    fn: boolean
    hyper: boolean
    os: boolean
    super: boolean
    win: boolean
    shortcut: string
  }
  export interface Hotkey {
    (placeholder?: string | PromptConfig): Promise<KeyData>
  }

  type SetImage = string | { src: string }

  type AddChoice = (
    choice: string | Choice
  ) => Promise<void>

  type SetChoices = (
    choices: (Choice | string)[],
    config?: {
      className?: string
      skipInitialSearch?: boolean
      inputRegex?: string
      generated?: boolean
    }
  ) => Promise<void>

  type SetFormData = (formData: any) => Promise<void>

  type AppendChoices = (choices: Choice[]) => Promise<void>

  type SetTextAreaOptions = {
    value?: string
    placeholder?: string
  }

  export interface AppConfig {
    os: string
    isWin: boolean
    isMac: boolean
    assetPath: string
    version: string
    delimiter: string
    sep: string
  }

  export interface KitStatus {
    status: Status
    message: string
  }

  export type Appearance = "light" | "dark"

  type DisabledThottlingConfig = Pick<
    PromptConfig,
    | "headerClassName"
    | "footerClassName"
    | "ui"
    | "inputHeight"
    | "itemHeight"
    | "placeholder"
    | "scriptPath"
  >

  export type GetAppData =
    | Channel.GET_ACTIVE_APP
    | Channel.GET_BACKGROUND
    | Channel.GET_MOUSE
    | Channel.GET_SCHEDULE
    | Channel.GET_BOUNDS
    | Channel.GET_SCREEN_INFO
    | Channel.GET_SCREENS_INFO
    | Channel.GET_SCRIPTS_STATE
    | Channel.GET_CLIPBOARD_HISTORY

  export type SendNoOptions =
    | Channel.CLEAR_CACHE
    | Channel.CLIPBOARD_SYNC_HISTORY
    | Channel.CLEAR_PREVIEW
    | Channel.CLEAR_PROMPT_CACHE
    | Channel.CLEAR_TABS
    | Channel.CONSOLE_CLEAR
    | Channel.KIT_CLEAR
    | Channel.HIDE_APP
    | Channel.BLUR_APP
    | Channel.NEEDS_RESTART
    | Channel.TOGGLE_TRAY
    | Channel.UPDATE_APP
    | Channel.QUIT_APP
    | Channel.OPEN_DEV_TOOLS
    | Channel.OPEN_MENU
    | Channel.FOCUS
    | Channel.SHOW_EMOJI_PANEL
    | Channel.BEEP
    | Channel.PING
    | Channel.PONG
  export interface ChannelMap {
    // Figure these undefined out later
    [Channel.KIT_LOADING]: string
    [Channel.KIT_READY]: string
    [Channel.MAIN_MENU_READY]: string
    [Channel.ERROR]: {
      script: string
      message?: string
      stack?: string
    }
    [Channel.VALUE_SUBMITTED]: any
    [Channel.GET_BACKGROUND]: undefined
    [Channel.GET_COLOR]: undefined
    [Channel.GET_TYPED_TEXT]: undefined
    [Channel.GET_MOUSE]: undefined
    [Channel.GET_EDITOR_HISTORY]: undefined
    [Channel.GET_SCHEDULE]: undefined
    [Channel.GET_PROCESSES]: undefined
    [Channel.GET_BOUNDS]: undefined
    [Channel.GET_SCREEN_INFO]: undefined
    [Channel.GET_SCREENS_INFO]: undefined
    [Channel.GET_ACTIVE_APP]: undefined
    [Channel.GET_SCRIPTS_STATE]: undefined
    [Channel.GET_CLIPBOARD_HISTORY]: undefined
    [Channel.GET_APP_STATE]: undefined
    [Channel.CUT_TEXT]: undefined
    [Channel.START_DRAG]: {
      filePath: string
      iconPath?: string
    }
    [Channel.WIDGET_GET]: undefined
    [Channel.WIDGET_UPDATE]: {
      widgetId: number
      html: string
      options?: ShowOptions
    }
    [Channel.WIDGET_EXECUTE_JAVASCRIPT]: {
      widgetId: number
      js: string
    }
    [Channel.WIDGET_SET_STATE]: {
      state: any
    }
    [Channel.WIDGET_CAPTURE_PAGE]: undefined
    [Channel.WIDGET_CLICK]: {
      targetId: string
      windowId: number
    }
    [Channel.WIDGET_DROP]: {
      targetId: string
      windowId: number
    }
    [Channel.WIDGET_MOUSE_DOWN]: {
      targetId: string
      windowId: number
    }
    [Channel.WIDGET_INPUT]: {
      targetId: string
      windowId: number
    }
    [Channel.WIDGET_DRAG_START]: {
      targetId: string
      windowId: number
    }
    [Channel.WIDGET_END]: { widgetId: number }
    [Channel.WIDGET_FIT]: { widgetId: number }
    [Channel.WIDGET_SET_SIZE]: {
      widgetId: number
      width: number
      height: number
    }
    [Channel.WIDGET_SET_POSITION]: {
      widgetId: number
      x: number
      y: number
    }

    [Channel.WIDGET_CALL]: {
      widgetId: number
      method: string
      args?: any[]
    }

    //

    [Channel.CLEAR_CACHE]: undefined
    [Channel.CLEAR_SCRIPTS_MEMORY]: undefined
    [Channel.CLEAR_TABS]: string[]
    [Channel.CLIPBOARD_SYNC_HISTORY]: undefined
    [Channel.CLEAR_PROMPT_CACHE]: undefined
    [Channel.CLEAR_PREVIEW]: undefined
    [Channel.CONSOLE_CLEAR]: undefined
    [Channel.KIT_CLEAR]: undefined
    [Channel.KIT_PASTE]: undefined
    [Channel.HIDE_APP]: HideOptions
    [Channel.BLUR_APP]: undefined
    [Channel.NEEDS_RESTART]: undefined
    [Channel.TOGGLE_TRAY]: undefined
    [Channel.UPDATE_APP]: undefined
    [Channel.QUIT_APP]: undefined
    [Channel.PRO_STATUS]: undefined
    //

    [Channel.APP_CONFIG]: AppConfig
    [Channel.APP_DB]: AppDb
    [Channel.ADD_CHOICE]: Choice
    [Channel.CONSOLE_LOG]: string
    [Channel.CONSOLE_WARN]: string
    [Channel.CONSOLE_ERROR]: string
    [Channel.CONSOLE_INFO]: string
    [Channel.TERM_EXIT]: string
    [Channel.TERM_KILL]: string
    [Channel.SET_TRAY]: { label: string; scripts: string[] }
    [Channel.KIT_LOG]: string
    [Channel.KIT_WARN]: string
    [Channel.COPY_PATH_AS_PICTURE]: string
    [Channel.DEV_TOOLS]: any
    [Channel.EXIT]: number
    [Channel.NOTIFY]: {
      title: string
      message: string
      icon: string
    }
    [Channel.SHEBANG]: {
      shebang: string
      filePath: string
    }
    [Channel.SELECT_FILE]: string
    [Channel.SELECT_FOLDER]: string
    [Channel.REVEAL_FILE]: string
    [Channel.PLAY_AUDIO]: AudioOptions
    [Channel.STOP_AUDIO]: undefined
    [Channel.STOP_MIC]: undefined
    [Channel.SPEAK_TEXT]: any

    [Channel.REMOVE_CLIPBOARD_HISTORY_ITEM]: string
    [Channel.SEND_KEYSTROKE]: Partial<KeyData>
    [Channel.SET_CONFIG]: Partial<Config>
    [Channel.SET_DISABLE_SUBMIT]: boolean
    [Channel.SET_BOUNDS]: Partial<Rectangle>
    [Channel.SET_CHOICES]: {
      choices: Choice[]
      skipInitialSearch?: boolean
      inputRegex?: string
      generated?: boolean
    }
    [Channel.SET_FORM_DATA]: {
      [key: string]: string
    }
    [Channel.SET_UNFILTERED_CHOICES]: Choice[]
    [Channel.SET_CHOICES_CONFIG]: { preload: boolean }
    [Channel.SET_SCORED_CHOICES]: ScoredChoice[]
    [Channel.SET_SCORED_FLAGS]: ScoredChoice[]
    [Channel.SET_DARK]: boolean

    [Channel.SET_DESCRIPTION]: string
    [Channel.SET_EDITOR_CONFIG]: EditorConfig
    [Channel.SET_EDITOR_SUGGESTIONS]: string[]
    [Channel.APPEND_EDITOR_VALUE]: string
    [Channel.SET_ENTER]: string
    [Channel.SET_FIELDS]: Field[]
    [Channel.SET_FLAGS]: FlagsObject
    [Channel.SET_FLAG_VALUE]: any
    [Channel.SET_FORM_HTML]: { html: string; formData: any }
    [Channel.SET_FORM]: PromptConfig[]
    [Channel.SET_HINT]: string
    [Channel.SET_IGNORE_BLUR]: boolean
    [Channel.SET_KIT_STATE]: any
    [Channel.SET_INPUT]: string
    [Channel.APPEND_INPUT]: string
    [Channel.SCROLL_TO]: "top" | "bottom" | "center" | null
    [Channel.SET_FILTER_INPUT]: string
    [Channel.SET_FOCUSED]: string
    [Channel.SET_FOOTER]: string
    [Channel.SET_LOADING]: boolean
    [Channel.SET_PROGRESS]: number
    [Channel.SET_RUNNING]: boolean
    [Channel.SET_LOG]: string
    [Channel.SET_LOGO]: string
    [Channel.SET_NAME]: string
    [Channel.SET_OPEN]: boolean
    [Channel.SET_PANEL]: string
    [Channel.SET_PID]: number
    [Channel.SET_PLACEHOLDER]: string
    [Channel.SET_PREVIEW]: string
    [Channel.SET_PROMPT_BLURRED]: boolean
    [Channel.SET_PROMPT_DATA]: PromptData
    [Channel.SET_PROMPT_PROP]: any
    [Channel.SET_READY]: boolean
    [Channel.SET_RESIZE]: boolean
    [Channel.SET_PAUSE_RESIZE]: boolean
    [Channel.SET_RESIZING]: boolean
    [Channel.SET_SCRIPT]: Script
    [Channel.SET_SHORTCUTS]: Shortcut[]
    [Channel.DEBUG_SCRIPT]: Script
    [Channel.SET_SCRIPT_HISTORY]: Script[]
    [Channel.SET_SPLASH_BODY]: string
    [Channel.SET_SPLASH_HEADER]: string
    [Channel.SET_SPLASH_PROGRESS]: number
    [Channel.SET_STATUS]: KitStatus
    [Channel.SET_SELECTED_TEXT]: string
    [Channel.SET_SUBMIT_VALUE]: any
    [Channel.SET_TAB_INDEX]: number
    [Channel.SET_TEXTAREA_CONFIG]: TextareaConfig
    [Channel.SET_TEXTAREA_VALUE]: string
    [Channel.SET_THEME]: any
    [Channel.SET_TEMP_THEME]: any
    [Channel.SET_VALUE]: any
    [Channel.START]: string
    [Channel.SHOW]: { options: ShowOptions; html: string }
    [Channel.SHOW_LOG_WINDOW]: string
    [Channel.SHOW_IMAGE]: {
      options: ShowOptions
      image: string | { src: string }
    }
    [Channel.SWITCH_KENV]: string
    [Channel.TERMINAL]: string
    [Channel.TERM_WRITE]: string
    [Channel.TOAST]: {
      text: string
      options: any
    }
    [Channel.TOGGLE_BACKGROUND]: string
    [Channel.SET_SEARCH_DEBOUNCE]: boolean
    [Channel.VALUE_INVALID]: string
    [Channel.TERMINATE_PROCESS]: number

    [Channel.KEYBOARD_CONFIG]: { autoDelayMs: number }
    [Channel.KEYBOARD_TYPE]: string
    [Channel.KEYBOARD_PRESS_KEY]: Key[]
    [Channel.KEYBOARD_RELEASE_KEY]: Key[]

    [Channel.SCRIPT_CHANGED]: Script
    [Channel.SCRIPT_REMOVED]: Script
    [Channel.SCRIPT_ADDED]: Script

    [Channel.TRASH]: {
      input: Parameters<Trash>[0]
      options: Parameters<Trash>[1]
    }

    [Channel.COPY]: string
    [Channel.PASTE]: undefined

    [Channel.VERIFY_FULL_DISK_ACCESS]: undefined
    [Channel.SET_ALWAYS_ON_TOP]: boolean
    [Channel.SET_APPEARANCE]: Appearance
    [Channel.PRELOAD]: string
    [Channel.MIC_STREAM]: boolean
    [Channel.START_MIC]: MicConfig
    [Channel.SCREENSHOT]: {
      displayId?: Screenshot["displayId"]
      bounds?: Screenshot["bounds"]
    }
    [Channel.SYSTEM_CLICK]: boolean
    [Channel.SYSTEM_MOVE]: boolean
    [Channel.SYSTEM_KEYDOWN]: boolean
    [Channel.SYSTEM_KEYUP]: boolean
    [Channel.SYSTEM_MOUSEDOWN]: boolean
    [Channel.SYSTEM_MOUSEUP]: boolean
    [Channel.SYSTEM_MOUSEMOVE]: boolean
    [Channel.SYSTEM_WHEEL]: boolean
    [Channel.STAMP_SCRIPT]: Script
    [Channel.VITE_WIDGET_SEND]: any
  }
  export interface Send {
    (channel: Channel | GetAppData | SendNoOptions): void
    <C extends keyof ChannelMap, T extends ChannelMap[C]>(
      channel: C,
      data: T
    ): void
  }

  export interface SendData<C extends keyof ChannelMap> {
    pid: number
    kitScript: string
    channel: C
    value: ChannelMap[C]
  }

  export type GenericSendData = SendData<keyof ChannelMap>

  export type SetHint = (hint: string) => void

  export type SetName = (name: string) => void

  export type SetDescription = (description: string) => void

  export type SetInput = (input: string) => Promise<void>

  export type ScrollTo = (
    location: "top" | "bottom" | "center"
  ) => Promise<void>

  export type SetTextareaValue = (value: string) => void

  export type SetFocused = (id: string) => void

  export type SetResize = (resize: boolean) => void

  export type SetLoading = (loading: boolean) => void

  export type SetProgress = (progress: number) => void
  export type ShowDeprecated = (
    message: string
  ) => Promise<void>

  export type SetStatus = (status: KitStatus) => void

  export interface KitTheme {
    "--color-primary-light": string
    "--color-secondary-light": string
    "--color-primary": string
    "--color-secondary-dark": string
    "--color-background-light": string
    "--color-background-dark": string
    "--opacity-themelight": string
    "--opacity-themedark": string
    name: string
    foreground: string
    background: string
    accent: string
    ui: string
    opacity: string
  }

  export type SetTheme = (theme: string) => Promise<void>

  export type SetPlaceholder = (placeholder: string) => void

  export type SetEnter = (text: string) => void

  export type SetPanel = (
    html: string,
    containerClasses?: string
  ) => void

  export type SetFooter = (footer: string) => void

  export type SetPrompt = (
    config: Partial<PromptData>
  ) => void
  export type SetPreview = (
    html: string,
    containerClasses?: string
  ) => void
  export type SetBounds = (
    bounds: Partial<Rectangle>
  ) => void

  export type SendKeystroke = (
    keyData: Partial<KeyData>
  ) => void

  export type GetBounds = () => Promise<Rectangle>

  export type GetActiveScreen = () => Promise<Display>

  export type GetEditorHistory = () => Promise<
    {
      content: string
      timestamp: string
    }[]
  >

  export interface Submit {
    (value: any): Promise<void>
  }

  export type ShowOptions =
    BrowserWindowConstructorOptions & {
      ttl?: number
      draggable?: boolean
      center?: boolean
    }

  export interface ShowAppWindow {
    (content: string, options?: ShowOptions): Promise<void>
  }

  export interface ClipboardItem {
    id: string
    name: string
    description: string
    value: string
    type: string
    timestamp: string
    maybeSecret: boolean
    preview?: string
  }

  export interface System {
    onClick: typeof global.onClick
    onMousedown: typeof global.onMousedown
    onMouseup: typeof global.onMouseup
    onWheel: typeof global.onWheel
    onKeydown: typeof global.onKeydown
    onKeyup: typeof global.onKeyup
  }
  /**
   * A handler for a script event. Receives the full path to the script that was affected
   * @param script The script that was added, changed, or removed.
   */
  type ScriptHandler = (scriptPath: string) => void
  type ScriptEventHandler = (
    handler: ScriptHandler
  ) => removeListener

  export type App = {
    /**
     * A handler for a script event. Receives the full path to the script that was added.
     * @param scriptPath The full path to the script that was added
     */
    onScriptAdded?: ScriptEventHandler
    /**
     * A handler for a script event. Receives the full path to the script that was changed.
     * @param scriptPath The full path to the script that was changed
     */
    onScriptChanged?: ScriptEventHandler
    /**
     * A handler for a script event. Receives the full path to the script that was removed.
     * @param scriptPath The full path to the script that was removed
     */
    onScriptRemoved?: ScriptEventHandler
  }

  export interface Keyboard {
    type: (...text: (string | Key)[]) => Promise<void>
    /**
     * Types text or keys with a delay between each keystroke.
     * @param config Configuration object for typing.
     * @param config.rate The delay in milliseconds between keystrokes. Note: values less than 700 can give weird results.
     * @param config.textOrKeys The text or keys to type.
     */
    typeDelayed: (config: {
      rate?: number
      textOrKeys: string | Key[]
    }) => Promise<void>
    /**
     * Presses a key.
     * @param keys The keys to press.
     */
    pressKey: (...keys: Key[]) => Promise<void>
    /**
     * Releases a key.
     * @param keys The keys to release.
     */
    releaseKey: (...keys: Key[]) => Promise<void>
    /**
     * Taps a key.
     * @param keys The keys to tap.
     */
    tap: (...keys: Key[]) => Promise<void>
    /**
     * @deprecated Use `keyboard.typeDelayed` or set `KIT_TYPING_RATE` and use `keyboard.type` instead.
     */
    config: (config: {
      autoDelayMs: number
    }) => Promise<void>
  }

  export interface Mouse {
    leftClick: () => Promise<void>
    rightClick: () => Promise<void>
    move: (
      points: [{ x: number; y: number }]
    ) => Promise<void>
    setPosition: (position: {
      x: number
      y: number
    }) => Promise<void>
  }

  export interface Bookmark {
    title: string
    url: string
  }

  export interface KitClipboard {
    readText: () => Promise<string>
    readHTML: () => Promise<string>
    readImage: () => Promise<Buffer>
    readRTF: () => Promise<string>
    readBookmark: () => Promise<Bookmark>
    readFindText: () => Promise<string>

    writeText: (text: string) => Promise<void>
    writeHTML: (html: string) => Promise<void>
    writeImage: (image: Buffer) => Promise<void>
    writeRTF: (rtf: string) => Promise<void>
    writeBookmark: (bookmark: Bookmark) => Promise<void>
    writeFindText: (text: string) => Promise<void>

    /**
     * Write a buffer to the clipboard for a custom type (e.g., file URLs, Finder file references).
     * @param type The clipboard type (e.g., 'public.file-url', 'NSFilenamesPboardType').
     * @param buffer The buffer to write.
     * #### Example
     * ```ts
     * await clipboard.writeBuffer('public.file-url', Buffer.from(`file://${encodeURI(filePath)}`, 'utf8'))
     * ```
     */
    writeBuffer: (type: string, buffer: Buffer) => Promise<void>

    clear: () => Promise<void>
  }

  export type RegisterShortcut = (
    shortcut: string,
    callback: () => void
  ) => Promise<void>

  export type UnregisterShortcut = (
    shortcut: string
  ) => Promise<void>

  export type GuideSection = {
    name: string
    raw: string
    group: string
    comments: {
      [key: string]: string
    }
  }
  export type Docs<T = any> = (
    markdownPath: string,
    options?:
      | Partial<PromptConfig>
      | ((
        sections?: GuideSection[],
        tokens?: marked.Token[]
      ) => Promise<Partial<PromptConfig>>)
  ) => Promise<T>

  export type ExecLog = (
    command: string,
    logger?: typeof console.log
  ) => ChildProcess

  export interface AppApi {
    textarea: TextArea
    drop: Drop
    editor: Editor
    template: Template
    form: Form
    fields: Fields
    emoji: Emoji
    div: Div
    hotkey: Hotkey
    prompt: Prompt

    kitPrompt: (promptConfig: PromptConfig) => Promise<any>
    send: Send
    setFocused: SetFocused
    setPlaceholder: SetPlaceholder
    setEnter: SetEnter
    setDiv: SetPanel
    setPanel: SetPanel
    setFooter: SetFooter
    setPreview: SetPreview
    setPrompt: SetPrompt
    setBounds: SetBounds
    getBounds: GetBounds
    getActiveScreen: GetActiveScreen
    setHint: SetHint
    setName: SetName
    setDescription: SetDescription
    setInput: SetInput
    setFilterInput: SetInput
    showDeprecated: ShowDeprecated
    setTextareaValue: SetTextareaValue

    setIgnoreBlur: SetIgnoreBlur
    setResize: SetResize
    setLoading: SetLoading
    setProgress: SetProgress
    setStatus: SetStatus
    setTheme: SetTheme
    setScriptTheme: SetTheme

    showImage: ShowAppWindow

    currentOnTab: any
    addChoice: AddChoice
    setChoices: SetChoices
    clearTabs: () => void
    getDataFromApp: (channel: Channel) => Promise<any>
    sendWait: (channel: Channel, value: any) => Promise<any>
    sendWaitLong: (
      channel: Channel,
      value: any
    ) => Promise<any>
    getBackgroundTasks: () => Promise<{
      channel: string
      tasks: Background[]
    }>
    getSchedule: () => Promise<{
      channel: string
      schedule: Schedule[]
    }>
    getScriptsState: () => Promise<{
      channel: string
      tasks: Background[]
      schedule: Schedule[]
    }>

    memoryMap: Map<string, any>

    show: () => Promise<void>
    hide: (hideOptions?: HideOptions) => Promise<void>
    blur: () => Promise<void>

    dev: (object: any) => Promise<void>
    getClipboardHistory: () => Promise<ClipboardItem[]>
    getEditorHistory: GetEditorHistory
    removeClipboardItem: (id: string) => void
    setTab: (tabName: string) => void
    submit: Submit
    mainScript: (
      input?: string,
      tab?: string
    ) => Promise<void>

    appKeystroke: SendKeystroke
    Key: typeof core.Key

    log: typeof console.log
    warn: typeof console.warn

    keyboard: Keyboard
    clipboard: KitClipboard
    execLog: ExecLog

    focus: () => Promise<void>
    setAlwaysOnTop: (alwaysOnTop: boolean) => Promise<void>
    docs: Docs
    getAppState: any

    registerShortcut: RegisterShortcut
    unregisterShortcut: UnregisterShortcut
  }

  export interface Background {
    filePath: string
    process: {
      spawnargs: string[]
      pid: number
      start: string
    }
  }

  export interface Schedule extends Choice {
    date: Date
  }

  export interface HideOptions {
    preloadScript?: string
  }
  declare global {
    var textarea: TextArea
    var drop: Drop
    var div: Div
    var form: Form
    var fields: Fields
    var emoji: Emoji
    var editor: Editor
    var template: Template

    var hotkey: Hotkey
    var send: Send
    var sendWait: (
      channel: Channel,
      value?: any,
      timeout?: number
    ) => Promise<any>
    var sendWaitLong: (
      channel: Channel,
      value?: any,
      timeout?: number
    ) => Promise<any>

    var setFocused: SetFocused
    var setEnter: SetEnter
    var setPlaceholder: SetPlaceholder
    var setPanel: SetPanel
    var setFooter: SetFooter
    var addChoice: AddChoice
    var appendChoices: AppendChoices
    var setChoices: SetChoices
    var setFormData: SetFormData
    var clearTabs: () => void
    var setDiv: SetPanel
    var setPreview: SetPreview
    var setPrompt: SetPrompt
    var setBounds: SetBounds
    var getBounds: GetBounds
    var getActiveScreen: GetActiveScreen
    var setHint: SetHint
    var setName: SetName
    var setDescription: SetDescription
    var setInput: SetInput
    var appendInput: SetInput
    var scrollTo: ScrollTo
    var setFilterInput: SetInput
    var setTextareaValue: SetTextareaValue
    var setIgnoreBlur: SetIgnoreBlur
    var setResize: SetResize
    var setPauseResize: SetResize
    var setLoading: SetLoading
    var setProgress: SetProgress
    var setRunning: SetLoading
    var setStatus: SetStatus
    var setTheme: SetTheme
    var setScriptTheme: SetTheme

    var showImage: ShowAppWindow

    var show: () => Promise<void>
    var hide: (hideOptions?: HideOptions) => Promise<void>
    var blur: () => Promise<void>

    var dev: (object?: any) => Promise<void>
    var getClipboardHistory: () => Promise<ClipboardItem[]>
    var clearClipboardHistory: () => Promise<void>
    var getEditorHistory: GetEditorHistory
    var removeClipboardItem: (id: string) => Promise<void>
    var setTab: (tabName: string) => void
    var submit: Submit
    var mainScript: (
      input?: string,
      tab?: string
    ) => Promise<void>

    var appKeystroke: SendKeystroke
    var Key: typeof core.Key

    var log: typeof console.log
    var warn: typeof console.warn

    var keyboard: Keyboard
    var mouse: Mouse
    var clipboard: KitClipboard

    var execLog: ExecLog

    var focus: () => Promise<void>
    var setAlwaysOnTop: (
      alwaysOnTop: boolean
    ) => Promise<void>

    var docs: Docs
    var getAppState: any

    var registerShortcut: RegisterShortcut
    var unregisterShortcut: UnregisterShortcut
    var startDrag: (
      filePath: string,
      iconPath?: string
    ) => void
    var eyeDropper: () => Promise<{
      sRGBHex: string
    }>
    var chat: Chat
    var toast: Toast
    var find: Find
    var mic: Mic
    /**
     * Captures a screenshot. Defaults to the display where the current mouse cursor is located and captures the full screen if no bounds are specified.
     * @param displayId - The identifier for the display to capture. If not provided, captures the display with the current mouse cursor.
     * @param bounds - The specific area of the screen to capture. If not provided, captures the entire screen.
     * @returns A Promise that resolves to a Buffer containing the screenshot data.
     */
    var screenshot: Screenshot
    var webcam: WebCam
    var prompt: Prompt
    var getMediaDevices: GetMediaDevices
    var getTypedText: GetTypedText
    var PROMPT: typeof PROMPT_OBJECT
    var preventSubmit: Symbol

    type removeListener = () => void
    /**
     * Registers a global system onClick event listener.
     * @param callback - The callback to call when the event is fired.
     * @returns A function to disable the listener.
     */
    var onClick: (
      callback: (event: UiohookMouseEvent) => void
    ) => removeListener

    /**
     * Registers a global system onMousedown event listener.
     * @param callback - The callback to call when the event is fired.
     * @returns A function to disable the listener.
     */
    var onMousedown: (
      callback: (event: UiohookMouseEvent) => void
    ) => removeListener
    /**
     * Registers a global system onMouseup event listener.
     * @param callback - The callback to call when the event is fired.
     * @returns A function to disable the listener.
     */
    var onMouseup: (
      callback: (event: UiohookMouseEvent) => void
    ) => removeListener
    /**
     * Registers a global system onWheel event listener.
     * @param callback - The callback to call when the event is fired.
     * @returns A function to disable the listener.
     */
    var onWheel: (
      callback: (event: UiohookWheelEvent) => void
    ) => removeListener
    /**
     * Registers a global system onKeydown event listener.
     * @param callback - The callback to call when the event is fired.
     * @returns A function to disable the listener.
     */
    var onKeydown: (
      callback: (event: UiohookKeyboardEvent) => void
    ) => removeListener
    /**
     * Registers a global system onKeyup event listener.
     * @param callback - The callback to call when the event is fired.
     * @returns A function to disable the listener.
     */
    var onKeyup: (
      callback: (event: UiohookKeyboardEvent) => void
    ) => removeListener

    var system: System
    var app: App

    var getTheme: () => Promise<KitTheme>

    var notify: Notify
  }
  export interface NotificationAction {
    // Docs: https://electronjs.org/docs/api/structures/notification-action

    /**
     * The label for the given action.
     */
    text?: string
    /**
     * The type of action, can be `button`.
     */
    type: "button"
  }

  export interface NotificationConstructorOptions {
    /**
     * A title for the notification, which will be displayed at the top of the
     * notification window when it is shown.
     */
    title?: string
    /**
     * A subtitle for the notification, which will be displayed below the title.
     *
     * @platform darwin
     */
    subtitle?: string
    /**
     * The body text of the notification, which will be displayed below the title or
     * subtitle.
     */
    body?: string
    /**
     * Whether or not to suppress the OS notification noise when showing the
     * notification.
     */
    silent?: boolean
    /**
     * An icon to use in the notification.
     */
    icon?: string
    /**
     * Whether or not to add an inline reply option to the notification.
     *
     * @platform darwin
     */
    hasReply?: boolean
    /**
     * The timeout duration of the notification. Can be 'default' or 'never'.
     *
     * @platform linux,win32
     */
    timeoutType?: "default" | "never"
    /**
     * The placeholder to write in the inline reply input field.
     *
     * @platform darwin
     */
    replyPlaceholder?: string
    /**
     * The name of the sound file to play when the notification is shown.
     *
     * @platform darwin
     */
    sound?: string
    /**
     * The urgency level of the notification. Can be 'normal', 'critical', or 'low'.
     *
     * @platform linux
     */
    urgency?: "normal" | "critical" | "low"
    /**
     * Actions to add to the notification. Please read the available actions and
     * limitations in the `NotificationAction` documentation.
     *
     * @platform darwin
     */
    actions?: NotificationAction[]
    /**
     * A custom title for the close button of an alert. An empty string will cause the
     * default localized text to be used.
     *
     * @platform darwin
     */
    closeButtonText?: string
    /**
     * A custom description of the Notification on Windows superseding all properties
     * above. Provides full customization of design and behavior of the notification.
     *
     * @platform win32
     */
    toastXml?: string
  }

  import * as shelljs from "shelljs/index"

  export type Trash = (
    input: string | readonly string[],
    option?: {
      glob?: boolean
    }
  ) => Promise<void>

  export type Git = {
    clone: (
      repo: string,
      dir: string,
      options?: Partial<Parameters<typeof clone>[0]>
    ) => ReturnType<typeof clone>
    pull: (
      dir: string,
      options?: Partial<Parameters<typeof pull>[0]>
    ) => ReturnType<typeof pull>
    push: (
      dir: string,
      options?: Partial<Parameters<typeof push>[0]>
    ) => ReturnType<typeof push>
    add: (
      dir: string,
      glob: string,
      options?: Partial<Parameters<typeof add>[0]>
    ) => ReturnType<typeof add>
    commit: (
      dir: string,
      message: string,
      options?: Partial<Parameters<typeof commit>[0]>
    ) => ReturnType<typeof commit>
    init: (
      dir: string,
      options?: Partial<Parameters<typeof init>[0]>
    ) => ReturnType<typeof init>
    addRemote: (
      dir: string,
      remote: string,
      url: string,
      options?: Partial<Parameters<typeof addRemote>[0]>
    ) => ReturnType<typeof addRemote>
  }
  export type Open = typeof import("open/index").default
  export type OpenApp = typeof import("open/index").openApp

  export interface OnTab {
    (name: string, fn: () => void): void
  }

  type Zx = typeof import("zx/build/index")

  export interface PackagesApi {
    cd: Zx["cd"]
    cp: typeof shelljs.cp
    chmod: typeof shelljs.chmod
    echo: typeof shelljs.echo
    exit: typeof shelljs.exit
    grep: typeof shelljs.grep
    ln: typeof shelljs.ln
    ls: typeof shelljs.ls
    mkdir: typeof shelljs.mkdir
    mv: typeof shelljs.mv
    sed: typeof shelljs.sed
    tempdir: typeof shelljs.tempdir
    test: typeof shelljs.test
    which: typeof shelljs.which
    paste: () => Promise<string>
    copy: (text: string) => Promise<void>
    trash: Trash
    open: Open
    rm: Trash

    $: Zx["$"]
  }

  export interface DegitOptions {
    force?: boolean
  }

  export interface IDegit {
    repo: string
    subdirectory: string | undefined
    ref: string | undefined
    options: DegitOptions

    clone(dest: string): Promise<void>
  }
  type Degit = (
    repo: string,
    options?: DegitOptions
  ) => IDegit

  declare global {
    var cd: Zx["cd"]
    var cp: typeof shelljs.cp
    var chmod: typeof shelljs.chmod
    var echo: typeof shelljs.echo
    var exit: typeof shelljs.exit
    var grep: typeof shelljs.grep
    var ln: typeof shelljs.ln
    var ls: typeof shelljs.ls
    var mkdir: typeof shelljs.mkdir
    var mv: typeof shelljs.mv
    var pwd: typeof shelljs.pwd
    var sed: typeof shelljs.sed
    var tempdir: typeof shelljs.tempdir
    var test: typeof shelljs.test
    var which: typeof shelljs.which

    var paste: () => Promise<string>
    var copy: (text: string) => Promise<void>

    var trash: Trash
    var open: Open
    var openApp: OpenApp
    var rm: Trash
    var git: Git
    var degit: Degit

    var memoryMap: Map<string, any>

    var onTabIndex: number
  }
  import type { ProcessInfo } from "./core"
  import type { Display, Point } from "./electron"
  import type {
    BrowserContextOptions,
    Page,
    PageScreenshotOptions,
  } from "playwright"

  type PlayAudioFile = (
    path: string,
    options?: any
  ) => Promise<string>

  type StopAudioFile = () => Promise<void>

  type CopyPathAsImage = (path: string) => Promise<string>

  interface FileSearchOptions {
    onlyin?: string
    kind?: string
    kMDItemContentType?: string
  }
  type FileSearch = (
    name: string,
    fileSearchOptions?: FileSearchOptions
  ) => Promise<string[]>

  type Browser =
    | "Google Chrome"
    | "Brave"
    | "Firefox"
    | "Edge"

  type GetActiveTab = (browser?: Browser) => Promise<string>
  type GetTabs = (
    browser?: Browser
  ) => Promise<{ url: string; title: string }[]>

  type FocusTab = (
    url: string,
    browser?: Browser
  ) => Promise<string>

  interface ScrapeOptions {
    headless?: boolean
    timeout?: number
    /**
     * Playwright browser context options.
     *
     * {@link https://playwright.dev/docs/api/class-browser#browser-new-context}
     */
    browserOptions?: BrowserContextOptions
  }

  type ScrapeSelector<T = any> = (
    url: string,
    selector: string,
    /**
     * Transformation to apply to each DOM node that was selected.
     * By default, `element.innerText` is returned.
     */
    transform?: (element: any) => T,
    options?: ScrapeOptions
  ) => Promise<T[]>

  type ScrapeAttribute = (
    url: string,
    selector: string,
    attribute: string,
    options?: ScrapeOptions
  ) => Promise<string | null>
  interface ScreenshotFromWebpageOptions {
    timeout?: number
    /**
     * Playwright browser context options.
     *
     * {@link https://playwright.dev/docs/api/class-browser#browser-new-context}
     */
    browserOptions?: BrowserContextOptions
    /**
     * Playwright page screenshot options.
     *
     * {@link https://playwright.dev/docs/api/class-page#page-screenshot}
     */
    screenshotOptions?: PageScreenshotOptions
  }

  type GetScreenshotFromWebpage = (
    url: string,
    options?: ScreenshotFromWebpageOptions
  ) => Promise<Buffer>

  interface WebpageAsPdfOptions {
    timeout?: number
    /**
     * Playwright browser context options.
     *
     * {@link https://playwright.dev/docs/api/class-browser#browser-new-context}
     */
    browserOptions?: BrowserContextOptions
    /**
     * Playwright page pdf options.
     *
     * {@link https://playwright.dev/docs/api/class-page#page-pdf}
     */
    pdfOptions?: Parameters<Page["pdf"]>[0]
    /**
     * Playwright page emulate media options.
     *
     * {@link https://playwright.dev/docs/api/class-page#page-emulate-media}
     */
    mediaOptions?: Parameters<Page["emulateMedia"]>[0]
  }

  type GetWebpageAsPdf = (
    url: string,
    options?: WebpageAsPdfOptions
  ) => Promise<Buffer>

  interface Window {
    process: string
    title: string
    index: number
  }
  type GetWindows = () => Promise<Window[]>

  type FocusWindow = (
    process: string,
    title: string
  ) => Promise<string>

  interface WindowBounds {
    process: string
    name: string
    position: { x: number; y: number }
    size: { width: number; height: number }
    fullscreen: boolean
  }
  type GetWindowsBounds = () => Promise<WindowBounds[]>
  type GetWindowPosition = (
    process: string,
    title: string,
    x: number,
    y: number
  ) => Promise<string>

  type SetWindowPosition = (
    process: string,
    title: string,
    x: number,
    y: number
  ) => Promise<string>
  type SetWindowSizeByIndex = (
    process: string,
    index: number,
    x: number,
    y: number
  ) => Promise<string>
  type SetWindowBoundsByIndex = (
    process: string,
    index: number,
    x: number,
    y: number,
    width: number,
    height: number
  ) => Promise<string>

  type ScatterWindows = () => Promise<string>

  type OrganizeWindows = () => Promise<void>

  type SetWindowPositionByIndex = (
    process: string,
    index: number,
    x: number,
    y: number
  ) => Promise<string>

  type SetWindowSize = (
    process: string,
    title: string,
    x: number,
    y: number
  ) => Promise<string>

  interface Screen {
    name: string
    x: number
    y: number
    width: number
    height: number
  }
  type GetScreens = () => Promise<Display[]>
  type SelectDisplay = (
    includeThumbnails?: boolean
  ) => Promise<Display>

  type TileWindow = (
    app: string,
    leftOrRight: "left" | "right"
  ) => Promise<string>

  type GetActiveScreen = () => Promise<Display>

  type GetMousePosition = () => Promise<Point>

  type GetProcesses = () => Promise<ProcessInfo[]>

  interface Rectangle {
    x: number
    y: number
    width: number
    height: number
  }

  export interface Prompt {
    id: string
    pid: number
    birthTime: number
    isFocused: boolean
    isVisible: boolean
    isDestroyed: boolean
    bounds: Rectangle
    focus: () => Promise<void>
  }

  type GetPrompts = () => Promise<Prompt[]>
  interface KitWindow {
    name: string
    id: string
    value: string
    bounds: Rectangle
    isFocused: boolean
    isVisible: boolean
    isDestroyed: boolean
  }

  type GetKitWindows = () => Promise<KitWindow[]>

  type FocusAppWindow = (id: string) => Promise<void>

  interface Bounds {
    left: number
    top: number
    right: number
    bottom: number
  }
  type SetActiveAppBounds = (
    bounds: Bounds
  ) => Promise<void>
  type SetActiveAppPosition = (position: {
    x: number
    y: number
  }) => Promise<void>
  type SetActiveAppSize = (size: {
    width: number
    height: number
  }) => Promise<void>

  type GetActiveAppInfo = () => Promise<{
    localizedName: string
    bundleIdentifier: string
    bundleURLPath: string
    executableURLPath: string
    isFinishedLaunching: boolean
    processIdentifier: number
    windowTitle: string
    windowIndex: number
    windowID: number
    x: number
    y: number
    width: number
    height: number
  }>
  type GetActiveAppBounds = () => Promise<Bounds>

  type GetSelectedFile = () => Promise<string>

  type SetSelectedFile = (filePath: string) => Promise<void>

  type GetSelectedDir = () => Promise<string>
  type SelectFile = (message?: string) => Promise<string>

  type RevealFile = (filePath: string) => Promise<string>
  type RevealInFinder = (filePath?: string) => Promise<void>
  type SelectFolder = (message?: string) => Promise<string>

  type GetSelectedText = () => Promise<string>

  type CutText = () => Promise<string>

  type Lock = () => Promise<unknown>

  type Logout = () => Promise<unknown>
  type Sleep = () => Promise<unknown>
  type Shutdown = () => Promise<unknown>

  type QuitAllApps = (
    appsToExclude?: string
  ) => Promise<unknown>

  type Say = (
    text: string,
    options?: any
  ) => Promise<string>

  type Beep = () => Promise<void>

  type SetSelectedText = (
    text: string,
    hide?: boolean
  ) => Promise<void>

  type KeyStroke = (keyString: string) => Promise<string>

  type AppleScript = (
    script: string,
    options?: any
  ) => Promise<string>

  export interface PlatformApi {
    applescript: AppleScript
    copyPathAsImage: CopyPathAsImage
    fileSearch: FileSearch
    focusTab: FocusTab
    focusWindow: FocusWindow
    getActiveTab: GetActiveTab
    getActiveScreen: GetActiveScreen
    getActiveAppInfo: GetActiveAppInfo
    getActiveAppBounds: GetActiveAppBounds
    getMousePosition: GetMousePosition
    getScreens: GetScreens
    selectDisplay: SelectDisplay
    getSelectedFile: GetSelectedFile
    setSelectedFile: SetSelectedFile
    getSelectedDir: GetSelectedDir
    revealInFinder: RevealInFinder
    selectFile: SelectFile
    selectFolder: SelectFolder
    revealFile: RevealFile
    getSelectedText: GetSelectedText
    cutText: CutText
    getTabs: GetTabs
    getWindows: GetWindows
    getWindowsBounds: GetWindowsBounds
    keystroke: KeyStroke
    lock: Lock
    openLog: () => void
    organizeWindows: OrganizeWindows
    playAudioFile: PlayAudioFile
    stopAudioFile: StopAudioFile
    quitAllApps: QuitAllApps
    say: Say
    beep: Beep
    scatterWindows: ScatterWindows
    scrapeAttribute: ScrapeAttribute
    scrapeSelector: ScrapeSelector
    getScreenshotFromWebpage: GetScreenshotFromWebpage
    getWebpageAsPdf: GetWebpageAsPdf
    setActiveAppBounds: SetActiveAppBounds
    setActiveAppPosition: SetActiveAppPosition
    setActiveAppSize: SetActiveAppSize
    setSelectedText: SetSelectedText
    setWindowBoundsByIndex: SetWindowBoundsByIndex
    setWindowPosition: SetWindowPosition
    setWindowPositionByIndex: SetWindowPositionByIndex
    setWindowSize: SetWindowSize
    setWindowSizeByIndex: SetWindowSizeByIndex
    shutdown: Shutdown
    sleep: Sleep
    tileWindow: TileWindow
  }

  declare global {
    var applescript: AppleScript
    var beep: Beep
    var copyPathAsImage: CopyPathAsImage
    var fileSearch: FileSearch
    var focusTab: FocusTab
    var focusWindow: FocusWindow
    var getActiveAppInfo: GetActiveAppInfo
    var getActiveAppBounds: GetActiveAppBounds
    var getActiveScreen: GetActiveScreen
    var getActiveTab: GetActiveTab
    var getMousePosition: GetMousePosition
    var getProcesses: GetProcesses
    var getPrompts: GetPrompts
    var getKitWindows: GetKitWindows
    var focusKitWindow: FocusAppWindow
    var getScreens: GetScreens
    var selectDisplay: SelectDisplay
    var getSelectedFile: GetSelectedFile
    var revealInFinder: RevealInFinder
    var selectFile: SelectFile
    var selectFolder: SelectFolder
    var revealFile: RevealFile
    var getSelectedText: GetSelectedText
    var cutText: CutText
    var getTabs: GetTabs
    var getWindows: GetWindows
    var getWindowsBounds: GetWindowsBounds
    var getSelectedDir: GetSelectedDir
    var keystroke: KeyStroke
    var logout: Logout
    var lock: Lock
    var openLog: () => void
    var organizeWindows: OrganizeWindows
    var playAudioFile: PlayAudioFile
    var stopAudioFile: StopAudioFile
    var quitAllApps: QuitAllApps
    var say: Say
    var scatterWindows: ScatterWindows
    var scrapeAttribute: ScrapeAttribute
    var scrapeSelector: ScrapeSelector
    var getScreenshotFromWebpage: GetScreenshotFromWebpage
    var getWebpageAsPdf: GetWebpageAsPdf
    var setActiveAppBounds: SetActiveAppBounds
    var setActiveAppPosition: SetActiveAppPosition
    var setActiveAppSize: SetActiveAppSize
    var setSelectedText: SetSelectedText
    var setSelectedFile: SetSelectedFile
    var setWindowBoundsByIndex: SetWindowBoundsByIndex
    var setWindowPosition: SetWindowPosition
    var setWindowPositionByIndex: SetWindowPositionByIndex
    var setWindowSize: SetWindowSize
    var setWindowSizeByIndex: SetWindowSizeByIndex
    var shutdown: Shutdown
    var sleep: Sleep
    var tileWindow: TileWindow
  }
  import type { ForkOptions } from "node:child_process"
  import type { Channel } from "../core/enum"
  import type { PromptConfig } from "./core"
  import type {
    BrowserWindowConstructorOptions,
    Display,
    Rectangle,
  } from "./electron"

  export type BaseWidgetOptions =
    BrowserWindowConstructorOptions & {
      /**
       * Important: This property determines whether the widget can be dragged.
       * To enable dragging, ensure that the "draggable" class is added to any element
       * intended for dragging the widget. This is essential for user interaction.
       */
      draggable?: boolean
      title?: string
      ignoreMouse?: boolean
      ttl?: number
      center?: boolean
      preventEscape?: boolea
      css?: string
      body?: string
    }

  export type WidgetOptions = BaseWidgetOptions & {
    state?: any
    unpkg?: string[]
    containerClass?: string
  }

  export type ViteOptions = BaseWidgetOptions & {
    mode?: "development" | "production" | string
    port?: number
  }

  export interface WidgetMessage {
    channel: Channel
    pid: number
    targetId: string
    widgetId: number
    value?: any
    x: number
    y: number
    width?: number
    height?: number
    dataset?: {
      [key: string]: any
    }
  }

  export interface ViteMessage extends WidgetMessage {
    widgetChannel: string
    widgetData?: any
  }

  export type WidgetHandler = (data: WidgetMessage) => void
  export type ViteHandler = (data: ViteMessage) => void

  export interface BaseWidgetApi {
    show: () => void
    showInactive: () => void
    hide: () => void
    focus: () => void
    blur: () => void
    minimize: () => void
    maximize: () => void
    restore: () => void
    setAlwaysOnTop: (flag: boolean) => void
    close: () => void
    setSize: (width: number, height: number) => void
    setPosition: (x: number, y: number) => void
    call: (name: string, ...args: any[]) => void
    executeJavaScript: (js: string) => Promise<any>
    capturePage: () => Promise<string>
    onClose: (handler: WidgetHandler) => void
  }

  export interface WidgetAPI extends BaseWidgetApi {
    setState: (state: any) => void
    fit: () => void
    onCustom: (handler: WidgetHandler) => void
    onClick: (handler: WidgetHandler) => void
    onDrop: (handler: WidgetHandler) => void
    onMouseDown: (handler: WidgetHandler) => void
    onInput: (handler: WidgetHandler) => void
    onResized: (handler: WidgetHandler) => void
    onMoved: (handler: WidgetHandler) => void
    onInit: (handler: WidgetHandler) => void
  }

  type ViteWidgetSendMessage = {
    channel: string
    pid: number
    targetId: string
    widgetId: number
    [key: string]: any
  }
  export interface ViteAPI extends BaseWidgetApi {
    /**
     * Registers an event handler for a specific channel.
     * @param event The channel name to listen for.
     * @param handler The function to be called when an event on this channel is received.
     * @returns A function that, when called, will remove the event handler.
     *
     * Example usage:
     * ```typescript
     * const removeHandler = v.on('myChannel', (data) => {
     *   console.log('Received data:', data);
     * });
     *
     * // Later, when you want to stop listening:
     * removeHandler();
     * ```
     */
    on: (event: string, handler: ViteHandler) => () => void
    send: (channel: string, data: any) => void
  }

  export type Widget = (
    html: string,
    options?: WidgetOptions
  ) => Promise<WidgetAPI>

  export type ViteWidget = (
    dir: string,
    options?: ViteOptions
  ) => Promise<ViteAPI>

  export type Menubar = (
    text: string,
    scripts?: string[]
  ) => Promise<void>

  export interface TerminalOptions extends PromptConfig {
    command?: string
    cwd?: string
    shell?: string | boolean
    args?: string[]
    env?: {
      [key: string]: string
    }
    closeOnExit?: boolean
    cleanPath?: boolean
  }

  export type Terminal = {
    (command?: string, actions?: Action[]): Promise<string>
    (
      options?: TerminalOptions,
      actions?: Action[]
    ): Promise<string>
  } & {
    write?: (text: string) => Promise<void>
  }

  export interface ProAPI {
    widget: Widget
    menubar: Menubar
    term: Terminal
  }

  export type ShowLogWindow = (
    scriptPath?: string
  ) => Promise<void>

  declare global {
    var widget: Widget
    var vite: ViteWidget
    var menu: Menubar
    var term: Terminal
    var showLogWindow: ShowLogWindow
  }
  export type Md = (markdown: string, containerClasses?: string) => string

  type ReadFileOptions = Parameters<typeof readFile>[1]
  export type EnsureReadFile = (
    path: string,
    defaultContent?: string,
    options?: ReadFileOptions) => Promise<string>

  export type EnsureReadJson =
    <T>(
      path: string,
      defaultContent: T,
      options?: Parameters<typeof readJson>[1]) => Promise<T>

  export interface GlobalsApi {
    cwd: typeof process.cwd
    pid: typeof process.pid
    stderr: typeof process.stderr
    stdin: typeof process.stdin
    stdout: typeof process.stdout
    uptime: typeof process.uptime
    get: import("./axios").AxiosInstance["get"]
    put: import("./axios").AxiosInstance["put"]
    post: import("./axios").AxiosInstance["post"]
    patch: import("./axios").AxiosInstance["patch"]
    chalk: typeof import("chalk-template").default
    spawn: typeof import("child_process").spawn
    spawnSync: typeof import("child_process").spawnSync
    fork: typeof import("child_process").fork
    exec: typeof import("./execa").execaCommand
    execa: typeof import("./execa").execa
    execaSync: typeof import("./execa").execaSync
    execaCommand: typeof import("./execa").execaCommand
    execaCommandSync: typeof import("./execa").execaCommandSync
    execaNode: typeof import("./execa").execaNode

    download: typeof import("./download")

    emptyDir: typeof import("./fs-extra").emptyDir
    emptyDirSync: typeof import("./fs-extra").emptyDirSync
    ensureFile: typeof import("./fs-extra").ensureFile
    ensureFileSync: typeof import("./fs-extra").ensureFileSync
    ensureDir: typeof import("./fs-extra").ensureDir
    ensureDirSync: typeof import("./fs-extra").ensureDirSync
    ensureLink: typeof import("./fs-extra").ensureLink
    ensureLinkSync: typeof import("./fs-extra").ensureLinkSync
    ensureSymlink: typeof import("./fs-extra").ensureSymlink
    ensureSymlinkSync: typeof import("./fs-extra").ensureSymlinkSync
    mkdirp: typeof import("./fs-extra").mkdirp
    mkdirpSync: typeof import("./fs-extra").mkdirpSync
    mkdirs: typeof import("./fs-extra").mkdirs
    outputFile: typeof import("./fs-extra").outputFile
    outputFileSync: typeof import("./fs-extra").outputFileSync
    outputJson: typeof import("./fs-extra").outputJson
    outputJsonSync: typeof import("./fs-extra").outputJsonSync
    pathExists: typeof import("./fs-extra").pathExists
    pathExistsSync: typeof import("./fs-extra").pathExistsSync
    readJson: typeof import("./fs-extra").readJson
    readJsonSync: typeof import("./fs-extra").readJsonSync
    remove: typeof import("./fs-extra").remove
    removeSync: typeof import("./fs-extra").removeSync
    writeJson: typeof import("./fs-extra").writeJson
    writeJsonSync: typeof import("./fs-extra").writeJsonSync
    move: typeof import("./fs-extra").move
    moveSync: typeof import("./fs-extra").moveSync
    readFile: typeof import("node:fs/promises").readFile
    readFileSync: typeof import("node:fs").readFileSync
    writeFile: typeof import("node:fs/promises").writeFile
    writeFileSync: typeof import("node:fs").writeFileSync
    appendFile: typeof import("node:fs/promises").appendFile
    appendFileSync: typeof import("node:fs").appendFileSync
    readdir: typeof import("node:fs/promises").readdir
    readdirSync: typeof import("node:fs").readdirSync
    copyFile: typeof import("node:fs/promises").copyFile
    copyFileSync: typeof import("node:fs").copyFileSync

    stat: typeof import("node:fs/promises").stat
    lstat: typeof import("node:fs/promises").lstat

    rmdir: typeof import("node:fs/promises").rmdir
    unlink: typeof import("node:fs/promises").unlink
    symlink: typeof import("node:fs/promises").symlink
    readlink: typeof import("node:fs/promises").readlink
    realpath: typeof import("node:fs/promises").realpath
    access: typeof import("node:fs/promises").access
    rename: typeof import("node:fs/promises").rename

    chown: typeof import("node:fs/promises").chown
    lchown: typeof import("node:fs/promises").lchown
    utimes: typeof import("node:fs/promises").utimes
    lutimes: typeof import("node:fs/promises").lutimes

    createReadStream: typeof import("node:fs").createReadStream
    createWriteStream: typeof import("node:fs").createWriteStream
    Writable: typeof import("stream").Writable
    Readable: typeof import("stream").Readable
    Duplex: typeof import("stream").Duplex
    Transform: typeof import("stream").Transform
    compile: typeof import("./handlebars").compile

    md: Md
    marked: typeof import("./marked").marked
    uuid: typeof import("crypto").randomUUID
    replace: typeof import("./replace-in-file").replaceInFile

    //custom
    ensureReadFile: EnsureReadFile
    ensureReadJson: EnsureReadJson

    globby: typeof import("globby").globby
  }

  declare global {
    //process
    var cwd: typeof process.cwd
    var pid: typeof process.pid
    var stderr: typeof process.stderr
    var stdin: typeof process.stdin
    var stdout: typeof process.stdout
    var uptime: typeof process.uptime
    //axios
    var get: import("./axios").AxiosInstance["get"]
    var put: import("./axios").AxiosInstance["put"]
    var post: import("./axios").AxiosInstance["post"]
    var patch: import("./axios").AxiosInstance["patch"]
    //chalk
    var chalk: typeof import("./chalk").default
    //child_process
    var spawn: typeof import("child_process").spawn
    var spawnSync: typeof import("child_process").spawnSync
    var fork: typeof import("child_process").fork

    // custom
    var ensureReadFile: EnsureReadFile
    var ensureReadJson: EnsureReadJson
    // execa
    var exec: typeof import("./execa").execaCommand
    var execa: typeof import("./execa").execa
    var execaSync: typeof import("./execa").execaSync
    var execaCommand: typeof import("./execa").execaCommand
    var execaCommandSync: typeof import("./execa").execaCommandSync
    var execaNode: typeof import("./execa").execaNode
    //download
    var download: typeof import("./download")
    //fs-extra
    var emptyDir: typeof import("./fs-extra").emptyDir
    var emptyDirSync: typeof import("./fs-extra").emptyDirSync
    var ensureFile: typeof import("./fs-extra").ensureFile
    var ensureFileSync: typeof import("./fs-extra").ensureFileSync
    var ensureDir: typeof import("./fs-extra").ensureDir
    var ensureDirSync: typeof import("./fs-extra").ensureDirSync
    var ensureLink: typeof import("./fs-extra").ensureLink
    var ensureLinkSync: typeof import("./fs-extra").ensureLinkSync
    var ensureSymlink: typeof import("./fs-extra").ensureSymlink
    var ensureSymlinkSync: typeof import("./fs-extra").ensureSymlinkSync
    var mkdirp: typeof import("./fs-extra").mkdirp
    var mkdirpSync: typeof import("./fs-extra").mkdirpSync
    var mkdirs: typeof import("./fs-extra").mkdirs
    var outputFile: typeof import("./fs-extra").outputFile
    var outputFileSync: typeof import("./fs-extra").outputFileSync
    var outputJson: typeof import("./fs-extra").outputJson
    var outputJsonSync: typeof import("./fs-extra").outputJsonSync
    var pathExists: typeof import("./fs-extra").pathExists
    var pathExistsSync: typeof import("./fs-extra").pathExistsSync
    var readJson: typeof import("./fs-extra").readJson
    var readJsonSync: typeof import("./fs-extra").readJsonSync
    var remove: typeof import("./fs-extra").remove
    var removeSync: typeof import("./fs-extra").removeSync
    var writeJson: typeof import("./fs-extra").writeJson
    var writeJsonSync: typeof import("./fs-extra").writeJsonSync
    var move: typeof import("./fs-extra").move
    var moveSync: typeof import("./fs-extra").moveSync
    //fs/promises
    var readFile: typeof import("node:fs/promises").readFile
    var readFileSync: typeof import("node:fs").readFileSync
    var writeFile: typeof import("node:fs/promises").writeFile
    var writeFileSync: typeof import("node:fs").writeFileSync
    var appendFile: typeof import("node:fs/promises").appendFile
    var appendFileSync: typeof import("node:fs").appendFileSync
    var readdir: typeof import("node:fs/promises").readdir
    var readdirSync: typeof import("node:fs").readdirSync
    var copyFile: typeof import("node:fs/promises").copyFile
    var copyFileSync: typeof import("node:fs").copyFileSync

    var stat: typeof import("node:fs/promises").stat
    var lstat: typeof import("node:fs/promises").lstat

    var rmdir: typeof import("node:fs/promises").rmdir
    var unlink: typeof import("node:fs/promises").unlink
    var symlink: typeof import("node:fs/promises").symlink
    var readlink: typeof import("node:fs/promises").readlink
    var realpath: typeof import("node:fs/promises").realpath
    var access: typeof import("node:fs/promises").access

    var chown: typeof import("node:fs/promises").chown
    var lchown: typeof import("node:fs/promises").lchown
    var utimes: typeof import("node:fs/promises").utimes
    var lutimes: typeof import("node:fs/promises").lutimes

    var rename: typeof import("node:fs/promises").rename

    //fs
    var createReadStream: typeof import("node:fs").createReadStream
    var createWriteStream: typeof import("node:fs").createWriteStream

    //handlebars
    var compile: typeof import("./handlebars").compile

    //marked
    var md: Md
    var marked: MarkedFunction
    //uuid
    var uuid: typeof import("crypto").randomUUID

    //replace-in-file
    var replace: typeof import("./replace-in-file").replaceInFile
    // stream
    var Writable: typeof import("stream").Writable
    var Readable: typeof import("stream").Readable
    var Duplex: typeof import("stream").Duplex
    var Transform: typeof import("stream").Transform

    var globby: typeof import("globby").globby
    namespace NodeJS {
      interface Global extends GlobalsApi { }
    }
  }

  //process
  export var cwd: typeof process.cwd
  export var pid: typeof process.pid
  export var stderr: typeof process.stderr
  export var stdin: typeof process.stdin
  export var stdout: typeof process.stdout
  export var uptime: typeof process.uptime
  //axios
  export var get: import("./axios").AxiosInstance["get"]
  export var put: import("./axios").AxiosInstance["put"]
  export var post: import("./axios").AxiosInstance["post"]
  export var patch: import("./axios").AxiosInstance["patch"]
  //chalk
  export var chalk: typeof import("chalk-template").default
  //child_process
  export var spawn: typeof import("child_process").spawn
  export var spawnSync: typeof import("child_process").spawnSync
  export var fork: typeof import("child_process").fork

  //custom
  export var ensureReadFile: EnsureReadFile
  export var ensureReadJson: EnsureReadJson
  //download
  export var download: typeof import("./download")
  // execa
  export var exec: typeof import("./execa").execaCommand
  export var execa: typeof import("./execa").execa
  export var execaSync: typeof import("./execa").execaSync
  export var execaCommand: typeof import("./execa").execaCommand
  export var execaCommandSync: typeof import("./execa").execaCommandSync
  export var execaNode: typeof import("./execa").execaNode
  //fs-extra
  export var emptyDir: typeof import("./fs-extra").emptyDir
  export var ensureFile: typeof import("./fs-extra").ensureFile
  export var ensureDir: typeof import("./fs-extra").ensureDir
  export var ensureLink: typeof import("./fs-extra").ensureLink
  export var ensureSymlink: typeof import("./fs-extra").ensureSymlink
  export var mkdirp: typeof import("./fs-extra").mkdirp
  export var mkdirs: typeof import("./fs-extra").mkdirs
  export var outputFile: typeof import("./fs-extra").outputFile
  export var outputJson: typeof import("./fs-extra").outputJson
  export var pathExists: typeof import("./fs-extra").pathExists
  export var readJson: typeof import("./fs-extra").readJson
  export var remove: typeof import("./fs-extra").remove
  export var writeJson: typeof import("./fs-extra").writeJson
  export var move: typeof import("./fs-extra").move
  //fs/promises
  export var readFile: typeof import("node:fs/promises").readFile
  export var writeFile: typeof import("node:fs/promises").writeFile
  export var appendFile: typeof import("node:fs/promises").appendFile
  export var readdir: typeof import("node:fs/promises").readdir
  export var copyFile: typeof import("node:fs/promises").copyFile

  export var stat: typeof import("node:fs/promises").stat
  export var lstat: typeof import("node:fs/promises").lstat

  export var rmdir: typeof import("node:fs/promises").rmdir
  export var unlink: typeof import("node:fs/promises").unlink
  export var symlink: typeof import("node:fs/promises").symlink
  export var readlink: typeof import("node:fs/promises").readlink
  export var realpath: typeof import("node:fs/promises").realpath
  export var access: typeof import("node:fs/promises").access

  export var chown: typeof import("node:fs/promises").chown
  export var lchown: typeof import("node:fs/promises").lchown
  export var utimes: typeof import("node:fs/promises").utimes
  export var lutimes: typeof import("node:fs/promises").lutimes
  export var rename: typeof import("node:fs/promises").rename

  //fs
  export var createReadStream: typeof import("node:fs").createReadStream
  export var createWriteStream: typeof import("node:fs").createWriteStream
  //handlebars
  export var compile: typeof import("./handlebars").compile

  //marked
  export var md: Md
  export var marked: typeof import("./marked").marked
  //nonoid
  export var uuid: typeof import("crypto").randomUUID
  //replace-in-file
  export var replace: typeof import("./replace-in-file").replaceInFile
  // stream
  export var Writable: typeof import("stream").Writable
  export var Readable: typeof import("stream").Readable
  export var Duplex: typeof import("stream").Duplex
  export var Transform: typeof import("stream").Transform

  export var globby: typeof import("globby").globby
}
