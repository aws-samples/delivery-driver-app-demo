const express = require('express')
const router = express.Router()
// Add all routes here
router.get('/', (req, res, next) => res.status(200).send('Api works!'))
const user = require('./user/user.controller')
router.use('/user', user)
const chimeproxy = require('./chimeproxy/chimeproxy.controller')
router.use('/chimeproxy', chimeproxy)
const login = require('./login/login.controller')
router.use('/login', login)
const me = require('./me/me.controller')
router.use('/me', me)
const order = require('./order/order.controller')
router.use('/order', order)
module.exports = router