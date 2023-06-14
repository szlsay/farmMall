<template>
	<view>
		<view class="uni-header">
			<view class="uni-group">
				<view class="uni-title"></view>
				<view class="uni-sub-title"></view>
			</view>
			<view class="uni-group">
				<button class="uni-button" type="default" size="mini" @click="navigateTo('./add')">新增</button>
			</view>
		</view>
		<view class="uni-container">
			<unicloud-db ref="udb" collection="fm-dict" field="title,type"
				v-slot:default="{data,pagination,loading,error,options}" loadtime="manual">
				<uni-table ref="table" :loading="loading" :emptyText="error.message || '没有更多数据'" border stripe>
					<uni-tr>
						<uni-th align="center">名称</uni-th>
						<uni-th align="center">英文标识</uni-th>
						<uni-th align="center">操作</uni-th>
					</uni-tr>
					<uni-tr v-for="(item,index) in data" :key="index">
						<uni-td align="center">{{item.title}}</uni-td>
						<uni-td align="center">{{item.type}}</uni-td>
						<uni-td align="center">
							<view class="uni-group">
								<button @click="navigateTo('./edit?id='+item._id, false)" class="uni-button" size="mini"
									type="primary">修改</button>
							</view>
						</uni-td>
					</uni-tr>
				</uni-table>
			</unicloud-db>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		onReady() {
			this.$refs.udb.loadData()
		},
		methods: {
			loadData(clear = true) {
				this.$refs.udb.loadData({
					clear
				})
			},
			navigateTo(url, clear) {
				uni.navigateTo({
					url,
					events: {
						refreshData: () => {
							this.loadData()
						}
					}
				})
			},
		}
	}
</script>