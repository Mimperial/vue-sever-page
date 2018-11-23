<template>
    <div class="accountPage">
      <!--<div class="accountPage_box_input">-->
        <!--<div class="accountPage_box_input_top">-->
          <!--<el-input-->
            <!--placeholder="服务器名称/键名称/IP/端口号/版本号"-->
            <!--suffix-icon="el-icon-search"-->
            <!--v-model="searchValue"-->
          <!--&gt;-->
          <!--</el-input>-->
        <!--</div>-->
        <!--<div class="accountPage_box_input_bottom">-->
          <!--<el-button @click="searchInput">搜索</el-button>-->
        <!--</div>-->
      <!--</div>-->
      <div class="accountPage_box_title">
        <div class="accountPage_box_title_left">
          当前XXX的键数量及表数量如下
        </div>
        <div class="accountPage_box_title_right">
          <div class="accountPage_box_title_right_list" @click="searchPerformancePage">性能监控查看
          </div>
        </div>
      </div>
      <div class="accountPage_box_content">
        <el-table
          :data="formData"
          border
          style="width: 100%"
          height="500px"
          highlight-current-row="true"
        >
          <el-table-column
            prop="name"
            label="名称"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="number"
            label="名称所对应的值"
            align="center"
          >
          </el-table-column>
        </el-table>
      </div>
      <div class="accountPage_box_end_page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="nowpage"
          :page-sizes="[9, 20, 60, 80]"
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
  name: 'AccountPage',
  data () {
    return {
      searchValue: '',
      searchId: '2',
      nowpage: 1,
      formData: [],
      everyrows: 9,
      oldData: []
    }
  },
  mounted () {
    if(localStorage.getItem("sessionKey")){
      this.getMethods(this.searchId);
    }else{
      this.$message({
        showClose: true,
        message: '未登录状态',
        duration: 1500
      });
      // this.$router.push({path:"/"})
    }
  },
  methods: {
    // 请求数据
    getMethods (sendSearchId) {
      let _this = this
      _this.formData = []
      let searchId = _this.searchValue ? _this.searchValue : sendSearchId
      _this.$message({
        showClose: true,
        message: '加载数据时间较长（25秒左右）,请耐心等待',
        duration: 4000
      });
      let sessionKey = localStorage.getItem("sessionKey")
      let sendOpt = {
        session_key: sessionKey,
        id: searchId
      }
      _this.axios.post('redis/statistics/', qs.stringify(sendOpt), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      }).then((res) => {
        console.log(res)
        if (res['data']['msg'] == 'success') {
          var resultObj = res['data']['resultObj'];
          var arr = [];
          for(var key in resultObj){
            var opt = {
              name: key,
              number: resultObj[key]
            }
            arr.push(opt)
          }
          if(arr.length > 0){
            _this.oldData = arr;
            _this.formData = _this.oldData.slice(0,_this.everyrows)
          }else {
            _this.formData = [];
          }
        } else {
          _this.$message({
            message: res['data']['msg'],
            type: 'error',
            duration: 2000
          })
        }
      }).catch((err) => {
        _this.$message({
          message: "服务器500",
          type: 'error',
          duration: 2000
        })
      })
    },
    searchPerformancePage () {
      this.$router.push({path:'/PerformancePage'})
    },
    searchInput () {
      if(this.searchValue.length > 0){
        this.formData = []
        this.getMethods()
      } else {
        this.$message({
          message: 'input输入框不能为空',
          type: 'error',
          duration: 2000
        })
      }
    },
    handleSizeChange (val) {
      this.everyrows = val;
      this.formDat = this.oldData.slice((this.nowpage-1)*this.everyrows,this.nowpage*this.everyrows)
    },
    handleCurrentChange (val) {
      this.nowpage = val;
      this.formData = this.oldData.slice((val-1)*this.everyrows,val*this.everyrows)
    }
  }
}
</script>

<style scoped>
  .accountPage{
    height: 100%;
    width: 100%;
    background: #666666;
    padding: 15px 15px 15px 15px;
    box-sizing: border-box;
  }
  a{
    color: #3399CC;
    font-size: 14px;
  }
  .accountPage_box_input{
    height: 40px;
    width: 400px;
    display: flex;
  }
  .accountPage_box_input_top{
    height: 40px;
    width: 300px;
  }
  .accountPage_box_title{
    height: 40px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    /*margin-top: 20px;*/
  }
  .accountPage_box_title_left{
    height: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: #FF6600;
    font-size: 14px;
  }
  .accountPage_box_title_right{
    width: 135px;
    height: 100%;
    display: flex;
    flex-shrink: 0;
    justify-content: space-between;
    font-size: 14px;
    color: white;
  }
  .accountPage_box_title_right_list{
    height: 100%;
    width: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .accountPage_box_content{
    width: 100%;
    height: 500px;
    background: #cccccc;
    margin-top: 20px;
  }
  .accountPage_box_end_page{
    height: 40px;
    width: 100%;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
