<template>
  <div class="login">
    <div class="login_content">
      <div class="login_content_alone">
        <div class="login_content_name">账号:</div>
        <div class="login_content_content">
          <el-input
            placeholder="请输入账号"
            v-model="account"
            clearable>
          </el-input>
        </div>
      </div>
      <div class="login_content_alone login_password">
        <div class="login_content_name">密码:</div>
        <div class="login_content_content">
          <el-input
            placeholder="请输入密码"
            v-model="password"
            type="password"
            clearable>
          </el-input>
        </div>
      </div>
      <div class="login_content_login" @click="login">登录
        <!--<el-button size="medium" @click="login">登录</el-button>-->
        <!--<el-button size="medium" @click="signUp">注册</el-button>-->
      </div>
    </div>
  </div>
</template>

<script>
import qs from 'qs'
export default {
  name: 'Login',
  data () {
    return {
      name: '',
      account: '', // 账号
      password: '' // 密码
    }
  },
  methods: {
    login () {
      let _this = this
      if (this.account.length > 0 && this.password.length > 0) {
        let opt = {
          token: '',
          username: this.account,
          password: this.password
        }
        this.axios.post('redis/login/', qs.stringify(opt), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((res) => {
          if (res['data']['msg'] == 'success') {
            let session_key = res['data']['resultObj'];
            localStorage.setItem('sessionKey', session_key);
            _this.$emit('changeShow', true)
            localStorage.setItem('login', 'true')
          } else {
            this.$message({
              message: res['data']['msg'],
              type: 'error',
              duration: 1500
            })
          }
        })
      } else if (this.account.length <= 0 && this.password.length <= 0) {
        this.$message({
          message: '账号和密码不能为空',
          type: 'error',
          duration: 1500
        })
      } else if (this.account.length > 0 && this.password.length <= 0) {
        this.$message({
          message: '密码不能为空',
          type: 'error',
          duration: 1500
        })
      } else if (this.account.length <= 0 && this.password.length > 0) {
        this.$message({
          message: '账号不能为空',
          type: 'error',
          duration: 1500
        })
      }
    },
    signUp () {
      console.log('signUp')
    }
  }
}
</script>

<style scoped>
  .login{
    width: 100%;
    height: 100%;
    background: #666666;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .login_content{
    height: 300px;
    width: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .login_content_alone{
    height: 40px;
    width: 100%;
    display: flex;
  }
  .login_password{
    margin-top: 15px;
  }
  .login_content_name{
    width: 70px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
  .login_content_content{
    height: 100%;
    flex: 1;
  }
  .login_content_login{
    height: 40px;
    width: 230px;
    background: #ffffff;
    border-radius: 4px;
    margin-top: 15px;
    margin-left: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    /*justify-content: space-around;*/
    cursor: pointer;
  }
</style>
