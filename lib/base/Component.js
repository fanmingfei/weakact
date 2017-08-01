import { getType, mount} from '../utils'

const preId = '___weakactid_'
const preClick = '___weakactClick_'

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
        const [dom, renderStr, childCount, funcMap] = createDom(render)
        bindClick(dom, funcMap)
        insertChildComponent(dom, render[1], renderStr, childCount)
        this.el = dom.children[0]
        return dom.children[0]
    }
}
function bindClick(dom, funcMap) {
    const clicks = dom.querySelectorAll('[onclick]')
    clicks.forEach(x=>{
        const clickName = x.attributes.onclick.value
        const func = funcMap.get(clickName)
        x.removeAttribute('onclick')
        x.addEventListener('click', ()=>{
            func();
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
                str += `<div id="${preId}${childIndex}"></div>${curr}`
                childIndex ++
                break
            case 'str':
                str += `${target}${curr}`
                break
            case 'function':
                str += `${preClick}${funcIndex}${curr}`
                funcMap.set(preClick+funcIndex, target)
                break
            default:
                str += `${target}${curr}`
                break

        }
        return str
    })

    const div = document.createElement('div')
    div.innerHTML = html
    return [div, html, childIndex, funcMap]
}

function insertChildComponent(dom, childs, renderStr, childCount) {
    if(childCount == 0) return

    for (let index = 0; index < childCount; index++){
        const currDom = dom.querySelector(`#${preId+index}`)
        let doms = []
        if (getType(childs[index]) == 'array') {
            for (const component of childs[index]) {
                doms.push(component)
            }
        } else if (childs[index] instanceof Component) {
            doms.push(childs[index])
        }
        doms.forEach(x=>{
            mount(currDom, x)
        })
        currDom.after(...currDom.children)
        currDom.remove()
    }

}