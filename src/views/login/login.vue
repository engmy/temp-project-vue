<template>
  <div class="page-wrapper">
    <div class="box">
      <h1 class="title">{{ config_name }}</h1>
      <el-form class="login-form" :model="form" ref="loginForm" :rules="rules">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="账号" @keyup.enter="handleLogin"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" show-password placeholder="密码" @keyup.enter="handleLogin"></el-input>
        </el-form-item>

        <el-form-item prop="code">
          <el-row>
            <el-col>
              <el-input v-model="form.code" placeholder="验证码" @keyup.enter="handleLogin"></el-input>
            </el-col>
            <div class="login-code" @click="refreshCode">
              <img :src="captcha" height="34" @click="getCaptcha" />
            </div>
          </el-row>
        </el-form-item>

        <el-form-item>
          <el-button class="login-btn" type="primary" @click="handleLogin" :loading="loading">登录</el-button>
        </el-form-item>
        <p class="copyright">{{ config_copyright }}</p>
      </el-form>
    </div>
  </div>
</template>

<script>
import { reactive, ref, toRefs, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { elMessage } from "element-plus";
import { sys_config } from "@/api/system/sysconfig";

export default
{
    created() {
      this.getConfige();
    },
    setup() {
      const store = useStore();
      const router = useRouter();
      const loginForm = ref("loginForm");

      let state = reactive({
        form: {
          username: "",
          password: "",
          code: "",
        },
        loading: false,
        rules: {
          username: [{ required: true, message: "请输入账号" }],
          password: [{ required: true, message: "请输入密码" }],
          code: [{ required: true, message: "请输入验证码" }],
        },
        configeList: [
          { config_value: '系统名称' },
          { config_value: '版权' }
        ],
        captcha: ""
      });

      const clearStore = () => {
        store.dispatch("user/clearStore");
      };

      const handleLogin = () => {
        loginForm.value.validate(async (valid) => {
          if (valid) {
            state.loading = true;
            try {
              await store.dispatch("user/login", state.form).then((res) => {
                if (res.code === 200) {
                  router.push({ path: "/" });
                } else if (res.code === 401) {
                  getCaptcha();
                  elMessage({ message: res.msg, type: 'error', duration: 1500 })
                } else {
                  elMessage({ message: res.msg, type: 'error', duration: 1500 })
                }
              });
              state.loading = false;
            } catch (error) {
              state.loading = false;
            }
          }
        });
      };

      const config_name = computed(() => {
        getConfige();
        return state.configeList[0].config_value;
      })
      const config_copyright = computed(() => {
        return state.configeList[1].config_value;
      })

      // 获取配置信息
      const getConfige = async () => {
        // 获取之前先判断vuex中是否存在配置信息 若存在 则直接返回配置
        let config = store.getters.configeData;
        if (config.length >= 2) {
          // 存在配置信息 则不调用接口获取
          state.configeList = config;
          state.configState = true;
        } else {
          await sys_config().then(res => {
            if (res.code === 200) {
              store.dispatch("app/addConfig", res.data);
              state.configeList = res.data;
              state.configState = true;
            } else {
              elMessage.error(res.msg || "获取系统配置信息异常");
            }
          })
        }
      }

      const getCaptcha = () => {
        state.captcha = process.env.VUE_APP_BASE_API + "/admin/captcha?t=" + Math.random();
      }

      onMounted(() => {
        getCaptcha();
        clearStore();
      });


      return {
        ...toRefs(state), getCaptcha, clearStore, loginForm, handleLogin, getConfige, config_name, config_copyright
      };
    }
  };
</script>

<style scoped lang="scss">
.page-wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url("~@/assets/bg.jpg");
  .login-code {
    cursor: pointer;
    position: absolute;
    right: 1px;
    height: 34px;
    top: 1px;
  }
  .box {
    padding: 20px;
    width: 260px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    color: black;
    border-radius: 4px;
    .title {
      font-weight: 400;
      color: rgba(0, 0, 0, 0.85);
      font-size: 24px;
      margin: 20px 0 40px 0;
      font-family: Helvetica Neue, Helvetica, PingFang SC, Tahoma, Arial,
        sans-serif;
    }
    .login-form {
      width: 100%;
    }
    .login-btn {
      width: 100%;
    }
    .copyright {
      padding-top: 15px;
      margin-bottom: 15px;
      font-size: 14px;
      text-align: center;
    }
  }
}
</style>
