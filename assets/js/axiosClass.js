import axios from 'axios'
// import qs from 'qs'
import cookie from './cookie'
import config from '../../config/api.config'
import { aesEncrypy } from './aes.js'
// import VueX from 'vuex'
import Alert from '../../components/bx-ui/alert/index'
// import Vue from 'vue'
axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8'
class AxiosClass {
  constructor(url, isInternal = true) {
    this.service = axios.create({ baseURL: url })
    this.isInternal = isInternal
    this.intercept()
    this.error()
    return this.service
  }
  intercept() {
    // 拦截器
    this.service.interceptors.request.use(config => {
      // post方法并且数据不是formData，序列化参数
      // if (config.method === 'post' && config.headers['Content-Type'] !== 'multipart/form-data') {
      //   config.data = qs.stringify(config.data)
      // }
      // let c_host
      // try {
      //   c_host = cookie.getCookie('host')
      //   if (c_host) {
      //     config.baseURL = 'https://' + c_host + '/v1/'
      //   }
      // } catch (err) {}
      let timestamp = new Date().valueOf()
      let nonce = timestamp + '000'
      config.headers.common['TMEX-Ver'] = '1.0'
      config.headers.common['TMEX-Dev'] = 'web'
      config.headers.common['TMEX-Ts'] = nonce
      config.headers.common['Content-Type'] = 'application/json'
      // config.headers.common['Access-Control-Max-Age'] = '60'
      try {
        let ssid = cookie.getCookie('ssid')
        let uid = cookie.getCookie('uid')
        let locale = cookie.getCookie('lang')
        let token = cookie.getCookie('token')
        let version = cookie.getCookie('version')
        let options = cookie.getCookie('options')
        if (version && options) {
          config.headers.common['TMEX-Ver'] = version
          config.headers.common['TMEX-Dev'] = options
        }
        if (!locale || ~locale.indexOf('en')) {
          locale = 'en'
        }
        // console.log(config.url, new Date())
        // console.log(document.cookie, 33, token)
        if (token) {
          token = aesEncrypy(token, nonce)
          config.headers.common['TMEX-Sign'] = token
        }
        if (ssid) {
          config.headers.common['TMEX-Ssid'] = ssid
        }
        if (uid) {
          config.headers.common['TMEX-Uid'] = uid
        }
        config.headers.common['TMEX-Language'] = locale
      } catch (err) {}
      // if (~config.url.indexOf('?')) {
      //   config.url = config.url + '&t=' + Date.now()
      // } else {
      //   config.url = config.url + '?t=' + Date.now()
      // }
      return config
    }, error => {
      return Promise.reject(error)
    })
  }
  error() {
    this.service.interceptors.response.use(res => {
      let token = res.headers['TMEX-token']
      // let ssid = res.headers['TMEX-ssid']
      let uid = res.headers['TMEX-uid']
      if (token) {
        cookie.setCookie('token', token, 1, '/', config.domain)
      }
      // if (ssid) {
      //   cookie.setCookie('ssid', ssid, 1, '/', config.domain)
      // }
      if (uid) {
        cookie.setCookie('uid', uid, 1, '/', config.domain)
      }
      if (this.isInternal) {
        if (parseInt(res.status) === 204) { return res }
        if (parseInt(res.status) !== 200) return Promise.reject(res)
      /*
       * 状态码0判断，成功返回，失败则根据error.status判断是请求成功还是请求失败
       * error.status为true，则表示请求成功，此时根据后台返回状态码编写回调逻辑
       * error.status不存在，则表示请求失败（网络原因、请求状态不为200等原因）
       */
        if (res.data.errno === 'OK') return res.data
        if (process.client && !~['FORBIDDEN', 'ACCESS_TOO_OFTEN', 'TEAM_MAX_MEMBER_LIMIT', 'ONE_OF_TEAM_MEMBER', 'TEAM_NOT_FOUND', 'TEAM_USER_NOT_FOUND'].indexOf(res.data.errno)) {
          Alert(res.data.message)
        } else {
          console.log(res.data.message)
        }
        return Promise.reject(res.data)
      } else {
        if (parseInt(res.status) !== 200) return Promise.reject(res)
        return res.data
      }
    }, error => {
      return Promise.reject(error)
    })
  }
}

export default AxiosClass
