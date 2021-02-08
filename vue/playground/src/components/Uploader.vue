<template>
  <div>
    <input type="file" @change="handleFileChange" />
    <button @click="handleUpload">upload</button>
  </div>
</template>

<script>
export default {
  data: () => ({
    container: {
      file: null
    }
  }),
  methods: {
    handleFileChange (e) {
      const [file] = e.target.files
      console.log(file)
      this.container.file = file
    },
    createFileChunk (file, size = 10 * 1024 * 1024) {
      const fileChunkList = []
      let cur = 0
      while (cur < file.size) {
        fileChunkList.push({ file: file.slice(cur, cur + size) })
        cur += size
      }
      return fileChunkList
    },
    calculateHash (fileChunkList) {
      return new Promise(resolve => {
        const workerScript = `
          self.onmessage = e => {
            console.log('worker received:', e)
          }`
        const workerScriptBlob = new Blob([workerScript])
        const workerScriptBlobUrl = URL.createObjectURL(workerScriptBlob)
        console.time('create')
        this.container.worker = new Worker(workerScriptBlobUrl)
        console.timeEnd('create')
        console.time('post')
        this.container.worker.postMessage({ fileChunkList })
        console.timeEnd('post')
        this.container.worker.onmessage = e => {
          console.log('worker message:', e)
          resolve(e)
        }
      })
    },
    async handleUpload () {
      const fileChunkList = this.createFileChunk(this.container.file)
      console.log(fileChunkList)
      this.calculateHash(fileChunkList)
    }
  }
}
</script>