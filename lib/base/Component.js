import {createDom, getType, mount} from '../utils'
export default class Component {
    constructor(props) {
        this.props = props
    }
    setState(obj) {
        this.state = {...this.state, ...obj}
        this.onStateChange()
    }
    renderDom () {
        const render = this.render()
        const renderStr = render[0]
        const dom = createDom(renderStr)
        // 遍历所有绑定事件
        const clicks = dom.querySelectorAll('[onclick]')
        clicks.forEach(x=>{
            const onclick = x.attributes.onclick.value
            const funcName = onclick.split('.')
            x.removeAttribute('onclick')
            x.addEventListener('click', ()=>{
                this[funcName[1]]()
            })
        })
        insertChildComponent(dom, render, renderStr)
        this.el = dom.children[0]
        return dom.children[0]
    }
}
function getIndex(x) {
    return Number.parseInt(x.replace(/{{|}}/g, ''))
}
function insertChildComponent(dom, render, renderStr) {
    const regs = /{{(\d+?)}}/g
    const reg = /^({{)\d+?(}})$/
    const variable = renderStr.match(regs)
    const dict = new Map()

    if (variable) {
        variable.forEach(x=>{
            const index = getIndex(x)
            dict.set(index, render[index])
        })
        // 遍历所有 dom 找到{{number}} 然后 替换
        dom.querySelectorAll('*').forEach(d=>{
            if(!reg.test(d.innerHTML)) return
            const index = getIndex(d.innerHTML)
            let childs = []
            if (getType(render[index]) == 'array') {
                for (const component of render[index]) {
                    childs.push(component)
                }
            } else if (render[index] instanceof Component) {
                childs.push(render[index])
            }
            d.innerHTML = ''
            childs.forEach(x=>{
                mount(d, x)
            })
        })
    }
}