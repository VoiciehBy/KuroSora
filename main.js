const { app, BrowserWindow } = require("electron")
const path = require(`node:path`)

const createWindow = () => {
    const window = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, "preload.js"),
        }
    })

    window.loadURL(path.join(__dirname, "frontend/dist/frontend/index.html"))
}

app.whenReady().then(() => {
    console.log("Ready...")

    createWindow()
    app.on("active", () => {
        let windows = BrowserWindow.getAllWindows()
        let windowsCount = windows.length
        if (windowsCount == 0)
            createWindow()
    })
})

app.on("browser-window-focus", () => {
    console.log("Got Focused...")
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        app.quit()
})