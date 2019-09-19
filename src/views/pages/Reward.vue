<!-- 赞赏页面 -->
<template>
<div>

	<div class="container">
		<el-row :gutter="30">
			<el-col :sm="24" :md="16" style="transition:all .5s ease-out;margin-bottom:30px;">
				<wbc-reward></wbc-reward>

			</el-col>

      <el-col :sm="24"  :md="8" >
                    <wbc-rightlist></wbc-rightlist>
                </el-col>
		</el-row>
	</div>
	<wbc-footer></wbc-footer>
</div>
</template>

<script>

import footer from '../../components/Footer.vue'
import temRightlist from '../../components/TemRightList.vue'

import temReward from '../../components/TemReward.vue'

export default {
	name: 'Reward',
	data() { //选项 / 数据
		return {

		}
	},
	methods: { //事件处理器

	},
	components: { //定义组件

		'wbc-reward': temReward,
		'wbc-rightlist': temRightlist,
		'wbc-footer': footer
	},
	created() { //生命周期函数

	}
}
</script>

<style>

</style>
