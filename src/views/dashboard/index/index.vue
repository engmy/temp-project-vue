<template>
  <div class="app-container">
    <div v-for="(item,index) in optionList" :key="index">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-card class="box-card">
            <myEcharts :id="'echarts'+index" :option="item[0]" style="height:350px;" />
          </el-card>
        </el-col>
        <el-col :span="12" v-if="item.length >=2">
          <el-card class="box-card">
            <myEcharts :id="'echarts'+index +1" :option="item[1]" style="height:350px;" />
          </el-card>
        </el-col>
      </el-row>
    </div>

    <el-dialog :title="msg" v-model="userVerify" :before-close="closePassDialog" :close-on-click-modal="false" width="400px">
      <el-form ref="dataForm" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="新&ensp;密&ensp;码" prop="newpass">
          <el-input v-model="form.newpass" placeholder="请输入新密码" type="password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="renewpass">
          <el-input v-model="form.renewpass" placeholder="请输入新密码" type="password" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="small" icon="el-icon-close" @click="logout">退 出</el-button>
        <el-button type="primary" size="small" icon="el-icon-check" @click="updateData">提 交</el-button>
      </template>
    </el-dialog>

  </div>
</template>

<script>
import { onMounted, reactive, toRefs, ref } from "vue";
import { ElMessage, elMessage } from 'element-plus';
import { getEchartsDataGroupOnWeek } from '@/api/produce/statistics';
import myEcharts from '@/components/my-echarts';
import { addOptionOnTip } from '@/utils/index';
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { compulsoryUpdatePassword } from "@/api/dashboard/profile";
import { strongVerifiOfPassword } from "@/utils/index";

export default {
  name: 'homebar',
  components: { myEcharts },
  setup() {
    const store = useStore();
    const dataForm = ref(null);
    const router = useRouter();

    const state = reactive({
      optionList: [],
      userVerify: false,
      msg: '',
      form: {
        password: "",
        newpass: "",
        renewpass: "",
      },
      rules: {
        newpass: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { validator: strongVerifiOfPassword, trigger: "blur" }
        ],
        renewpass: [
          { required: true, message: "请验证密码", trigger: "blur" },
          { validator: strongVerifiOfPassword, trigger: "blur" },
        ],
      }
    })

    // 绘制图表信息
    const echartsDataGroupOnWeek = async () => {
      await getEchartsDataGroupOnWeek().then(result => {
        if (result.code === 200) {
          // 先处理最基本的数据信息
          let flage = result.data.map(res => {
            let obj = {};
            obj.xAxis = res.xaxis;
            obj.yAxis = res.yaxis;
            Object.assign(res, obj)
            return addOptionOnTip(res)
          })
          // 将数据处理成可做左右循环的列表，将一维数组转换成二维数组
          let len = flage.length;
          let n = 2; //每行显示2个
          let lineNum = len % n === 0 ? len / n : Math.floor((len / n) + 1);
          let res = [];
          for (let i = 0; i < lineNum; i++) {
            // slice() 方法返回一个从开始到结束（不包括结束）选择的数组的一部分浅拷贝到一个新数组对象。且原始数组不会被修改。
            let temp = flage.slice(i * n, i * n + n);
            res.push(temp);
          }
          state.optionList = res;
        }
      })
    }

    // 验证用户状态是否是201 即userVerify为false 若是，则强制修改密码
    const verifyUserStata = () => {
      state.userVerify = store.getters.userVerify - 0 !== 201;
      state.msg = store.getters.updateMsg;
    }

    onMounted(() => {
      echartsDataGroupOnWeek()
      verifyUserStata();
    });

    const closePassDialog = () => {
      ElMessage.warning({
        message: state.msg + ' ！！！',
        type: 'warning',
      })
    }

    const logout = () => {
      store.dispatch("user/logout").then(() => {
        router.push({ path: "/login", replace: true });
      });
    }

    const updateData = () => {
      dataForm.value.validate(async (valid) => {
        if (valid) {
          const result = await compulsoryUpdatePassword(state.form);
          if (result.code === 200) {
            store.dispatch("user/set_verify_ok").then(() => {
              state.userVerify = false;
            });
            elMessage({ message: result.msg, type: 'success', duration: 2000 })
          }
        }
      });
    }

    return {
      ...toRefs(state), dataForm, closePassDialog, updateData, logout
    };
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  box-sizing: border-box;
  padding: 10px;
}
.chart {
  width: 100%;
  height: 400px;
  background-color: #fff;
}
.chart-box,
.box-card {
  height: 400px;
}
.box-card {
  margin-left: 10px;
  margin-bottom: 26px;
}
</style>