<template>
  <div class="app-container">
    <div id="bar" class="chart"></div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts";

export default {
  name:'bar',
  setup() {
    const chart = ref(null);

    let count;
    let timer;
    const initChart = () => {
      chart.value = echarts.init(document.getElementById("bar"));

      let option = {
        title: {
          text: "动态数据",
          subtext: "纯属虚构",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#283b56",
            },
          },
        },
        legend: {
          data: ["最新成交价", "预购队列"],
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {},
          },
        },
        dataZoom: {
          show: false,
          start: 0,
          end: 100,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: true,
            data: (function () {
              var now = new Date();
              var res = [];
              var len = 10;
              while (len--) {
                res.unshift(now.toLocaleTimeString().replace(/^\D*/, ""));
                now = new Date(now - 2000);
              }
              return res;
            })(),
          },
          {
            type: "category",
            boundaryGap: true,
            data: (function () {
              var res = [];
              var len = 10;
              while (len--) {
                res.push(10 - len - 1);
              }
              return res;
            })(),
          },
        ],
        yAxis: [
          {
            type: "value",
            scale: true,
            name: "价格",
            max: 30,
            min: 0,
            boundaryGap: [0.2, 0.2],
          },
          {
            type: "value",
            scale: true,
            name: "预购量",
            max: 1200,
            min: 0,
            boundaryGap: [0.2, 0.2],
          },
        ],
        series: [
          {
            name: "预购队列",
            type: "bar",
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: (function () {
              var res = [];
              var len = 10;
              while (len--) {
                res.push(Math.round(Math.random() * 1000));
              }
              return res;
            })(),
          },
          {
            name: "最新成交价",
            type: "line",
            data: (function () {
              var res = [];
              var len = 0;
              while (len < 10) {
                res.push((Math.random() * 10 + 5).toFixed(1) - 0);
                len++;
              }
              return res;
            })(),
          },
        ],
      };

      count = 11;
      timer = setInterval(function () {
        var axisData = new Date().toLocaleTimeString().replace(/^\D*/, "");

        var data0 = option.series[0].data;
        var data1 = option.series[1].data;
        data0.shift();
        data0.push(Math.round(Math.random() * 1000));
        data1.shift();
        data1.push((Math.random() * 10 + 5).toFixed(1) - 0);

        option.xAxis[0].data.shift();
        option.xAxis[0].data.push(axisData);
        option.xAxis[1].data.shift();
        option.xAxis[1].data.push(count++);

        chart.value.setOption(option);
      }, 2100);
      chart.value.setOption(option);
    };

    onMounted(() => {
      initChart();
    });

    onBeforeUnmount(() => {
      clearInterval(timer);
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