import Mock from 'mockjs'

export default {
  'get /api/todolist': () => {
    return {
      'status': 200,
      'data': Mock.mock({
        'todolist|10': [{
          'id|+1': 0,
          'desc': '@sentence(3, 5)',
          'done|1': true,
          'stared|1': true,
          'create-time': '@date',
        }],
      }),
    }
  },
  'put /api/todolist': params => {
    return {
      status: 200,
      data: params,
    }
  }
}

