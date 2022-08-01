<template>
  <div class="app-container">
    <div :id="id" class="chart"></div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, reactive, toRefs } from "vue";
import * as echarts from "echarts";
export default {
  name: 'myEcharts',
  props: {
    id: String,
    option: Object
  },
  watch: {
    option: {
      handler(newValue) {
        this.echartsOption = newValue;
        this.initChart();
      },
      deep: true
    }
  },
  setup(props) {
    const chart = ref(null);

    const state = reactive({
      echartsOption: {},
    })

    const initChart = () => {
      let _option = state.echartsOption;
      if (JSON.stringify(_option) == "{}") {
        return;
      }
      chart.value = echarts.init(document.getElementById(props.id));
      // vue3 需要进行这样的装箱操作 不然浮动框会显示不了
      const unwarp = (obj) => obj && (obj.__v_raw || obj.valueOf() || obj);
      unwarp(chart.value).setOption(_option);
      window.addEventListener("resize", function () {
        chart.value.resize();
      })
    };

    onMounted(() => {
      state.echartsOption = props.option;
      initChart();
    });

    onBeforeUnmount(() => {
      //clearInterval(timer);
      if (!chart.value) {
        return;
      }
      chart.value.dispose();
      chart.value = null;

    });

    return {
      props, initChart, ...toRefs(state)
    };
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  background-color: #fff;
  box-sizing: border-box;
}
.chart {
  width: 100%;
  height: 400px;
  background-color: #fff;
}


</style>