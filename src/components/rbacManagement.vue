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
          <el-table-column prop="role" label="角色" align="left" width="260">
          </el-table-column>
          <el-table-column prop="permissions" label="对应权限" align="left">
          </el-table-column>
          <el-table-column label="操作" align="left" width="460">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" circle size="mini" @click.native.prevent="chooseRbac(scope.row)"></el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>

      <el-dialog :title="title" :visible.sync="dialogVisible" width="43.5%" :before-close="handleClose">
        <el-form ref="form" label-width="100px">
          <el-form-item label="角色">
            <el-input v-model="rbacName" class="dialogInput"></el-input>
          </el-form-item>
          <el-form-item label="拥有权限">
            <template>
              <el-transfer :titles="['未拥有权限', '已拥有权限']" v-model="value1" :data="data" @change='handleChange'></el-transfer>
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
    // const generateData = _ => {
    //   const data = [];
    //   for (let i = 1; i <= 15; i++) {
    //     data.push({
    //       key: i,
    //       label: `备选项 ${i}`
    //       // disabled: i % 4 === 0
    //     });
    //   }
    //   return data;
    // };
    return {
      // 穿梭框
      data: [],
      value1: [209],
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
      //删除还是添加
      addOrDelete: null,
      // 每页展示条数
      size: 12,
      // 数据展示页
      currentPage: 1,
      //改变的权限
      cahngPermissions: null,
      //所有权限数据
      allPermissionsInfo: null,
      //当前权限
      currentPermissions: null
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
    handleChange(value, direction, movedKeys) {
      // this.currentPermissions = value;
      this.addOrDelete = direction;
      this.cahngPermissions = movedKeys;
    },
    // 设置分页
    setCurrent(val) {
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
    getRbacInfo() {
      let query = {
        userToken: this.$userToken
      };
      this.$axios
        .get("api/rolePermission/findRoleAndPermission", { params: query })
        .then(res => {
          if (res.data.code === 0) {
            let str;
            // this.rbacInfoData = res.data.data
            for (let i = 0; i < res.data.data.length; i++) {
              let permissionsInfo = {
                id: Number,
                role: "",
                permissions: ""
              };
              permissionsInfo.role = res.data.data[i].role.name;
              permissionsInfo.roleId = res.data.data[i].role.id;
              let str = res.data.data[i].permission.name;
              for (let j = i + 1; j < res.data.data.length; j++) {
                if (res.data.data[i].role.id === res.data.data[j].role.id) {
                  str += "、" + res.data.data[j].permission.name;
                  res.data.data.splice(j, 1);
                  j--;
                }
              }
              permissionsInfo.permissions = str;
              str = "";
              this.rbacInfoData.push(permissionsInfo);
            }
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
    chooseRbac(data) {
      this.title = "修改权限";
      this.value1 = [];
      this.roleId = data;
      this.dialogVisible = true;
      this.rbacName = data.role;
      // this.rbac = data[i].permission.name;
      this.$axios
        .get("/api/permission/findPermissionList", {
          params: { userToken: this.$userToken }
        })
        .then(res => {
          this.data = [];
          for (let i = 0; i < res.data.data.length; i++) {
            let obj = {
              key: null,
              label: null
            };
            obj.key = res.data.data[i].id;
            obj.label = res.data.data[i].name;
            this.data.push(obj);
          }
          this.$axios
            .get("api/rolePermission/findRoleAndPermission", {
              params: { userToken: this.$userToken }
            })
            .then(res => {
              this.currentPermissions = [];
              this.allPermissionsInfo = res.data.data;
              for (let i = 0; i < res.data.data.length; i++) {
                if (res.data.data[i].role.id === data.roleId) {
                  this.value1.push(res.data.data[i].permission.id);
                  this.currentPermissions.push(res.data.data[i].permission.id);
                }
              }
            });
        });
      // this.rbacId = data[i].permission.id;
      // this.rbacUserName = data[i].user.name
    },
    addRoleRbac(e) {
      this.title = "添加角色";
      this.exchageRbacId = e;
      this.rbacName = "";
      this.value1 = [];
      this.$axios
        .get("/api/permission/findPermissionList", {
          params: { userToken: this.$userToken }
        })
        .then(res => {
          this.data = [];
          for (let i = 0; i < res.data.data.length; i++) {
            let obj = {
              key: null,
              label: null
            };
            obj.key = res.data.data[i].id;
            obj.label = res.data.data[i].name;
            this.data.push(obj);
          }
        });
      this.dialogVisible = true;
    },
    subArr(a, b) {
      return a.filter(function(i) {
        return b.indexOf(i) == -1;
      });
    },
    exchageRbac() {
      // 修改权限管理
      if (this.title === "修改权限") {
        // this.roleId=this.rbacInfoData[this.index].role.id;
        if (this.currentPermissions !== null) {
          var deleteArr = this.subArr(this.currentPermissions, this.value1);
          var addArr = this.subArr(this.value1, this.currentPermissions);
          if (deleteArr.length > 0) {
            let query = {
              userToken: this.$userToken,
              roleId: this.roleId.roleId,
              perminssionIds: deleteArr.join(",")
            };
            this.$axios
              .delete("/api/rolePermission/delete", { params: query })
              .then(res => {});
          }
          if (addArr.length > 0) {
            let query = {
              userToken: this.$userToken,
              roleId: this.roleId.roleId,
              perminssionIds: addArr.join(",")
            };
            this.$axios
              .post("/api/rolePermission/save", qs.stringify(query))
              .then(res => {});
          }
          if (addArr.length > 0 || deleteArr.length > 0) {
            this.$message({
              showClose: true,
              message: "权限修改成功!",
              type: "success"
            });
            this.dialogVisible = false;
            let str = "";
            for (let i = 0; i < this.value1.length; i++) {
              for (let j = 0; j < this.rbacAllRbacData.length; j++) {
                if (this.value1[i] === this.rbacAllRbacData[j].id) {
                  str += "、" + this.rbacAllRbacData[j].name;
                }
              }
            }
            this.roleId.roleId;
            for (let k = 0; k < this.rbacInfoData.length; k++) {
              if (this.rbacInfoData[k].roleId === this.roleId.roleId) {
                this.rbacInfoData[k].permissions = str.substr(1);
              }
            }
          } else {
            this.$message({
              showClose: true,
              message: "你未修改权限!",
              type: "warning"
            });
          }
        } else {
          this.$message({
            showClose: true,
            message: "你未修改权限!",
            type: "warning"
          });
        }
      } else if (this.title === "添加角色") {
        // let query = {
        //   userToken = this.$userToken,
        // }
        if (this.value1.length > 0) {
          let query = {
            userToken: this.$userToken,
            name: this.rbacName
          };
          this.$axios.post("/api/role/save", qs.stringify(query)).then(res => {
            if (res.status === 200) {
              if (res.data.code === 0) {
                let query = {
                  userToken: this.$userToken,
                  roleId: res.data.data.id,
                  perminssionIds: this.value1.join(",")
                };
                this.$axios
                  .post("/api/rolePermission/save", qs.stringify(query))
                  .then(res => {
                    if (res.status === 200) {
                      if (res.data.code === 0) {
                        this.$message({
                          showClose: true,
                          message: "角色添加成功",
                          type: "success"
                        })
                        this.dialogVisible = false;
                      }
                    }
                  });
              }
            }
          });
        } else {
          this.$message({
            showClose: true,
            message: "你未给该角色设置权限，不能添加",
            type: "warning"
          })
        }
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