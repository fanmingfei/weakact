import {mount} from '../utils'
function Weakact (id, Component) {
    mount(document.querySelector(id), new Component)
}
Weakact.render = function(strArr, ...objs) {
    return [strArr, objs];
}
export default Weakact;