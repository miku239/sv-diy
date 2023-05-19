import {
	addType,
	deleteAll,
	deleteByid,
	getAll,
	openSqlite,
	tableInitCheck
} from '../../public/database/sqlite.js'

export default {
	data() {
		return {
			items: ['卡面', '效果'], // 分段器内容
			showRight: false, // 抽屉状态
			screenWidth: 750,
			title: 'Hello',
			drawStatic: {
				baseInfo: "/static/output/output-baseInfo-n.png",
				beforeEvolve: "/static/output/output-before-evolve.png",
				afterEvolve: "/static/output/output-after-evolve.png",
				spell: "/static/output/output-spell.png",
				amulet: "/static/output/output-amulet.png"
			},
			card: {
				x: 0,
				y: 0,
				scale: 1,
				old: {
					x: 0,
					y: 0,
					scale: 1
				}
			},
			formats: {},
			formatsEvo: {},
			info: {
				name: "佩可莉姆(高达形态)",
				cost: "4",
				attack: "3",
				hp: "6",
				attackEvo: "5",
				hpEvo: "8",
				row: { //进化前，原描述
					ops: [{
						insert: "\n"
					}]
				},
				after: {
					ops: [{
						"insert": "能力与进化前相同（"
					}, {
						"attributes": {
							"bold": true,
							"color": "#d4ae3d",
							"underline": true
						},
						"insert": "入场曲"
					}, {
						"insert": "除外）。\n"
					}]
				}

			},
			setting: {
				nameFontSize: 34,
				nameLeftMargin: 0,
				descFontSize: 24,
				defaultLineNumner: 7, //默认8+2行内容，以此为基础调节字体大小
				outputType: false, // false 简洁模式，只输出卡面；true详细模式，输出卡面和描述
				fontName: 'DFWeiBeiW7-GB',
				manaFontName: 'Garamond',
				bold: 'bold',
				showDiyMark: true,
				author: ''
				//markText:`※此卡牌为${this.setting.author}自定义卡牌。`

			},
			imgPath: "/static/peko.png",
			// borderPath: "/static/border-legendary.png",
			baseBorderPath: "/static/",
			//分段器当前选中
			current: 0,
			// Boolean
			bool: false,
			// 稀有度
			rare: 'bronze',
			// 卡牌类型
			cardType: 'follower',
			class: 'neutral',
			type: '全部',
			typeSecond: '无',
			// 下拉菜单默认值
			// value: 0,
			// 稀有度可选值
			rareRange: [{
					value: "bronze",
					text: "铜"
				},
				{
					value: "silver",
					text: "银"
				},
				{
					value: "gold",
					text: "金"
				},
				{
					value: "legendary",
					text: "虹"
				},
			],
			// 卡牌类型可选值
			cardTypeRange: [{
					value: "follower",
					text: "随从"
				},
				{
					value: "spell",
					text: "法术"
				},
				{
					value: "amulet",
					text: "护符"
				},
			],
			// 卡牌职业可选值
			classRange: [{
					value: "neutral",
					text: "中立"
				},
				{
					value: "forestcraft",
					text: "精灵"
				},
				{
					value: "swordcraft",
					text: "皇家护卫"
				},
				{
					value: "runecraft",
					text: "巫师"
				},
				{
					value: "dragoncraft",
					text: "龙族"
				},
				{
					value: "shadowcraft",
					text: "唤灵师"
				},
				{
					value: "bloodcraft",
					text: "吸血鬼"
				},
				{
					value: "havencraft",
					text: "主教"
				},
				{
					value: "portalcraft",
					text: "复仇者"
				},
			],
			// 兵种可选值
			tableName: "type_range",
			typeRange: [{
					value: "无",
					text: "无",
					buildIn: 1
				},
				{
					value: "指挥官",
					text: "指挥官",
					buildIn: 1
				},
				{
					value: "士兵",
					text: "士兵",
					buildIn: 1
				},
				{
					value: "土之印",
					text: "土之印",
					buildIn: 1
				},
				{
					value: "马纳历亚",
					text: "马纳历亚",
					buildIn: 1
				},
				{
					value: "创造物",
					text: "创造物",
					buildIn: 1
				},
				{
					value: "财宝",
					text: "财宝",
					buildIn: 1
				},
				{
					value: "机械",
					text: "机械",
					buildIn: 1
				},
				{
					value: "雷维翁",
					text: "雷维翁",
					buildIn: 1
				},
				{
					value: "自然",
					text: "自然",
					buildIn: 1
				},
				{
					value: "宴乐",
					text: "宴乐",
					buildIn: 1
				},
				{
					value: "英雄",
					text: "英雄",
					buildIn: 1
				},
				{
					value: "武装",
					text: "武装",
					buildIn: 1
				},
				{
					value: "西洋棋",
					text: "西洋棋",
					buildIn: 1
				},
				{
					value: "八狱",
					text: "八狱",
					buildIn: 1
				},
				{
					value: "学园",
					text: "学园",
					buildIn: 1
				},
				{
					value: "全部",
					text: "全部",
					buildIn: 1
				}
			],
		}
	},

	onReady: function() {
		//获取屏幕信息
		var that = this
		uni.getSystemInfo({
			success: function(res) {
				that.screenWidth = res.screenWidth
				that.card.scale = 1 / 1.5
				that.card.old.scale = that.card.scale
			},
			error: function(e) {
				console.log(e)
			}
		});
	},
	onShow() {
		try {
			openSqlite().then(res => {
				tableInitCheck(this.tableName).then(() => {
					getAll(this.tableName).then(rows => {
						if (rows.length == 0) {
							for (var i = 0; i < this.typeRange.length; i++) {
								addType(this.typeRange[i])
							}
						} else {
							this.typeRange = []
							for (var i = 0; i < rows.length; i++) {
								this.typeRange.push({
									"id": rows[i].id,
									"text": rows[i].name,
									"value": rows[i].value,
									"buildIn": rows[i].build_in
								})
							}
						}
					})
				})
			})
		} catch (e) {
			console.log("发生异常:" + e)
		}
	},
	onLoad: function() {},
	computed: {
		// 计算卡牌框完整路径
		borderPath() {
			return this.baseBorderPath + this.cardType + '/' + this.rare + '.png';
		},
		classPath() {
			return this.baseBorderPath + 'class' + '/' + this.class + '.png';
		},
		backgroundPath() {
			return this.baseBorderPath + 'background' + '/' + this.class + '.png';
		}

	},
	methods: {
		//初始化富文本编辑器
		onEditorReady() {
			uni.createSelectorQuery().select('#editor').context((res) => {
				this.editorCtx = res.context
			}).exec()
		},
		onEditorReadyEvo() {
			uni.createSelectorQuery().select('#editorEvo').context((res) => {
				this.editorEvoCtx = res.context
			}).exec()
		},
		//获取编辑器输入的内容
		getContent() {
			// let results = this.convertDelta(this.)
		},
		navigateToData() {
			uni.navigateTo({
				url: '/pages/data/data'
			})
		},
		amplifyFontSize() {
			let size = this.setting.nameFontSize + 2
			this.setting.nameFontSize = size
		},
		reduceFontSize() {
			if (this.setting.nameFontSize < 3) {
				return
			}
			let sizeR = this.setting.nameFontSize - 2
			this.setting.nameFontSize = sizeR;
		},
		moveNameLeft() {
			let padding = this.setting.nameLeftMargin - 6
			this.setting.nameLeftMargin = padding
		},
		moveNameRight() {
			let padding = this.setting.nameLeftMargin + 6
			this.setting.nameLeftMargin = padding
		},
		setKeyWord(e) {
			let status = e.detail.value
			this.editorCtx.format('bold', '')
			this.editorCtx.format('color', '#d4ae3d')
			this.editorCtx.format('underline', '')
		},
		setKeyWordEvo() {
			this.editorEvoCtx.format('bold', '')
			this.editorEvoCtx.format('color', '#d4ae3d')
			this.editorEvoCtx.format('underline', '')
		},
		onKeyWordChange(e) {
			let formats = e.detail
			this.formats = formats
		},
		onKeyWordChangeEvo(e) {
			let formatsEvo = e.detail
			this.formatsEvo = formatsEvo
		},
		insertDivider() {
			//todo 在插入之后判断是否为空白行（清除空白行）
			this.editorCtx.insertDivider()
			this.editorEvoCtx.insertDivider()
		},
		getEditorContent(e) { //获取编辑器内容，当前页面都能获取到
			
			this.info.row = e.detail.delta
		},
		getEditorContentEvo(e) { //获取编辑器内容，当前页面都能获取到
			
			this.info.after = e.detail.delta
		},
		changeRare(e) {
		},
		changeCardType(e) {
		},
		// 打开窗口
		showDrawer(e) {
			this.$refs[e].open()
		},
		// 关闭窗口
		closeDrawer(e) {
			this.$refs[e].close()
		},
		// 抽屉状态发生变化触发
		change(e, type) {
			this[type] = e
		},
		className(classValue) {
			return (this.classRange.find((item, index) => {
				return item.value === classValue
			})).text
		},
		// 分段器状态变化
		onClickItem(e) {
			if (this.current !== e.currentIndex) {
				this.current = e.currentIndex
			}
		},

		tap: function(e) {
			this.card.x = this.card.old.x
			this.card.y = this.card.old.y
			this.$nextTick(function() {
				this.card.x = 30
				this.card.y = 30
			})
		},
		onChange: function(e) {
			this.card.old.x = e.detail.x
			this.card.old.y = e.detail.y

		},
		onScale: function(e) {
			this.card.old.scale = e.detail.scale
		},
		changeImg: function(e) {
			let that = this
			uni.chooseImage({
				count: 1, //默认9
				crop: {
					height: 757,
					width: 615
				},
				sizeType: ['original', 'compressed'], //原图,压缩图
				sourceType: ['album'], //从相册选择
				success: function(res) {
					that.imgPath = res.tempFiles[0].path
					that.card.scale = 1 / 1.5
					that.card.old.scale = that.card.scale
				}
			});
		},
		drawBasic() {
			var ctx = uni.createCanvasContext('cardOutput');
			ctx.width = "536"
			//绘制底图
			let imgStart_x = Math.abs(this.card.old.x) * 750 / this.screenWidth / this.card.old.scale
			let imgStart_y = Math.abs(this.card.old.y) * 750 / this.screenWidth / this.card.old.scale
			let imgStart_width = 410 / this.card.old.scale
			let imgStart_height = 505 / this.card.old.scale
			let img_x = (536 - 410) / 2
			let img_y = (130)

			ctx.drawImage(this.imgPath, imgStart_x, imgStart_y, imgStart_width, imgStart_height, img_x, img_y, 410,
				505);
			ctx.drawImage(this.classPath, 0, 0, 536, 698);
			ctx.drawImage(this.borderPath, 0, 0, 536, 698);

			//绘制卡牌名称
			let name_length = this.getStrLength(this.info.name)
			let font_size = this.setting.nameFontSize + 'px'
			// ctx.font = "normal bolder 35px sans-serif"
			ctx.font = "normal bolder " + font_size + " " + this.setting.fontName
			ctx.fillStyle = "white"
			ctx.setTextAlign("center")
			ctx.setTextBaseline("center")
			ctx.fillText(this.info.name, 536 / 2 + this.setting.nameLeftMargin / 2, 108)
			//border 无法识别，以此取消掉加粗效果
			ctx.font = "normal bold 104px " + this.setting.manaFontName
			ctx.shadowOffsetX = 0; //用来设定阴影在 X轴的延伸距
			ctx.shadowOffsetY = 0; //用来设定阴影在 Y轴的延伸距
			ctx.shadowBlur = 10; //设定阴影的模糊程度 默认0
			ctx.shadowColor = "rgba(49, 95, 29, 0.9)"; //设定阴影颜色效果	
			ctx.fillText(this.info.cost, 59, 128)
			ctx.font = "normal bolder 85px " + this.setting.manaFontName
			ctx.shadowOffsetX = 0; //用来设定阴影在 X轴的延伸距
			ctx.shadowOffsetY = 3 / 750 * this.screenWidth; //用来设定阴影在 Y轴的延伸距
			ctx.shadowBlur = 2; //设定阴影的模糊程度 默认0
			ctx.shadowColor = "rgba(0, 0, 0, 0.9)"; //设定阴影颜色效果
			ctx.font = "normal bolder 85px " + this.setting.manaFontName
			if (this.cardType == "follower") {
				ctx.fillText(this.info.attack, 66, 649)
				ctx.fillText(this.info.hp, 470, 649)
			}

			ctx.restore();
			if (this.setting.outputType == false) {
				ctx.draw(false, () => { //清空并画图
					this.saveCanvasToAlbum()
				})
				return
			}
		},
		drawDetail() {
			var ctx = uni.createCanvasContext('cardOutput');

			//职业背景
			ctx.drawImage(this.backgroundPath, 0, 0, 1212, 698)
			ctx.rect(0, 0, 1212, 698);
			// 半透明 背景填充颜色
			ctx.globalAlpha = 0.85;
			ctx.setFillStyle('black');
			// // 绘制已填色的矩形
			ctx.fillRect(0, 0, 1212, 698);
			ctx.globalAlpha = 1;
			let scale_p = 0.9
			let margin_left = 30
			let margin_top = 35
			//绘制底图
			let imgStart_x = Math.abs(this.card.old.x) * 750 / this.screenWidth / this.card.old.scale
			let imgStart_y = Math.abs(this.card.old.y) * 750 / this.screenWidth / this.card.old.scale
			let imgStart_width = 410 / this.card.old.scale
			let imgStart_height = 505 / this.card.old.scale
			let img_x = (536 - 410) / 2
			let img_y = (130)

			ctx.drawImage(this.imgPath, imgStart_x, imgStart_y, imgStart_width, imgStart_height, img_x * scale_p +
				margin_left, img_y * scale_p + margin_top, 410 * scale_p,
				505 * scale_p);
			ctx.drawImage(this.classPath, 0 + margin_left, 0 + margin_top, 536 * scale_p, 698 * scale_p);
			ctx.drawImage(this.borderPath, 0 + margin_left, 0 + margin_top, 536 * scale_p, 698 * scale_p);


			//绘制卡牌名称
			let name_length = this.getStrLength(this.info.name)
			let font_size = Math.ceil(this.setting.nameFontSize * scale_p) + 'px'
			// ctx.font = "normal bolder 35px sans-serif"
			ctx.font = "normal bolder " + font_size + " " + this.setting.fontName
			ctx.fillStyle = "white"
			ctx.setTextAlign("center")
			ctx.setTextBaseline("center")
			ctx.fillText(this.info.name, (536 / 2 + this.setting.nameLeftMargin / 2) * scale_p + margin_left, 108 *
				scale_p + margin_top)
			//border 无法识别，以此取消掉加粗效果
			ctx.font = "normal bold " + Math.ceil(104 * scale_p) + "px " + this.setting.manaFontName
			ctx.shadowOffsetX = 0; //用来设定阴影在 X轴的延伸距
			ctx.shadowOffsetY = 0; //用来设定阴影在 Y轴的延伸距
			ctx.shadowBlur = 10; //设定阴影的模糊程度 默认0
			ctx.shadowColor = "rgba(49, 95, 29, 0.9)"; //设定阴影颜色效果

			ctx.fillText(this.info.cost, 59 * scale_p + margin_left, 128 * scale_p + margin_top)
			ctx.font = "normal bolder 85px " + this.setting.manaFontName
			ctx.shadowOffsetX = 0; //用来设定阴影在 X轴的延伸距
			ctx.shadowOffsetY = 3 / 750 * this.screenWidth; //用来设定阴影在 Y轴的延伸距
			ctx.shadowBlur = 2; //设定阴影的模糊程度 默认0
			ctx.shadowColor = "rgba(0, 0, 0, 0.9)"; //设定阴影颜色效果
			ctx.font = "normal bolder " + Math.ceil(84 * scale_p) + "px " + this.setting.manaFontName
			if (this.cardType == "follower") {
				ctx.fillText(this.info.attack, 66 * scale_p + margin_left, 649 * scale_p + margin_top)
				ctx.fillText(this.info.hp, 470 * scale_p + margin_left, 649 * scale_p + margin_top)
			}

			ctx.shadowBlur = 0;
			ctx.shadowOffsetX = 0; //用来设定阴影在 X轴的延伸距
			ctx.shadowOffsetY = 0; //用来设定阴影在 Y轴的延伸距
			ctx.restore();
			if (this.setting.outputType == false) {
				ctx.draw(false, () => { //清空并画图
					this.saveCanvasToAlbum()
				})
				return
			}

			//绘制diy标记：
			if (this.setting.showDiyMark) {
				ctx.font = "normal bolder 17px " + this.setting.fontName
				ctx.fillStyle = "#E7E8D7"
				ctx.setTextAlign("right")
				ctx.setTextBaseline("center")
				let markText = `※此卡牌为玩家${this.setting.author}自定义卡牌。`
				ctx.fillText(markText, 1190, 40)

			}

			//('图片路径',canvas的横坐标，canvas的纵坐标，图片的宽度，图片的宽度)
			//绘制基本信息
			//基本信息表格
			ctx.drawImage(this.drawStatic.baseInfo, 0, 0, 1212, 698)
			ctx.font = "normal bolder 28px " + this.setting.fontName
			ctx.fillStyle = "#E7E8D7"
			ctx.setTextAlign("left")
			ctx.fillText(this.info.name, 605, 100)
			ctx.font = "normal bolder 26px " + this.setting.fontName
			ctx.fillText(this.className(this.class), 625, 161)
			ctx.setTextAlign("center")
			let typeOfCard = this.type
			if (this.typeSecond !== '无') {
				typeOfCard += '•' + this.typeSecond
			}
			ctx.fillText(typeOfCard, 1020, 161)

			//计算字体大小
			let lineNumb = this.autoFontsize()
			console.log()
			//画底色
			let descContentHeight = (lineNumb + 1) * (this.setting.descFontSize * 1.45) + 35 + 300 - 227
			descContentHeight = descContentHeight < 300 ? 300 : descContentHeight
			// 半透明 背景填充颜色
			ctx.globalAlpha = 0.8;
			ctx.setFillStyle('black');
			// // 绘制已填色的矩形
			// ctx.fillRect(538, 200,619, descContentHeight);
			ctx.globalAlpha = 1;
			//进化前信息
			ctx.fillStyle = "#E7E8D7"
			ctx.font = "normal bolder 38px " + this.setting.manaFontName
			ctx.setTextAlign("left")
			if (this.cardType == "follower") {
				ctx.drawImage(this.drawStatic.beforeEvolve, 551, 227) //图案
				ctx.fillText(this.info.attack, 1017, 255) //attack
				ctx.fillText(this.info.hp, 1100, 255) //hp
			} else if (this.cardType == "spell") {
				ctx.drawImage(this.drawStatic.spell, 551, 227) //图案
			} else if (this.cardType == "amulet") {
				ctx.drawImage(this.drawStatic.amulet, 551, 227) //图案
			}


			let that = this
			ctx.draw(false, () => { //清空并画图

				let descEnd = this.drawEvolveDesc(this.info.row, 300)
				if (this.cardType == "follower") {
					//进化后
					ctx.font = "normal bolder 38px " + this.setting.manaFontName
					ctx.drawImage(this.drawStatic.afterEvolve, 551, descEnd + 35) //图案
					ctx.fillStyle = "#E7E8D7"
					ctx.fillText(this.info.attackEvo, 1017, descEnd + 35 + (255 - 227)) //attack
					ctx.fillText(this.info.hpEvo, 1100, descEnd + 35 + (255 - 227)) //hp
					ctx.draw(true, () => {})
					let descAfter = this.drawEvolveDesc(this.info.after, descEnd + 35 + (300 - 227))
					descEnd = descAfter
				}
				//画说明的外边框
				let minHeight = 300
				descEnd = descEnd - 200 < minHeight ? minHeight + 200 : descEnd
				//外淡边框
				ctx.lineWidth = 1.5
				ctx.strokeStyle = "#636460"
				ctx.strokeRect(538, 200, 619, (descEnd - 200))
				// ctx.stroke()
				ctx.lineWidth = 2
				ctx.strokeStyle = "#93948e"
				ctx.strokeRect(544, 206, 619 - 12, (descEnd - 200) - 12)
				// this.saveCanvasToAlbum()
				ctx.draw(true, () => { //清空并画图
					// that.saveCanvasToAlbum()
				})
				uni.showLoading({
					title: "正在生成..."
				})
				setTimeout(() => {
					that.saveCanvasToAlbum()
					uni.hideLoading()
				}, 2000)
			})
		},
		drawViewToCanvas: function() {

			if (this.setting.outputType == false) {
				this.drawBasic()
			} else {
				this.drawDetail()
			}
		},
		autoFontsize() {
			var ctx = uni.createCanvasContext('cardOutput');
			ctx.font = "normal bolder " + this.setting.descFontSize + "px " + this.setting.fontName
			let baseLength = 570
			let lines = 0
			let baseLines = this.setting.defaultLineNumner
			//基础描述
			let desc = this.convertDelta(this.info.row)
			let descRow = this.contentWrap(ctx, desc, baseLength)
			descRow.forEach((item) => {
				if (item.newLine) {
					lines += 1
				}
			})
			//进化后描述
			if (this.cardType == "follower") {
				desc = this.convertDelta(this.info.after)
				descRow = this.contentWrap(ctx, desc, baseLength)
				descRow.forEach((item) => {
					if (item.newLine) {
						lines += 1
					}
				})
			} else {
				baseLines += 2
			}
			// console.log("lines:",lines)
			//计算字体大小
			lines = lines === 0 ? 1 : lines
			let result = 24 * baseLines / lines
			result = result > 24 ? 24 : result;
			result = result < 14 ? 14 : result;
			// console.log("result:",result)
			this.setting.descFontSize = result.toFixed(0)
			return lines
		},
		drawEvolveDesc(rowDelta, baseY) {
			var ctx = uni.createCanvasContext('cardOutput');
			ctx.font = "normal bolder " + this.setting.descFontSize + "px " + this.setting.fontName
			ctx.setTextAlign("left")
			ctx.shadowOffsetX = 0; //用来设定阴影在 X轴的延伸距
			ctx.shadowOffsetY = 0; //用来设定阴影在 Y轴的延伸距
			// console.log(rowDelta)
			let baseX = 563
			// let baseY = 300
			let baseHeight = this.setting.descFontSize * 1.45 //行高
			let baseLength = 570
			let currentY = baseY
			let currentX = baseX
			let lineNumb = 0
			let desc = this.convertDelta(rowDelta)
			desc = this.contentWrap(ctx, desc, baseLength)
			if (desc == undefined || desc.length == 0) {
				return
			}
			desc.forEach((item, index) => {
				
				if (item.content == undefined) {
					item.content = ""
				}
				if (item.newLine) {

					//换行
					currentX = baseX
					currentY += baseHeight
					lineNumb += 1

				} else {
					if (item.isDivider) {
						ctx.fillStyle = "#E7E8D7"
						//todo 画一条分割线
					} else {
						if (item.isKeyWord) {
							ctx.fillStyle = "#d4ae3d"
							// console.log(item.content, currentX, currentY)
							ctx.fillText(item.content, currentX, currentY)
							let itemWidth = ctx.measureText(item.content).width
							//画下划线
							ctx.lineWidth = 2
							ctx.strokeStyle = "#d4ae3d"; //直线的颜色状态设置
							ctx.moveTo(currentX, currentY + 2)
							ctx.lineTo(currentX + itemWidth, currentY + 2)
							ctx.stroke()
							currentX += itemWidth
						} else {
							ctx.fillStyle = "#E7E8D7"
							ctx.fillText(item.content, currentX, currentY)
							// console.log(item.content, currentX, currentY)
							currentX += ctx.measureText(item.content).width
						}
					}
				}
			})
			ctx.draw(true, () => {
				// that.saveCanvasToAlbum()
			})
			this.drawGrid(ctx, lineNumb, baseX, baseY, baseLength, baseHeight)
			return currentY
		},
		drawGrid(ctx, lineNumb, baseX, baseY, baseLength, lineHeight) {
			//网格
			ctx.lineWidth = 1.5
			ctx.strokeStyle = "#7f807b"; //直线的颜色状态设置
			let currentY = baseY
			let baseOffset = this.setting.descFontSize * 0.5
			//最后一行空行不画网格线
			for (var i = 0; i < lineNumb; i++) {
				ctx.moveTo(baseX, currentY + baseOffset)
				ctx.lineTo(baseX + baseLength, currentY + baseOffset)
				// console.log("draw grid",baseX,currentY)
				ctx.stroke()
				currentY += lineHeight
			}
			ctx.draw(true, () => {
				// that.saveCanvasToAlbum()
			})

		},
		saveCanvasToAlbum: function() {
			let that = this
			let width = 1212
			if (this.setting.outputType == false) {
				width = 536
			}
			uni.canvasToTempFilePath({
				canvasId: 'cardOutput',
				destWidth: width,
				success: (res) => {
					// that.saveImageToPhotosAlbum(res.tempFilePath) //保存到相册
					uni.previewImage({
						current: res.tempFilePath,
						urls: [res.tempFilePath],
						longPressActions: {
							itemList: ['保存图片'],
							success: function(data) {
								// console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
								that.saveImageToPhotosAlbum(res.tempFilePath)
							},
							fail: function(err) {
								console.log(err.errMsg);
							}
						}
					});
				}
			})
		},
		saveImageToPhotosAlbum: function(imgUrl) {
			uni.hideLoading();
			if (imgUrl) {
				uni.saveImageToPhotosAlbum({
					filePath: imgUrl,
					success: (res) => {
						uni.showToast({
							title: '保存成功',
							icon: 'success',
							duration: 2000
						})
					},
					fail: (err) => {
						uni.showToast({
							title: '保存失败',
							icon: 'none',
							duration: 2000
						})
					}
				})
			} else {
				uni.showToast({
					title: '出错了',
					icon: 'loading',
					duration: 3000
				})
			}
		},
		getStrLength: function(str) {
			let chars = str.split('')
			return chars.length
		},
		selectChange() {
			this.flag = true;
		},

		outputTypeChange(e) {
			this.setting.outputType = e.detail.value
		},
		diyMarkChange(e) {
			this.setting.showDiyMark = e.detail.value
		},
		contentWrap(ctx, contents, lineLength) {
			let results = []
			let leftLength = lineLength
			contents.forEach((item, index) => {
				//换行和分割线
				if (item.isDivider || item.newLine) {
					leftLength = lineLength
					results.push(item)
				} else {
					let content = item.content
					let itemLength = ctx.measureText(item.content).width
					while (itemLength > leftLength) {
						//尽可能取长
						// console.log("截取中")
						// sleep()
						let cttChars = content.split('')
						let tmpChars = []
						let totalLength = 0
						for (var i = 0; i < cttChars.length; i++) {
							let charWidth = ctx.measureText(cttChars[i]).width
							if ((charWidth + totalLength) < leftLength) {
								totalLength += charWidth
								tmpChars.push(cttChars[i])

							} else {
								//本行内容及下一行
								results.push({
									newLine: false,
									isDivider: false,
									isKeyWord: item.isKeyWord,
									content: tmpChars.join('')
								})
								results.push({
									newLine: true,
									isDivider: false,
									content: ""
								})
								cttChars = cttChars.slice(i)
								content = cttChars.join('')
								leftLength = lineLength
								itemLength = ctx.measureText(content).width
								break
							}
						}

					}
					leftLength -= itemLength
					results.push({
						newLine: false,
						isDivider: false,
						isKeyWord: item.isKeyWord,
						content: content
					})
				}


			})
			return results
		},
		convertDelta(rowDelta) {
			let newLineReg = /\n/
			let delta = rowDelta
			let results = []
			delta.ops.forEach((item, index) => {
				let form = {}
				form.newLine = false
				//是否为分隔符
				if (item.insert.divider != undefined) {
					form.isDivider = true
					results.push(form)
					results.push({
						newLine: true
					})
				} else {
					form.isDivider = false
					form.isKeyWord = item.attributes != undefined ? true : false
					//是否到达行末
					if (newLineReg.test(item.insert)) {
						let contents = item.insert.split(newLineReg)

						for (var i = 0; i < contents.length - 1; i++) {
							if (contents[i] != '') {
								results.push({
									newLine: false,
									isDivider: false,
									isKeyWord: form.isKeyWord,
									content: contents[i]
								})
							}
							results.push({
								newLine: true
							})
						}
						form.content = contents[contents.length - 1]
						if (form.content != '') {
							results.push(form)
						}

					} else {
						form.content = item.insert
						results.push(form)
					}

				}
			})
			return results
		},
	},

	onNavigationBarButtonTap(e) {
		if (this.showLeft) {
			this.$refs.showLeft.close()
		} else {
			this.$refs.showLeft.open()
		}
	},
	// app端拦截返回事件 ，仅app端生效
	onBackPress() {
		if (this.showRight || this.showLeft) {
			this.$refs.showLeft.close()
			this.$refs.showRight.close()
			return true
		}
	}
}