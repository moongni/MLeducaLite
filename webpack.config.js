module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader' /* 로더 설정 */]
      }
    ]
  }
}