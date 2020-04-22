
var jwt = require('jsonwebtoken');


export default {
  state: function() {
   return  {auth: {
      loggedIn:false,
      user:null
    }}
  },
  mutations: {
    set_user (state,user) {
      state.auth.user = user
    },
    set_loggedIn (state,isLoggedIn) {
      state.auth.loggedIn = isLoggedIn
    }
  },
  actions : {
     nuxtServerInit ({ commit }, { req }) {
        const authHeader = req.headers['authorization']
        const cookie = req.cookies
        let token = authHeader && authHeader.split(' ')[1]
        if (token == null) 
        {
          token = cookie['auth._token.local'] && cookie['auth._token.local'].split(' ')[1]
          if (token ==null)
             return
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
          console.log(err)
          if (err) 
              return 
          commit('set_user', user)
          commit('set_loggedIn',true)
        })
       
    }
  },
  getters: { 
    isAuthenticated(state) {
     return state.auth.loggedIn == true
   },
   isNotAuthenticated(state) {
    return state.auth.loggedIn == false
  },
     loggedInUser(state) {
     return  state.auth.user
   }
 }

};


