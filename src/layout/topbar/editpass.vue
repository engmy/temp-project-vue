<template>
  <el-dialog title="修改密码" v-model="editPassDialogForm" :close-on-click-modal="false" width="400px">
    <el-form ref="dataForm" :rules="rules" :model="form" label-width="80px">
      <el-form-item label="原&ensp;密&ensp;码" prop="password">
        <el-input v-model="form.password" placeholder="请输入原密码" type="password" />
      </el-form-item>
      <el-form-item label="新&ensp;密&ensp;码" prop="newpass">
        <el-input v-model="form.newpass" placeholder="请输入新密码" type="password" />
      </el-form-item>
      <el-form-item label="重输密码" prop="renewpass">
        <el-input v-model="form.renewpass" placeholder="请输入新密码" type="password" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button size="small" icon="el-icon-close" @click="closePassDialog()">取 消</el-button>
      <el-button type="primary" size="small" icon="el-icon-check" @click="updateData()">提 交</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, ref, toRefs } from "vue";
import { elMessage } from "element-plus";
import { updatePassword } from "@/api/dashboard/profile";
import { strongVerifiOfPassword } from "@/utils/index";
export default
  {
    name: 'editpass',
    props: {
      editPassDialogForm: {
        type: Boolean,
        default: false
      }
    },
    emits: ['closePassDialog'],
    setup(props, context) {
      const dataForm = ref("dataForm");
      const state = reactive({
        form: {
          password: "",
          newpass: "",
          renewpass: "",
        },
        rules: {
          password: [{ required: true, message: "请输入原密码", trigger: "blur" }],
          newpass: [{ required: true, message: "请输入新密码", trigger: "blur" },
          { validator: strongVerifiOfPassword, trigger: "blur" }],
          renewpass: [{ required: true, message: "请输入新密码", trigger: "blur" },
          { validator: strongVerifiOfPassword, trigger: "blur" }],
        }
      })

      // 更新角色
      const updateData = () => {
        dataForm.value.validate(async (valid) => {
          if (valid) {
            const result = await updatePassword(state.form);
            if (result.code === 200) {
              closePassDialog();
              elMessage({ message: result.msg, type: 'success', duration: 2000 })
            }
          }
        });
      }

      const closePassDialog = () => {
        context.emit("closePassDialog");
      }
      return { dataForm, ...toRefs(state), closePassDialog, updateData }
    }
  }
</script>