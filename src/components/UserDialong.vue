<template>
  <div class="nofind">
    <el-dialog
      :title="dialong.title"
      type="primary"
      size="small"
      :close-on-press-escape="true"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :visible.sync="dialong.show"
    >
      <el-form :model="form" ref="formdoalog" :rules="formdialog" label-width="80px">
        <el-form-item label="用户名" prop="user_name">
          <el-input v-model="form.user_name" :disabled="dialong.disabled"></el-input>
        </el-form-item>
        <el-form-item label="email" prop="email">
          <el-input v-model="form.email" :disabled="dialong.disabled"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="form.phone" :disabled="dialong.disabled"></el-input>
        </el-form-item>

        <el-form-item label="锁定：" prop="state">
            <el-radio-group v-model="form.state">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="2">否</el-radio>
            </el-radio-group>
        </el-form-item>

        <el-form-item label="角色" prop="role_ids">
          <el-checkbox-group v-model="form.role_ids">
                <el-checkbox
                 v-for="item in roleData"
                  :label="item.id"
                  :key="item.id">{{item.name}}</el-checkbox> 
          </el-checkbox-group>        
        </el-form-item>

        <el-form-item label="密码" prop="passwd">
          <el-input type="password" v-model="form.passwd"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirm_passwd">
          <el-input type="password" v-model="form.confirm_passwd"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialong.show = false">取 消</el-button>
        <el-button type="primary" @click="addHandle('formdoalog')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: "UserDialong",
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value != "" && this.form.passwd != "" && value !== this.form.passwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      roleData: [
        {
          id: 1,
          name: "超级管理员"
        },
        {
          id: 2,
          name: "普通管理员"
        },
        {
          id: 3,
          name: "普通用户"
        }
      ],
      formdialog: {
        user_name: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
        state: [{required: true, message: "请选择状态", trigger: "change"}],
        phone: [{ required: true, message: "手机号码格式不正确", trigger: "blur" },{
            validator: (rule, value, callback) => {
              if (!/^1[3456789]\d{9}$/.test(value)) {
                callback(new Error('手机号码格式不正确'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }],
        email: [
          {
            type: 'email',
            required: true,
            message: '邮箱格式不正确',
            trigger: 'blur'
          }
        ],
        passwd: [
          { required: false, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 30, message: '长度在2到30个字符之间', trigger: 'blur' }
        ],
        confirm_passwd: [
          { required: false, message: '确认密码不能为空', trigger: 'blur' },
          { min: 6, max: 30, message: '长度在6到30个之间', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]  
      }
    };
  },
  props: {
    dialong: Object,
    form: Object
  },
  methods: {
    roles(){
      var url = HOST + '/admin/api/roles';
        this.$axios.post(url).then(resp => {
          this.roleData = resp.data.data;
        }).catch();
    },
    addHandle(formdoalog) {
      this.$refs[formdoalog].validate(valid => {
        if (valid) {
          // console.log(this.form)
          let url =
            this.dialong.option == "add" ? "add" : `edit/${this.form.id}`;
          this.form.phone = parseInt(this.form.phone);
          this.$axios.post(HOST+`/admin/api/user/${url}`, this.form).then(res => {
            if (res.status === 401) {
              next("/login");
              return
            }
            
            if (res.data.code == 0) {
                this.$message({
                  type: "success",
                  message: res.data.msg
                }),
              (this.dialong.show = false);
              this.$emit("UserData");
              //清空内容
              this.form.value = {};
            } else {
              this.$message({
                type: "error",
                message: res.data.msg
              });
            }

          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  created() {
    this.roles();
  }
};
</script>
<style scoped>
</style>
