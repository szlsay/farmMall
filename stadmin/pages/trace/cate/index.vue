<template>
	<view>
		{{content}}
	</view>
</template>
<script setup>
	import {
		ref
	} from "vue";
	const content = ref(123)
</script>
<style lang="scss" scoped>

</style>