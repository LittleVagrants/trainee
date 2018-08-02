// 标签管理

<template>
  <div>
    <div class="container">
      <div class="contentHeader">
        <h4>标签管理列表</h4>
        <div class="functionalArea">
          <el-button type="primary" size="small" @click="addLabel" class="addButton">添加标签</el-button>
          <!-- <input type="text" class="searchInput" placeholder="请输入搜索内容">
          <el-button type="primary" size="small" class="searchButton">搜索</el-button> -->
        </div>

      </div>
      <div class="contentDiv">
        <el-table :data="labelInfoData.slice((currentPage-1)*size,currentPage*size)" v-if="getLabelInfo">
          <el-table-column prop="name" label="标签" align="left" width="260">
          </el-table-column>
          <el-table-column label="操作" align="left">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" circle size="mini" @click.native.prevent="chooseLabel(scope.$index,labelInfoData)"></el-button>
              <el-button type="danger" icon="el-icon-delete" circle size="mini" @click.native.prevent="dialogDeleteLabel(scope.$index,labelInfoData)"></el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>
      <div class="paginationDiv">
        <el-pagination ref="pages" layout=" total, prev, pager, next, jumper" :total="total" :page-size="size" @current-change="setCurrent">
        </el-pagination>
      </div>
      <!-- 标签编辑弹框 -->
      <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <el-form ref="form" label-width="100px">
          <el-form-item label="标签">
            <el-input class="dialogInput" v-model="labelName"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogVisible=false">取 消</el-button>
          <el-button type="primary" size="small" @click="changeLable">确 定</el-button>
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
      labelName: "",
      dialogVisible: false,
      labelInfoData: [],
      labelId: null,
      index: null,
      title: null,
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
      return this.labelInfoData.length;
    }
  },
  methods: {
    // 设置分页
    setCurrent(val) {
      console.log(val);
      this.current = val;
      this.currentPage = val
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    // 弹框设置value值
    chooseLabel(i, data) {
      this.title = "修改标签";
      this.labelName = data[i].name;
      this.dialogVisible = true;
      this.labelId = data[i].id;
      this.index = i;
    },
    //添加标签
    addLabel() {
      this.title = "添加标签";
      this.dialogVisible = true;
      this.labelName = "";
    },
    changeLable() {
      if (this.title === "修改标签") {
        let query = {
          id: this.labelId,
          name: this.labelName,
          userToken: this.$userToken
        };
        this.$axios.post("api/labels/update", qs.stringify(query)).then(res => {
          if (this.labelName == "") {
            this.$message({
              showClose: true,
              message: "警告，标签名里不能为空！",
              type: "warning"
            });
          } else {
            this.labelInfoData[this.index].name = this.labelName;
            this.dialogVisible = false;
              this.$message({
                type: "success",
                message: "修改成功!"
              });
          }
        });
      } else if(this.title === "添加标签"){
        let query = {
          userToken: this.$userToken,
          name: this.labelName
        }
        this.$axios.post("api/labels/save", qs.stringify(query)).then(res => {
          if (this.labelName == "") {
            this.$message({
              showClose: true,
              message: "警告，标签名里不能为空！",
              type: "warning"
            });
          } else {
            this.getLabelInfo()
            this.dialogVisible = false
            this.$message({
                type: "success",
                message: "添加成功!"
              });
          }
        });
      }
    },
    dialogDeleteLabel(i, data) {
      this.$confirm("此操作将永久删除该标签, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let query = {
            userToken:this.$userToken,
            id: data[i].id
          };
          this.$axios
            .delete("api/labels/delete", { params: query })
            .then(res => {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              // 本地删除，缺点，前后台若不同步，前后台数据不一致
              this.labelInfoData.splice(i, 1);
              // 删除，重调接口
              // this.getLabelInfo()
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    getLabelInfo() {
      this.$axios
        .get(
          "api/labels/findLabelsList?userToken=4eaabded5c1f480d807a598187aef982"
        )
        .then(res => {
          // console.log(res);
          if ((res.data.code = "0")) {
            this.labelInfoData = res.data.data;
            // console.log(this.roleInfoData);
          } else {
            console.log("请求失败！");
          }
        });
    }
  },
  created() {
    this.getLabelInfo();
  },
  mounted() {}
};
</script>
<style scoped>
</style>