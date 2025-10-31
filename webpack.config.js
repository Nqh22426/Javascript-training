const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // File đầu vào
  entry: './src/index.js',
  
  // File đầu ra
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
  },
  
  // Dev server
  devServer: {
    static: './dist',
    port: 5500,
    hot: true, // tự động refresh khi code thay đổi
  },
  
  // Xử lý các loại file
  module: {
    rules: [
      {
        // Xử lý file .js và .jsx
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          }
        }
      },
      {
        // Xử lý file css
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  
  // Plugin tạo file HTML tự động
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      title: 'React TODO List'
    })
  ],
  
  // Không cần ghi đuôi .js khi import
  resolve: {
    extensions: ['.js', '.jsx']
  }
};