// nuxt.js
const express = require('express')
const app = express()
const { Nuxt } = require('nuxt')
const path = require('path')
const  cookieParser = require('cookie-parser')
app.use('/_nuxt', express.static(path.join(__dirname, '.nuxt', 'dist')))
const config = require('./nuxt.config.js')
const nuxt = new Nuxt(config)
app.use(cookieParser())
app.use(async (req, res) => {
   //console.dir(req)
   await nuxt.ready()
   nuxt.render(req, res)
})

module.exports = app