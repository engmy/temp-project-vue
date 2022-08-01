<template>
  <el-form :model="form" :rules="rules" ref="formRef" label-width="90px">
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="grid">
          <div class="grid-title">个人资料</div>
          <div class="grid-content">
            <el-form-item prop="avatar">
              <el-upload class="avatar-uploader" :with-credentials="true" :headers="headers" :action="action" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                <img v-if="form.avatar" :src="form.avatar" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="登录账号：">{{form.username}}</el-form-item>
            <el-form-item label="所属工厂：">{{form.site_name}}</el-form-item>
            <el-form-item label="昵&emsp;&emsp;称："> {{form.nickname}}</el-form-item>
            <el-form-item label="性&emsp;&emsp;别：" disabled>{{form.status==1? '男': '女'}}</el-form-item>
            <el-form-item label="手&emsp;&emsp;机：">{{form.phone}}</el-form-item>
            <el-form-item label="邮&emsp;&emsp;箱：">{{form.email}}</el-form-item>
          </div>
        </div>
      </el-col>

      <el-col :span="16">
        <div class="grid">
          <div class="grid-title">基本资料</div>
          <div class="grid-content">
            <el-form-item label="昵&emsp;称：">
              <el-input v-model="form.nickname" class="input"></el-input>
            </el-form-item>
            <el-form-item label="性&emsp;别：">
              <el-select v-model="form.sex" placeholder="请选择性别" style="width: 100%">
                <el-option v-for="item in sexList" :key="item.sexId" :label="item.sexName" :value="item.sexId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="手&emsp;机：">
              <el-input v-model="form.phone" class="input"></el-input>
            </el-form-item>
            <el-form-item label="邮&emsp;箱：">
              <el-input v-model="form.email" class="input"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" icon="el-icon-check" @click="submitForm">提 交</el-button>
            </el-form-item>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
import storage from "@/utils/storage";
import { onMounted, reactive, ref, toRefs } from "vue";
import { elMessage } from 'element-plus'
import { getUserAvatar, updateProfile } from "@/api/dashboard/profile";
import { getToken } from "@/utils/auth";

export default {
  name: "info",
  setup()
  {
      let userInfo = storage.get("userInfo");
      const formRef = ref("formRef");
      const state = reactive({
          action: "",
          headers: { token : getToken() },
          form: {
              avatar:     "",
              username:   userInfo.username,
              site_name:  userInfo.site_name,
              status:     userInfo.status,
              phone:      userInfo.phone,
              email:      userInfo.email,
              nickname:   userInfo.nickname,
              sex:        userInfo.sex,
              create_time:userInfo.create_time,
          },
          rules: {
              nickname: [
                  {required: true, message: '请输入名称', trigger: 'blur'},
                  {min: 1, message: '长度最少 1 个字符', trigger: 'blur'}
              ],
              sex: [
                {required: true, message: '请选择性别', trigger: 'blur'},
              ],
              email: [
                  {required: true, message: '请输入邮箱地址', trigger: 'blur'},
                  {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
              ],
              password: [
                {min: 10, max: 20, message: '长度在 10 到 20 个字符', trigger: 'blur'}
              ]
          },
          sexList: [
              { sexId: 1, sexName: '男' },
              { sexId: 2, sexName: '女' }
          ],
          dialogFormVisible: false,
      });

      const submitForm = async () =>
      {
          let formData = {
              nickname: state.form.nickname,
              phone: state.form.phone,
              email: state.form.email,
              sex: state.form.sex
          };

          const result = await updateProfile(formData)
          if (result.code==200)
          {
              elMessage({message: result.msg, type: 'success', duration: 2000 })
          }else{
              elMessage({message: result.msg, type: 'error', duration: 2000 })
          }
      };

      const beforeAvatarUpload = (file) =>
      {
          const fileType = ["image/jpeg", "image/png"];
          const isJPG = fileType.includes(file.type);
          const isLt2M = file.size / 1024 / 1024 < 2;

          if (!isJPG) {
              elMessage({message: "上传头像图片只能是 JPG、PNG 格式!", type: 'error', duration: 2000 })
          }
          if (!isLt2M) {
              elMessage({message: "上传头像图片大小不能超过 2MB!", type: 'error', duration: 2000 })
          }
          return isJPG && isLt2M;
      };

      const handleAvatarSuccess = (res) =>
      {
          if(res.code==200)
          {
              handleUserAvatar();
          }
      };

      const handleUserAvatar = async() =>
      {
          await getUserAvatar().then(res =>
          {
              const blob = new Blob([res], {type: 'application/png;charset=utf-8'});
              state.form.avatar = window.URL.createObjectURL(blob);
          }).catch(err =>
          {
              console.log(err);
          });
      };

      onMounted(()=>
      {
          state.action = process.env.VUE_APP_BASE_API + "/admin/profile/avatar";
          handleUserAvatar();
      })

      return { formRef, ...toRefs(state), submitForm, handleUserAvatar, handleAvatarSuccess, beforeAvatarUpload };
  }
};
</script>

<style lang="scss" scoped>
.avatar
{
    width: 120px;
    height: 120px;
    margin-left: 80px;
    border-radius: 50%;
}
.grid{
  border-radius: 4px;
  min-height: 36px;
  background: #FFFFFF;
  border: 1px #eee solid;
  border-radius: 0;
  height: 600px;
}
.grid-title
{
    height:43px;
    font-size:14px;
    background:#FAFAFA;
    line-height:43px;
    margin-bottom:50px;
    padding-left:20px;
}
.grid-content {
  margin: 20px;
}
</style>