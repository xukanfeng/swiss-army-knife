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