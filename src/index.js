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
            this.setState({
                list: [{
                    content: '实现一个简易版的 React 类似的东西 2333',
                    status: true
                },{
                    content: '明天要去欢乐谷 饿死我了 3点了',
                    status: false
                },{
                    content: '两秒后自动添加这一条',
                    status: false
                }]
            })
        },2000)
    }

    render () {
        const list = this.state.list.map(x=>new List(x))
        return Weakact.render`
            <div>${list}</div>
        `
    }
}

Weakact('#root', TodoList)

