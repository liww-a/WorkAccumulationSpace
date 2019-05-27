<template>
  <!--  -->
</template>
<script>
import Qs from 'qs'
import AdaptScreen from '../../utils/adaptScreen'
export default {
  name: 'login',
  data () {
    return {
      form: {
        account: '',
        password: ''
      },
      rules: {
        account: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    setHeight: function () {
      /* eslint-disable no-new */
      let screenWidth = new AdaptScreen()
      return screenWidth._windowHeight - 105
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http({
            url: '/api/login',
            method: 'post',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {
              ...this.form
            },
            paramsSerializer: function (params) {
              return Qs.stringify(params, { arrayFormat: 'repeat' })
            }
          }).then((response) => {
            console.log(response)
          }).catch((error) => {
            console.log(error)
          })
        } else {
          console.log('error submit')
          return false
        }
      })
    },
    coso () {
      /* eslint-disable no-new */
      let screenWidth = new AdaptScreen()
      console.log(screenWidth._windowWidth)
      // alert提示 高深版
      this.$alert('这是一段内容', '标题名称', {
        confirmButtonText: '确定',
        callback: action => {
          this.$message({
            type: 'info',
            message: `action: ${ action }`
          });
        }
      })
      // alert提示简洁版
      this.$alert('登陆失败，请重新登录', '提示', {
        confirmButtonText: '确定',
        type: 'warning'
      }),
      // 删除监控
      deleteInterlligent () {
        this.$confirm('此操作将永久删除该单体, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          
        }).catch(() => {
          this.$message.info('已取消删除')
        })
      },
    },
    // 重置表单
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // JSON.stringify() === '{}' 判断对象为空
    // accept="image/png, image/jpeg" 判断上传文件类型
    // 路由跳转
    toSystemSeting () {
      this.$router.push({
        path: '/sysbody',
        query: {
          token: this.btn,
          currentUser: this.currentUser
        }
      }) + '_t=' + new Date().getTime()
    }
    // loading用法
    // import { Loading } from 'element-ui'
    // var loadingInstance  = Loading.service({
    //   text: '正在登录中。。。'
    // })
    // loadingInstance.close()

    // vue-migration-helper vue1.0到vue2.0迁移助手

      // #iframe牛逼用法
      // $("#iframe").attr('src', '/park/project/manager/simulation.html');
    
  }
}
</script>