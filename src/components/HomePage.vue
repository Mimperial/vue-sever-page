<template>
  <div class="container">
    <div class="col-2-3">
      <div class="input-nav">
        <el-input class="input-basic"
                  placeholder="服务器名称/键名称/IP/端口号/版本号"
                  suffix-icon="el-icon-search"
                  v-model="searchSever">
        </el-input>
        <el-button class="add-server-btn" type="primary" @click="dialogFormVisible = true">添加服务器</el-button>
        <el-dialog title="添加服务器" :visible.sync="dialogFormVisible">
          <el-form :model="form">
            <el-form-item label="服务器名称" :label-width="formLabelWidth" placeholder="请输入自定义名称">
              <el-input v-model="form.severName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="服务器IP" :label-width="formLabelWidth" placeholder="请输入正确IP地址">
              <el-input v-model="form.severIp" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="服务器端口号" :label-width="formLabelWidth" placeholder="请输入5位数端口号">
              <el-input v-model="form.severPort" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="服务器端密码" :label-width="formLabelWidth" placeholder="请输入密码">
              <el-input v-model="form.severPassword" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addServer">确定添加</el-button>
          </div>
        </el-dialog>

      </div>
      <div class="table-content">
        <el-table
          :data="tableData"
          style="width: 100%"
          @cell-click="cellClick"
        >
          <el-table-column
            prop="name"
            label="服务器名称"
            align="center"
          >
          </el-table-column>
          <el-table-column
          prop="keys"
          label="键总数/个"
          align="center"
        >
        </el-table-column>
          <el-table-column
            prop="ip"
            label="IP"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="port"
            label="端口号"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="redis_version"
            label="版本号"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="is_work"
            label="运行模式"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="days"
            label="运行时间(天)"
            align="center"
          >
          </el-table-column>
          <el-table-column label="性能监控"
                           align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                >查看详情</el-button>
            </template>
          </el-table-column>
          <el-table-column label="键统计数据"
                           align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                >查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--<el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400">
        </el-pagination>-->
      </div>
    </div>
  </div>
</template>
<style scoped>
  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
    text-decoration: none;
  }

  div.container {
    width: 100%;
    /*background-color: #525c65;*/
  }

  div.col-1-3 {
    width: 10%;
    height: 900px;
    display: inline-block;
    background-color: #525c65;
    color: #fff;
  }

  div.col-2-3 {
    width: 100%;
    background-color: aliceblue;
    height: 900px;
    display: inline-block;
  }
  .input-basic{
    width: 300px;
    height: 40px;
    padding: 8px;
  }
  div.input-basic .el-input. el-input__suffix {
    right: 20px;
  }
  .add-server-btn{
    background-color: #6c829c;
  }
</style>

<script>
import axios from 'axios'
import qs from 'qs'

import Vue from 'vue'
Vue.prototype.$qs = qs

export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your 服务器 App',
      dialogFormVisible: false,
      searchSever: '',
      form: {
        name: '',
        region: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        severName: '',
        severIp: '',
        severPort: '',
        severPassword: ''
      },
      formLabelWidth: '120px',
      itemTotal: 0,
      tableData: []
    }
  },
  mounted () {
    this.getAllRedis()
  },
  updates () {
  },
  methods: {
    // 获取所有redis名称
    getAllRedis () {
      var _this = this
      var sessionKey = window.localStorage.getItem('sessionKey')
      axios.post('/redis/info', qs.stringify(
        {
          session_key: sessionKey
        }))
        .then(function (resAddRedis) {
          if (resAddRedis.data.code === 1) {
            var aResultRedisObj = resAddRedis.data.resultObj
            for (var i = 0; i < aResultRedisObj.length; i++) {
              // 通过id获取到该行服务器的基本信息
              var sRedisId = aResultRedisObj[i].id
              // 获取对应名称的基本信息
              axios.post('/redis/detail/', qs.stringify(
                {
                  session_key: sessionKey,
                  id: sRedisId,
                  data_type: 0
                }))
                .then(function (resAddRedis) {
                  if (resAddRedis.data.code === 1) {
                    var atableData = resAddRedis.data.resultObj
                    _this.tableData.push(atableData)
                  } else if (resAddRedis.data.code === 2) {
                    _this.$message({
                      type: 'info',
                      message: '获取详情信息失败'
                    })
                  }
                })
                .catch(function (error) {
                  console.log('获取redis信息接口请求失败' + error.toString())
                })
            }
          } else if (resAddRedis.data.code === 2) {
            _this.$message({
              type: 'info',
              message: '获取失败'
            })
          }
        })
        .catch(function (error) {
          console.log('获取所有redis信息接口请求失败' + error.toString())
        })
    },
    // 添加服务器
    addServer () {
      var _this = this
      var sessionKey = window.localStorage.getItem('sessionKey')
      if (_this.form.severPort.length < 4) {
        _this.$message({
          type: 'info',
          message: '请输入至少4位数端口号'
        })
      } else {
        axios.post('/redis/add/', qs.stringify(
          {
            session_key: sessionKey,
            name: _this.form.severName,
            ip: _this.form.severIp,
            port: _this.form.severPort,
            password: _this.form.severPassword
          }))
          .then(function (resAddRedis) {
            if (resAddRedis.data.code === 1) {
              _this.$message({
                type: 'success',
                message: '添加成功!'
              })
              _this.getAllRedis()
              _this.form.severName = ''
              _this.form.severIp = ''
              _this.form.severPort = ''
              _this.form.severPassword = ''
            } else if (resAddRedis.data.code === 3) {
              _this.$message({
                type: 'info',
                message: resAddRedis.data.msg
              })
            }
          })
          .catch(function (error) {
            console.log('添加服务器接口请求失败' + error.toString())
          })
      }
    },
    handleSizeChange () {
      console.log('pass')
    },
    handleCurrentChange () {
      console.log('pass')
    },
    // 点击该行第一个单元格获取该行的id,name信息传给新打开页面
    cellClick (row, event, column) {
      localStorage.setItem('severName', row.name)
      localStorage.setItem('severId', row.id)
      if (column.cellIndex === 1) {
        window.open('#/DetailPage')
      } else if (column.cellIndex === 7) {
        window.open('#/PerformancePage')
      } else if (column.cellIndex === 8) {
        window.open('#/AccountPage')
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
