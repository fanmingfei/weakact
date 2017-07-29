import {mount} from '../utils'
export default function Weakact (id, Component) {
    mount(document.querySelector(id), new Component)
}