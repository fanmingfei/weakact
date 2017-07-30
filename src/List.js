import {Weakact, Component} from '../lib/index'

export default class List extends Component {
    constructor(props) {
        super(props)
        this.state = {
            content: props.content,
            status: props.status
        }
    }
    complete() {
        this.setState({
            status: !this.state.status
        })
    }
    render() {
        return Weakact.render`
            <li onClick="this.complete" style="color: ${this.state.status ? 'red' : 'black'}">${this.state.content} </li>
        `
    }
}