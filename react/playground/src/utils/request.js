import { request } from 'umi'

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300 ) {
    return response
  }

  const error = new Error(response.statusText)
  error.response = response
  throw error
}

export default async function response(url, options) {
  const response = await request(url, options) 
  return response
}