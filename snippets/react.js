const { func } = require("prop-types")

{
  const vnode = {
    tag: '',
    attr: '',
    children: []
  }

  function render(vnode) {
    if (typeof vnode === 'string') {
      return document.createTextNode(vnode)
    }
    const dom = document.createElement(vnode.tag)
    if (vnode.attr) {
      Object.entries(vnode.attr).forEach(entry => {
        dom.setAttribute(entry[0], entry[1])
      })
    }
    vnode.children.forEach(child => dom.appendChild(render(child)))
    return dom
  }

  class vNode {
    constructor(tag, attr, children) {
      this.tag = tag
      this.attr = attr
      this.children = children
    }
    render() {
      return render(this)
    }
  }

  function el(tag, attr, children) {
    return new vNode(tag, attr, children)
  }

  const ul = el('ul', {id: 'list'}, [
    el('li', {class: 'item'}, ['Item 1']),
    el('li', {class: 'item'}, ['Item 2']),
    el('li', {class: 'item'}, ['Item 3'])
  ])
  const ulRoot = ul.render();
  document.body.appendChild(ulRoot);

  /*
  <ul id='list'>
    <li class='item'>Item 1</li>
    <li class='item'>Item 2</li>
    <li class='item'>Item 3</li>
  </ul>
  */
}

{
  // 每个组件维护一个 _state 和 index
  let _state = [];
  let index = 0;
  // 在源码里，useState 是 useReducer 的语法糖
  function useState(initialValue) { // 需要考虑初始值是 function 的情况
    let currentIndex = index; //引入中间变量currentIndex就是为了保存当前操作的下标index。
    _state[currentIndex] = _state[currentIndex] === undefined ? initialValue : _state[currentIndex];
    const setState = (newValue) => {
      _state[currentIndex] = newValue;
      render();
    };
    index += 1; // 每次更新完state值后，index值+1
    return [_state[currentIndex], setState];
  }


  let _deps;

  function useEffect(callback, dependencies) {
    const hasChanged = _deps ?
      (dependencies ? !dependencies.every((el, i) => el === _deps[i]) : true) // dependencies 不存在，表示没有依赖
      :
      true; // _deps 不存在，表示第一次
    // 如果 dependencies 不存在，或者 dependencies 有变化，就执行 callback
    if (!dependencies || hasChanged) {
      callback();
      _deps = dependencies;
    }
  }
}

function virtualize(element) {
  const obj = {
    type: element.tagName.toLowerCase(),
    props: {}
  }
  for (let attr of element.attributes) {
    const name = attr.name === 'class' ? 'className' : attr.name
    obj.props[name] = attr.value
  }
  const children = []
  for (let node of element.childNodes) {
    if (node.nodeType === 3) {
      children.push(node.textContent)
    } else {
      children.push(virtualize(node))
    }
  }
  obj.props.children = children.length === 1 ? children[0] : children
  return obj
}
function render(obj) {
  if (typeof obj === 'string') return document.createTextNode(obj)
  const { type, props: { children, ...attrs } } = obj
  const element = document.createElement(type)
  for (let [name, value] of Object.entries(attrs)) {
    element.setAttribute(name === 'className' ? 'class' : name, value)
  }
  const childrenArr = Array.isArray(children) ? children : [children]
  for (let child of childrenArr) {
    element.append(render(child))
  }
  return element
}