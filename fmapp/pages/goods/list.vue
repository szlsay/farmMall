<template>
	<view class="container">
		<unicloud-db ref="udb" v-slot:default="{data, pagination, loading, hasMore, error}" :collection="collectionList"
			field="image,name,description">
			<view v-if="error">{{error.message}}</view>
			<view v-else-if="data">
				<pp-waterfall-flow :value="changeShowData(data)" @clickItem="handleItemClick"
					@clickImage="handleItemClick"></pp-waterfall-flow>
			</view>
			<uni-load-more :status="loading?'loading':(hasMore ? 'more' : 'noMore')"></uni-load-more>
		</unicloud-db>
	</view>
</template>

<script>
	import {
		cloneObject
	} from "@/utils/util.js"
	const db = uniCloud.database()
	export default {
		data() {
			return {
				collectionList: "fm-goods",
				loadMore: {
					contentdown: '',
					contentrefresh: '',
					contentnomore: ''
				}
			}
		},
		onPullDownRefresh() {
			this.$refs.udb.loadData({
				clear: true
			}, () => {
				uni.stopPullDownRefresh()
			})
		},
		onReachBottom() {
			this.$refs.udb.loadMore()
		},
		methods: {
			handleItemClick(item) {
				console.log("handleItemClick---", item._id)
				uni.navigateTo({
					url: './detail?id=' + item._id
				})
			},
			changeShowData(data) {
				const copyData = cloneObject(data)
				return copyData.map(item => {
					if (item.image && item.image.url) {
						item.image = item.image.url
					}
					item.desc = item.description
					item.title = item.name
					return item
				})
			}
		}
	}
</script>

<style>
</style>