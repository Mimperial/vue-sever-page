<template>
  <div id="app" class="app">
    <div class="app_content" v-if='isShow'>
      <div class="app_head">
        <div class="app_head_logo"></div>
        <div class="app_head_info">潘多拉搜索</div>
        <div class="app_head_return" @click="exit">退出</div>
      </div>
      <div class="app_box">
        <div class="app_box_left">
          <div class="app_box_list" @click="searchFirst">基本信息</div>
          <div class="app_box_list" @click="searchSecond">键详情</div>
          <div class="app_box_list" @click="searchThird">性能监控</div>
          <div class="app_box_list" @click="searchFour">键统计</div>
        </div>
        <div class="app_box_right">
          <router-view/>
        </div>
      </div>
    </div>
    <div class="app_content_second" v-if="!isShow">
      <Login @changeShow="changeShow"></Login>
    </div>
  </div>
</template>

<script>
import Login from '@/components/Login'
export default {
  name: 'App',
  components: {
    Login
  },
  data () {
    return {
      isShow: false
    }
  },
  mounted () {
    let isShow = localStorage.getItem("login");
    if(isShow){
      this.isShow = isShow;
    }
  },
  methods: {
    // 判断显示
    changeShow (state) {
      this.isShow = state
    },
    //点击标签添加背景色
    tagListContent(index){
      var addBackground = document.getElementsByClassName("app_box_list");
      var domLen = addBackground.length;
      for(let i = 0; i < domLen; i++){
        if(index == i){
          this.addClass(addBackground[i],"app_box_list_color")
        }else{
          this.removeClass(addBackground[i],"app_box_list_color")
        }
      }
    },
    //判断是否有某个class
    hasClass( elements,cName ){
      return !!elements.className.match( new RegExp( "(\\s|^)" + cName + "(\\s|$)") ); // ( \\s|^ ) 判断前面是否有空格 （\\s | $ ）判断后面是否有空格 两个感叹号为转换为布尔值 以方便做判断
    },
    //添加class名
    addClass( elements,cName ){
      if( !this.hasClass( elements,cName ) ){
        elements.className += " " + cName;
      }
    },
    //删除class
    removeClass( elements,cName ){
      if( this.hasClass( elements,cName ) ){
        elements.className = elements.className.replace( new RegExp( "(\\s|^)" + cName + "(\\s|$)" )," " ); // replace方法是替换
      };
    },
    searchFirst(){
      this.tagListContent(0);
      this.$router.push({path:"/"})
    },
    searchSecond(){
      this.tagListContent(1);
      this.$router.push({path:"/DetailPage"})
    },
    searchThird(){
      this.tagListContent(2);
      this.$router.push({path:"/PerformancePage"})
    },
    searchFour(){
      this.tagListContent(3);
      this.$router.push({path:"/AccountPage"})
    },
    // 退出
    exit () {
      this.$router.push({path:'/'});
      localStorage.removeItem("sessionKey")
      localStorage.removeItem("login")
      this.isShow = false
    }
  }
}
</script>

<style>
  html,body{
    height: 100%;
    width: 100%;
    margin: 0px;
    padding: 0px;
  }
  a{
    text-decoration: none;
    color: #ffffff;
  }
  .app_content_second{
    height: 100%;
    width: 100%;
  }
  .app{
    height: 100%;
    width: 100%;
  }
  .app_content{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .app_head{
    height: 80px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2px solid #666666 ;
  }
  .app_head_logo{
    height: 60px;
    width: 60px;
    background: url("../static/images/logo2.png") center center;
    background-size: 60px 60px;
    margin-left: 15px;
  }
  .app_head_info{
    height: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    margin-left: 15px;
  }
  .app_head_return{
    width: 70px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .app_box{
    width: 100%;
    flex: 1;
    display: flex;

  }
  .app_box_left{
    height: 100%;
    width: 150px;
    background: #525c65;
  }
  .app_box_list{
    height: 40px;
    width: 130px;
    margin: 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #ccc;
    color: #ffffff;
    font-size: 14px;
    cursor: pointer;
  }
  .app_box_list:hover{
    background: #409eff;
  }
  .app_box_list_color{
    background: #409eff;
  }
  .app_box_right{
    height: 100%;
    flex: 1;
  }
</style>
