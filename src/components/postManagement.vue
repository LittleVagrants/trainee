// 职位管理

<template>
  <div>
    <div class="container">
      <div class="contentHeader">
        <h4>职位管理列表</h4>
        <div class="functionalArea">
          <!-- <input type="text" class="searchInput" placeholder="请输入搜索内容">
          <el-button type="primary" size="small" class="searchButton">搜索</el-button> -->
          <el-button @click="addPosition" type="primary" size="small" class="addButton">添加职位</el-button>

        </div>

      </div>
      <div class="contentDiv">
        <el-table :data="postInfoData.slice((currentPage-1)*size,currentPage*size)" v-if="getPostInfo">
          <el-table-column prop="name" label="职位" align="left" width="160">
          </el-table-column>
          <el-table-column prop="information" label="职位介绍" align="left" width="460">
          </el-table-column>
          <el-table-column prop="resources.id" label="职位照片" align="center">
            <template  slot-scope="scope">
              <img :src="'http://gpstapi.antup.me/resources/findResourcesById?id='+postInfoData.headPortrait.id" style="width=100px;height:100px" alt="">
            </template>
            <template slot-scope="scope">
              <el-button type="primary" plain size="small" @click="getEduInfo(scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="left">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" circle size="mini" @click.native.prevent="choosePost(scope.row,scope.$index)"></el-button>
              <el-button type="danger" icon="el-icon-delete" circle size="mini" @click.native.prevent="dialogDeletePost(scope.$index,postInfoData)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="paginationDiv">
        <el-pagination ref="pages" layout=" total, prev, pager, next, jumper" :total="total" :page-size="size" @current-change="setCurrent">
        </el-pagination>
      </div>
      <el-dialog :title="title" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
        <el-form ref="form" label-width="100px">
          <el-form-item label="职位">
            <el-input class="dialogInput" v-model="postName"></el-input>
          </el-form-item>
          <el-form-item label="职位介绍">
            <el-input type="textarea" resize="none" class="dialogInput" v-model="postInfo"></el-input>
          </el-form-item>
          <el-form-item label="职位相册">
            <!-- <input type="file"> -->
            <el-upload action="string" :http-request="uploadSectionFile" ref="upload" list-type="picture-card" :file-list='positionVisibleArr' :on-preview="handlePictureCardPreview" :auto-upload="false" :limit="6" :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="closeDialog">取 消</el-button>
          <el-button type="primary" size="small" @click="changePostInfo">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog :visible.sync="aImgVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
      <el-dialog title="职位照片" :visible.sync="positionImgVisible" width="60%">
        <div>
          <img v-for="item in positionImgArr" :key="item.id" class="viewPositionImg" :src="'/api/resources/findResourcesById?id='+item.positionPicture" alt="">
        </div>
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
      postInfoData: [],
      postName: "",
      postInfo: "",
      postId: null,
      postPicId: null,
      positionImgArr: null,
      positionImgVisible: false,
      positionVisibleArr: [],
      aImgVisible: false,
      dialogImageUrl: "",
      selectPositionId: null,
      deleteImg: null,
      title: "",
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
      return this.postInfoData.length;
    }
  },
  methods: {
    // 设置分页
    setCurrent(val) {
      console.log(val);
      this.current = val;
      this.currentPage = val;
    },
    uploadSectionFile(param) {
      var form = new FormData();
      form.append("photoFiles", param.file);
      form.append("userToken", this.$userToken);
      form.append("positionId", this.selectPositionId);
      this.$axios.post("/api/positionPicture/save", form).then(res => {
        console.log(res);
        if (res.status === 200) {
          if (res.data.msg === "保存职位详细图片成功！") {
            console.log("成功");
          }
        }
      });
    },
    closeDialog() {
      this.dialogVisible = false;
      this.positionVisibleArr = [];
    },
    addPosition() {
      this.dialogVisible = true;
      this.title = "添加职位信息";
      this.postName = "";
      this.postInfo = "";
      this.positionVisibleArr = [];
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.aImgVisible = true;
    },
    handleRemove(file) {
      this.deleteImg = {
        userToken: this.$userToken,
        positionId: this.selectPositionId,
        pictureId: file.id
      };
    },
    getEduInfo(info) {
      this.$axios
        .get("/api/positionPicture/findPositionPictureByPosition", {
          params: { positionId: info.id }
        })
        .then(res => {
          if (res.status === 200) {
            this.positionImgArr = res.data.data;
            this.positionImgVisible = true;
          }
        });
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG和PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 获取职位信息
    getPostInfo(id) {
      this.$axios
        .get(
          "api/position/findPositionList?userToken=4eaabded5c1f480d807a598187aef982"
        )
        .then(res => {
          if ((res.data.code = "0")) {
            this.postInfoData = res.data.data;
          } else {
            console.log("请求失败！");
          }
        });
    },
    // 选择该项
    choosePost(data, i) {
      this.title = "修改职位信息";
      this.selectPositionId = data.id;
      this.$axios
        .get("/api/positionPicture/findPositionPictureByPosition", {
          params: { positionId: data.id }
        })
        .then(res => {
          console.log(res);
          if (res.status === 200) {
            var tempUrl = {};
            this.positionVisibleArr = [];
            for (var i = 0; i < res.data.data.length; i++) {
              tempUrl.id = res.data.data[i].positionPicture.id;
              tempUrl.url =
                "/api/resources/findResourcesById?id=" +
                res.data.data[i].positionPicture;
              this.positionVisibleArr.push(tempUrl);
              var tempUrl = {};
            }
          }
        });
      this.dialogVisible = true;
      this.postName = data.name;
      this.postInfo = data.information;
      this.index = i;
      this.postId = data.id;
    },
    // 修改&增加职位信息
    changePostInfo() {
      if (this.title === "修改职位信息") {
        let query = {
          id: this.postId,
          name: this.postName,
          information: this.postInfo,
          newResourcesId: this.postPicId,
          userToken: this.$userToken
        };
        console.log(query);
        this.$axios
          .put("api/position/update", qs.stringify(query))
          .then(res => {
            console.log(res);
            if (this.postName == "" || this.getPostInfo == "") {
              this.$message({
                showClose: true,
                message: "警告，职位名和职位信息不能为空!",
                type: "warning"
              });
            } else {
              this.postInfoData[this.index].name = this.postName;
              this.postInfoData[this.index].information = this.postInfo;
              this.postInfoData[this.index].newResourcesId = this.postPicId;
              this.dialogVisible = false;
              if (this.deleteImg !== null) {
                this.$axios
                  .delete("/api/positionPicture/delete", {
                    params: this.deleteImg
                  })
                  .then(res => {
                    if (res.status === 200) {
                      if (res.data.msg === "删除职位详细图片成功！") {
                        this.$refs.upload.submit();
                      }
                    }
                  });
              } else {
                this.$refs.upload.submit();
              }
            }
            this.$message({
              message: "职位信息保存成功",
              type: "success"
            });
          });
      } else {
        let query = {
          name: this.postName,
          information: this.postInfo,
          userToken: this.$userToken
        };
        this.$axios
          .post("/api/position/save", qs.stringify(query))
          .then(res => {
            if (res.status === 200) {
              console.log(res);
              if (res.data.msg === "职位添加成功") {
                this.selectPositionId = res.data.data.id;
                this.$refs.upload.submit();
                this.dialogVisible = false;
                this.getPostInfo();
                this.$message({
                  message: "职位添加成功",
                  type: "success"
                });
              } else if (res.data.msg === "职位已存在！") {
                this.$message.error("该职位已存在");
              }
            }
          });
      }
    },
    // 删除职位
    dialogDeletePost(i, data) {
      this.$confirm("此操作将永久删除该职位及其信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let query = {
            userToken: this.$userToken,
            id: data[i].id
          };
          this.$axios
            .delete("api/position/delete", { params: query })
            .then(res => {
              console.log(res);
              if (res.status === 200) {
                if (res.data.msg === "删除职位信息成功!") {
                  this.$message({
                    type: "success",
                    message: "删除成功!"
                  });
                  // 本地删除，缺点，前后台若不同步，前后台数据不一致
                  this.postInfoData.splice(i, 1);
                  // 删除，重调接口
                  // this.getPostInfo()
                }
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  created() {
    this.getPostInfo();
  },
  mounted() {}
};
</script>
<style scoped>
.viewPositionImg {
  width: 300px;
  height: 200px;
  margin: 30px;
}
</style>