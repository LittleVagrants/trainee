// 主页面框架

<template>
  <div class="hello">
    <el-container>
      <!-- 头部 -->
      <el-header class="homeHeader">
        <h1>管培生-管理系统</h1>
        <el-tooltip class="exitButton" content="退出系统" placement="bottom" effect="light">
          <el-button class="exitIcon" @click="exitTrainee()">
            <i class="iconfont icon-084tuichu"></i>
          </el-button>
        </el-tooltip>

      </el-header>
      <!-- 侧边导航 -->
      <el-container>
        <el-aside width='150px'>
          <el-row class="tac">
            <el-col :span="24">
              <el-menu :defaultO-active="$route.path" router :class="{'bgColor': true}" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
                <el-submenu index="/home/userManagement">
                  <span slot="title">
                    <i class="iconfont  icon-yonghu" style="margin:3px"></i>用户管理</span>
                  <el-menu-item-group>
                    <el-menu-item index="/home/userManagement">用户信息</el-menu-item>
                    <el-menu-item index="/home/roleManagement">角色管理</el-menu-item>
                    <el-menu-item index="/home/rbacManagement">权限管理</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
                <el-submenu index="/home/jobSeekerManagement">
                  <span slot="title">
                    <i class="iconfont  icon-qiuzhi" style="margin:3px"></i>求职管理</span>
                  <el-menu-item-group>
                    <el-menu-item index="/home/jobSeekerManagement">求职者信息</el-menu-item>
                    <el-menu-item index="/home/successiveTrainee">历届管培生</el-menu-item>
                    <el-menu-item index="/home/albumManagement">相册管理</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
                <el-menu-item index="/home/labelManagement">
                  <template slot="title">
                    <i class="iconfont icon-multilabel"></i>
                    <span>标签管理</span>
                  </template>
                </el-menu-item>
                <el-menu-item index="/home/postManagement">
                  <template slot="title">
                    <i class="iconfont icon-zhiweiguanli"></i>
                    <span>职位管理</span>
                  </template>
                </el-menu-item>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <!-- 内容块区域 -->
        <el-container>
          <el-main>
            <router-view/>
          </el-main>

          <el-footer height='40px'>Footer</el-footer>
        </el-container>
      </el-container>

    </el-container>

  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    //跳转user
    // getUser() {
    //   this.$router.push('/home/user')
    // },
    // 打印菜单项
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
    exitTrainee() {
      const h = this.$createElement;
      this.$msgbox({
        center: "true",
        message: h("p", { style: "margin-bottom:20px;font-size:16px;" }, [
          h("span", null, "您确定要退出登录系统吗")
        ]),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "退出中..";
            setTimeout(() => {
              done();
              window.sessionStorage.removeItem("isLog");
              this.$router.push("/login");
              setTimeout(() => {
                instance.confirmButtonLoading = false;
              }, 300);
            }, 1500);
          } else {
            done();
          }
        }
      }).then(action => {
        this.$message({
          type: "success",
          message: "退出成功"
        });
      });
    }
  },
  mounted() {
    document.getElementsByClassName("el-aside")[0].style.height =
      parseInt(window.innerHeight) - 60 + "px";
    document.getElementsByClassName("el-main")[0].style.height =
      parseInt(window.innerHeight) - 60 - 40 + "px";
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.hello h1,
h2 {
  font-weight: bold;
  float: left;
}
.hello .homeHeader {
  width: 100%;
  line-height: 60px;
  color: white;
  background-color: #08a2ba;
}
.hello .exitButton {
  float: right;
  margin: 10px 1.2% 0 0;
  color: white;
  border-radius: 30px;
}
.hello .exitIcon {
  background-color: rgba(0, 0, 0, 0.2);
}
.hello .el-aside {
  background-color: #28323d;
}
.hello .el-menu-vertical-demo {
  background-color: #28323b;
}
.hello i {
  display: inline-block;
}
.hello .el-submenu,
.el-menu-item {
  min-width: auto;
  background-color: #28323b;
  color: white;
}
.el-menu-item-group__title {
  padding: 0;
}
.el-submenu__title {
  color: white;
}
.el-submenu__title:hover {
  background-color: #2d3b46;
}
.el-submenu__title i {
  color: white;
}
.el-menu-item i {
  color: white;
}
.hello .el-menu {
  border-right: none;
}
.hello .el-footer {
  background-color: #24292d;
  text-align: center;
  line-height: 40px;
  color: white;
}
/* .hello .bgColor{
  color: 
} */
.hello .is-active {
  background-color: #2d3b46;
  color: white;
}
.hello .el-menu-item:hover {
  background-color: #2d3b46;
}
</style>
