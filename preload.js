window.addEventListener("DOMContentLoaded", () => {
    const replaceTxt = (selector, txt) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = txt
    }

    for (const dependency of ["chrome", "node", "electron"]) {
        replaceTxt(`${dependency}-version`, process.versions[dependency])
    }
})