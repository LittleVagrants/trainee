// 用户管理
<template>
  <div>
    <div class="container">
      <div class="contentHeader">
        <h4>用户信息列表</h4>
        <div class="functionalArea">
          <input v-model="findUserName" type="text" class="searchInput" placeholder="搜索姓名">
          <el-button type="primary" size="small" class="searchButton" @click="findUser">搜索</el-button>
        </div>
        <div class="functionalArea">
          <input v-model="findPhoneNum" type="tel" class="searchInput" placeholder="搜索电话号码">
          <el-button type="primary" size="small" class="searchButton" @click="findNum">搜索</el-button>
        </div>
        <div class="functionalArea">
          <el-button type="primary" size="small" class="searchButton" @click="allUserInfo">全部用户信息</el-button>
        </div>
      </div>
      <div class="contentDiv">
        <el-table v-if="getTableInfo" :data="tableInfoData.slice((currentPage-1)*size,currentPage*size)">
          <el-table-column prop="name" label="姓名" align="left">
          </el-table-column>
          <el-table-column prop="phoneNumber" label="电话号码" align="left">
          </el-table-column>
          <el-table-column prop="sex" label="性别" align="left">
          </el-table-column>
          <el-table-column prop="birthday" label="生日" align="left">
          </el-table-column>
          <el-table-column prop="constellation" label="星座" align="left">
          </el-table-column>
          <el-table-column prop="registrationTime" label="注册时间" align="left">
          </el-table-column>
          <!-- <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="dialogVisible = true"></el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
      <div class="paginationDiv">
        <el-pagination ref="pages" layout=" total, prev, pager, next, jumper" :total="total" :page-size="size" @current-change="setCurrent">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false,
      tableInfoData: [],
      findUserName: "",
      findPhoneNum: "",
      // 默认打开页
      current: 1,
      // 每页展示条数
      size: 7,
      // 数据展示页
      currentPage: 1
    };
  },
  watch: {},
  computed: {
    // 计算分页
    data1() {
      var arr = [];
      var current = this.current;
      var size = this.size;
      for (var i = (current - 1) * size; i < (current - 1) * size + size; i++) {
        if (this.data[i]) arr.push(this.data[i]);
      }
      return arr;
    },
    total() {
      return this.tableInfoData.length;
    }
  },
  methods: {
    // 设置分页
    setCurrent(val) {
      console.log(val);
      this.current = val;
      this.currentPage = val;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    getTableInfo() {
      let query = {
        userToken: this.$userToken
      };
      this.$axios.get("api/user/findUserList", { params: query }).then(res => {
        if ((res.data.code = "0")) {
          this.tableInfoData = res.data.data;
          for (let i = 0; i < this.tableInfoData.length; i++) {
            if (this.tableInfoData[i].sex == false) {
              this.tableInfoData[i].sex = "女";
            } else if (this.tableInfoData[i].sex == true) {
              this.tableInfoData[i].sex = "男";
            };
            if(this.tableInfoData[i].phoneNumber==0){
              this.tableInfoData[i].phoneNumber="无"
            }
          }
        } else {
          console.log("请求失败！");
        }
      });
    },
    // 模糊搜索用户
    findUser() {
      let query = {
        userToken: this.$userToken,
        name: this.findUserName
      };
      this.$axios
        .get("api/user/findUserByName", { params: query })
        .then(res => {
          if ((res.data.code = "0")) {
            console.log(res);
            this.tableInfoData = res.data.data;
            for (let i = 0; i < this.tableInfoData.length; i++) {
              if (this.tableInfoData[i].sex == false) {
                this.tableInfoData[i].sex = "女";
              } else if (this.tableInfoData[i].sex == true) {
                this.tableInfoData[i].sex = "男";
              }
            }
          } else {
            console.log("请求失败！");
          }
        });
    },
    // 电话号码搜索用户
    findNum() {
      let query1 = {
        userToken: this.$userToken,
        phoneNumber: this.findPhoneNum
      };
      console.log(query1)
      this.$axios
        .get("api/user/findUserByPhoneNumber", { params: query1 })
        .then(res => {
          if ((res.data.code = "0")) {
            console.log(res);
            this.tableInfoData = res.data.data;
            for (let i = 0; i < this.tableInfoData.length; i++) {
              if (this.tableInfoData[i].sex == false) {
                this.tableInfoData[i].sex = "女";
              } else if (this.tableInfoData[i].sex == true) {
                this.tableInfoData[i].sex = "男";
              }
            }
          } else {
            console.log("请求失败！");
          }
        });
    },
    allUserInfo(){
      this.getTableInfo();
    }
  },
  created() {
    this.getTableInfo();
  }
};
</script>
<style scoped>
</style>