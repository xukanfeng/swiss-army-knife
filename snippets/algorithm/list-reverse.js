{
  class Node {
    constructor(val) {
      this.val = val
      this.next = null
    }
  }
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  console.log(nums)
  const head = nums.reverse()
    .map(num => new Node(num))
    .reduce((prev, cur) => {
      cur.next = prev
      return cur
    })

  function print(head) {
    const nums = []
    while (head) {
      nums.push(head.val)
      head = head.next
    }
    console.log(nums)
  }

  function reverse(head) {
    if (!head.next) return head
    const last = reverse(head.next)
    head.next.next = head
    head.next = null
    return last
  }
  // print(reverse(head))

  let successor = null

  function reverseN(head, n) {
    if (n === 1 || !head.next) {
      successor = head.next
      return head
    }
    const last = reverseN(head.next, n - 1)
    head.next.next = head
    head.next = successor
    return last
  }
  // print(reverseN(head, 4))

  function reverseMN(head, m, n) {
    if (m === 1) return reverseN(head, n)

    head.next = reverseMN(head.next, m - 1, n - 1)

    return head
  }
  // print(reverseMN(head, 3, 6))

  function reverseMN_iteration(head, m, n) {
    if (m === 1) return reverseN(head, n)

    let p = head,
      q = null
    while (m > 1) {
      q = p
      p = p.next
      m--
      n--
    }
    q.next = reverseN(p, n)

    return head
  }
  // print(reverseMN_iteration(head, 3, 6))


  function reverseKGroup_iteration(head, k) {
    let p = head
    let n = 1
    while (p) {
      if (n % k === 1) {
        head = reverseMN(head, n, n - 1 + k)
      }
      p = p.next
      n++
    }
    return head
  }
  // print(reverseKGroup_iteration(head, 3))
}