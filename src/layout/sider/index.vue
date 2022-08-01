<template>
  <div class="sider-wrap" v-if="configState">
    <div class="logo">
      <div class="logo-title" v-if="!menuCollapse">{{ config_name }}</div>
      <div class="logo-title" :class="{collapse: menuCollapse}" v-else>
        <img src="@/assets/logo.png" alt="{{ config_name }}" width="64" height="64" />
      </div>
    </div>
    <div class="menu">
      <sider-menu :collapse="menuCollapse" />
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed, reactive, toRefs } from "vue";
import siderMenu from "./sider-menu";
import { sys_config } from "@/api/system/sysconfig";
import { elMessage } from "element-plus";

export default {
  components: { siderMenu },
  created() {
    this.getConfige();
  },
  setup() {
    const store = useStore();
    let state = reactive({
      configeList: [],
      configState: false, //配置信息是否加载完成
    })
    const menuCollapse = computed(() => {
      return store.getters.menuCollapse;
    });

    const config_name = computed(() => {
       getConfige();
       return state.configeList[0].config_value;
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

    return {
      menuCollapse,
      ...toRefs(state),
      config_name,
      getConfige
    };
  },
};
</script>

<style lang="scss" scoped>
.sider-wrap {
  height: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  .logo {
    background-color: #0085e8;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    .logo-title {
      color: #fff;
      font-size: 18px;
      text-align: center;
    }
    .collapse {
      width: 64px !important;
    }
  }
  .menu {
    overflow-y: auto;
    height: calc(100% - 80px);
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }
}
</style>