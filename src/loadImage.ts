export default (url: string, crossOrigin: any) => {
    const image = new Image()

    if (crossOrigin) image.crossOrigin = crossOrigin
  
    return new Promise((resolve, reject) => {
      const loaded = (event: any) => {
        unbindEvents(image)
        resolve(event.target)
      }
  
      const errored = (error: any) => {
        unbindEvents(image)
        reject(error)
      }
  
      image.onload = loaded
      image.onerror = errored
      image.onabort = errored
  
      image.src = url
    })
  }
  
  function unbindEvents(image: any) {
    image.onload = null
    image.onerror = null
    image.onabort = null
  }