module.exports = {
  //parser: 'sugarss',
  plugins: {
    'postcss-import': {},
    'autoprefixer': {
      remove: false,
      browsers: ['ie >=9', '> 1% in CN'],
    },
    'cssnano': {}
  }
}
