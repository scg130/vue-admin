<template>
    <div class="form_container">
        <div class="manage_tip">
            <span class="title">在线后台管理系统</span>
            <el-form :model="registerUser" status-icon :rules="rules" ref="registerForm" class="registerForm" label-width="80px">
                <el-form-item label="用户名" prop="user_name">
                    <el-input v-model="registerUser.user_name" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="registerUser.email" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="phone">
                    <el-input v-model="registerUser.phone"  placeholder="请输入手机"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="passwd">
                    <el-input type="password" v-model="registerUser.passwd" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirm_passwd">
                    <el-input type="password" v-model="registerUser.confirm_passwd" placeholder="请输入确认密码"></el-input>
                </el-form-item>
                <!-- <el-form-item label="选择身份">
                    <el-select v-model="registerUser.identity" placeholder="请选择身份">
                        <el-option value="manager" label="管理员"></el-option>
                        <el-option value="employee" label="员工"></el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item>
                    <el-button type="primary" class="submit_btn" @click="submitForm('registerForm')">提交</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: 'Register',
  data () {
    var validatePass2 = (rule, value, callback) => {
      if (value !== this.registerUser.passwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      registerUser: {
        user_name: '',
        email: '',
        phone: '',
        passwd: '',
        confirm_passwd: '',
        role_ids:[]
        // identity: ''
      },
      rules: {
        user_name: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在2到30个字符之间', trigger: 'blur' }
        ],
        email: [
          {
            type: 'email',
            required: true,
            message: '邮箱格式不正确',
            trigger: 'blur'
          }
        ],
        phone: [
          {
            required: true,
            message: '手机格式不正确',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (!/^1[3456789]\d{9}$/.test(value)) {
                callback(new Error('手机号码格式不正确'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        passwd: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 30, message: '长度在2到30个字符之间', trigger: 'blur' }
        ],
        confirm_passwd: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          { min: 6, max: 30, message: '长度在6到30个之间', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
          this.registerUser.phone = Number(this.registerUser.phone);
          console.log(this.registerUser)
					this.$axios.post(HOST+'/admin/reg',this.registerUser).then(res => {
              if(res.data.code == 0){
                this.$message({
                  message: '注册成功',
                  type: 'success'
                })
                this.$router.push('/login')
                } else {
                  this.$message({
                    message: res.data.msg,
                    type: 'error'
                  })
                }
				})
      }
		})
    }
  }
}
</script>

<style scoped>
.form_container {
  position: relative;
  width: 100%;
  height: 100%;
  background: url(../../assets/bg.jpg) no-repeat center center;
  background-size: 100% 100%;
}
.manage_tip {
  width: 370px;
  height: 210px;
  position: absolute;
  top: 10%;
  left: 50%;
  padding: 25px;
  border-radius: 5px;
  text-align: center;
  margin-left: -185px;
}
.form_container .manage_tip .title {
  font-family: "Microsoft YaHei";
  font-weight: bold;
  font-size: 26px;
  color: #fff;
}

.registerForm {
  margin-top: 20px;
  background-color: white;
  padding: 20px 40px 20px 20px;
  border-radius: 5px;
  box-shadow: 0px 5px 10px #cccccc;
}
.submit_btn {
  width: 100%;
}
</style>