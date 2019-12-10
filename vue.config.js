const IS_PROD_MODE = process.env.NODE_ENV === 'production';
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const os = require('os');
const path = require('path');

const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;

const resolve = dir => path.join(__dirname, dir);

module.exports = {
  publicPath: '', // 部署应用包时的基本 URL

  outputDir: './dist', // 生成的生产环境构建文件的目录

  assetsDir: 'static', // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录

  indexPath: 'index.html', // 指定生成的 index.html 的输出路径 (相对于 outputDir)

  filenameHashing: true, // 静态资源在它们的文件名中包含 hash

  pages: undefined, // multi-page 模式

  lintOnSave: IS_PROD_MODE ? false : 'error', // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码

  devServer: { // 开发服务器配置
    overlay: { // 让浏览器 overlay 同时显示警告和错误
      warnings: true,
      errors: true,
    },
    open: true,
    proxy: {
      '/plateno_mall': {
        target: 'http://dev-malls.bestwehotel.com/', // 接口地址代理跨域
        changeOrigin: true,
      },
    },
  },

  runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本

  transpileDependencies: [], // Array<string | RegExp> 通过 Babel 显式转译的依赖

  productionSourceMap: false,

  crossorigin: undefined, // html-webpack-plugin 在构建时注入的<link rel="stylesheet">

  // 和 <script> 标签的 crossorigin 属性
  integrity: false, // html-webpack-plugin 在构建时注入的<link rel="stylesheet">

  // 和 <script> 标签启用SRI

  // 配合 webpack > 简单的配置方式 https://cli.vuejs.org/zh/guide/webpack.html#%E7%AE%80%E5%8D%95%E7%9A%84%E9%85%8D%E7%BD%AE%E6%96%B9%E5%BC%8F
  configureWebpack: (config) => {
    const plugins = [];
    if (IS_PROD_MODE) {
      plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: productionGzipExtensions,
          threshold: 10240,
          minRatio: 0.8,
        }),
      );
    }
    // 配置 externals 引入 cdn 资源
    config.externals = {
      vue: 'Vue',
      axios: 'axios',
      'vue-router': 'VueRouter',
    };
    config.plugins = [...config.plugins, ...plugins];
  },

  // 配合 webpack > 链式操作 https://cli.vuejs.org/zh/guide/webpack.html#%E9%93%BE%E5%BC%8F%E6%93%8D%E4%BD%9C-%E9%AB%98%E7%BA%A7
  chainWebpack: (config) => {
    // 添加别名
    config.resolve.alias
      .set('vue$', 'vue/dist/vue.esm.js')
      .set('@', resolve('src'))
      .set('@assets', resolve('src/assets'))
      .set('@components', resolve('src/components'))
      .set('@plugins', resolve('src/plugins'))
      .set('@views', resolve('src/views'))
      .set('@router', resolve('src/router'))
      .set('@action', resolve('src/action'))
      .set('@utils', resolve('src/utils'))
      .set('@api', resolve('src/api'))
      .set('@config', resolve('src/utils/config'))
      .set('@commoncss', resolve('src/assets/less/common.less'))
      .set('@static', resolve('src/static'));

    // 打包分析
    if (IS_PROD_MODE) {
      config.plugin('webpack-report').use(BundleAnalyzerPlugin, [
        {
          analyzerMode: 'static',
        },
      ]);
    }

    // 配置 externals 引入 cdn 资源
    const cdn = {
      js: [
        '//unpkg.com/vue@2.6.10/dist/vue.min.js', // 访问https://unpkg.com/vue/dist/vue.min.js获取最新版本
        '//unpkg.com/axios@0.19.0/dist/axios.min.js',
        '//unpkg.com/vue-router@3.1.3/dist/vue-router.min.js',
      ],
    };

    // 如果使用多页面打包，使用vue inspect --plugins查看html是否在结果数组中
    config.plugin('html').tap((args) => {
      // html中添加cdn
      args[0].cdn = cdn;
      return args;
    });
  },

  css: {
    requireModuleExtension: true, // js import 时将所有的 *.(css|scss|sass|less|styl(us)?) 文件
    // 视为 CSS Modules 模块
    extract: IS_PROD_MODE, // 将组件中的 CSS 提取至一个独立的 CSS 文件中
    sourceMap: !IS_PROD_MODE,
    loaderOptions: {
      less: {
        // 向全局sass样式传入共享的全局变量, $src可以配置图片cdn前缀
        // 详情: https://cli.vuejs.org/guide/css.html#passing-options-to-pre-processor-loaders
        // prependData: `
        // @import "@scss/variables.scss";
        // @import "@scss/mixins.scss";
        // @import "@scss/function.scss";
        // $src: "${process.env.VUE_APP_OSS_SRC}";
        // `
        modifyVars: {
          // 通过 less 文件覆盖（文件路径为绝对路径）
          hack: `true; @import "${resolve('src/assets/less/hack/theme-color.less')}";`,
        },
      },
    },
  },
  parallel: os.cpus().length > 1,
};
