import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import NutBig from '@nutui/nutui-bingo'
import '@nutui/nutui-bingo/dist/style.css'
import 'vant/lib/index.css'
import router from '@/router'

const app = createApp(App)
app.use(NutBig)
app.use(router)
app.mount('#app')
// 微信中如何禁止分享给好友和朋友圈
document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
	WeixinJSBridge.call('hideOptionMenu')
})
// import { getWeixinAuthUrl } from './utils/wx-auth'
// const appid = 'wx7485ecfd7cfe6a62'
// const redirectUri = window.location.origin + window.location.pathname // 当前页面
// let openid = localStorage.getItem('openid')
// const urlParams = new URLSearchParams(window.location.search)
// const code = urlParams.get('code')

// if (!openid) {
// 	if (!code) {
// 		// 跳转微信授权
// 		window.location.href = getWeixinAuthUrl(appid, redirectUri)
// 	} else {
// 		// 用 code 换 openid
// 		axios.get(`/api/getOpenid?code=${code}`).then((res) => {
// 			openid = res.data.openid
// 			localStorage.setItem('openid', openid)
// 			// 建议去掉URL中的code参数
// 			window.location.replace(redirectUri)
// 		})
// 	}
// }
