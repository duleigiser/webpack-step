module.exports = {
  //parser: 'sugarss',
  plugins: {
    'postcss-import': {},
    'autoprefixer': {
      remove: false,
      browsers: ['ie >=11', '> 1% in CN'],
    },
    'cssnano': {}
  }
}
