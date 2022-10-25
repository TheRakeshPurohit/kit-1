let notSupported = name => async () =>
  await div(
    md(`# ${name} is Not Supported on Windows

Have an idea on how to support it? Please share on our [GitHub Discussions](https://github.com/johnlindquist/kit/discussions/categories/ideas)

`)
  )
global.edit = async (path, dir, line, col) => {
  await global.exec(
    `${env?.KIT_EDITOR || "code"} ${path} ${dir}`
  )
}

global.browse = async (url: string) => {
  await global.exec(`start ${url}`)
}

global.fileSearch = async (
  name,
  { onlyin, kind } = { onlyin: home(), kind: "" }
) => {
  let command = `where /r ${onlyin} *${name.replace(
    /\W/g,
    "*"
  )}*`
  let stdout = ``
  try {
    stdout = (await global.exec(command)).stdout
  } catch (error) {
    stdout = `No results for ${name}`
  }

  return stdout.split("\n").filter(Boolean)
}

// comment out means they are supported in windows
global.applescript = notSupported("applescript")
global.copyPathAsImage = notSupported("copyPathAsImage")
// global.fileSearch = notSupported("fileSearch")
global.focusTab = notSupported("focusTab")
global.focusWindow = notSupported("focusWindow")
global.getActiveTab = notSupported("getActiveTab")
// global.getActiveScreen = notSupported("getActiveScreen")
global.getActiveAppInfo = notSupported("getActiveAppInfo")
global.getActiveAppBounds = notSupported(
  "getActiveAppBounds"
)
global.getActiveScreen = notSupported("getActiveScreen")
global.getActiveTab = notSupported("getActiveTab")
// global.getMousePosition = notSupported("getMousePosition")
// global.getScreens = notSupported("getScreens")
global.getSelectedFile = notSupported("getSelectedFile")
global.setSelectedFile = notSupported("setSelectedFile")
global.getSelectedDir = notSupported("getSelectedDir")
// global.revealInFinder = notSupported("revealInFinder")
// global.selectFile = notSupported("selectFile")
// global.selectFolder = notSupported("selectFolder")
// global.revealFile = notSupported("revealFile")
// global.getSelectedText = notSupported("getSelectedText")
// global.cutText = notSupported("cutText")
global.getTabs = notSupported("getTabs")
global.getWindows = notSupported("getWindows")
global.getWindowsBounds = notSupported("getWindowsBounds")
global.keystroke = notSupported("keystroke")
global.lock = notSupported("lock")
// global.openLog = notSupported("openLog")
global.organizeWindows = notSupported("organizeWindows")
// global.playAudioFile = notSupported("playAudioFile")
global.quitAllApps = notSupported("quitAllApps")
// global.say = notSupported("say")
// global.beep = notSupported("beep")
global.scatterWindows = notSupported("scatterWindows")
// global.scrapeAttribute = notSupported("scrapeAttribute")
// global.scrapeSelector = notSupported("scrapeSelector")
global.setActiveAppBounds = notSupported(
  "setActiveAppBounds"
)
global.setActiveAppPosition = notSupported(
  "setActiveAppPosition"
)
global.setActiveAppSize = notSupported("setActiveAppSize")
// global.setSelectedText = notSupported("setSelectedText")
global.setWindowBoundsByIndex = notSupported(
  "setWindowBoundsByIndex"
)
global.setWindowPosition = notSupported("setWindowPosition")
global.setWindowPositionByIndex = notSupported(
  "setWindowPositionByIndex"
)
global.setWindowSize = notSupported("setWindowSize")
global.setWindowSizeByIndex = notSupported(
  "setWindowSizeByIndex"
)
global.shutdown = notSupported("shutdown")
global.sleep = notSupported("sleep")
global.tileWindow = notSupported("tileWindow")
