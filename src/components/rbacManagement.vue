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
              <el-transfer :titles="['未拥有权限', '已拥有权限']" v-model="value1" :data="data" @change = 'handleChange'></el-transfer>
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
      addOrDelete:null,
      // 每页展示条数
      size: 7,
      // 数据展示页
      currentPage: 1,
      //改变的权限
      cahngPermissions:null,
      //所有权限数据
      allPermissionsInfo:null,
      //当前权限
      currentPermissions:null
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
       this.currentPermissions = value
       this.addOrDelete = direction
       this.cahngPermissions = movedKeys
        console.log(value)
        console.log(direction)
        console.log(movedKeys)
      },
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
          if ((res.data.code === 0)) {
            let str;
            // this.rbacInfoData = res.data.data
            for (let i = 0; i < res.data.data.length; i++) {
              let permissionsInfo = {
                id:Number,
                role: "",
                permissions: ""
              };
              permissionsInfo.role = res.data.data[i].role.name
              permissionsInfo.roleId =  res.data.data[i].role.id
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
    chooseRbac(data) {
      this.title = "修改权限";
      this.value1 = []
      this.roleId = data;
      this.dialogVisible = true;
      this.rbacName = data.role;
      // this.rbac = data[i].permission.name;
      this.$axios.get('/api/permission/findPermissionList',{params:{userToken:this.$userToken}})
      .then(res => {
        this.data = []
        for(let i=0;i<res.data.data.length;i++){
          let obj = {
            key:null,
            label:null
          }
          obj.key = res.data.data[i].id
          obj.label = res.data.data[i].name
          this.data.push(obj)
        }
        this.$axios.get("api/rolePermission/findRoleAndPermission", { params: {userToken:this.$userToken} })
        .then(res => {
            this.allPermissionsInfo = res.data.data
            for(let i=0;i<res.data.data.length;i++){
              if(res.data.data[i].role.id === data.roleId){
                this.value1.push(res.data.data[i].permission.id)
              }
            }
        })
      })
      // this.rbacId = data[i].permission.id;
      // this.rbacUserName = data[i].user.name
    },
    addRoleRbac(e) {
      this.title = "添加角色";
      this.exchageRbacId = e;
      this.dialogVisible = true;
    },
    exchageRbac() {
      // 修改权限管理
      if (this.title === "修改权限") {
        // this.roleId=this.rbacInfoData[this.index].role.id;
        let tempAdd=[];
        let tempDelete=[];
        for(let i=0;i<this.currentPermissions.length;i++){
          for(let j=0;j<this.allPermissionsInfo.length;j++){
            if(this.currentPermissions[i] === this.allPermissionsInfo[j].permission.id){
              // console.log(this.currentPermissions[i])
            }else{
              tempAdd.push(this.currentPermissions[i])
              tempDelete.push(this.allPermissionsInfo[j].permission.id)
              // console.log(this.currentPermissions[i])
            }
          }
          console.log(tempAdd)
          console.log(tempDelete)
        }
        // let query = {
        //   userToken: this.$userToken,
        //   roleId: this.roleId,
        //   newPermissionId: this.exchageRbacId,
        //   perminssionId: this.rbacId
        // };
        // console.log(query);
        // this.$axios
        //   .put("api/rolePermission/update", qs.stringify(query))
        //   .then(res => {
        //     console.log(res);
        //     if ((res.data.code = "0")) {
        //       // this.rbacInfoData[i].permission.name = ;
        //       this.dialogVisible = false;
        //       this.$message({
        //         type: "success",
        //         message: "修改成功!"
        //       });
        //     } else {
        //     }
        //   });
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