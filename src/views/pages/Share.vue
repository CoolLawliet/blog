<!-- 文章列表 -->
<template>
<div>
<!--	<wbc-nav></wbc-nav>-->
	<div class="container">
		<el-row :gutter="30">
			<el-col :sm="24" :md="16" style="transition:all .5s ease-out;margin-bottom:30px;">
				<wbc-sharelist></wbc-sharelist>
			</el-col>
			<el-col :sm="24" :md="8">
				<wbc-rightlist></wbc-rightlist>
			</el-col>
		</el-row>
	</div>
	<wbc-footer></wbc-footer>
</div>
</template>

<script>

import footer from '../../components/Footer.vue'

import temSharelist from '../../components/temShareList.vue'
import temRightlist from '../../components/TemRightList.vue'

export default {
	name: "Share",
	data() { //选项 / 数据
		return {

		}
	},
	methods: { //事件处理器

	},
	components: { //定义组件

		'wbc-sharelist': temSharelist,
		'wbc-rightlist': temRightlist,
		'wbc-footer': footer
	},

	created() { //生命周期函数

	}
}
</script>

<style>

</style>
