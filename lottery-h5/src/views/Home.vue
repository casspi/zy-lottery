<template>
  <div style="text-align: center; margin-top: 40px">
    <img class="logo" src="@/assets/logo.png" />
    <div style="display: flex; align-items: center; justify-content: center">
      <h2 class="title">幸运大转盘抽奖</h2>
      <button
        v-if="result"
        style="text-align: right; margin-left: 20px"
        @click="showResult = true"
      >
        查看奖品
      </button>
    </div>

    <div v-if="loading">加载奖品中...</div>
    <div v-else>
      <nutbig-turntable
        v-if="prizes.length"
        class="turntable"
        ref="bingoRef"
        :prize-list="prizes"
        width="300px"
        height="300px"
        :prize-index="prizeIndex"
        :style-opt="styleOpt"
        :pointer-style="pointerStyle"
        @start-turns="startTurns"
        @end-turns="endTurns"
        :disabled="hasDrawn || spinning"
      />
      <Empty v-else description="抱歉，奖品已抽完！" />
    </div>

    <div class="result-popup" v-if="showResult && result">
      <div class="result-popup-inner">
        <p>
          恭喜您抽中：<strong>{{ result.prizeName }}</strong>
        </p>

        <img :src="result.prizeImg" alt="" />
        <p class="tips">请截图保存，到Y15展台兑换奖品！</p>
        <p class="openid">识别码:{{ refOpenid }}</p>
        <button style="margin-top: 20px" @click="showResult = false">
          关闭
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, reactive } from "vue";
import axios from "axios";
import { sleep } from "@daysnap/utils";
import { showToast, Empty } from "vant";
import { v4 as uuidv4 } from "uuid";

const BASE_URL = "http://10.50.100.208:3000";
const prizes = ref([]);
const loading = ref(true);
const result = ref(null);
const showResult = ref(false);
const spinning = ref(false);
const hasDrawn = ref(false);
const refOpenid = ref("");

// 获取openid，优先从localStorage取，取不到再生成
// localStorage.setItem("zy_openid", "1");
let openid = localStorage.getItem("zy_openid");
if (!openid) {
  openid = uuidv4();
  localStorage.setItem("zy_openid", openid);
}

refOpenid.value = openid;

// 获取奖品列表
const fetchPrizes = async () => {
  loading.value = true;
  const res = await axios.get(BASE_URL + "/api/prizes");
  if (res.data.success === false) {
    prizes.value = [];
    loading.value = false;
    return;
  }
  prizes.value = res.data.map((p) => ({ ...p, text: p.name }));
  loading.value = false;
};

const checkUser = async () => {
  const res = await axios.post(BASE_URL + "/api/check", { openid });
  if (res.data.drawn) {
    result.value = res.data.prize;
    showResult.value = true;
    hasDrawn.value = true;
  } else {
    hasDrawn.value = false;
  }
};

onMounted(async () => {
  await fetchPrizes();
  await checkUser();
});

// 转盘指针图片样式
const pointerStyle = {
  width: "80px",
  height: "80px",
  backgroundImage: 'url("assets/zz.png")',
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
};
// 转盘样式的选项
const styleOpt = reactive({
  // 转盘中每一块扇形的背景色,根据奖品的index来取每一块的对应颜色
  prizeBgColors: [
    "rgb(255, 231, 149)",
    "rgb(255, 247, 223)",
    "rgb(255, 231, 149)",
    "rgb(255, 247, 223)",
    "rgb(255, 201, 120)",
  ],
  // 每一个扇形的外边框颜色
  borderColor: "#ff9800",
});
// 中奖的奖品的index(此数据可根据后台返回的值重新赋值)
const prizeIndex = ref(-1);

const endTurns = () => {
  console.log("中奖了");
};
// 抽奖
const startTurns = async () => {
  if (spinning.value) {
    return;
  }
  if (hasDrawn.value) {
    showToast("您已经抽过了，请点击我的奖品查看");
    return;
  }
  spinning.value = true;
  try {
    const res = await axios.post(BASE_URL + "/api/lottery", {
      openid,
    });
    const { success, prize, msg } = res.data;
    if (success) {
      bingoRef.value.rotateTurn();
      await sleep(2000);
      // 找到中奖项在prizes中的index
      const idx = prizes.value.findIndex((p) => p.id === prize.id);
      prizeIndex.value = idx;
      result.value = prize;
      showResult.value = true;
      hasDrawn.value = true;
      fetchPrizes();
    } else {
      result.value = prize || { name: res.data.msg };
      showResult.value = true;
    }
  } finally {
    spinning.value = false;
  }
};

const bingoRef = ref();
</script>
<style scoped>
.logo {
  width: 200px;
  margin-bottom: 10px;
}
.title {
  color: #205299;
}
.result {
  display: flex;
  flex-direction: column;
}
.prizes-over {
  margin-top: 30px;
  color: red;
}
.result-popup {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.result-popup-inner {
  background: #fff;
  padding: 10px 30px;
  border-radius: 10px;
  min-width: 200px;
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.result-popup-inner img {
  width: 100px;
  object-fit: contain;
}
strong {
  font-weight: 500;
  color: #f90;
  font-size: 16px;
}
.tips {
  color: red;
  font-weight: 500;
}
.openid {
  color: #666;
  font-size: 12px;
}
</style>
