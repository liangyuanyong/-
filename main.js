import App from './App'
import {
  createSSRApp
} from 'vue'
// 不能修改导出的 createApp 方法名，不能修改从 Vue 中导入的 createSSRApp。
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}

//导入网络请求的包
import {
  $http
} from '@escook/request-miniprogram'

uni.$http = $http

$http.baseUrl = 'https://www.uinav.com'
//请求拦截器
$http.beforeRequest = function(options) {
  uni.showLoading({
    title: '数据加载中...'
  })
}
//响应拦截器
$http.afterRequest = function() {
  uni.hideLoading()
}

//封装弹框的方法
uni.$showMsg = function(title = "数据请求失败！", duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none'
  })
}
