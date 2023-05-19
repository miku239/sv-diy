<template>
	<view>
<!-- 		<button @click="testSql">获取数据</button>
		<button @click="clear">清空数据</button> -->
		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog mode="input" message="添加兵种" :duration="0" :before-close="true" 
			title="添加兵种"  @close="closeAdd" @confirm="confirmAdd"></uni-popup-dialog>
		</uni-popup>
		<uni-popup ref="deleteDialog" type="dialog">
			<uni-popup-dialog  mode="base" :message="'是否删除兵种:'+currentItem.text" :duration="0"
			:title="'是否删除兵种:'+currentItem.text"  @close="closeDel" @confirm="confirmDel">
			</uni-popup-dialog>
			
			<!-- <uni-popup-dialog mode="input" message="添加兵种" :duration="0" :before-close="true" 
			title="添加兵种"  @close="closeDel" @confirm="confirmDel"></uni-popup-dialog> -->
		</uni-popup>
		<uni-collapse accordion class="data-collapse">
			<uni-collapse-item title="我的兵种">
				<view class="data-item" @click="openDialog()" style="justify-content: center;" >
					<button > <uni-icons type="plusempty" size="18" plain="true" /></button>
				</view>
				<view :class="item.buildIn==1?'data-item build-in':'data-item'" v-for="(item,index) in typeRange">
					<span :class="item.buildIn==1?'build-in':' '" >{{item.text}}</span>
					<button v-if="item.buildIn==0" @click="deleteItem(item)"> 
						<uni-icons type="close" size="18" plain="true" />
					</button>
				</view>
			</uni-collapse-item>
			<uni-collapse-item title="我的职业">
				<view class="data-item">敬请期待</view>
			</uni-collapse-item>
		</uni-collapse>

	</view>
</template>

<script>
	import '../../public/database/sqlite.js'
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
				tableName: 'type_range',
				currentItem:{},
				typeRangeIn: [{
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
				// 兵种可选值
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
				]

			}
		},
		onReady: function() {
			//


		},
		onShow: function() {
			openSqlite().then(res => {
				tableInitCheck(this.tableName).then(() => {
					getAll(this.tableName).then(rows => {
						if (rows.length == 0) {
							for (var i = 0; i < this.typeRangeIn.length; i++) {
								addType(this.typeRangeIn[i])
							}
						} else {
							this.typeRange = []
							for (var i = 0; i < rows.length; i++) {
								this.typeRange.push({
									"id":rows[i].id,
									"text": rows[i].name,
									"value": rows[i].value,
									"buildIn": rows[i].build_in
								})
							}
						}
					})
				})
			})
		},
		methods: {
			testSql() {
				openSqlite().then(res => {
					tableInitCheck(this.tableName).then(() => {

						deleteAll(this.tableName)
						for (var i = 0; i < this.typeRangeIn.length; i++) {
							addType(this.typeRangeIn[i])
						}
						getAll(this.tableName).then(rows => {
							console.log('test-getall')
							console.log(rows)
						})
					})
				})

			},
			clear(){
				openSqlite().then(res => {
					deleteAll(this.tableName)
				})
			},
			deleteItem(item){
				this.currentItem=item
				this.$refs.deleteDialog.open()
			},
			refreshType(){
				getAll(this.tableName).then(rows =>{
					this.typeRange = []
					for (var i = 0; i < rows.length; i++) {
						this.typeRange.push({
							"id": rows[i].id,
							"text": rows[i].name,
							"value": rows[i].value,
							"buildIn": rows[i].build_in
						})
					}
				})
			},
			openDialog(){
				this.$refs.popup.open()
			},
			confirmAdd(value){
				addType({"value":value,"text":value})
				this.refreshType()
				this.$refs.popup.close()
			},
			closeAdd(){
				this.$refs.popup.close()
			},
			confirmDel(){
				deleteByid(this.currentItem.id,this.tableName)
				this.refreshType()
				this.$refs.deleteDialog.close()
			},
			closeDel(){
				this.$refs.deleteDialog.close()
			}
		}
	}
</script>

<style>
	@import 'data.css';
</style>