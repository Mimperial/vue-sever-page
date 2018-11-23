<template>
    <div class="detail_box">
      <div class="detail_box_input">
        <div class="detail_box_input_top">
          <el-input
            placeholder="输入键名称"
            suffix-icon="el-icon-search"
            v-model="searchValue"
          >
          </el-input>
        </div>
        <div class="detail_box_input_bottom">
          <el-button @click="searchInput">查询</el-button>
        </div>
      </div>
      <div class="detail_box_title">
        <div class="detail_box_title_left">
          当前XXX服务器键总数为: {{total}}
        </div>
        <div class="detail_box_title_right">
          <div class="detail_box_title_right_list" @click="lookPerformancePage">性能监控查看</div>
          <div class="detail_box_title_right_list" @click="lookAccountPage">键统计数据查看</div>
        </div>
      </div>
      <div class="detail_box_content">
        <el-table
          :data="formData"
          border
          style="width: 100%"
          height="500px"
          highlight-current-row="true"
        >
          <el-table-column
            prop="name"
            label="键名称"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="number"
            label="二级键数量"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="space"
            label="空间大小"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="structure"
            label="结构"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="time"
            label="有效期"
            align="center"
          >
          </el-table-column>
        </el-table>
      </div>
      <div class="detail_box_end_page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="nowpage"
          :page-sizes="[9, 40, 60, 80]"
          :page-size="everyrows"
          layout="total, sizes, prev, pager, next, jumper"
          :total="oldData.length">
        </el-pagination>
      </div>
    </div>
</template>

