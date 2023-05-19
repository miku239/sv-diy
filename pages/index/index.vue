<template>
	<view class="content ">

		<!-- 基本信息抽屉 -->
		<view class="baseinfo-button">
			<!-- <button type="primary" size="mini" @click="showDrawer('showRight')"><text class="word-btn-white">基本信息</text>
			</button> -->
			<view class="button-groups-top">
				<button size="mini" @click="navigateToData">

					<uni-icons type="link" size="18" />
				</button>
				<button @click="showDrawer('showRight')" size="mini">
					<uni-icons type="tune" size="18" />

				</button>

			</view>

			<!-- 抽屉内部 -->
			<uni-drawer ref="showRight" mode="right" :width="320" @change="change($event,'showRight')">
				<view class="scroll-view">
					<scroll-view class="scroll-view-box" scroll-y="true">
						<view class="close">
							<!-- 关闭按钮（也可点击抽屉外部进行关闭） -->
							<button @click="closeDrawer('showRight')" size="mini"
								style="background-color: transparent;border: 0;"><text
									class="word-btn-white">返回</text></button>
						</view>
						<!-- 基本信息设定 -->
						<uni-forms>
							<uni-forms-item label="选择卡牌类型" label-width="105px" labelAlign="right"
								style="margin-right: 3%;">
								<uni-data-select v-model="cardType" :localdata="cardTypeRange" @change="changeCardType"
									:clear="bool" style="border: 1px solid #bbbdbf;border-radius: 5px;" />
							</uni-forms-item>
							<uni-forms-item label="选择稀有度" label-width="105px" labelAlign="right"
								style="margin-right: 3%;">
								<uni-data-select v-model="rare" :localdata="rareRange" @change="changeRare"
									:clear="bool" style="border: 1px solid #bbbdbf;border-radius: 5px;" />
							</uni-forms-item>
							<uni-forms-item label="选择职业" label-width="105px" labelAlign="right"
								style="margin-right: 3%;">
								<uni-data-select v-model="class" :localdata="classRange" @change="changeRare"
									:clear="bool" style="border: 1px solid #bbbdbf;border-radius: 5px;" />
							</uni-forms-item>
							<uni-forms-item label="选择兵种" label-width="105px" labelAlign="right"
								style="margin-right: 3%;">
								<uni-data-select v-model="type" :localdata="typeRange" @change="changeRare"
									:clear="bool" style="border: 1px solid #bbbdbf;border-radius: 5px;" />
							</uni-forms-item>
							<uni-forms-item label="第二兵种" label-width="105px" labelAlign="right"
								style="margin-right: 3%;">
								<uni-data-select v-model="typeSecond" :localdata="typeRange" @change="changeRare"
									:clear="bool" style="border: 1px solid #bbbdbf;border-radius: 5px;" />
							</uni-forms-item>
							<view style="margin-left: 73rpx;font-size: 18rpx;margin-top: -30rpx;">
								*第二兵种为'无'时将只显示第一兵种。
							</view>
						</uni-forms>
						<view style="padding: 15rpx;position: absolute;bottom: 10rpx;font-size: 20rpx;">

							*联系邮箱：dearmosy@outlook.com
							<br />
							*QQ交流群：312196058<br />
							版本更新，欢迎问题反馈、提出建议等。
						</view>
					</scroll-view>

				</view>
			</uni-drawer>
		</view>
		<view class="uni-padding-wrap uni-common-mt">
			<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" styleType="text"
				activeColor="#007aff" />
		</view>
		<view class="content">
			<view v-show="current === 0">
				<view class="top">

				</view>
				<view class="card">
					<movable-area class="card-image-content">
						<movable-view class="card-image-view" :x="card.x" :y="card.y" direction="all"
							out-of-bounds="true" scale="true" @change="onChange" @scale="onScale"
							:scale-value="card.scale">
							<image class="card-image" :src="imgPath"></image>
						</movable-view>
					</movable-area>
					<image class="card-border" :src="borderPath"></image>
					<image class="card-border" :src="classPath"></image>
					<view class="card-info-text">
						<view class="card-info-name">
							<view class=""
								:style="'font-size:'+setting.nameFontSize+'rpx;' + ' padding-left:'+setting.nameLeftMargin+'rpx'">
								{{info.name}}
							</view>
						</view>
					</view>
					<view class="card-info-text">
						<view class="card-info-mana">
							<view class="">
								{{info.cost}}
							</view>
						</view>
					</view>
					<view class="card-info-text" v-show="cardType=='follower'">
						<view class="card-info-attack">
							<view class="">
								{{info.attack}}
							</view>
						</view>
					</view>
					<view class="card-info-text" v-show="cardType=='follower'">
						<view class="card-info-hp">
							<view class="">
								{{info.hp}}
							</view>
						</view>
					</view>
					<view class="card-info-panel">
						<view class="card-info-panel-name">
							<button class="adjust-button-item" @click="amplifyFontSize">+</button>
							<button class="adjust-button-item" @click="reduceFontSize">-</button>
							<button class="adjust-button-item" @click="moveNameLeft">&lt;</button>
							<button class="adjust-button-item" @click="moveNameRight">&gt;</button>
						</view>
					</view>
				</view>

				<view class="opt-panel-1">
					<button class=" round-button" @click="changeImg" style="margin-bottom: 5%;">选择图片</button>
					<button class=" round-button" @click="drawViewToCanvas()">生成</button>
				</view>
				<view style="margin-top: 20rpx;font-size: 30rpx;display: flex;justify-content: center;">

					*点击-、+按钮调整卡牌名称字体大小;<br />
					*点击右上角按钮切换卡牌类型、稀有度等;<br />
					*点击左上角可添加、管理自定义类型;<br />
					*切换到效果页面可编辑卡牌描述信息;<br />
					*点击生成按钮后，长按保存到相册。

				</view>
			</view>

			<view v-show="current === 1">
				<view class="card-descr">
					<view style="display: flex;justify-content: end;align-items: center;">
						详细
						<switch @change="outputTypeChange" :checked="setting.outputType" color="#0055ff"
							style="transform:scale(0.7)" />
					</view>
					<uni-forms ref="info" :modelValue="info">
						<uni-forms-item label="卡牌名称" labelWidth="150rpx" label-align="right">
							<uni-easyinput v-model="info.name" placeholder="请输入卡牌名称" />
						</uni-forms-item>


						<uni-forms-item label="费用" labelWidth="150rpx" label-align="right">
							<uni-easyinput v-model="info.cost" placeholder="请输入费用" />
						</uni-forms-item>
						<view v-if="cardType=='follower'">
							<uni-forms-item label="攻击" labelWidth="150rpx" label-align="right">
								<uni-easyinput v-model="info.attack" placeholder="请输入攻击" />
							</uni-forms-item>
							<uni-forms-item label="血量" labelWidth="150rpx" label-align="right">
								<uni-easyinput v-model="info.hp" placeholder="请输入血量" />
							</uni-forms-item>
							<view v-if="setting.outputType">
								<uni-forms-item label="进化攻击" labelWidth="150rpx" label-align="right">
									<uni-easyinput v-model="info.attackEvo" placeholder="请输入进化后攻击" />
								</uni-forms-item>
								<uni-forms-item label="进化血量" labelWidth="150rpx" label-align="right">
									<uni-easyinput v-model="info.hpEvo" placeholder="请输入进化后血量" />
								</uni-forms-item>
							</view>

						</view>


					</uni-forms>
					<view v-if="setting.outputType" style="display: flex;flex-direction: column;align-items: flex-end;">
						<view class="action text-green">
							关键词
							<switch @change="setKeyWord" :checked="formats.color" color="#0055ff"
								style="transform:scale(0.7)" />
						</view>
						<editor id="editor" class="ql-container input-area" placeholder="卡牌效果" @input="getEditorContent"
							@ready="onEditorReady" @statuschange="onKeyWordChange">
						</editor>
						<view class="action text-green" v-if="cardType=='follower'">
							关键词
							<switch @change="setKeyWordEvo" :checked="formatsEvo.color" color="#0055ff"
								style="transform:scale(0.7)" />
						</view>
						<editor id="editorEvo" class="ql-container input-area" placeholder="进化后效果"
							@input="getEditorContentEvo" @ready="onEditorReadyEvo" v-if="cardType=='follower'"
							@statuschange="onKeyWordChangeEvo">
						</editor>
						<view style="display: flex;justify-content: end;align-items: center;">
							DIY标识与作者
							<switch @change="diyMarkChange" :checked="setting.showDiyMark" color="#0055ff"
								style="transform:scale(0.7)" />
						</view>
						<uni-forms ref="setting" :modelValue="setting" v-show="setting.showDiyMark">
							<uni-forms-item label="作者" labelWidth="150rpx" label-align="right">
								<uni-easyinput v-model="setting.author" placeholder="请输入作者" />
							</uni-forms-item>
						</uni-forms>
					</view>


					<view class="opt-panel-2" style="display: none;">
						<button class=" round-button" @click="drawViewToCanvas()">保存</button>
					</view>


				</view>
			</view>
		</view>

		<view class="canvas-content" style="visibility: hidden;position: absolute;z-index: -999;">
			<canvas class="card-output" canvas-id="cardOutput" :style="'width:'+(setting.outputType?1212:536)+'px'">

			</canvas>
		</view>
	</view>
</template>

<script src="./index.js"></script>
<style>
	/* 	@font-face {
		font-family: "Garamond";
		src: url(/static/font/AGaramondPro-Regular.otf);
	} */

	@import 'index.css'
</style>