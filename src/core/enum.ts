export enum Mode {
  FILTER = "FILTER",
  GENERATE = "GENERATE",
  HOTKEY = "HOTKEY",
  MANUAL = "MANUAL",
  CUSTOM = "CUSTOM",
}

export enum Channel {
  ABANDON = "ABANDON",
  APP_CONFIG = "APP_CONFIG",
  APP_DB = "APP_DB",
  AUDIO_ENDED = "AUDIO_ENDED",
  AUDIO_DATA = "AUDIO_DATA",
  CHOICE_FOCUSED = "CHOICE_FOCUSED",
  CLEAR_CACHE = "CLEAR_CACHE",
  CLEAR_PROMPT_CACHE = "CLEAR_PROMPT_CACHE",
  CLEAR_PREVIEW = "CLEAR_PREVIEW",
  CLIPBOARD_SYNC_HISTORY = "CLIPBOARD_SYNC_HISTORY",
  CONSOLE_CLEAR = "CONSOLE_CLEAR",
  CONSOLE_LOG = "CONSOLE_LOG",
  CONSOLE_INFO = "CONSOLE_INFO",
  CONSOLE_WARN = "CONSOLE_WARN",
  CONSOLE_ERROR = "CONSOLE_ERROR",
  CONTENT_HEIGHT_UPDATED = "CONTENT_HEIGHT_UPDATED",
  CONTENT_SIZE_UPDATED = "CONTENT_SIZE_UPDATED",
  COPY_PATH_AS_PICTURE = "COPY_PATH_AS_PICTURE",
  CREATE_KENV = "CREATE_KENV",
  SET_TRAY = "SET_TRAY",
  DEV_TOOLS = "DEV_TOOLS",
  ESCAPE_PRESSED = "ESCAPE_PRESSED",
  EXIT = "EXIT",
  FLAG_INPUT = "FLAG_INPUT",
  FLAG_SUBMITTED = "FLAG_SUBMITTED",
  GENERATE_CHOICES = "GENERATE_CHOICES",
  GET_BACKGROUND = "GET_BACKGROUND",
  GET_BOUNDS = "GET_BOUNDS",
  GET_EDITOR_HISTORY = "GET_EDITOR_HISTORY",
  GET_CLIPBOARD_HISTORY = "GET_CLIPBOARD_HISTORY",
  GET_MOUSE = "GET_MOUSE",
  GET_PROCESSES = "GET_PROCESSES",
  GET_SCHEDULE = "GET_SCHEDULE",
  GET_SCREEN_INFO = "GET_SCREEN_INFO",
  GET_SCRIPTS_STATE = "GET_SCRIPTS_STATE",
  GET_SERVER_STATE = "GET_SERVER_STATE",
  GROW_PROMPT = "GROW_PROMPT",
  HIDE_APP = "HIDE_APP",
  KEYBOARD_CONFIG = "KEYBOARD_CONFIG",
  KEYBOARD_TYPE = "KEYBOARD_TYPE",
  KEYBOARD_PRESS_KEY = "KEYBOARD_PRESS_KEY",
  KEYBOARD_RELEASE_KEY = "KEYBOARD_RELEASE_KEY",
  KEYWORD_TRIGGERED = "KEYWORD_TRIGGERED",
  KIT_LOG = "KIT_LOG",
  KIT_CLEAR = "KIT_CLEAR",
  KIT_PASTE = "KIT_PASTE",
  KIT_WARN = "KIT_WARN",
  NEEDS_RESTART = "NEEDS_RESTART",
  OPEN_KIT_LOG = "OPEN_KIT_LOG",
  OPEN_DEV_TOOLS = "OPEN_DEV_TOOLS",
  OPEN_MENU = "OPEN_MENU",
  BLUR = "BLUR",
  PROMPT_BOUNDS_UPDATED = "PROMPT_BOUNDS_UPDATED",
  PROMPT_ERROR = "PROMPT_ERROR",
  QUIT_APP = "QUIT_APP",
  RESET_PROMPT = "RESET_PROMPT",
  REMOVE_CLIPBOARD_HISTORY_ITEM = "REMOVE_CLIPBOARD_HISTORY_ITEM",
  RUN_SCRIPT = "RUN_SCRIPT",
  SCRIPTS_CHANGED = "SCRIPTS_CHANGED",
  SELECTED = "SELECTED",
  SEND_RESPONSE = "SEND_RESPONSE",
  SEND_KEYSTROKE = "SEND_KEYSTROKE",
  SET_CONFIG = "SET_CONFIG",
  SET_BOUNDS = "SET_BOUNDS",
  SET_CHOICES = "SET_CHOICES",
  SET_SELECTED_CHOICES = "SET_SELECTED_CHOICES",
  SET_DARK = "SET_DARK",
  SET_DESCRIPTION = "SET_DESCRIPTION",
  SET_EDITOR_CONFIG = "SET_EDITOR_CONFIG",
  SET_FLAGS = "SET_FLAGS",
  SET_FIELDS = "SET_FIELDS",
  SET_FILTER_INPUT = "SET_FILTER_INPUT",
  SET_FOCUSED = "SET_FOCUSED",
  SET_FOOTER = "SET_FOOTER",
  SET_FORM_HTML = "SET_FORM_HTML",
  SET_HINT = "SET_HINT",
  SET_KIT_STATE = "SET_KIT_STATE",
  SET_IGNORE_BLUR = "SET_IGNORE_BLUR",
  SET_INPUT = "SET_INPUT",
  GET_INPUT = "GET_INPUT",
  SET_LOADING = "SET_LOADING",
  SET_LOG = "SET_LOG",
  SET_LOGO = "SET_LOGO",
  SET_LOGIN = "SET_LOGIN",
  SET_NAME = "SET_NAME",
  SET_MAIN_HEIGHT = "SET_MAIN_HEIGHT",
  SET_MAX_HEIGHT = "SET_MAX_HEIGHT",
  SET_OPEN = "SET_OPEN",
  SET_PANEL = "SET_PANEL",
  SET_PID = "SET_PID",
  SET_PLACEHOLDER = "SET_PLACEHOLDER",
  SET_PREVIEW = "SET_PREVIEW",
  SET_PREVIEW_ENABLED = "SET_PREVIEW_ENABLED",
  SET_PROMPT_BLURRED = "SET_PROMPT_BLURRED",
  SET_PROMPT_BOUNDS = "SET_PROMPT_BOUNDS",
  SET_PROMPT_DATA = "SET_PROMPT_DATA",
  SET_PROMPT_PROP = "SET_PROMPT_PROP",
  SET_READY = "SET_READY",
  SET_RESIZE = "SET_RESIZE",
  SET_RESIZING = "SET_RESIZING",
  SET_SCRIPT = "SET_SCRIPT",
  SET_SCRIPT_HISTORY = "SET_SCRIPT_HISTORY",
  SET_SHORTCUTS = "SET_SHORTCUTS",
  SET_SHORTCODES = "SET_SHORTCODES",
  SET_SPLASH_BODY = "SET_SPLASH_BODY",
  SET_SPLASH_HEADER = "SET_SPLASH_HEADER",
  SET_SPLASH_PROGRESS = "SET_SPLASH_PROGRESS",
  SET_STATUS = "SET_STATUS",
  SET_SUBMIT_VALUE = "SET_SUBMIT_VALUE",
  SET_TAB_INDEX = "SET_TAB_INDEX",
  SET_TEXTAREA_CONFIG = "SET_TEXTAREA_CONFIG",
  SET_TEXTAREA_VALUE = "SET_TEXTAREA_VALUE",
  SET_THEME = "SET_THEME",
  SET_TOP_HEIGHT = "SET_TOP_HEIGHT",
  SET_UNFILTERED_CHOICES = "SET_UNFILTERED_CHOICES",
  SET_CHOICES_CONFIG = "SET_CHOICES_CONFIG",
  SET_VALUE = "SET_VALUE",
  SHEBANG = "SHEBANG",
  START = "START",
  SHOW = "SHOW",
  SHOW_IMAGE = "SHOW_IMAGE",
  SHOW_NOTIFICATION = "SHOW_NOTIFICATION",
  SHOW_TEXT = "SHOW_TEXT",
  SHRINK_PROMPT = "SHRINK_PROMPT",
  SWITCH_KENV = "SWITCH_KENV",
  TAB_CHANGED = "TAB_CHANGED",
  TERMINAL = "TERMINAL",
  TOAST = "TOAST",
  TOGGLE_ALL_SELECTED_CHOICES = "TOGGLE_ALL_SELECTED_CHOICES",
  TOGGLE_BACKGROUND = "TOGGLE_BACKGROUND",
  SET_SEARCH_DEBOUNCE = "SET_SEARCH_DEBOUNCE",
  TOGGLE_TRAY = "TOGGLE_TRAY",
  UPDATE_APP = "UPDATE_APP",
  UPDATE_PROMPT_WARN = "UPDATE_PROMPT_WARN",
  USER_RESIZED = "USER_RESIZED",
  VALUE_SUBMITTED = "VALUE_SUBMITTED",
  VALUE_INVALID = "VALUE_INVALID",
  NO_CHOICES = "NO_CHOICES",
  CHOICES = "CHOICES",
  ESCAPE = "ESCAPE",
  BACK = "BACK",
  FORWARD = "FORWARD",
  UP = "UP",
  DOWN = "DOWN",
  TAB = "TAB",
  INPUT = "INPUT",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  NOTIFY = "NOTIFY",
  WIDGET_GET = "WIDGET_GET",
  WIDGET_CAPTURE_PAGE = "WIDGET_CAPTURE_PAGE",
  WIDGET_END = "WIDGET_END",
  WIDGET_UPDATE = "WIDGET_UPDATE",
  WIDGET_SET_STATE = "WIDGET_SET_STATE",
  WIDGET_CLICK = "WIDGET_CLICK",
  WIDGET_DROP = "WIDGET_DROP",
  WIDGET_MOUSE_DOWN = "WIDGET_MOUSE_DOWN",
  WIDGET_INPUT = "WIDGET_INPUT",
  WIDGET_DRAG_START = "WIDGET_DRAG_START",
  TERMINATE_PROCESS = "TERMINATE_PROCESS",
  WIDGET_RESIZED = "WIDGET_RESIZED",
  WIDGET_MOVED = "WIDGET_MOVED",
  WIDGET_SET_POSITION = "WIDGET_SET_POSITION",
  WIDGET_SET_SIZE = "WIDGET_SET_SIZE",
  WIDGET_FIT = "WIDGET_FIT",
  WIDGET_INIT = "WIDGET_INIT",
  SHORTCUT = "SHORTCUT",
  ON_PASTE = "ON_PASTE",
  ON_DRAG_ENTER = "ON_DRAG_ENTER",
  ON_DRAG_LEAVE = "ON_DRAG_LEAVE",
  ON_DRAG_OVER = "ON_DRAG_OVER",
  ON_DROP = "ON_DROP",
  ON_INIT = "ON_INIT",
  ON_SUBMIT = "ON_SUBMIT",
  GET_SCREENS_INFO = "GET_SCREENS_INFO",
  GET_ACTIVE_APP = "GET_ACTIVE_APP",
  TRASH = "TRASH",
  COPY = "COPY",
  PASTE = "PASTE",
  CLEAR_SCRIPTS_MEMORY = "CLEAR_SCRIPTS_MEMORY",
  SET_FORM = "SET_FORM",
  CLEAR_TABS = "CLEAR_TABS",
  VERIFY_FULL_DISK_ACCESS = "VERIFY_FULL_DISK_ACCESS",
  SET_CLIPBOARD = "SET_CLIPBOARD",
  SET_SELECTED_TEXT = "SET_SELECTED_TEXT",
  ADD_CHOICE = "ADD_CHOICE",
  FOCUS = "FOCUS",
  SET_ALWAYS_ON_TOP = "SET_ALWAYS_ON_TOP",
  SHOW_EMOJI_PANEL = "SHOW_EMOJI_PANEL",
  SET_APPEARANCE = "SET_APPEARANCE",
  SET_TEMP_THEME = "SET_TEMP_THEME",
  SELECT_FILE = "SELECT_FILE",
  REVEAL_FILE = "REVEAL_FILE",
  SELECT_FOLDER = "SELECT_FOLDER",
  PLAY_AUDIO = "PLAY_AUDIO",
  STOP_AUDIO = "STOP_AUDIO",
  SPEAK_TEXT = "SPEAK_TEXT",
  BEEP = "BEEP",
  SET_ENTER = "SET_ENTER",
  CUT_TEXT = "CUT_TEXT",
  DEBUG_SCRIPT = "DEBUG_SCRIPT",
  BLUR_APP = "BLUR_APP",
  WIDGET_CALL = "WIDGET_CALL",
  SHOW_LOG_WINDOW = "SHOW_LOG_WINDOW",
  PRO_STATUS = "PRO_STATUS",
  GET_MAC_WINDOWS = "GET_MAC_WINDOWS",
  GET_APP_STATE = "GET_APP_STATE",
  APP = "APP",
  CHANGE = "CHANGE",
  SET_EDITOR_SUGGESTIONS = "SET_EDITOR_SUGGESTIONS",
  APPEND_EDITOR_VALUE = "APPEND_EDITOR_VALUE",
  CLIPBOARD_READ_TEXT = "CLIPBOARD_READ_TEXT",
  CLIPBOARD_READ_HTML = "CLIPBOARD_READ_HTML",
  CLIPBOARD_READ_IMAGE = "CLIPBOARD_READ_IMAGE",
  CLIPBOARD_READ_RTF = "CLIPBOARD_READ_RTF",
  CLIPBOARD_READ_BUFFER = "CLIPBOARD_READ_BUFFER",
  CLIPBOARD_READ_BOOKMARK = "CLIPBOARD_READ_BOOKMARK",
  CLIPBOARD_READ_FIND_TEXT = "CLIPBOARD_READ_FIND_TEXT",
  CLIPBOARD_WRITE_TEXT = "CLIPBOARD_WRITE_TEXT",
  CLIPBOARD_WRITE_HTML = "CLIPBOARD_WRITE_HTML",
  CLIPBOARD_WRITE_IMAGE = "CLIPBOARD_WRITE_IMAGE",
  CLIPBOARD_WRITE_RTF = "CLIPBOARD_WRITE_RTF",
  CLIPBOARD_WRITE_BUFFER = "CLIPBOARD_WRITE_BUFFER",
  CLIPBOARD_WRITE_BOOKMARK = "CLIPBOARD_WRITE_BOOKMARK",
  CLIPBOARD_WRITE_FIND_TEXT = "CLIPBOARD_WRITE_FIND_TEXT",
  CLIPBOARD_CLEAR = "CLIPBOARD_CLEAR",
  GLOBAL_SHORTCUT_PRESSED = "GLOBAL_SHORTCUT_PRESSED",
  REGISTER_GLOBAL_SHORTCUT = "REGISTER_GLOBAL_SHORTCUT",
  UNREGISTER_GLOBAL_SHORTCUT = "UNREGISTER_GLOBAL_SHORTCUT",
  START_DRAG = "START_DRAG",
  GET_COLOR = "GET_COLOR",
  CHAT_ADD_MESSAGE = "CHAT_ADD_MESSAGE",
  CHAT_GET_MESSAGES = "CHAT_GET_MESSAGES",
  CHAT_CLEAR_MESSAGES = "CHAT_CLEAR_MESSAGES",
  CHAT_SET_MESSAGES = "CHAT_SET_MESSAGES",
  CHAT_PUSH_TOKEN = "CHAT_PUSH_TOKEN",
  CHAT_MESSAGES_CHANGE = "CHAT_MESSAGES_CHANGE",
  CHAT_SUBMIT = "CHAT_SUBMIT",
  CHAT_SET_MESSAGE = "CHAT_SET_MESSAGE",
  MESSAGE_FOCUSED = "MESSAGE_FOCUSED",
  ON_VALIDATION_FAILED = "ON_VALIDATION_FAILED",
  APPEND_CHOICES = "APPEND_CHOICES",
  TERM_EXIT = "TERM_EXIT",
  TERM_KILL = "TERM_KILL",
  APPEND_INPUT = "APPEND_INPUT",
  SCROLL_TO = "SCROLL_TO",
  GET_MICROPHONE = "GET_MICROPHONE",
  ON_AUDIO_DATA = "ON_AUDIO_DATA",
  GET_DEVICES = "GET_DEVICES",
  SET_RUNNING = "SET_RUNNING",
  GET_TYPED_TEXT = "GET_TYPED_TEXT",
  WIDGET_CUSTOM = "WIDGET_CUSTOM",
  SET_PAUSE_RESIZE = "SET_PAUSE_RESIZE",
  TERM_WRITE = "TERM_WRITE",
  SET_FORM_DATA = "SET_FORM_DATA",
  SET_DISABLE_SUBMIT = "SET_DISABLE_SUBMIT",
  WIDGET_EXECUTE_JAVASCRIPT = "WIDGET_EXECUTE_JAVASCRIPT",
  START_MIC = "START_MIC",
  STOP_MIC = "STOP_MIC",
  EDITOR_GET_SELECTION = "EDITOR_GET_SELECTION",
  EDITOR_SET_CODE_HINT = "EDITOR_SET_CODE_HINT",
  PING = "PING",
  PONG = "PONG",
  EDITOR_GET_CURSOR_OFFSET = "EDITOR_GET_CURSOR_OFFSET",
  EDITOR_MOVE_CURSOR = "EDITOR_MOVE_CURSOR",
  EDITOR_INSERT_TEXT = "EDITOR_INSERT_TEXT",
  SET_SCORED_CHOICES = "SET_SCORED_CHOICES",
  SET_SCORED_FLAGS = "SET_SCORED_FLAGS",
  PRELOAD = "PRELOAD",
  SET_FLAG_VALUE = "SET_FLAG_VALUE",
  DB = "DB",
  CLEAR_TIMESTAMPS = "CLEAR_TIMESTAMPS",
  REMOVE_TIMESTAMP = "REMOVE_TIMESTAMP",
  CACHE_SCRIPTS = "CACHE_SCRIPTS",
  PREVENT_SUBMIT = "PREVENT_SUBMIT",
  ON_MENU_TOGGLE = "ON_MENU_TOGGLE",
  TOGGLE_CLIPBOARD_WATCHER = "TOGGLE_CLIPBOARD_WATCHER",
  TOGGLE_WATCHER = "TOGGLE_WATCHER",
  ACTION = "ACTION",
  ENABLE_ACCESSIBILITY = "ENABLE_ACCESSIBILITY",
  QUIT_AND_RELAUNCH = "QUIT_AND_RELAUNCH",
  BEFORE_EXIT = "BEFORE_EXIT",
  MOUSE_SET_POSITION = "MOUSE_SET_POSITION",
  MOUSE_LEFT_CLICK = "MOUSE_LEFT_CLICK",
  MOUSE_RIGHT_CLICK = "MOUSE_RIGHT_CLICK",
  SYSTEM_CLICK = "SYSTEM_MOUSE_CLICK",
  SYSTEM_KEYDOWN = "SYSTEM_KEYDOWN",
  SYSTEM_KEYUP = "SYSTEM_KEYUP",
  SYSTEM_MOUSEDOWN = "SYSTEM_MOUSEDOWN",
  SYSTEM_MOUSEUP = "SYSTEM_MOUSEUP",
  SYSTEM_MOUSEMOVE = "SYSTEM_MOUSEMOVE",
  SYSTEM_WHEEL = "SYSTEM_WHEEL",
}

