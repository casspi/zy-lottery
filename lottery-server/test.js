// 并发请求抽奖接口，测试多人抽奖和奖品数据
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const BASE_URL = "http://localhost:3000";
const userCount = 20; // 模拟20个用户

async function testLottery() {
  // 生成不同的openid
  const openids = Array.from({ length: userCount }, () => uuidv4());

  // 并发请求抽奖接口
  const requests = openids.map((openid) =>
    axios
      .post(`${BASE_URL}/api/lottery`, { openid })
      .then((res) => ({ openid, result: res.data }))
      .catch((err) => ({ openid, error: err.message }))
  );

  const results = await Promise.all(requests);
  console.log("=== 抽奖结果 ===");
  results.forEach((r, idx) => {
    if (r.error) {
      console.log(`用户${idx + 1} openid=${r.openid} 报错: ${r.error}`);
    } else {
      console.log(`用户${idx + 1} openid=${r.openid} 结果:`, r.result);
    }
  });

  // 查询奖品库存
  const prizeRes = await axios.get(`${BASE_URL}/api/prizes`);
  console.log("\n=== 剩余奖品 ===");
  console.log(prizeRes.data);
}

testLottery();
