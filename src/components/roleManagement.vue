// 角色管理

<template>
  <div>
    <div class="container">
      <div class="contentHeader">
        <h4>角色管理列表</h4>
        <div class="functionalArea">
          <!-- 下拉框选择 -->
          <span class="dropdownPrompt">请选择角色：</span>
          <el-select @change="selectRole" class="dropdownContent" v-model="roleList.id" placeholder="请选择角色">
            <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="functionalArea">
          <el-button type="primary" size="small" class="searchButton" @click="allRoleInfo">全部信息</el-button>
        </div>
      </div>

      <!-- 内容列表 -->
      <div class="contentDiv">
        <el-table :data="roleInfoData.slice((currentPage-1)*size,currentPage*size)" v-if="getRoleInfo">
          <el-table-column prop="user.name" label="姓名" align="left">
          </el-table-column>
          <el-table-column prop="user.phoneNumber" label="电话号码" align="left">
          </el-table-column>
          <el-table-column prop="user.sex" label="性别" align="left">
          </el-table-column>
          <el-table-column prop="user.birthday" label="生日" align="left">
          </el-table-column>
          <el-table-column prop="role.name" label="对应角色" align="left">
          </el-table-column>
          <el-table-column label="操作" align="left">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" circle size="mini" @click.native.prevent="chooseRoleUser(scope.$index,roleInfoData)"></el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>
      <div class="paginationDiv">
        <el-pagination ref="pages" layout=" total, prev, pager, next, jumper" :total="total" :page-size="size" @current-change="setCurrent">
        </el-pagination>
      </div>
      <el-dialog title="修改用户信息" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <el-form ref="form" label-width="100px">
          <el-form-item label="姓名">
            <el-input class="dialogInput" v-model="roleUserName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="对应角色">
            <el-select class="dialogSelect" @change="getNewRole" v-model="userRole">
              <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogVisible=false">取 消</el-button>
          <el-button type="primary" size="small" @click="changeUserRole">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import qs from "qs";
export default {
  data() {
    return {
      dialogVisible: false,
      roleInfoData: [],
      roleList: [],
      roleUserName: "",
      roleId: null,
      newRoleId: null,
      userRole: "",
      exchangeRoleName: "",
      index: null,
      // 默认打开页
      current: 1,
      // 每页展示条数
      size: 12,
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
      return this.roleInfoData.length;
    }
  },
  methods: {
    // 设置分页
    setCurrent(val) {
      // console.log(val);
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
    getRole() {
      let query = {
        userToken: this.$userToken
      };
      this.$axios.get("api/role/findRoleList", { params: query }).then(res => {
        if ((res.data.code = "0")) {
          this.roleList = res.data.data;
          console.log(this.roleList);
        } else {
          console.log("请求失败！");
        }
      });
    },
    getRoleInfo() {
      let query = {
        userToken: this.$userToken
      };
      this.$axios
        .get("api/userRole/findUserAndRole", { params: query })
        .then(res => {
          if ((res.data.code = "0")) {
            this.roleInfoData = res.data.data;
            // console.log(res)
            for (let i = 0; i < this.roleInfoData.length; i++) {
              if (this.roleInfoData[i].user.sex == false) {
                this.roleInfoData[i].user.sex = "女";
              } else if (this.roleInfoData[i].user.sex == true) {
                this.roleInfoData[i].user.sex = "男";
              }
            }
          } else {
            console.log("请求失败！");
          }
        });
    },
    // 弹框设置value值
    chooseRoleUser(i, data) {
      this.roleUserName = data[i].user.name;
      this.userRole = data[i].role.name;
      this.dialogVisible = true;
      this.index = i;
      this.roleId = data[i].role.id;
    },
    getNewRole(id) {
      console.log(this.roleList[i])
      this.roleList[i].id = id;
    },
    // 根据选择值做出改变
    changeUserRole() {
      let query = {
        roleId: this.roleId,
        newRoleId: this.newRoleId,
        userToken: this.$userToken
      };
      this.$axios.put("api/userRole/update", query).then(res => {
        this.roleInfoData[this.index].role.name = this.exchangeRoleName;
        // console.log(this.userRole)
        this.dialogVisible = false;
      });
    },
    // 选择对应角色，select框
    selectRole(e) {
      console.log(e);
      let query = {
        userToken: this.$userToken,
        roleId: e
      };
      this.$axios
        .get("api/userRole/findUserByRole", { params: query })
        .then(res => {
          if ((res.data.code = "0")) {
            console.log(res);
            this.roleInfoData = res.data.data;
            // console.log(this.roleInfoData)
          } else {
            console.log("请求失败！");
          }
        });
    },
    allRoleInfo() {
      this.getRoleInfo();
    }
  },
  created() {
    this.getRole();
    this.getRoleInfo();
  },
  mounted() {}
};
</script>
<style scoped>
</style>