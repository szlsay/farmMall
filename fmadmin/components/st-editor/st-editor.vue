<template>
	<view>
		<view id="wangeditor"></view>
	</view>
</template>

<script>
	import E from 'wangeditor'
	let editor = null
	export default {
		name: "st-editor",
		mounted() {
			this.initEditor()
		},
		methods: {
			setContent(content) {
				editor.txt.html(content)
			},
			/**
			 * 初始化富文本编辑器
			 */
			initEditor() {
				editor = new E('#wangeditor')
				// 配置菜单栏，设置不需要的菜单
				editor.config.excludeMenus = [
					'emoticon',
					'image',
					'video'
				]
				editor.config.zIndex = 0
				// 取消自动 focus
				editor.config.focus = false
				editor.config.placeholder = '请填写内容'
				// editor.config.onblur = function(newHtml) {
				// 	console.log('onblur', newHtml) // 获取最新的 html 内容
				// }
				// editor.config.onfocus = function(newHtml) {
				// 	console.log('onfocus', newHtml) // 获取最新的 html 内容
				// }
				// 配置 onchange 回调函数
				const that = this
				editor.config.onchange = function(newHtml) {
					that.$emit("onEdit", newHtml)
				};
				// 配置触发 onchange 的时间频率，默认为 200ms
				editor.config.onchangeTimeout = 500; // 修改为 500ms
				editor.create()
			},
		}
	}
</script>
