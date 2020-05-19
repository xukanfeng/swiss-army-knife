import mockjs from 'mockjs';

const random_jokes = [{
    setup: 'number?',
    punchline: '123',
  },
  {
    setup: 'charactor?',
    punchline: 'abc',
  },
  {
    setup: 'hello?',
    punchline: 'world',
  },
]

export default {
  'GET /dev/random_joke': function (req, res) {
    const responseObj = random_jokes[Math.floor(Math.random() * random_jokes.length)]
    setTimeout(() => {
      res.json(responseObj)
      // res.status(500) // 模拟出错
    }, Math.floor(Math.random() * 3))
  },
}

