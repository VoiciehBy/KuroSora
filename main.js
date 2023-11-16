const { app, BrowserWindow } = require("electron")
const path = require(`node:path`)

const server = require("./server")

const createWindow = () => {
    const window = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    })

    window.loadFile(path.join(__dirname, "frontend/dist/frontend/index.html"))
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
    server.initHttpServer();
})

app.on("browser-window-focus", () => {
    console.log("Got Focused...")
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        app.quit()
})