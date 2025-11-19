// server.js
// Minimal upload server for dev only.
// Usage: node server.js
const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const app = express()
const PORT = process.env.UPLOAD_PORT || 5174 // beda port dari Vite (5173)

const publicImagesDir = path.join(__dirname, 'public', 'images')

// ensure folder exists
if (!fs.existsSync(publicImagesDir)) fs.mkdirSync(publicImagesDir, { recursive: true })

// multer storage: save to public/images with original filename prefixed by timestamp
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, publicImagesDir)
  },
  filename: function (req, file, cb) {
    // sanitize filename a little
    const ext = path.extname(file.originalname)
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-_\.]/g, '')
    const name = `${Date.now()}-${base}${ext}`
    cb(null, name)
  }
})
const upload = multer({ storage })

// allow CORS from dev server (vite)
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

// endpoint
app.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ ok: false, message: 'No file' })
  // return URL relative to dev server root (served by vite from /public)
  const urlPath = `/images/${req.file.filename}`
  return res.json({ ok: true, url: urlPath, filename: req.file.filename })
})

// static serve public for quick preview (optional)
app.use('/images', express.static(publicImagesDir))

app.listen(PORT, () => {
  console.log(`Upload server running on http://localhost:${PORT}`)
  console.log(`Uploaded files saved to ${publicImagesDir}`)
})
