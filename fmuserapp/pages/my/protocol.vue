<template>
	<view>
		{{title}}
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: null
			}
		},
		onLoad(e) {
			this.title = e.title
		},
		methods: {

		}
	}
</script>

<style>

</style>