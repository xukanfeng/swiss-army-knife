{
  const vnode = {
    tag: '',
    attr: '',
    children: []
  }

  function render(vnode, container) {
    container.appendChild(createNode(vnode))
  }

  function createNode(vnode) {
    if (typeof vnode === 'string') {
      return document.createTextNode(vnode)
    }
    const dom = document.createElement(vnode.tag)
    if (vnode.attr) {
      Object.entries(vnode.attr).forEach(entry => {
        dom.setAttribute(entry[0], entry[1])
      })
    }
    vnode.children.forEach(child => render(child, dom))
    return dom
  }
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