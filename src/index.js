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
    }

    addList(content) {
        this.setState({
            list: [...this.state.list, ...[{
                content: content,
                status:false
            }]]
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
        var value = '';
        return Weakact.render`
            <div>
                <input onchange=${(e)=>value=e.target.value} />
                <button onclick=${()=>{this.addList(value)}} >添加</button>
                <div>${list}</div>
            </div>
        `
    }
}

Weakact('#root', TodoList)