export enum ProcessType {
  App = "App",
  Background = "Background",
  Prompt = "Prompt",
  Schedule = "Schedule",
  System = "System",
  Watch = "Watch",
}

export enum ErrorAction {
  Ask = "Ask",
  KitLog = "KitLog",
  Log = "Log",
  Open = "Open",
  Copy = "Copy",
  CopySyncPath = "CopySyncPath",
}

export enum ProcessState {
  Active = "Active",
  Idle = "Idle",
}

export enum UI {
  none = "none",
  arg = "arg",
  textarea = "textarea",
  hotkey = "hotkey",
  drop = "drop",
  editor = "editor",
  form = "form",
  div = "div",
  log = "log",
  splash = "splash",
  term = "term",
  fields = "fields",
  emoji = "emoji",
  debugger = "debugger",
  chat = "chat",
  mic = "mic",
  webcam = "webcam",
}

export enum Bin {
  cli = "cli",
  scripts = "scripts",
}

export enum Secret {
  password = "password",
  text = "text",
}

export enum Value {
  NoValue = "__noValue__",
  Undefined = "__undefined__",
}

export enum Key {
  Space = 0,
  Escape = 1,
  Tab = 2,
  LeftAlt = 3,
  LeftControl = 4,
  RightAlt = 5,
  RightControl = 6,
  LeftShift = 7,
  LeftSuper = 8,
  RightShift = 9,
  RightSuper = 10,
  F1 = 11,
  F2 = 12,
  F3 = 13,
  F4 = 14,
  F5 = 15,
  F6 = 16,
  F7 = 17,
  F8 = 18,
  F9 = 19,
  F10 = 20,
  F11 = 21,
  F12 = 22,
  F13 = 23,
  F14 = 24,
  F15 = 25,
  F16 = 26,
  F17 = 27,
  F18 = 28,
  F19 = 29,
  F20 = 30,
  F21 = 31,
  F22 = 32,
  F23 = 33,
  F24 = 34,
  Num0 = 35,
  Num1 = 36,
  Num2 = 37,
  Num3 = 38,
  Num4 = 39,
  Num5 = 40,
  Num6 = 41,
  Num7 = 42,
  Num8 = 43,
  Num9 = 44,
  A = 45,
  B = 46,
  C = 47,
  D = 48,
  E = 49,
  F = 50,
  G = 51,
  H = 52,
  I = 53,
  J = 54,
  K = 55,
  L = 56,
  M = 57,
  N = 58,
  O = 59,
  P = 60,
  Q = 61,
  R = 62,
  S = 63,
  T = 64,
  U = 65,
  V = 66,
  W = 67,
  X = 68,
  Y = 69,
  Z = 70,
  Grave = 71,
  Minus = 72,
  Equal = 73,
  Backspace = 74,
  LeftBracket = 75,
  RightBracket = 76,
  Backslash = 77,
  Semicolon = 78,
  Quote = 79,
  Return = 80,
  Comma = 81,
  Period = 82,
  Slash = 83,
  Left = 84,
  Up = 85,
  Right = 86,
  Down = 87,
  Print = 88,
  Pause = 89,
  Insert = 90,
  Delete = 91,
  Home = 92,
  End = 93,
  PageUp = 94,
  PageDown = 95,
  Add = 96,
  Subtract = 97,
  Multiply = 98,
  Divide = 99,
  Decimal = 100,
  Enter = 101,
  NumPad0 = 102,
  NumPad1 = 103,
  NumPad2 = 104,
  NumPad3 = 105,
  NumPad4 = 106,
  NumPad5 = 107,
  NumPad6 = 108,
  NumPad7 = 109,
  NumPad8 = 110,
  NumPad9 = 111,
  CapsLock = 112,
  ScrollLock = 113,
  NumLock = 114,
  AudioMute = 115,
  AudioVolDown = 116,
  AudioVolUp = 117,
  AudioPlay = 118,
  AudioStop = 119,
  AudioPause = 120,
  AudioPrev = 121,
  AudioNext = 122,
  AudioRewind = 123,
  AudioForward = 124,
  AudioRepeat = 125,
  AudioRandom = 126,
}

