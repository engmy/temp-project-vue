<template>
  <div class="custom-table-pagination">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="data.pagination.current_page" :page-sizes="data.pageSize" prev-text="上一页" next-text="下一页" :page-size="data.pagination.page_size" layout="total, sizes, prev, pager, next, jumper" :total="data.pagination.total">
    </el-pagination>
  </div>
</template>

<script>
import { ref } from "vue";
export default
  {
    props: {
      pagination:
      {
        type: Object,
        required: true,
        default() {
          return {
            current_page: 1, //当前页数
            total: 0, //总条目数
            page_size: 2, //每页显示条目个数
          };
        }
      },
      // 每页显示个数选择器的选项设置
      pageSize: {
        default() {
          return [2, 4, 6, 8, 10];
        }
      }
    },

    setup(props, context) {
      const data = ref(props);

      // 切换每页条数
      const handleSizeChange = (size) => {
        data.value.pagination.page_size = size
        context.emit("handleQuery");
      };

      // 切换页码
      const handleCurrentChange = (pageNo) => {
        data.value.pagination.current_page = pageNo
        context.emit("handleQuery");
      };

      return { data, handleSizeChange, handleCurrentChange };
    }
  };
</script>