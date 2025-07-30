const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = 3000

app.use(cors())
app.use(bodyParser.json())

// 奖品列表及库存
const PRIZES_FILE = path.join(__dirname, 'prizes.json')
const USERS_FILE = path.join(__dirname, 'users.json')

// 初始化奖品数据
const defaultPrizes = [
	{
		id: 1,
		prizeName: '植物盲袋',
		count: 350,
		prizeImg: '/assets/1.jpg',
	},
	{
		id: 2,
		prizeName: '猫抓挠挠',
		count: 200,
		prizeImg: '/assets/2.jpg',
	},
	{
		id: 3,
		prizeName: '旅行挎包',
		count: 40,
		prizeImg: '/assets/3.jpg',
	},
	{
		id: 4,
		prizeName: '多功能小风扇',
		count: 60,
		prizeImg: '/assets/4.jpg',
	},
	{
		id: 5,
		prizeName: '旅行洗漱包',
		count: 80,
		prizeImg: '/assets/5.jpg',
	},
]
// const defaultPrizes = [
// 	{
// 		id: 1,
// 		prizeName: '植物盲袋',
// 		count: 5,
// 		prizeImg: '/assets/1.jpg',
// 	},
// 	{
// 		id: 2,
// 		prizeName: '猫抓挠挠',
// 		count: 5,
// 		prizeImg: '/assets/2.jpg',
// 	},
// 	{
// 		id: 3,
// 		prizeName: '旅行挎包',
// 		count: 5,
// 		prizeImg: '/assets/3.jpg',
// 	},
// 	{
// 		id: 4,
// 		prizeName: '多功能小风扇',
// 		count: 5,
// 		prizeImg: '/assets/4.jpg',
// 	},
// 	{
// 		id: 5,
// 		prizeName: '旅行洗漱包',
// 		count: 5,
// 		prizeImg: '/assets/5.jpg',
// 	},
// ]

function readJSON(file, defaultValue) {
	try {
		return JSON.parse(fs.readFileSync(file, 'utf-8'))
	} catch {
		return defaultValue
	}
}

function writeJSON(file, data) {
	fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

// 初始化文件
if (!fs.existsSync(PRIZES_FILE)) writeJSON(PRIZES_FILE, defaultPrizes)
if (!fs.existsSync(USERS_FILE)) writeJSON(USERS_FILE, {})

// 获取奖品列表及剩余数量
app.get('/api/prizes', (req, res) => {
	const prizes = readJSON(PRIZES_FILE, defaultPrizes)
	const allEmpty = prizes.every((p) => p.count === 0)
	if (allEmpty) {
		return res.json({ success: false, msg: '奖品已抽完' })
	}
	res.json(prizes)
})

// 抽奖接口
app.post('/api/lottery', (req, res) => {
	const { openid } = req.body
	if (!openid) return res.status(400).json({ error: '缺少openid' })

	const users = readJSON(USERS_FILE, {})
	if (users[openid]) {
		// 已抽奖
		return res.json({
			success: false,
			msg: '您已抽过奖',
			prize: users[openid],
		})
	}

	let prizes = readJSON(PRIZES_FILE, defaultPrizes)
	// 过滤掉已抽完的奖品
	const available = prizes.filter((p) => p.count > 0)
	if (available.length === 0) {
		return res.json({ success: false, msg: '奖品已抽完' })
	}

	// 按剩余数量加权抽奖
	const total = available.reduce((sum, p) => sum + p.count, 0)
	let rand = Math.floor(Math.random() * total)
	let selected
	for (let prize of available) {
		if (rand < prize.count) {
			selected = prize
			break
		}
		rand -= prize.count
	}

	// 更新库存
	prizes = prizes.map((p) =>
		p.id === selected.id ? { ...p, count: p.count - 1 } : p
	)
	writeJSON(PRIZES_FILE, prizes)

	// 记录用户
	users[openid] = { ...selected, time: Date.now() }
	writeJSON(USERS_FILE, users)

	res.json({ success: true, prize: selected })
})

// 新增：检查用户是否抽过奖
app.post('/api/check', (req, res) => {
	const { openid } = req.body
	if (!openid) return res.status(400).json({ error: '缺少openid' })
	const users = readJSON(USERS_FILE, {})
	if (users[openid]) {
		return res.json({ drawn: true, prize: users[openid] })
	} else {
		return res.json({ drawn: false })
	}
})

app.get('/api/lottery-results', (req, res) => {
	const users = readJSON(USERS_FILE, {})
	// 只返回已中奖的用户
	const results = Object.entries(users).map(([openid, prize]) => ({
		openid,
		...prize,
	}))
	res.json(results)
})

app.listen(PORT, '0.0.0.0', () => {
	console.log(`Lottery server running at http://0.0.0.0:${PORT}`)
})
