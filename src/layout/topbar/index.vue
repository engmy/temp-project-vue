<template>
  <el-header class="topbar-wrap">
    <div class="topbar_collapse" @click="collapse">
      <icon-svg name="indent"  v-if="menuCollapse"/>
      <icon-svg name="outdent" v-else />
    </div>
    <div class="topbar_flex"></div>
    <div class="topbar_user">
      <el-dropdown trigger="click" :hide-on-click="false" @command="onCommand">
        <span class="el-dropdown-link">
          <el-avatar :size="32" :src="userAvatar"></el-avatar>
          <span class="name">{{ userInfo.username }}</span>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="userInfo">个人中心</el-dropdown-item>
            <el-dropdown-item command="editpass">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <editpass :editPassDialogForm="editPassDialog" @closePassDialog="closePassDialog" />
  </el-header>
</template>

<script>
import { useStore } from "vuex";
import {computed, onMounted, reactive, toRefs} from "vue";
import { useRouter } from "vue-router";
import editpass from "./editpass";
import {getUserAvatar} from "@/api/dashboard/profile";
export default
{
    components: { editpass },
    setup()
    {
        const store = useStore();
        const router = useRouter();
        const state = reactive({
            userAvatar: "",
            editPassDialog: false
        })
        const userInfo = computed(() =>
        {
            handleUserAvatar();
            return store.getters.userInfo;
        });

        const menuCollapse = computed(() =>
        {
            return store.getters.menuCollapse;
        });

        const collapse = () =>
        {
            store.commit("menu/SET_COLLASPE", !menuCollapse.value);
        };

        const onCommand = (name) =>
        {
            switch (name)
            {
                case "userInfo":
                    router.push("/admin/profile");
                    break;
                case "logout":
                    store.dispatch("user/logout").then(() =>
                    {
                        router.push({ path: "/login", replace: true });
                    });
                    break;
                case "editpass":
                    state.editPassDialog = true;
                    break;
            }
        };

        const closePassDialog = () =>
        {
            state.editPassDialog = false;
        };

        const handleUserAvatar = async() =>
        {
            await getUserAvatar().then(res =>
            {
                const blob = new Blob([res], {type: 'application/png;charset=utf-8'});
                state.userAvatar = window.URL.createObjectURL(blob);
            }).catch(err =>
            {
                console.log(err);
            });
        };

        onMounted(()=>
        {

        })

        return {collapse, ...toRefs(state), userInfo, handleUserAvatar, closePassDialog, menuCollapse, onCommand };
    }
};
</script>

<style lang="scss" scoped>
.topbar-wrap {
  height: 60px;
  display: flex;
  align-items: center;
  background-color: #1e9fff;
  .topbar_collapse {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    svg{
      color: #FFFFFF;
      font-size: 20px;
    }
  }
  .topbar_flex {
    flex: 1;
  }
  .topbar_user {
    cursor: pointer;
    margin-right: 10px;
    .el-dropdown-link {
      display: flex;
      align-items: center;
    }
    .name {
      color: #FFFFFF;
      white-space: nowrap;
      margin-left: 15px;
    }
  }
}
</style>