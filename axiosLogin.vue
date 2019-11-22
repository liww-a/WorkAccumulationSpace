<template>
  <!--  -->
  <div>
     <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>导航一</span>
        </template>
        <el-menu-item-group>
          <template slot="title">分组一</template>
          <el-menu-item index="1-1">选项1</el-menu-item>
          <el-menu-item index="1-2">选项2</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="分组2">
          <el-menu-item index="1-3">选项3</el-menu-item>
        </el-menu-item-group>
        <el-submenu index="1-4">
          <template slot="title">选项4</template>
          <el-menu-item index="1-4-1">选项1</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-menu-item index="2">
        <i class="el-icon-menu"></i>
        <span slot="title">导航二</span>
      </el-menu-item>
      <el-menu-item index="3" disabled>
        <i class="el-icon-document"></i>
        <span slot="title">导航三</span>
      </el-menu-item>
      <el-menu-item index="4">
        <i class="el-icon-setting"></i>
        <span slot="title">导航四</span>
      </el-menu-item>
    </el-menu>



<el-menu :default-active="defaultSelectedCode" :collapse="collapsed" @select="handleClick">
  <el-submemu index="CostMeasure">
    <template slot="title">
      <i class="menu-icon"></i><span>成本测算管理</span>
    </template>
    <el-menu-item index="Budget">
      <i>图标</i><span>成本测算编制</span>
    </el-menu-item>
    <el-menu-item index="Statistics">
      <i>图标</i><span>成本测算统计</span>
    </el-menu-item>
  </el-submemu>
  <el-submemu index="DataAnalysis">
    <template slot="title">
      <i class="menu-icon"></i><span>数据分析</span>
    </template>
    <el-menu-item index="Expense">
      <i>图标</i><span>成本费用分析</span>
    </el-menu-item>
    <el-menu-item index="Price">
      <i>图标</i><span>工料价格分析</span>
    </el-menu-item>
  </el-submemu>
</el-menu>
  </div>
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
      // alert提示 高深版
      this.$alert('这是一段内容', '标题名称', {
        confirmButtonText: '确定',
        callback: action => {
          this.$message({
            type: 'info',
            message: `action: ${ action }`
          })
        }
      })
      // alert提示简洁版
      this.$alert('登陆失败，请重新登录', '提示', {
        confirmButtonText: '确定',
        type: 'warning'
      })
    },
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
    },
    // vue-migration-helper vue1.0到vue2.0迁移助手

    // #iframe牛逼用法
    // $("#iframe").attr('src', '/park/project/manager/simulation.html');
    async fetchUserInfo () {
      this.$store.commit('USER_INFO_REQUEST')
      const res = await this.$api.loadUserInfo()
      return new Promise(function (resolve, reject) {
        if (res instanceof Object && res.tenantId) {
          this.$store.commit('USER_INFO_SUCCESS', res)
          resolve(true)
        } else {
          throw new Error()
        }
      })
    },

  },
  mounted () {
    Promise.all([
      this.fetchUserInfo(),
      this.this.fetchOrgTree()
    ]).then(function (res) {
      
    })
  }
}
</script>