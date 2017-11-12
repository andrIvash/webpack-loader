module.exports = {
  plugins: [
    require('postcss-nested')({/* ...options */}),
    require('autoprefixer')({ "browsers": "> 5%"}),
    require('postcss-import')({/* ...options */}),
    require('postcss-simple-vars')({/* ...options */}),
    require('postcss-extend')({/* ...options */}),
    require('postcss-mixins')({/* ...options */}),
    require('postcss-custom-media')({/* ...options */}),
    
  ]
}