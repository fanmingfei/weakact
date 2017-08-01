import { getType, mount} from '../utils'

const preChild = '___weakactChild_'
const preFunc = '___weakactFunc_'

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
        const [dom, renderStr, componentMap, funcMap] = createDom(render)
        bindEvent(dom, funcMap)
        insertChildComponent(dom, componentMap, renderStr)
        this.el = dom.children[0]
        return dom.children[0]
    }
}
function bindEvent(dom, funcMap) {
    const eventType = ['onclick', 'onchange', 'onkeydown', 'onkeyup'];
    const selector = eventType.map(type=>`[${type}]`).toString()
    const clicks = dom.querySelectorAll(selector)
    clicks.forEach(d=>{
        eventType.forEach(type=>{
            if (d.attributes[type]) {
                const func = funcMap.get(d.attributes[type].value)
                d.removeAttribute(type)
                d.addEventListener(type.substring(2), (e)=>{
                    func(e)
                })
            }
        })
    })
}
function getIndex(x) {
    return Number.parseInt(x.replace(/{{|}}/g, ''))
}

function createDom(render) {
    let childIndex = 0
    let funcIndex = 0;
    let funcMap = new Map();
    let componentMap = new Map();
    const html = render[0].reduce((str, curr, i)=>{
        let type
        const target = render[1][i - 1]


        if(getType(target) == 'object' && target instanceof Component){
            type = 'component'
        }
        if (getType(target) == 'array' && getType(target[0]) == 'object' && target[0] instanceof Component) {
            type = 'component'
        }
        if (getType(target) == 'function') {
            type = 'function'
        }
        if (getType(target) == 'str') {
            type = 'str'
        }
        switch(type) {
            case 'component':
                str += `<div id="${preChild+childIndex}"></div>${curr}`
                componentMap.set(preChild+childIndex, target)
                childIndex++
                break
            case 'str':
                str += `${target}${curr}`
                break
            case 'function':
                str += `${preFunc}${funcIndex}${curr}`
                funcMap.set(preFunc+funcIndex, target)
                funcIndex++
                break
            default:
                str += `${target}${curr}`
                break

        }
        return str
    })

    const div = document.createElement('div')
    div.innerHTML = html
    return [div, html, componentMap, funcMap]
}

function insertChildComponent(dom, childs, renderStr) {
    for (let [cid, child] of childs) {
        const currDom = dom.querySelector(`#${cid}`)
        let doms = []
        if (getType(child) == 'array') {
            for (const component of child) {
                doms.push(component)
            }
        } else if (child instanceof Component) {
            doms.push(child)
        }
        doms.forEach(x=>{
            mount(currDom, x)
        })
        currDom.after(...currDom.children)
        currDom.remove()
    }
}