export const statuses = [
  "default",
  "success",
  "warn",
  "busy",
  "error",
  "pause",
  "update",
] as const

export enum AppChannel {
  BUILD_TS_SCRIPT = "BUILD_TS_SCRIPT",
  DRAG_FILE_PATH = "DRAG_FILE_PATH",
  EDIT_SCRIPT = "EDIT_SCRIPT",
  FOCUS_PROMPT = "FOCUS_PROMPT",
  GET_ASSET = "GET_ASSET",
  INIT_RESIZE_HEIGHT = "INIT_RESIZE_HEIGHT",
  OPEN_FILE = "OPEN_FILE",
  OPEN_SCRIPT = "OPEN_SCRIPT",
  OPEN_SCRIPT_DB = "OPEN_SCRIPT_DB",
  OPEN_SCRIPT_LOG = "OPEN_SCRIPT_LOG",
  PROMPT_HEIGHT_RESET = "PROMPT_HEIGHT_RESET",
  READ_FILE_CONTENTS = "READ_FILE_CONTENTS",
  RECEIVE_FILE_CONTENTS = "RECEIVE_FILE_CONTENTS",
  RESIZE = "RESIZE",
  RUN_MAIN_SCRIPT = "RUN_MAIN_SCRIPT",
  SET_FILEPATH_BOUNDS = "SET_PROMPT_DB",
  SET_MAIN_HEIGHT = "SET_MAIN_HEIGHT",
  END_PROCESS = "END_PROCESS",
  FEEDBACK = "SUBMIT_SURVEY",
  PROCESSES = "PROCESSES",
  RUN_PROCESSES_SCRIPT = "RUN_PROCESSES_SCRIPT",
  LOG = "LOG",
  MAIN_SCRIPT = "MAIN_SCRIPT",
  KIT_STATE = "STATE",
  APPLY_UPDATE = "APPLY_UPDATE",
  LOGIN = "LOGIN",
  USER_CHANGED = "USER_CHANGED",
}

