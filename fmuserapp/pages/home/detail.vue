<template>
	<view>
		{{query}}
	</view>
</template>

<script>
	export default {
		data() {
			return {
				query: null
			}
		},
		onLoad(query) {
			this.query = query
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
