<template>
  <div class="app-container">
    <div id="pie" class="chart"></div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts";

export default {
  name:'pie',
  setup() {
    const chart = ref(null);

    const initChart = () => {
      chart.value = echarts.init(document.getElementById("pie"));

      let option = {
        backgroundColor: "#2c343c",

        title: {
          text: "Customized Pie",
          left: "center",
          top: 20,
          textStyle: {
            color: "#ccc",
          },
        },

        tooltip: {
          trigger: "item",
        },

        visualMap: {
          show: false,
          min: 80,
          max: 600,
          inRange: {
            colorLightness: [0, 1],
          },
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "55%",
            center: ["50%", "50%"],
            data: [
              { value: 335, name: "直接访问" },
              { value: 310, name: "邮件营销" },
              { value: 274, name: "联盟广告" },
              { value: 235, name: "视频广告" },
              { value: 400, name: "搜索引擎" },
            ].sort(function (a, b) {
              return a.value - b.value;
            }),
            roseType: "radius",
            label: {
              color: "rgba(255, 255, 255, 0.3)",
            },
            labelLine: {
              lineStyle: {
                color: "rgba(255, 255, 255, 0.3)",
              },
              smooth: 0.2,
              length: 10,
              length2: 20,
            },
            itemStyle: {
              color: "#c23531",
              shadowBlur: 200,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },

            animationType: "scale",
            animationEasing: "elasticOut",
            animationDelay: function () {
              return Math.random() * 200;
            },
          },
        ],
      };
      chart.value.setOption(option);
    };

    onMounted(() => {
      initChart();
    });

    onBeforeUnmount(() => {
      if (!chart.value) {
        return;
      }
      chart.value.dispose();
      chart.value = null;
    });

    return {};
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  background-color: #fff;
  box-sizing: border-box;
  padding: 20px;
}
.chart {
  width: 100%;
  height: 100%;
}
</style>