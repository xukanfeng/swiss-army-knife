import axios from 'axios'

export const ApiService = {
  get(resource, slug = '') {
    return axios.get(`/${resource}/${slug}`)
      .then(res => {
        return res.data
      })
      .catch(err => {
        throw new Error(`ApiService ${err}`)
      })
  },

  query(resource, params) {
    // 拼接在url: '/user?ID=12345'
    // 或者以键值对的形式放入 params 对象中: { params: { ID: 12345 } }
    return axios.get(`/${resource}`, params)
      .then(res => {
        return res.data
      })
      .catch(err => {
        throw new Error(`ApiService ${err}`)
      })
  },

  post(resource, params) {
    return axios.post(`/${resource}`, params)
  },

  update(resource, slug, params) {
    return axios.put(`/${resource}/${slug}`, params)
  },

  put(resource, params) {
    return axios.put(`/${resource}`, params)
  },

  delete(resource) {
    return axios.delete(`/${resource}`)
      .then(res => {
        console.log(res)
      })
      .catch(err => {
      throw new Error(`ApiService ${err}`)
    });
  }
}

export const TodoListService = {
  get(slug) {
    return ApiService.get('api/todolist', slug)
  },
  update(slug, params) {
    return ApiService.update('api/todolist', slug, params)
  },
}

export const UserService = {
  post(params) {
    return ApiService.post('signin', params)
  },
}

export const PuzzleCardsService = {
  get(slug) {
    return ApiService.get('api/puzzles', slug)
  },
  query(params) {
    return ApiService.query('api/puzzles', { params: {name: params.currentUser.name} })
  },
  post(params) {
    return ApiService.post('api/puzzles', params)
  },
}