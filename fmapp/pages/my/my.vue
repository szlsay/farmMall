<template>
	<view class="center">
		<uni-sign-in ref="signIn"></uni-sign-in>
		<!-- 用户信息 -->
		<view class="user-info" @click.capture="toUserInfo">
			<cloud-image class="default-avatar" v-if="hasLogin&&userInfo.avatar_file&&userInfo.avatar_file.url"
				:src="userInfo.avatar_file.url"></cloud-image>
			<view v-else class="default-avatar">
				<uni-icons color="#ffffff" size="50" type="person-filled" />
			</view>
			<view class="logo-title">
				<text class="uer-name" v-if="hasLogin">{{userInfo.nickname||userInfo.username||userInfo.mobile}}</text>
				<text class="uer-name" v-else>{{$t('mine.notLogged')}}</text>
			</view>
		</view>
		<!-- 用户订单 -->
		<view class="user-order">
			<view class="order-title">
				<text class="my-order">我的订单</text>
				<view class="all-order" >
					<navigator url="../order/list">
						<text>全部订单</text>
						<uni-icons type="right" size="16" color="#333333"></uni-icons>
					</navigator>

				</view>
			</view>
			<uni-grid class="order-grid" :column="orderList.length" :showBorder="false" :square="false" :highlight="false">
				<uni-grid-item v-for="(item,index) in orderList" @click.native="tapGrid(index)" :key="index">
					<view class="grid-item-box">
						<uni-icons color="#00CC99" :type="item.icon" size="26"></uni-icons>
						<text class="text">{{item.text}}</text>
					</view>
				</uni-grid-item>
			</uni-grid>
		</view>
		<!-- 用户菜单 -->
		<view class="user-menu">
			<uni-list v-for="(sublist , index) in menuList" :key="index">
				<uni-list-item v-for="(item,i) in sublist" :title="item.title" link :key="i" :clickable="true" :to="item.to"
					@click="ucenterListClick(item)">
				</uni-list-item>
			</uni-list>
		</view>
	</view>
</template>