<script>
import qs from 'qs'
export default {
  name: 'DetailPage',
  data () {
    return {
      searchValue: '', //input框内容
      searchId: '2',
      currentPage: 1,
      total: '',
      formData: [
        // {
        //   number: '20160502',
        //   name: '王小虎',
        //   space: '无',
        //   structure: '结构',
        //   time: '永久'
        // }
      ],
      oldData: [],
      everyrows: 9,
      nowpage: 1
    }
  },
  mounted () {
    if (localStorage.getItem("sessionKey")) {
      this.calculate(this.searchId)
    } else {
      _this.$message({
        message: "sessionKey为空",
        type: 'error',
        duration: 1500
      })
      // this.$router.push({path:'/'});
      // this.isShow = false
    }
  },
  methods: {
    calculate() {
      var _this = this
      this.formData = []
      this.total = ""
       _this.$message({
         showClose: true,
         message: '加载数据时间较长（40秒）,请耐心等待',
         duration: 1500
       });
      var sessionKey = localStorage.getItem("sessionKey");
      var searchId = _this.searchId
      var opt = {
        // session_key: 'gg30xrp3ez6z4wjzdzljoy5t16e6zh8w',
        session_key: sessionKey,
        id: searchId,
        pn: '1',
        rn: '100'
      }
      var timeNumer = 2;
      var timer = setInterval(function(){
        timeNumer--;
        if(timeNumer == 0){
          new Promise((resolve,reject) => {
            _this.axios.post('redis/keys/', qs.stringify(opt), {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }).then((res) => {
              if (res['data']['code'] == '1') {
                // var resultObj = JSON.parse(res['data']['resultObj']);
                var resultObj = res['data']['resultObj'];
                for(var key in resultObj) {
                  if (key == 'keys') {
                    if (resultObj[key].length > 0) {
                      _this.total = resultObj['total']
                      resolve(resultObj[key]);
                    }
                  }
                }
              } else {
                _this.$message({
                  message: res['data']['msg'],
                  type: 'error',
                  duration: 1500
                })
              }
            }).catch((err) => {
              _this.$message({
                message: "服务器500",
                type: 'error',
                duration: 3000
              })
            })
          }).then((list) => {
            if (list && list instanceof Array) {
              var resetList = "";
              for(var i = 0 ;i < list.length ; i++){
                resetList += "'" + list[i] + "',"
              }
              var sendOpt = {
                'session_key': sessionKey,
                'id': searchId,
                'keys': "[" + resetList+ "]"
              }
              _this.axios.post('redis/key_detail/', qs.stringify(sendOpt), {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                }
              }).then((res) => {
                if (res['data']['code'] == '1') {
                  var returnData = res['data']['resultObj'];
                  if (Object.keys(returnData).length > 0) {
                    for (var keyName in returnData){
                      if (keyName == 'success_li' && returnData[keyName].length > 0) {
                        var successLi = returnData[keyName];
                        var resetformData = successLi.map(function(val){
                          if (!val['valid']) {
                            return {
                              number: val['total'],
                              name: val['key'],
                              time: "永久",
                              structure: val["structure"],
                              space: "无"
                            }
                          } else {
                            return {
                              number: val['total'],
                              name: val['key'],
                              time: val['valid'],
                              structure: val["structure"],
                              space: "无"
                            }
                          }
                        })
                        if(resetformData.length > 0){
                          _this.oldData = resetformData;
                          _this.formData = _this.oldData.slice(0,_this.everyrows)
                        } else {
                          _this.formData = []
                        }

                      } else if(keyName == 'fail_li' && returnData[keyName].length > 0) {
                        _this.$message({
                          message: returnData[keyName][0],
                          type: 'error',
                          duration: 2000
                        })
                      }
                    }
                  }
                }
              }).catch((err) => {
                _this.$message({
                  message: '服务器500',
                  type: 'error',
                  duration: 2000
                })
              })
            }
          })
          clearInterval(timer)
        }
      },1000)
    },
    // 查询键名称
    searchCalculate() {
      var _this = this
      this.formData = []
      this.total = ""
      _this.$message({
        showClose: true,
        message: '加载数据时间较长,请耐心等待',
        duration: 1500
      });
      var sessionKey = localStorage.getItem("sessionKey");
      var searchId = _this.searchId
      var opt = {
        // session_key: 'gg30xrp3ez6z4wjzdzljoy5t16e6zh8w',
        session_key: sessionKey,
        id: searchId,
        key: _this.searchValue,
        pn: '1',
        rn: '100'
      }
      var timeNumer = 2;
      var timer = setInterval(function(){
        timeNumer--;
        if(timeNumer == 0){
          new Promise((resolve,reject) => {
            _this.axios.post('redis/search_key/', qs.stringify(opt), {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }).then((res) => {
              if (res['data']['code'] == '1') {
                // var resultObj = JSON.parse(res['data']['resultObj']);
                var resultObj = res['data']['resultObj'];
                for(var key in resultObj) {
                  if (key == 'keys') {
                    if (resultObj[key].length > 0) {
                      _this.total = resultObj['total']
                      resolve(resultObj[key]);
                    }
                  }
                }
              } else {
                _this.$message({
                  message: res['data']['msg'],
                  type: 'error',
                  duration: 1500
                })
              }
            }).catch((err) => {
              _this.$message({
                message: "服务器500",
                type: 'error',
                duration: 3000
              })
            })
          }).then((list) => {
            if (list && list instanceof Array) {
              var resetList = "";
              for(var i = 0 ;i < list.length ; i++){
                resetList += "'" + list[i] + "',"
              }
              var sendOpt = {
                'session_key': sessionKey,
                'id': searchId,
                'keys': "[" + resetList+ "]"
              }
              _this.axios.post('redis/key_detail/', qs.stringify(sendOpt), {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                }
              }).then((res) => {
                if (res['data']['code'] == '1') {
                  var returnData = res['data']['resultObj'];
                  if (Object.keys(returnData).length > 0) {
                    for (var keyName in returnData){
                      if (keyName == 'success_li' && returnData[keyName].length > 0) {
                        var successLi = returnData[keyName];
                        var resetformData = successLi.map(function(val){
                          if (!val['valid']) {
                            return {
                              number: val['total'],
                              name: val['key'],
                              time: "永久",
                              structure: val["structure"],
                              space: "无"
                            }
                          } else {
                            return {
                              number: val['total'],
                              name: val['key'],
                              time: val['valid'],
                              structure: val["structure"],
                              space: "无"
                            }
                          }
                        })
                        if(resetformData.length > 0){
                          _this.oldData = resetformData;
                          _this.formData = _this.oldData.slice(0,_this.everyrows)
                        } else {
                          _this.formData = []
                        }

                      } else if(keyName == 'fail_li' && returnData[keyName].length > 0) {
                        _this.$message({
                          message: returnData[keyName][0],
                          type: 'error',
                          duration: 2000
                        })
                      }
                    }
                  }
                }
              }).catch((err) => {
                _this.$message({
                  message: '服务器500',
                  type: 'error',
                  duration: 2000
                })
              })
            }
          })
          clearInterval(timer)
        }
      },1000)
    },
    lookPerformancePage (){
      this.$router.push({path:"/PerformancePage"})
    },
    lookAccountPage () {
      this.$router.push({path:"/AccountPage"})
    },
    searchInput () {
      if (this.searchValue.length > 0) {
        this.searchCalculate()
      } else {
        this.$message({
          message: "input框不能为空",
          type: 'error',
          duration: 2000
        })
      }
    },
    handleSizeChange (val) {
      this.everyrows = val;
      this.formData = this.oldData.slice((this.nowpage-1)*this.everyrows,this.nowpage*this.everyrows)
    },
    handleCurrentChange (val) {
      this.nowpage = val;
      this.formData = this.oldData.slice((val-1)*this.everyrows,val*this.everyrows)
    }
  }
}
</script>

<style scoped>
  .detail_box{
    height: 100%;
    width: 100%;
    background: #666666;
    padding: 15px 15px 15px 15px;
    box-sizing: border-box;
  }
  .detail_box_input{
    height: 40px;
    width: 400px;
    display: flex;
  }
  .detail_box_input_top{
    height: 100%;
    width: 300px;
  }
  detail_box_input_bottom{
    height: 100%;
    width: 100px;
  }
  .detail_box_title{
    height: 40px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
  }
  .detail_box_title_left{
    height: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: #FF6600;
    font-size: 14px;
  }
  .detail_box_title_right{
    width: 250px;
    height: 100%;
    display: flex;
    flex-shrink: 0;
    justify-content: space-between;
  }
  .detail_box_title_right_list{
    height: 100%;
    width: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #3399CC;
    cursor: pointer;
  }
  .detail_box_content{
    width: 100%;
    height: 500px;
    background: #cccccc;
    margin-top: 20px;
  }
  .detail_box_end_page{
    height: 40px;
    width: 100%;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
