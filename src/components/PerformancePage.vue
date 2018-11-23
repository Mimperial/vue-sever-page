<template>
    <div class="performancePage">
      <el-input class="input-basic"
                placeholder="服务器名称/键名称/IP/端口号/版本号"
                suffix-icon="el-icon-search"
                v-model="searchSever">
      </el-input>
      <div class="info-perform">
        <span>当前{{ theServer }}的性能监控详情如下</span>
        <a href="./AccountPage.vue">性能监控查看</a>
      </div>
      <div class="server-navbtn">
        <el-button class="add-server-btn" type="primary" @click="dialogFormVisible = true">内存使用量</el-button>
        <el-button class="add-server-btn" type="primary" @click="dialogFormVisible = true">Key命中详情</el-button>
        <el-button class="add-server-btn" type="primary" @click="dialogFormVisible = true">Key数量</el-button>
        <el-button class="add-server-btn" type="primary" @click="dialogFormVisible = true">Cpu使用率</el-button>
        <el-button class="add-server-btn" type="primary" @click="dialogFormVisible = true">连接数</el-button>
      </div>
      <div id="lineChart" class="lineChart">

      </div>
    </div>
</template>
<style scoped>
  .performancePage{
    height: 100%;
    width: 100%;
    background: aliceblue;
  }
  .input-basic{
    width: 300px;
    height: 40px;
    padding: 8px;
  }
  .info-perform{
    margin: 5px;
    padding: 5px;
  }
  .info-perform a{
    color: #6699cc;
    text-decoration: dashed;
  }
  .server-navbtn{
    margin: 5px;
    padding: 0 5px;
  }
  .lineChart{
    width: 800px;
    height: 600px;
  }
</style>
<script>
import echarts from 'echarts'
export default {
  name: 'PerformancePage',
  data () {
    return {
      theServer: '',
      searchSever: ''
    }
  },
  mounted () {
    this.drawLine()
    this.canvas()
  },
  methods: {
    drawLine () {
      this.chart = echarts.init(document.getElementById('lineChart'))
      var option = {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line'
        }]
      }
      this.chart.setOption(option)
    },
    canvas () {
      var severName = window.localStorage.getItem('severName')
      var severId = window.localStorage.getItem('severId')
      console.log(severName + severId)
    }
  }
}
</script>
