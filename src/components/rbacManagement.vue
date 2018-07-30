// 权限管理

<template>
  <div>
    <div class="container">
      <div class="contentHeader">
        <h4>权限管理列表</h4>
        <div class="functionalArea">
          <!-- 下拉框选择 -->
          <!-- <span class="dropdownPrompt">请选择角色：</span>
          <el-select class="dropdownContent" v-model="roleList.id" placeholder="请选择角色">
            <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select> -->

          <el-button type="primary" size="small" class="addButton" @click="addRoleRbac">添加角色</el-button>
        </div>
      </div>

      <!-- 内容列表 -->
      <div class="contentDiv">
        <el-table :data="rbacInfoData.slice((currentPage-1)*size,currentPage*size)" v-if="getRbacInfo">
          <el-table-column prop="role.name" label="角色" align="left" width="260">
          </el-table-column>
          <el-table-column prop="permission.name" label="对应权限" align="left">
          </el-table-column>
          <el-table-column label="操作" align="left" width="460">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" circle size="mini" @click.native.prevent="chooseRbac(scope.$index,rbacInfoData)"></el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>

      <el-dialog :title="title" :visible.sync="dialogVisible" width="38.5%" :before-close="handleClose">
        <el-form ref="form" label-width="100px">
          <el-form-item label="角色">
            <el-input v-model="rbacName" class="dialogInput"></el-input>
          </el-form-item>
          <el-form-item label="对应权限">
            <template>
              <el-transfer v-model="value1" :data="data"></el-transfer>
            </template>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogVisible=false">取 消</el-button>
          <el-button type="primary" size="small" @click="exchageRbac">确 定</el-button>
          <!-- @click="changeUserRbac" -->
        </span>
      </el-dialog>
      <div class="paginationDiv">
        <el-pagination ref="pages" layout=" total, prev, pager, next, jumper" :total="total" :page-size="size" @current-change="setCurrent">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import qs from "qs";
export default {
  data() {
    // 穿梭框
    const generateData = _ => {
      const data = [];
      for (let i = 1; i <= 15; i++) {
        data.push({
          key: i,
          label: `备选项 ${i}`
          // disabled: i % 4 === 0
        });
      }
      return data;
    };
    return {
      // 穿梭框
      data: generateData(),
      value1: [1, 4],

      title: null,
      dialogVisible: false,
      roleList: [],
      rbacInfoData: [],
      rbacAllRbacData: [],
      rbacName: "",
      rbac: "",
      exchageRbacId: null,
      roleId: null,
      rbacId: null,
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
      return this.rbacInfoData.length;
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
    getRole() {
      let query = {
        userToken: this.$userToken
      };
      this.$axios.get("api/role/findRoleList", { params: query }).then(res => {
        if ((res.data.code = "0")) {
          this.roleList = res.data.data;
        } else {
          console.log("请求失败！");
        }
      });
    },
    getRbacInfo() {
      let query = {
        userToken: this.$userToken
      };
      this.$axios
        .get("api/rolePermission/findRoleAndPermission", { params: query })
        .then(res => {
          // console.log(res);
          if ((res.data.code = "0")) {
            this.rbacInfoData = res.data.data;
            // console.log(this.rbacInfoData);
          } else {
            console.log("请求失败！");
          }
        });
    },
    getAllrbac() {
      let query = {
        userToken: this.$userToken
      };
      this.$axios
        .get("api/permission/findPermissionList", { params: query })
        .then(res => {
          // console.log(res);
          if ((res.data.code = "0")) {
            this.rbacAllRbacData = res.data.data;
            // console.log(this.rbacAllRbacData)
          } else {
            console.log("请求失败！");
          }
        });
    },
    // 弹框设置value值
    chooseRbac(i, data) {
      this.title = "修改权限";
      console.log(i, data);
      this.roleId = i;
      this.dialogVisible = true;
      this.rbacName = data[i].role.name;
      this.rbac = data[i].permission.name;
      this.rbacId = data[i].permission.id;
      // this.rbacUserName = data[i].user.name
    },
    addRoleRbac(e) {
      this.title="添加角色";
      this.exchageRbacId = e;
      this.dialogVisible = true;
    },
    exchageRbac() {
      // 修改权限管理
      if (this.title === "修改权限") {
        // this.roleId=this.rbacInfoData[this.index].role.id;
        console.log("11111111111111111111111111111111111111111111");
        let query = {
          userToken: this.$userToken,
          roleId: this.roleId,
          newPermissionId: this.exchageRbacId,
          perminssionId: this.rbacId
        };
        console.log(query);
        this.$axios
          .put("api/rolePermission/update", qs.stringify(query))
          .then(res => {
            console.log(res);
            if ((res.data.code = "0")) {
              // this.rbacInfoData[i].permission.name = ;
              this.dialogVisible = false;
              this.$message({
                type: "success",
                message: "修改成功!"
              });
            } else {
            }
          });
      } else if (this.title === "添加权限") {
          // let query = {
          //   userToken = this.$userToken,
            
          // }
      }
    }
  },
  created() {
    this.getRole();
    this.getRbacInfo();
    this.getAllrbac();
    // console.log(this.getRbacInfo)
  },
  mounted() {}
};
</script>
<style scoped>
.el-checkbox__label {
  padding: 0;
  margin-left: 0;
}
</style>