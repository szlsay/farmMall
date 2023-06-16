<template>
	<view>
		<view class="combo-info" v-if="data">
			<image :src="data.image.url" mode="aspectFill" @click="onPreview(data.image.url)"></image>
		</view>
		<view class="combo-sku">

		</view>
		<view class="combo-comment">

		</view>
		<view class="combo-detail">

		</view>
		{{data}}
	</view>
</template>

<script>
	export default {
		data() {
			return {
				query: null,
				data: null
			}
		},
		onLoad(query) {
			this.query = query
			this.getData()
		},
		methods: {
			onPreview(url) {
				uni.previewImage({
					urls: [url],
					current: 0
				})
			},
			async getData() {
				const fmcombo = uniCloud.importObject('fm-combo')
				const result = await fmcombo.get(this.query.id)
				console.log(result)
				if (result.data && result.data.length > 0) {
					this.data = result.data[0]
				}
			}
		}
	}
</script>

<style>

</style>