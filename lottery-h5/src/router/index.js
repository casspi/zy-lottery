import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import LotteryResults from '@/views/LotteryResults.vue'

const routes = [
	{ path: '/', component: Home },
	{ path: '/results', component: LotteryResults },
]

export default createRouter({
	history: createWebHashHistory(import.meta.env.BASE_URL),
	routes,
})
