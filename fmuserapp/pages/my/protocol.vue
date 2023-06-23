<template>
	<view class="page">
		<text v-html="content"></text>
		<!-- {{content}} -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: null,
				content: null
			}
		},
		onLoad({
			title
		}) {
			this.title = title
			if (title) {
				uni.setNavigationBarTitle({
					title
				});
			}
			this.getDetail(title)
		},
		methods: {
			getDetail(title) {
				uni.showLoading({
					mask: true
				})
				const db = uniCloud.database();
				const dbCmd = db.command;
				const dbCollectionName = 'fm-protocol';
				db.collection(dbCollectionName).where({
					title
				}).field("content").get().then((
					res) => {
					console.log(res)
					const data = res.result.data
					if (data.length === 1) {
						this.content = data[0].content
					}

				}).catch((err) => {
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					})
				}).finally(() => {
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style scoped>
	.page {
		padding: 40rpx;
	}
</style>