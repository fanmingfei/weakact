import {Weakact, Component} from '../lib/index'

export default class List extends Component {
    constructor(props) {
        super(props)
        this.state = {
            content: props.item.content,
            status: props.item.status
        }
    }
    render() {
        return Weakact.render`
            <li onClick="${()=>this.props.changeStatus()}" style="color: ${this.state.status ? 'red' : 'black'}">${this.state.content} </li>
        `
    }
}