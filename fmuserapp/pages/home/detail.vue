<template>
	<view>
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
