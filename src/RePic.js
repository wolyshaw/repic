class Repic {
  constructor(files = [], {fullback, formData, minSize, filelist, mass, name, maxWidth}) {
    this.index = 0
    this.files = files
    this.name = name
    this.all = files.length || 0
    this.mass = mass || 0.7
    this.minSize = minSize || 4
    this.maxWidth = maxWidth || 1000
    this.formData = formData || new FormData()
    this.filelist = filelist || []
    this.fullback = fullback || function() {}
    this.init()
  }

  isTooBig(num) {
    return num / 1024 / 1024 > this.minSize
  }

  createImg(result, loadend) {
    let img = new Image()
    img.src = result
    img.complete ? loadend(img) : img.onload = (img) => loadend(img)
    return img.type ? img.target : img
  }

  casToFile(cas) {
    return cas.toBlob(blob => {
      if(this.isTooBig(blob.size) && /jpeg|jpg/.test(blob.type)) {
        let reader = new FileReader()
        reader.onloadend = res => this.hand(res.target.result, blob.type)
        reader.readAsBinaryString(blob)
      } else {
        this.formData.append(this.name, blob)
        this.filelist.push(blob)
        this.index ++
        if(this.index === this.all) {
          this.fullback(this.formData)
        }
      }
    })
  }

  writeCanvasContnent(img, type) {
    let cas = document.createElement('canvas'),
      ctx = cas.getContext('2d'),
      wid = img.width > this.maxWidth ? this.maxWidth : img.width,
      hid = img.width > this.maxWidth ? (img.width - (img.width - wid)) / img.width * img.height : img.height

    cas.width = wid
    cas.height = hid
    ctx.drawImage(img, 0, 0, wid, hid)
    return cas
  }

  hand(result, type) {
    let img = this.createImg(result, () => this.reduce(type, this.writeCanvasContnent(img, type)))
  }

  reduce(type, cas) {
    let img = this.createImg(cas.toDataURL(type, this.mass), () => this.casToFile(cas))
  }

  init() {
    Array.from(this.files).filter(file => /image/.test(file.type)).map(image => {
      if(!this.isTooBig(image.size)) {
        this.formData.append(this.name, image)
        this.filelist.push(image)
        this.index ++
        if(this.index === this.all) {
          this.fullback(this.formData)
        }
      } else {
        let reader = new FileReader()
        reader.onloadend = res => this.hand(res.target.result, image.type)
        reader.readAsDataURL(image)
      }
    })
  }
}
