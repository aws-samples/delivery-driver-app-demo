
module.exports = {
  mode: 'universal',
 
  /*
  ** Headers of the page
  */
 
  head: {
    title: 'Delivery Driver App Demo',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Delivery Driver App Demo' }
    ],
   
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
 modules: [
  '@nuxtjs/axios',
  '@nuxtjs/auth',
  'nuxt-buefy',
  ['nuxt-fontawesome', {
    component: 'fa',
    imports: [
      {
        set: '@fortawesome/free-solid-svg-icons',
        icons: ['faCog', 'faTruck', 'faHome', 'faCircle', 'faCheck','faTimes','faPlus','faUserPlus','faUserTimes','faCheckSquare']
      }
    ]
  }]],
  plugins: [
            "~/plugins/vue-phone-number-input",
            "~/plugins/vue-multiselect"
  ],
  srcDir:'client/',
  build: {
    extend(config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map'
      }
    },
    html: {
      minify: {
        collapseBooleanAttributes: true,
        decodeEntities: true,
        minifyCSS: false,
        minifyJS: false,
        processConditionalComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        trimCustomFragments: true,
        collapseWhitespace: true ,
        useShortDoctype: true
      }
    },
    publicPath: `/${require('./secrets.json').NODE_ENV}/_nuxt/client`,
    vendor:['axios'],
  },
  performance: {
      gzip: false
  },
  router: {
      base: `/`
  },
  axios: {
    baseURL: `${require('./secrets.json').API_PREFIX}/api`
 },
 dev:false,
  auth: {
   
    tokenRequired: true,
    tokenType: 'Bearer',
    strategies: {
      local: {
        endpoints: {
          login: { url: 'login', method: 'post', propertyName: 'data.token' },
          user: { url: 'me', method: 'get', propertyName: 'data' },
          logout: false,
        },
        
     }
    }
 }
}

