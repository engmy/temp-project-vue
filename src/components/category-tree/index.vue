<template>
  <div class="menu-tree">
    <el-popover ref="popover" placement="bottom-start" trigger="click" popper-class="popper-menu-tree" width="530px">
      <el-input size="small" v-model="filterValue">
        <template #prefix>
          <i class="el-input__icon el-icon-search"></i>
        </template>
      </el-input>

      <el-tree ref="tree" node-key="id" :data="treeList" :props="props" :highlight-current="true" :expand-on-click-node="false" :default-expanded-keys="expandedKeys" :filter-node-method="filterNode" @current-change="currentChange" @node-click="nodeClick">
      </el-tree>

      <template #reference>
        <el-input :value="name" readonly placeholder="请选择分类"></el-input>
      </template>
    </el-popover>
  </div>
</template>

<script>
import { reactive, ref, toRefs, computed, watch, onMounted } from "vue";
import { deepTree } from "@/utils";
export default
  {
    name: "categoryTree",
    props: {
      value: [String, Number],
      categoryList: Array,
      isMaterial: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      categoryList: {
        handler(newValue) {
          this.lists = newValue;
        },
        deep: true
      }
    },
    setup(props, context) {
      const tree = ref(null);
      const popover = ref(null);
      const state = reactive({
        filterValue: "",
        lists: [],
        props: {
          label: "name",
          children: "children",
        },
        expandedKeys: [],
      });

      watch(() => state.filterValue, (value) => {
        tree.value.filter(value);
      });

      const treeList = computed(() => {
        return deepTree(state.lists);
      });

      const name = computed(() => {
        const item = props.categoryList.find((e) => e.id == props.value);
        if (!props.isMaterial) {
          return item ? item.name : "一级分类";
        } else {
          return item ? item.name : '';
        }

      });

      const currentChange = ({ id }) => {
        context.emit("update:value", id);
      };

      const initMenuList = () => {
        let propsList = props.categoryList;
        if (!props.isMaterial) {
          propsList.unshift({ name: "一级分类", id: "0" });
        }

        state.lists = propsList;
      };

      const filterNode = (value, data) => {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      };

      // 点击时的回调
      const nodeClick = () => {

      }

      onMounted(() => {
        initMenuList();
      });

      return { popover, tree, ...toRefs(state), treeList, name, currentChange, filterNode, nodeClick };
    }
  };
</script>

<style lang="scss" >
.popper-menu-tree {
  width: 480px;
  box-sizing: border-box;
  .el-input {
    margin-bottom: 10px;
  }
}
</style>