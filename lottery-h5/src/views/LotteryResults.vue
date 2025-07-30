<template>
	<div>
		<div style="color: #f90">
			<h3>剩余奖品:</h3>
			<span v-for="item in prizes" :key="item.id">
				{{ item.prizeName }}: {{ item.count }}&nbsp;&nbsp;
			</span>
		</div>
		<h2>活动抽奖结果</h2>
		<table
			border="1"
			cellpadding="8"
			cellspacing="0"
			style="margin: 10px auto; width: 90%"
		>
			<thead>
				<tr>
					<th width="50">序号</th>
					<th>结果</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(item, idx) in results" :key="item.openid">
					<td>{{ idx + 1 }}</td>
					<td class="result-td">
						<p>用户ID: {{ item.openid }}</p>
						<p>奖品: {{ item.prizeName }}</p>
						<p>时间: {{ item.time && formatDate(item.time) }}</p>
					</td>
				</tr>
			</tbody>
		</table>
		<div v-if="results.length === 0" style="text-align: center">
			暂无中奖记录
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { formatDate } from '@daysnap/utils'
import { BASE_URL } from '@/utils/constants'

const results = ref([])
const prizes = ref([])

onMounted(async () => {
	const res = await axios.get(BASE_URL + '/api/lottery-results')
	results.value = res.data
	fetchPrizes()
})
// 获取奖品列表
const fetchPrizes = async () => {
	const res = await axios.get(BASE_URL + '/api/prizes')
	if (res.data.success === false) {
		prizes.value = []
		return
	}
	prizes.value = res.data.map((p) => ({ ...p }))
}
</script>
<style scoped>
td {
	white-space: pre-line;
	font-size: 12px;
}
.result-td p {
	line-height: 20px;
}
</style>
