/**
 * 模板字符串替换
 */
function render(template, context) {
  // 注意 ?
  return template.replace(/{{(.*?)}}/g, (match, key) => context[key.trim()])
}
console.log(render('{{ name }} is a genius, she is {{age}} years old.', {
  name: 'Alice',
  age: 18
}))