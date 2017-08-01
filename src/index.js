import {Weakact, Component} from '../lib/index'
import List from './List'

class TodoList extends Component {
    constructor (props) {
        super(props)
        this.state = {
            list: [{
                content: '实现一个简易版的 React 类似的东西 2333',
                status: true
            },{
                content: '明天要去欢乐谷 饿死我了 3点了',
                status: false
            }]
        }
        setTimeout(()=> {
            this.addList({
                content: '两秒后自动添加这一条',
                status: false
            })
        },2000)
    }

    addList(obj) {
        this.setState({
            list: [...this.state.list, ...[obj]]
        })
    }

    render () {
        const list = this.state.list.map((x,i)=>new List({
            changeStatus: ()=>{
                const list = [...this.state.list]
                list[i].status = !list[i].status
                this.setState({list})
            },
            item: x
        }))
        return Weakact.render`
            <div>${list}</div>
        `
    }
}

Weakact('#root', TodoList)

