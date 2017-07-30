import { getType, mount} from '../utils'
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
        const [dom, renderStr] = createDom(render)
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
        insertChildComponent(dom, render[1], renderStr)
        this.el = dom.children[0]
        return dom.children[0]
    }
}
function getIndex(x) {
    return Number.parseInt(x.replace(/{{|}}/g, ''))
}

function createDom(render) {
    let index = 0
    const html = render[0].reduce((str, curr, i)=>{
        let flag = false
        const target = render[1][i - 1]
        if(getType(target) == 'object' && target instanceof Component){
            flag = true
        }
        if (getType(target) == 'array' && getType(target[0]) == 'object' && target[0] instanceof Component) {
            flag = true
        }
        if (flag) {
            str += `{{${i-1}}}${curr}`
        } else {
            str += `${target}${curr}`
        }
        i ++
        return str
    })

    const div = document.createElement('div')
    div.innerHTML = html
    return [div, html]
}

function insertChildComponent(dom, childs, renderStr) {
    const regs = /{{(\d+?)}}/g
    const reg = /^({{)\d+?(}})$/
    const variable = renderStr.match(regs)
    const dict = new Map()

    if (variable) {
        variable.forEach(x=>{
            const index = getIndex(x)
            dict.set(index, childs[index])
        })
        // 遍历所有 dom 找到 {{number}} 然后 替换
        dom.querySelectorAll('*').forEach(d=>{
            if(!reg.test(d.innerHTML)) return
            const index = getIndex(d.innerHTML)
            let doms = []
            if (getType(childs[index]) == 'array') {
                for (const component of childs[index]) {
                    doms.push(component)
                }
            } else if (childs[index] instanceof Component) {
                doms.push(childs[index])
            }
            d.innerHTML = ''
            doms.forEach(x=>{
                mount(d, x)
            })
        })
    }
}