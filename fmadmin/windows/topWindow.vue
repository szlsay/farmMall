<template>
	<view class="header">
		<view class="navbar" :class="{'navbar-mini':!matchLeftWindow,'popup-menu':popupMenuOpened}">
			<view class="navbar-left">
				<view class="logo pointer" @click="linkTo">
					<!-- <image class="logo-image" :src="logo" mode="heightFix"></image> -->
					<text class="logo-text">{{appName}}</text>
				</view>
				<uni-icons @click="toggleSidebar" type="bars" class="menu-icon" size="30" color="#999"></uni-icons>
			</view>
			<view class="navbar-middle">
				<text class="title-text">{{navigationBarTitleText}}</text>
			</view>
			<view class="navbar-right pointer">
				<!-- #ifdef H5 -->
				<view v-if="logs.length" @click="showErrorLogs" class="menu-item debug pointer navbar-right-item-gap">
					<svg class="svg-icon">
						<use xlink:href="#icon-bug"></use>
					</svg>
					<uni-badge class="debug-badge" :text="logs.length" type="error"></uni-badge>
				</view>
				<!-- #endif -->

				<picker class="navbar-right-item-gap" mode="selector" :range="themes" range-key="text" :value="themeIndex" @change="changeTheme">
					<uni-icons type="color-filled" size="24" color="#999" />
				</picker>
				<picker class="navbar-right-item-gap" mode="selector" :range="langs" range-key="text" @change="changeLanguage" :value="langIndex">
					<view class="admin-icons-lang" />
				</picker>

				<view class="" style="position: relative;">
					<view v-show="userInfo.nickname || userInfo.username || userInfo.mobile || userInfo.email" class="navbar-user" @click="togglePopupMenu">
						<view class="admin-icons-user user-icon" />
						<view class="username ml-s"><text>{{userInfo.nickname || userInfo.username || userInfo.mobile || userInfo.email}}</text></view>
						<uni-icons class="arrowdown" type="arrowdown" color="#666" size="13"></uni-icons>
					</view>
					<view class="uni-mask" @click="togglePopupMenu" />
					<view class="navbar-menu">
						<template v-if="userInfo.nickname || userInfo.username || userInfo.mobile || userInfo.email">
							<view class="menu-item hover-highlight" @click="changePassword">
								<text>{{ $t("topwindow.text.changePwd") }}</text>
							</view>
							<view class="menu-item hover-highlight">
								<text class="logout pointer" @click="logout">{{ $t("topwindow.text.signOut") }}</text>
							</view>
						</template>
						<view class="popup-menu__arrow"></view>
					</view>
				</view>
			</view>
		</view>
		<uni-popup ref="errorLogsPopup" type="center">
			<view class="modal">
				<scroll-view class="modal-content" scroll-y="true">
					<error-log class="error-table" />
				</scroll-view>
			</view>
		</uni-popup>
		<!-- 冗余代码，临时处理 uni-datetime-picker 国际化不生效的问题 -->
		<!-- #ifdef H5 -->
		<uni-datetime-picker type="date" v-show="false"></uni-datetime-picker>
		<!-- #endif -->
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	import errorLog from '@/windows/components/error-log.vue'
	import config from '@/admin.config.js'

	export default {
		components: {
			errorLog
		},
		props: {
			navigationBarTitleText: {
				type: String
			},
			matchLeftWindow: {
				type: Boolean
			},
			showLeftWindow: {
				type: Boolean
			}
		},
		data() {
			return {
				...config.navBar,
				popupMenuOpened: false,
				mpCapsule: 0,
				langIndex:0
			}
		},
		computed: {
			...mapState('app', ['appName', 'routes', 'theme']),
			...mapState('error', ['logs']),
			userInfo () {
				return this.$uniIdPagesStore.store.userInfo
			},
			themeIndex () {
				let i = 0
				this.themes.forEach((theme,index) => {
					if(theme.value === this.theme) i = index
				})
				return i
			}
		},
		mounted() {
			// #ifdef MP
			let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			this.mpCapsule = menuButtonInfo.width
			// #endif

			// #ifdef H5
			let locale = uni.getLocale();
			this.$nextTick(() => {
				let index = this.langs.findIndex((item) => {
					return item.lang === locale;
				});
				this.changeLanguage(index)
			})
			// #endif
		},
		methods: {
			...mapMutations('app',['SET_THEME']),
			showErrorLogs() {
				if (this.popupMenuOpened) {
					this.popupMenuOpened = false
				}
				this.$refs.errorLogsPopup.open()
			},
			showPasswordPopup() {
				if (this.popupMenuOpened) {
					this.popupMenuOpened = false
				}
				this.$refs.passwordPopup.open()
			},
			logout() {
				this.popupMenuOpened = false
				this.$uniIdPagesStore.mutations.logout()
			},
			toggleSidebar() {
				if (!this.showLeftWindow) {
					uni.showLeftWindow()
				} else {
					uni.hideLeftWindow()
				}
			},
			togglePopupMenu() {
				this.popupMenuOpened = !this.popupMenuOpened
			},
			changePassword() {
				uni.navigateTo({
					url: '/uni_modules/uni-id-pages/pages/userinfo/change_pwd/change_pwd',
					complete: () => {
						this.popupMenuOpened = false
					}
				})
			},
			changeLanguage(e) {
				let index = typeof e === 'object' ? e.detail.value : e
				if (!index || index < 0) index = 0;
				const lang = this.langs[index].lang || 'zh-Hans'
				const platform = uni.getSystemInfoSync().platform
				if (platform === 'android') {
					uni.showToast({
						icon: 'error',
						title: '暂不支持',
						duration: 2000
					})
					return
				}
				this.$i18n.locale = lang
				this.langIndex = index;
				uni.setLocale(lang)
			},
			linkTo() {
				uni.reLaunch({
					url: '/'
				})
			},
			changeTheme(e) {
				const index = typeof e === 'object' ? e.detail.value : e
				const theme = this.themes[index].value || 'default'
				if(this.theme !== theme) this.SET_THEME(theme)
			}
		}
	}
