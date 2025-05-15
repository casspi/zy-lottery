import "./assets/main.css";
import { createApp } from "vue";
import App from "./App.vue";
import NutBig from "@nutui/nutui-bingo";
import "@nutui/nutui-bingo/dist/style.css";
import "vant/lib/index.css";
import router from "@/router";

const app = createApp(App);
app.use(NutBig);
app.use(router);
app.mount("#app");
// import { getWeixinAuthUrl } from "./utils/wx-auth";
// const appid = "你的公众号appid";
// const redirectUri = window.location.origin + window.location.pathname; // 当前页面
// let openid = localStorage.getItem("openid1");
// const urlParams = new URLSearchParams(window.location.search);
// const code = urlParams.get("code");

// if (!openid) {
//   if (!code) {
//     // 跳转微信授权
//     window.location.href = getWeixinAuthUrl(appid, redirectUri);
//   } else {
//     // 用 code 换 openid
//     axios.get(`/api/getOpenid?code=${code}`).then((res) => {
//       openid = res.data.openid;
//       localStorage.setItem("openid", openid);
//       // 建议去掉URL中的code参数
//       window.location.replace(redirectUri);
//     });
//   }
// }
