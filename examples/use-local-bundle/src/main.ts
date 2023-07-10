/**
 * copy generated bundles into other directories and import it directly
 * 把生成的产物直接拷贝到项目并使用
*/
// if use import syntax（如果使用的是import语法）
import './lib/index.js'

// or if use require（如果使用的是require）——AMD/Commonjs
// require('./lib/index.umd.js')

/**
 * or left the local component directory as-is, vite will resolve the package.json
 * in the directory and find the proper entry for you automatically
 * 或者保持本地的component目录不动，vite会解析目录下的package.json并自动找到合适的入口文件
 */
// if use import syntax（如果使用的是import语法）
// import '../../component'

// or if use require（如果使用的是require）——AMD/Commonjs
// require('../../component')