</script>

<style lang="scss">
	.header {
		height: 60px;
		width: 100%;
		box-sizing: border-box;
		border-bottom: 1px solid darken($top-window-bg-color, 8%);
		background-color: $top-window-bg-color;
		color: $top-window-text-color;
	}

	.navbar {
		font-size: 14px;
		position: relative;
		height: 100%;
		padding: 0 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.logo {
		min-width: 223px;
		display: flex;
		align-items: center;

		.logo-image {
			// logo宽高开发者可根据情况自行调节
			width: 30px;
			height: 30px;
		}

		.logo-text {
			// margin-left: 8px;
		}
	}

	.menu-icon {
		width: 30px;
		height: 30px;
		line-height: 30px;
	}

	.navbar-middle,
	.navbar-right {
		flex: 1;
		/* #ifdef MP */
		margin-right: 97px;
		/* #endif */
	}

	.navbar-right-item-gap {
		margin-right: 30px;
	}


	.navbar-left {
		display: flex;
	}

	// 在平板以下，保持navbar-middle
	@media screen and (max-width: 767px) {
		.navbar-left {
			flex: 1;
			/* #ifdef MP */
			margin-right: 97px;
			/* #endif */
		}
	}

	.navbar-middle,
	.username {
		display: flex;
		align-items: center;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.navbar-middle {
		text-align: center;
	}

	.username {
		max-width: 150px;
	}

	.title-text {
		font-size: 14px;
		line-height: 30px;
	}

	.navbar-menu {
		display: flex;
	}

	.menu-item {
		padding: 8px;
		font-size: 16px;
		color: #555;
		line-height: 1;
	}

	.debug {
		display: inline-block;
		position: relative;
	}

	.debug-badge {
		position: absolute;
		top: 5px;
		right: 14px;
		transform: translateY(-50%) translateX(100%) scale(0.8);
	}

	.arrowdown {
		margin-top: 4px;
		margin-left: 3px;
	}

	.person {
		margin-top: 2px;
		margin-right: 2px;
	}

	.navbar-right {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.navbar-right .uni-mask {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(255, 255, 255, 0);
		z-index: 999;
	}

	.popup-menu__arrow {
		position: absolute;
		top: -6px;
		right: 20px;
		border-width: 6px;
		margin-right: 3px;
		border-top-width: 0;
		border-bottom-color: #ebeef5;
		filter: drop-shadow(0 6px 12px rgba(0, 0, 0, .1));
	}

	.popup-menu__arrow::after {
		content: " ";
		position: absolute;
		display: block;
		width: 0;
		height: 0;
		border-color: transparent;
		border-style: solid;
		border-width: 10px;
		top: 1px;
		margin-left: -10px;
		border-top-width: 0;
		border-bottom-color: #fff;
	}

	/* 大屏时，隐藏的内容 */
	.menu-icon,
	.navbar-middle,
	// .navbar-user,
	.popup-menu__arrow,
	.navbar-right .uni-mask {
		display: none;
	}

	/* 小屏，显示的内容 */
	.navbar-mini .menu-icon {
		display: block;
	}

	.navbar-user {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/* 小屏时，隐藏的内容 */
	// .navbar-mini .navbar-menu .username
	.navbar-mini .logo,
	.navbar-mini .debug,
	.navbar-menu {
		display: none;
	}

	.navbar-menu {
		width: 100px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: absolute;
		right: 0;
		/* #ifdef MP */
		// right: 97px;
		/* #endif */
		top: 27px;
		/* #ifndef H5 */
		// top: 85pxs: ;
		/* #endif */
		background-color: #fff;
		z-index: 999;
		padding: 10px 0;
		background-color: #fff;
		border: 1px solid #ebeef5;
		border-radius: 4px;
		box-shadow: 0 6px 12px 0 rgba(0, 0, 0, .5);
	}

	/* 小屏时，弹出下拉菜单 */
	.popup-menu .navbar-menu {
		display: flex;
	}

	.popup-menu .popup-menu__arrow,
	.popup-menu .navbar-right .uni-mask {
		display: block;
	}

	.hover-highlight:hover {
		color: $menu-text-color-actived;
	}

	.svg-icon {
		width: 1em;
		height: 1em;
		vertical-align: -.15em;
		fill: currentColor;
		overflow: hidden;
	}

	.password-popup {
		padding: 30px;
	}


	.language-item {
		font-stretch: 12px;
		vertical-align: baseline;
		text-decoration: underline;
	}

	.lang-icon {
		font-size: 18px;
		margin-top: 5px;
		margin-right: 30px;
	}

	.user-icon {
		font-size: 20px;
	}
</style>
