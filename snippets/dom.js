/**
 * 查找子节点的公共父节点，可以包括节点自身
 */
function commonParentNode(oNode1, oNode2) {
    if (oNode1.contains(oNode2)) {
        return oNode1
    } else {
        return commonParentNode(oNode1.parentNode, oNode2)
    }
}

/**
 * 返回 dom tree 的高度
 */
function getHeight(tree) {
  if (!tree) return 0

  let height = 0
  for (let child of tree.children) {
    height = Math.max(height, getHeight(child))
  }
  return height + 1
}

/**
 * 返回 dom tree 包含的元素标签名
 */
function getTags(tree) {
  const set = new Set()
  const queue = [tree]

  while (queue.length) {
    const el = queue.shift()
    set.add(el.tagName.toLowerCase())
    queue.push(...el.children)
  }
  return [...set]
}

/**
 * 返回 dom tree 指定元素右边的元素
 */
function nextRightSibling(root, target) {
  const queue = [root]
  while(queue.length) {
    const el = queue.shift()
    if (el === target) {
      return queue.length ? queue.shift() : null
    }
    queue.push(...el.children)
  }
  return null
}