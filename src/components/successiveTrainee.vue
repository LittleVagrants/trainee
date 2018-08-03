<!-- 历届管培生 -->
<template>
  <div>
    <div class="container">
      <div class="contentHeader">
        <h4>历届管培生</h4>
        <div class="functionalArea">
          <el-button type="primary" size="small" class="addButton" @click="addTrainee">添加信息</el-button>
        </div>
      </div>
      <div class="contentDiv">
        <el-table v-if="getSuccessiveTrainee" :data="successiveInfoData.slice((currentPage-1)*size,currentPage*size)">
          <el-table-column prop="name" label="姓名" align="left" width="120px">
          </el-table-column>
          <el-table-column prop="sex" label="男" align="left" width="100px">
          </el-table-column>
          <el-table-column prop="age" label="年龄" align="left" width="80px">
          </el-table-column>
          <el-table-column prop="constellation" label="星座" align="left" width="100px">
          </el-table-column>
          <el-table-column prop="position.name" label="职业" align="left" width="120px">
          </el-table-column>
          <el-table-column prop="startTime" label="培养开始时间" align="left" width="120px">
          </el-table-column>
          <el-table-column prop="endTime" label="培养结束时间" align="left" width="140px">
          </el-table-column>
          <el-table-column prop="synopsis" label="评价" align="left" width="180px">
          </el-table-column>
          <el-table-column prop="content" label="心得体会" align="left">
          </el-table-column>
          <el-table-column prop="position" label="头像" align="center">
            <template slot-scope="scope">
              <img class="headePic" :src="'/api/resources/findResourcesById?id='+scope.row.headPortrait" alt="">
            </template>
          </el-table-column>
          <el-table-column label="操作" align="left">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" circle size="mini" @click.native.prevent="chooseTrainee(scope.row,scope.$index)"></el-button>
              <el-button type="danger" icon="el-icon-delete" circle size="mini" @click.native.prevent="deleteTrainee(scope.$index,successiveInfoData)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="paginationDiv">
        <el-pagination ref="pages" layout=" total, prev, pager, next, jumper" :total="total" :page-size="size" @current-change="setCurrent">
        </el-pagination>
      </div>
      <el-dialog :title="title" width="25%" :visible.sync="dialogVisible">
        <el-form ref="form" label-width="100px">
          <el-form-item label="姓名">
            <el-input class="dialogInput" v-model="traineeName"></el-input>
          </el-form-item>
          <el-form-item label="性别" width="50px">
            <el-select class="dropdownContent" v-model="traineeSex" placeholder="请选择角色">
              <el-option v-for="item in sexSelect" :key="item.index" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年龄">
            <el-input class="dialogInput" v-model="traineeAge"></el-input>
          </el-form-item>
          <el-form-item label="星座">
            <el-input class="dialogInput" v-model="constellation"></el-input>
          </el-form-item>
          <el-form-item label="职业">
            <el-select class="dropdownContent" v-model="orientation">
              <el-option v-for="item in allPosition" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间">
            <el-input class="dialogInput" v-model="startTime"></el-input>
          </el-form-item>
          <el-form-item label="结束时间">
            <el-input class="dialogInput" v-model="endTime"></el-input>
          </el-form-item>
          <el-form-item label="评价">
            <el-input class="dialogInput" v-model="evaluate"></el-input>
          </el-form-item>
          <el-form-item label="心得体会">
            <el-input type="textarea" resize="none" rows="3" class="dialogInput" v-model="experience"></el-input>
          </el-form-item>
          <el-form-item label="头像">
            <!-- <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :file-list = "editUserImg" :show-file-list="true" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload> -->
            <el-upload action="string" :http-request="uploadSectionFile" ref="upload" list-type="picture-card" :file-list='editUserImg' :on-preview="handlePictureCardPreview" :auto-upload="false" :limit="1" :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" size="small" @click="changeTraineeInfo">确 定</el-button>
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
      successiveInfoData: [],
      // 默认打开页
      current: 1,
      // 每页展示条数
      size: 7,
      // 数据展示页
      currentPage: 1,
      editUserImg: [{ id: "1", url: "" }],
      allPosition: [],
      // 弹框绑定
      title: null,
      traineeId: null,
      traineeName: "",
      traineeSex: "",
      traineeAge: "",
      constellation: "",
      orientation: "",
      startTime: "",
      endTime: "",
      evaluate: "",
      experience: "",
      changeSex: true,
      sexSelect: [
        {
          value: true,
          label: "男"
        },
        {
          value: false,
          label: "女"
        }
      ],
      imageUrl: ""
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
      return this.successiveInfoData.length;
    }
  },
  methods: {
    uploadSectionFile(param) {
      var form = new FormData()
      form.append("photoFiles", param.file)
      form.append("userToken", this.$userToken)
      form.append("name", this.traineeName)
      form.append("age", this.traineeAge)
      form.append("constellation", this.constellation)
      form.append("synopsis", this.evaluate)
      form.append("content", this.experience)
      form.append("positionId", this.traineeAge)
      form.append("age", this.traineeAge)
      form.append("age", this.traineeAge)
      form.append("age", this.traineeAge)
    },
    handlePictureCardPreview() {},
    handleRemove() {},
    // 设置分页
    setCurrent(val) {
      // console.log(val);
      this.current = val;
      this.currentPage = val;
    },
    // 弹框选择职业，获取所有职位名
    getPosition() {
      this.$axios.get("api/position/findPositionList").then(res => {
        // console.log(res)
        if (res.data.code == 0) {
          this.allPosition = res.data.data;
          // console.log(this.allPosition)
        }
      });
    },
    // 获取管培生列表
    getSuccessiveTrainee() {
      let query = {
        userToken: this.$userToken
      };
      this.$axios
        .get("api/successiveGuanPeiSheng/findSuccessiveGuanPeishengList", {
          params: query
        })
        .then(res => {
          console.log(res);
          this.successiveInfoData = res.data.data;
          console.log(this.successiveInfoData[1].position);
          for (let i = 0; i < this.successiveInfoData.length; i++) {
            if (this.successiveInfoData[i].sex == false) {
              this.successiveInfoData[i].sex = "女";
            } else if (this.successiveInfoData[i].sex == true) {
              this.successiveInfoData[i].sex = "男";
            }
          }
        });
    },
    // 选择行信息
    chooseTrainee(data, i) {
      // console.log(data.id);
      this.traineeId = data.id;
      this.title = "修改历届管培生信息";
      this.traineeName = data.name;
      this.traineeSex = data.sex;
      this.traineeAge = data.age;
      this.constellation = data.constellation;
      this.orientation = data.position.id;
      this.startTime = data.startTime;
      this.endTime = data.endTime;
      this.evaluate = data.synopsis;
      this.experience = data.content;
      this.editUserImg[0].url =
        "/api/resources/findResourcesById?id=" + data.headPortrait;
      console.log(1);
      console.log(this.editUserImg);
      this.dialogVisible = true;
      if (this.sexSelect.value == true) {
        this.changeSex = true;
        return this.changeSex;
      } else if (this.sexSelect == false) {
        this.changeSex = false;
        return this.changeSex;
      }
    },
    addTrainee() {
      this.editUserImg = [];
      this.traineeId = "";
      this.title = "添加历届管培生信息";
      this.traineeName = "";
      this.traineeSex = "";
      this.traineeAge = "";
      this.constellation = "";
      this.orientation = "";
      this.startTime = "";
      this.endTime = "";
      this.evaluate = "";
      this.experience = "";
      this.dialogVisible = true;
      if (this.sexSelect.value === true) {
        this.changeSex = true;
        return this.changeSex;
      } else if (this.sexSelect === false) {
        this.changeSex = false;
        return this.changeSex;
      }
    },
    // 删除行信息
    deleteTrainee(i, data) {
      console.log(data[i]);
      this.$confirm("此操作将永久删除该管培生信息, 是否继续?", "提示", {
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
            .delete("api/successiveGuanPeiSheng/delete", { params: query })
            .then(res => {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              // 本地删除，缺点，前后台若不同步，前后台数据不一致
              this.successiveInfoData.splice(i, 1);
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
    // 修改历届管培生信息
    changeTraineeInfo() {
      if (this.title === "修改历届管培生信息") {
        let query = {
          sex: this.changeSex,
          userToken: this.$userToken,
          id: this.traineeId,
          name: this.traineeName,
          age: this.traineeAge,
          constellation: this.constellation,
          synopsis: this.evaluate,
          content: this.experience,
          photoFiles: this.imageUrl,
          positionId: this.orientation,
          startTime: this.startTime,
          endTime: this.endTime
        };
        console.log(query);
        this.$axios
          .post("api/successiveGuanPeiSheng/update", qs.stringify(query))
          .then(res => {
            if (res.data.code == 0) {
              this.dialogVisible = false;
              this.$message({
                type: "success",
                message: "历届管培生信息修改成功!"
              });
            } else if (res.data.code == 1) {
              this.$message({
                type: "warning",
                message: "修改信息有问题!"
              });
            }
          });
      } else if (this.title === "添加历届管培生信息") {
        let query = {
          sex: this.changeSex,
          userToken: this.$userToken,
          name: this.traineeName,
          age: this.traineeAge,
          constellation: this.constellation,
          synopsis: this.evaluate,
          content: this.experience,
          photoFiles: null,
          positionId: this.orientation,
          startTime: this.startTime,
          endTime: this.endTime
          // positionId:
        };
        this.$axios
          .post("api/successiveGuanPeiSheng/save", qs.stringify(query))
          .then(res => {
            if (res.data.code == 0) {
              this.dialogVisible = false;
              this.$message({
                type: "success",
                message: "历届管培生信息添加成功!"
              });
            } else if (res.data.code == 1) {
              this.$message({
                type: "warning",
                message: "所有信息均不能为空!"
              });
            }
          });
      }
    },
    // 上传头像格式大小判断
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
    }
  },
  created() {
    this.getSuccessiveTrainee();
    this.getPosition();
  }
};
</script>
<style scoped>
.headePic {
  width: 70px;
  height: 90px;
  /* margin: 30px; */
}
.avatar-uploader .el-upload {
  border: 1px dashed gray;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>