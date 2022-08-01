<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card class="box-card">
          <myEcharts :id="'bargraph2'" :option="option" style="height:350px;" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <myEcharts :id="'bargraph'" :option="option" style="height:350px;" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs } from "vue";
import { getEchartsDataGroupDayByMonth } from '@/api/produce/statistics';
import myEcharts from '@/components/my-echarts';
import { addOptionOnTip } from '@/utils/index'
export default {
  name: 'bar',
  components: { myEcharts },
  setup() {

    const state = reactive({
      option: {},
    })

    onMounted(() => {
      getEchartsDataGroupDayByMonth().then(result => {
        if (result.code === 200) {
          let res = result.data;
          let obj = {};
          obj.xAxis = res.xaxis;
          obj.yAxis = res.yaxis;
          Object.assign(res, obj)

          state.option = addOptionOnTip(res)
        }

      })

    });

    return {
      ...toRefs(state),
    };
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  background-color: #fff;
  box-sizing: border-box;
  padding: 10px;
}
.chart {
  width: 100%;
  height: 390px;
  background-color: #fff;
}
.chart-box,
.box-card {
  height: 390px;
}
.box-card {
  margin-left: 10px;
  margin-bottom: 26px;
}
</style>