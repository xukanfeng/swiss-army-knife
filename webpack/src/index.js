import _ from 'lodash';
import printMe from './print.js'
import './styles.css'

function component(){
  var element = document.createElement('div');

  element.innerHTML = _.join(['hello', 'webpack'], ' ');
  
  var btn = document.createElement('button');
  btn.innerHTML = 'Click me and check the console';
  btn.onclick = printMe;

  element.appendChild(btn);

  return element;
}

var element = component(); // 当 print.js 改变导致页面重新渲染时，重新获取渲染的元素
document.body.appendChild(element);

if(module.hot) {
  module.hot.accept('./print.js', function() {
    console.log("Accepting the updated printMe module");
    
    document.body.removeChild(element);
    element = component();
    document.body.appendChild(element);
  })
}