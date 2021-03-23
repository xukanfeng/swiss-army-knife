function request({
  url,
  method = "post",
  data,
  headers = {},
  onProgress = e => e,
  requestList
}) {
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = onProgress;
    xhr.open(method, url);
    Object.keys(headers).forEach(key =>
      xhr.setRequestHeader(key, headers[key])
    );
    xhr.send(data);
    xhr.onload = e => {
      if (requestList) {
        const xhrIndex = requestList.findIndex(item => item === xhr);
        requestList.splice(xhrIndex, 1);
      }
      resolve({
        data: e.target.response
      });
    };
    requestList && requestList.push(xhr);
  });
}

/**
 * fetch 支持 abort
 */
const controller = new AbortController()
const signal = controller.signal

// 5s 后返回响应
fetch('https://slowmo.glitch.me/5000', {
    signal
  })
  .then(r => r.json())
  .then(response => console.log(response))
  .catch(err => {
    if (err.name === 'AbortError') {
      console.log('Fetch was aborted')
    } else {
      console.log('Error', err)
    }
  })
// 2s 后中断请求，触发 'AbortError'
setTimeout(() => controller.abort(), 2000)