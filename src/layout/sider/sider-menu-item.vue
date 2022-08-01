<template v-if="item.meta.show">
  <el-menu-item :index="item.path" v-if="!item.children || !item.children.length">
    <icon-svg :name="item.meta.icon" v-if="item.meta.icon" class="icon-svg-item" />
    <span class="title">{{ item.meta.title }}</span>
  </el-menu-item>

  <el-submenu :index="item.path" v-else>
    <template #title>
      <icon-svg :name="item.meta.icon" v-if="item.meta.icon" class="icon-svg-item" />
      <span class="title">{{ item.meta.title }}</span>
    </template>
    <sider-menu-item v-for="child in item.children" :key="child.path" :item="child" />
  </el-submenu>
</template>

<script>
export default {
  props: {
    item: Object,
  },
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
::v-deep(.el-submenu .el-submenu__title)
{
    height: 50px;
    line-height: 50px;
}
::v-deep(.el-submenu .el-submenu__title i)
{
    color: #FFFFFF;
}
::v-deep(.el-menu-item)
{
    height: 40px;
    line-height: 40px !important;
    background-color: rgba(0,0,0,.3) !important;
}
.icon-svg-item
{
      font-size: 14px;
      margin-right: 4px;
      vertical-align: text-bottom !important;
}
::v-deep(.el-menu .is-active)
{
    background: #1e9fff !important;
}
</style>