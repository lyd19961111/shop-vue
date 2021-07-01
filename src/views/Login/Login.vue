<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avator_box">
        <img src="@/assets/logo.svg" alt="" />
      </div>
      <!-- 登陆区域 -->
      <el-form
      ref="loginFormRef"
        label-width="0px"
        class="login_form"
        :model="loginForm"
        :rules="loginFormRules"
      >
        <!-- 账号区域 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-yonghu"
            placeholder="请输入账号"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <!-- 密码区域 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-mima"
            placeholder="请输入密码"
            v-model="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login('loginFormRef')">登陆</el-button>
          <el-button type="info" @click="resetLoginForm('loginFormRef')">重置</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>
import loginApi from '@/api/login.js'
export default {
  data () {
    return {
      // 登陆表单的数据绑定
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 登陆表单校验
      loginFormRules: {
        // 用户名校验
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 15, message: '账号长度在3到15个字符', trigger: 'blur' }
        ],
        // 密码校验
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度在6到15个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置账号密码
    resetLoginForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 账号登陆
    login (forName) {
      // 表单验证
      this.$refs[forName].validate((valid) => {
        if (!valid) {
          this.$message
          this.$message({
            type: 'error',
            message: '登陆失败'
          })
        } else {
          loginApi.login(this.loginForm.username, this.loginForm.password).then(response => {
            const resp = response.data
            // console.log(resp)
            if (resp.meta.status !== 200) {
              this.$message({
                type: 'error',
                message: '无效账号'
              })
            } else {
              this.$message({
                type: 'success',
                message: '登陆成功'
              })
              // 保存token
              const token = resp.data.token
              window.sessionStorage.setItem('token', token)
              this.$store.commit('setToken', token)
              // 跳转到主界面
              this.$router.push('/home')
              // console.log(resp)
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .avator_box {
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .login_form {
      position: fixed;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      .btns {
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>
