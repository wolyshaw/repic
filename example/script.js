const setTpl = (`
  <div class="info">
    <span>{{%sizeinfo}}</span>
    <span>{{%width}}</span>
    <span>{{%height}}</span>
  </div>
`)

const setImagesList = function(files, wraper) {
  wraper.innerHTML = ''
  Array.from(files).map(file => {
    let reader = new FileReader()
    reader.onloadend = res => {
      this.createImg(res.target.result, img => {
        let targetImg = img.type ? img.target : img
        let info = document.createElement('div')
        info.innerHTML = (
          setTpl
            .replace('{{%sizeinfo}}', (file.size / 1024 / 1024).toFixed(2) + 'MB')
            .replace('{{%width}}', targetImg.width + 'px')
            .replace('{{%height}}', targetImg.height + 'px')
        )
        wraper.appendChild(targetImg)
        wraper.appendChild(info)
      })
    }
    reader.readAsDataURL(file)
  })
}

document.querySelector('input').addEventListener('change', async e => {
  const getFormData = new Promise((resolve, reject) => {
    var pic = new Repic(e.target.files, {
      name: e.target.name,
      minSize: 0.5,
      maxWidth: Math.floor(document.querySelector('.maxwidth-input').value),
      mass: Math.floor(document.querySelector('.range-input').value),
      fullback(formData) {
        resolve(formData)
        setImagesList.call(this, e.target.files, document.querySelector('.pic-wraper .select'))
        setImagesList.call(this, this.filelist, document.querySelector('.pic-wraper .hanld'))
      }
    })
  })

  const data = await getFormData

}, false)
