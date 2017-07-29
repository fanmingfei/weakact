export const getType = (function() {
    const types = {}
    "Boolean Number String Function Array Date RegExp Object Error Map Set".split(" ").forEach(name=>{
        types["[object " + name + "]"] = name
    })
    return function (obj) {
        return types[Object.prototype.toString.call(obj)].toLowerCase()
    }
})()

export function createDom(str) {
    const div = document.createElement('div')
    div.innerHTML = str
    return div
}

export function mount (dom, child) {
    dom.append(child.renderDom())
    child.onStateChange = function() {
        child.olderEl = child.el
        child.olderEl.after(child.renderDom())
        child.olderEl.remove()
    }
}