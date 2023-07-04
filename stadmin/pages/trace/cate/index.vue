<template>
	<view class="uni-container">
		<view class="st-box-tow">
			<view class="st-box">
				<view class="st-card-header">分类列表</view>
				<view class="uni-group">
					<button class="uni-button" type="default" size="mini" @click="onAddOne">新增一级</button>
					<button class="uni-button" type="default" size="mini" @click="onAddTwo">新增二级</button>
				</view>
				<el-tree :data="data" show-checkbox />
			</view>
			<view class="st-box" style="margin-left: 10px;">
				<view class="st-card-header">分类信息</view>
			</view>
		</view>
	</view>
</template>
<script setup>
	import {
		ref
	} from "vue";
	const content = ref(123)
	
	function onAddOne() {
		console.log("onAddOne")
	}
	
	function onAddTwo() {
		console.log("onAddTwo")
	}
	
	const data = [
	  {
	    id: 1,
	    label: 'Level one 1',
	    children: [
	      {
	        id: 3,
	        label: 'Level two 2-1',
	        children: [
	          {
	            id: 4,
	            label: 'Level three 3-1-1',
	          },
	          {
	            id: 5,
	            label: 'Level three 3-1-2',
	            disabled: true,
	          },
	        ],
	      },
	      {
	        id: 2,
	        label: 'Level two 2-2',
	        disabled: true,
	        children: [
	          {
	            id: 6,
	            label: 'Level three 3-2-1',
	          },
	          {
	            id: 7,
	            label: 'Level three 3-2-2',
	            disabled: true,
	          },
	        ],
	      },
	    ],
	  },
	]
</script>
<style lang="scss" scoped>
	.st-box-tow {
		display: flex;
	}

	.st-box {
		flex: 1;
	}
</style>