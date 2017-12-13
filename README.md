## resize pic

#### example

```
document.querySelector('input').addEventListener('change', e => {
  new RePic(e.target.files, {
    name: e.target.name,
    minSize: 1,
    maxWidth: 1000,
    mass: 0.7,
    fullback(formData) {
      console.log(You can submit this)
    }
  })
}, false)
```

or

```
document.querySelector('input').addEventListener('change', async e => {
  const getFormData = new Promise((resolve, reject) => {
    new RePic(e.target.files, {
      name: e.target.name,
      minSize: 1,
      maxWidth: 1000,
      mass: 0.7,
      fullback(formData) {
        resolve(formData)
      }
    })
  })

  const data = await getFormData
}, false)
```