<script>
	import checkUpdate from '@/uni_modules/uni-upgrade-center-app/utils/check-update';
	import callCheckVersion from '@/uni_modules/uni-upgrade-center-app/utils/call-check-version';
	// #ifdef APP
	import UniShare from '@/uni_modules/uni-share/js_sdk/uni-share.js';
	const uniShare = new UniShare()
	// #endif
	const db = uniCloud.database();
	import {
		store,
		mutations
	} from '@/uni_modules/uni-id-pages/common/store.js'
	export default {
		// #ifdef APP
		onBackPress({
			from
		}) {
			if (from == 'backbutton') {
				this.$nextTick(function() {
					uniShare.hide()
				})
				return uniShare.isShow;
			}
		},
		// #endif
		data() {
			return {
				orderList: [{
						"text": "待付款",
						"icon": "email-filled"
					},
					{
						"text": "待发货",
						"icon": "navigate-filled"
					},
					{
						"text": "待收货",
						"icon": "cart-filled"
					}
				],
				menuList: [
					[{
							"title": "每日签到",
							"event": 'signIn',
						},
						{
							"title": "我的商品",
							"event": 'signIn',
						},
						{
							"title": "收货地址",
							"to": '/pages/my/address/list',
						},
						{
							"title": "我的积分",
							"event": 'getScore',
						},
						{
							"title": "分销推广",
							"event": 'share',
							"icon": "redo"
						}
					],
					[{
							"title": "客服电话",
							"event": 'signIn',
						},
						{
							"title": "问题反馈",
							"to": '/uni_modules/uni-feedback/pages/opendb-feedback/opendb-feedback',
						},
						{
							"title": "设置",
							"to": '/pages/ucenter/settings/settings',
						},
						{
							"title": "关于",
							"to": '/pages/ucenter/about/about',
						}
					]
				]
			}
		},
		onLoad() {
			//#ifdef APP-PLUS
			this.ucenterList[this.ucenterList.length - 2].unshift({
				title: this.$t('mine.checkUpdate'), // this.this.$t('mine.checkUpdate')"检查更新"
				rightText: this.appVersion.version + '-' + this.appVersion.versionCode,
				event: 'checkVersion',
				icon: 'loop',
				showBadge: this.appVersion.hasNew
			})
			//#endif
		},
		onShow() {},
		computed: {
			userInfo() {
				return store.userInfo
			},
			hasLogin() {
				return store.hasLogin
			},
			// #ifdef APP-PLUS
			appVersion() {
				return getApp().appVersion
			},
			// #endif
			appConfig() {
				return getApp().globalData.config
			}
		},
		methods: {
			toSettings() {
				uni.navigateTo({
					url: "/pages/ucenter/settings/settings"
				})
			},
			signIn() { //普通签到
				this.$refs.signIn.open()
			},
			signInByAd() { //看激励视频广告签到
				this.$refs.signIn.showRewardedVideoAd()
			},
			/**
			 * 个人中心项目列表点击事件
			 */
			ucenterListClick(item) {
				if (!item.to && item.event) {
					this[item.event]();
				}
			},
			async checkVersion() {
				let res = await callCheckVersion()
				console.log(res);
				if (res.result.code > 0) {
					checkUpdate()
				} else {
					uni.showToast({
						title: res.result.message,
						icon: 'none'
					});
				}
			},
			toUserInfo() {
				uni.navigateTo({
					url: '/uni_modules/uni-id-pages/pages/userinfo/userinfo'
				})
			},
			tapGrid(index) {
				uni.showToast({
					// title: '你点击了，第' + (index + 1) + '个',
					title: this.$t('mine.clicked') + " " + (index + 1),
					icon: 'none'
				});
			},
			/**
			 * 去应用市场评分
			 */
			gotoMarket() {
				// #ifdef APP-PLUS
				if (uni.getSystemInfoSync().platform == "ios") {
					// 这里填写appstore应用id
					let appstoreid = this.appConfig.marketId.ios; // 'id1417078253';
					console.log({
						appstoreid
					});
					plus.runtime.openURL("itms-apps://" + 'itunes.apple.com/cn/app/wechat/' + appstoreid + '?mt=8', err => {
						console.log('plus.runtime.openURL err:' + JSON.stringify(err));
					});
				}
				if (uni.getSystemInfoSync().platform == "android") {
					var Uri = plus.android.importClass("android.net.Uri");
					var uri = Uri.parse("market://details?id=" + this.appConfig.marketId.android);
					var Intent = plus.android.importClass('android.content.Intent');
					var intent = new Intent(Intent.ACTION_VIEW, uri);
					var main = plus.android.runtimeMainActivity();
					main.startActivity(intent);
				}
				// #endif
			},
			/**
			 * 获取积分信息
			 */
			getScore() {
				if (!this.userInfo) return uni.showToast({
					title: this.$t('mine.checkScore'),
					icon: 'none'
				});
				uni.showLoading({
					mask: true
				})
				db.collection("uni-id-scores")
					.where('"user_id" == $env.uid')
					.field('score,balance')
					.orderBy("create_date", "desc")
					.limit(1)
					.get()
					.then((res) => {
						console.log(res);
						const data = res.result.data[0];
						let msg = '';
						msg = data ? (this.$t('mine.currentScore') + data.balance) : this.$t('mine.noScore');
						uni.showToast({
							title: msg,
							icon: 'none'
						});
					}).finally(() => {
						uni.hideLoading()
					})
			},
			async share() {
				let {
					result
				} = await db.collection('uni-id-users').where("'_id' == $cloudEnv_uid").field('my_invite_code').get()
				let myInviteCode = result.data[0].my_invite_code
				if (!myInviteCode) {
					return uni.showToast({
						title: '请检查uni-config-center中uni-id配置，是否已启用 autoSetInviteCode',
						icon: 'none'
					});
				}
				console.log({
					myInviteCode
				});
				let {
					appName,
					logo,
					company,
					slogan
				} = this.appConfig.about
				// #ifdef APP-PLUS
				uniShare.show({
					content: { //公共的分享类型（type）、链接（herf）、标题（title）、summary（描述）、imageUrl（缩略图）
						type: 0,
						href: this.appConfig.h5.url +
							`/#/pages/ucenter/invite/invite?code=uniInvitationCode:${myInviteCode}`,
						title: appName,
						summary: slogan,
						imageUrl: logo +
							'?x-oss-process=image/resize,m_fill,h_100,w_100' //压缩图片解决，在ios端分享图过大导致的图片失效问题
					},
					menus: [{
							"img": "/static/app-plus/sharemenu/wechatfriend.png",
							"text": this.$t('common.wechatFriends'),
							"share": {
								"provider": "weixin",
								"scene": "WXSceneSession"
							}
						},
						{
							"img": "/static/app-plus/sharemenu/wechatmoments.png",
							"text": this.$t('common.wechatBbs'),
							"share": {
								"provider": "weixin",
								"scene": "WXSceneTimeline"
							}
						},
						{
							"img": "/static/app-plus/sharemenu/weibo.png",
							"text": this.$t('common.weibo'),
							"share": {
								"provider": "sinaweibo"
							}
						},
						{
							"img": "/static/app-plus/sharemenu/qq.png",
							"text": "QQ",
							"share": {
								"provider": "qq"
							}
						},
						{
							"img": "/static/app-plus/sharemenu/copyurl.png",
							"text": this.$t('common.copy'),
							"share": "copyurl"
						},
						{
							"img": "/static/app-plus/sharemenu/more.png",
							"text": this.$t('common.more'),
							"share": "shareSystem"
						}
					],
					cancelText: this.$t('common.cancelShare'),
				}, e => { //callback
					console.log(e);
				})
				// #endif
			}
		}
	}
</script>

<style lang="scss" scoped>
	.user-info {
		padding: 64rpx;
		display: flex;
		flex-direction: row;
		align-items: center;

		.default-avatar {
			width: 150rpx;
			height: 150rpx;
			background-color: #00CC99;
			border-radius: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.logo-title {
			margin-left: 16rpx;

			.uer-name {
				height: 100rpx;
				line-height: 100rpx;
				font-size: 38rpx;
				color: #00CC99;
			}
		}
	}

	.user-order {
		background-color: #FFFFFF;
		padding: 32rpx;

		// color: #666666;
		.order-title {
			display: flex;
			justify-content: space-between;

			.my-order {
				font-size: 30rpx;
			}

			.all-order {
				display: flex;
				align-items: center;
			}
		}

		.order-grid {
			padding-top: 32rpx;

			.grid-item-box {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				.text {
					text-align: center;
				}
			}
		}
	}

	.user-menu {
		.uni-list {
			margin-top: 20rpx;
		}
	}
</style>