export enum WindowChannel {
  SET_LAST_LOG_LINE = "LOG_LINE",
  SET_EDITOR_LOG_MODE = "SET_EDITOR_LOG_MODE",
  SET_LOG_VALUE = "SET_LOG_VALUE",
  CLEAR_LOG = "CLEAR_LOG",
  MOUNTED = "MOUNTED",
}

export enum Trigger {
  App = "app",
  Background = "background",
  Info = "info",
  Schedule = "schedule",
  Snippet = "snippet",
  System = "system",
  Shortcut = "shortcut",
  Watch = "watch",
  Kit = "kit",
  Kar = "kar",
  Menu = "menu",
  Tray = "tray",
  RunTxt = "runTxt",
}

export const PROMPT = {
  RATIO: 1.6,
  INPUT: {
    HEIGHT: {
      XXS: 32,
      XS: 40,
      SM: 46,
      BASE: 56,
      LG: 64,
      XL: 72,
    },
  },
  ITEM: {
    HEIGHT: {
      XXXS: 28,
      XXS: 30,
      XS: 38,
      SM: 46,
      BASE: 56,
      LG: 64,
      XL: 72,
      XXL: 80,
    },
  },
  WIDTH: {
    XXXS: 360,
    XXS: 480,
    XS: 512,
    SM: 640,
    BASE: 768,
    LG: 896,
    XL: 1024,
    "2XL": 1152,
    "3XL": 1280,
    "4XL": 1408,
    "5XL": 1536,
    "6XL": 1664,
  },
  HEIGHT: {
    get XXS() {
      return Math.round(PROMPT.WIDTH.XXS / PROMPT.RATIO)
    },
    get XS() {
      return Math.round(PROMPT.WIDTH.XS / PROMPT.RATIO)
    },
    get SM() {
      return Math.round(PROMPT.WIDTH.SM / PROMPT.RATIO)
    },
    get BASE() {
      return Math.round(PROMPT.WIDTH.BASE / PROMPT.RATIO)
    },
    get LG() {
      return Math.round(PROMPT.WIDTH.LG / PROMPT.RATIO)
    },
    get XL() {
      return Math.round(PROMPT.WIDTH.XL / PROMPT.RATIO)
    },
    get "2XL"() {
      return Math.round(PROMPT.WIDTH["2XL"] / PROMPT.RATIO)
    },
    get "3XL"() {
      return Math.round(PROMPT.WIDTH["3XL"] / PROMPT.RATIO)
    },
    get "4XL"() {
      return Math.round(PROMPT.WIDTH["4XL"] / PROMPT.RATIO)
    },
    get "5XL"() {
      return Math.round(PROMPT.WIDTH["5XL"] / PROMPT.RATIO)
    },
    get "6XL"() {
      return Math.round(PROMPT.WIDTH["6XL"] / PROMPT.RATIO)
    },
    HEADER: 24,
    FOOTER: 28,
    INPUT_INFO: 26,
    get INPUT_ONLY() {
      return (
        PROMPT.HEIGHT.HEADER +
        PROMPT.INPUT.HEIGHT.BASE +
        PROMPT.HEIGHT.FOOTER
      )
    },
  },
}
