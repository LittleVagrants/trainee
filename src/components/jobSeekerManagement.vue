// 求职管理

<template>
  <div>
    <div class="container">
      <div class="contentHeader">
        <h4>求职者信息</h4>
        <div class="functionalArea">
          <!-- <input type="text" class="searchInput" placeholder="请输入搜索内容">
          <el-button type="primary" size="small" class="searchButton">搜索</el-button> -->
        </div>

      </div>
      <div class="contentDiv">
        <el-table :data="jobSeekerInfoData.slice((currentPage-1)*size,currentPage*size)" v-if="getJobSeekerInfo">
          <el-table-column prop="jobHunter.user.name" label="姓名" align="left">
          </el-table-column>
          <el-table-column prop="jobHunter.user.phoneNumber" label="电话号码" align="left">
          </el-table-column>
          <el-table-column prop="jobHunter.advantage" label="求职者优势" align="left">
          </el-table-column>
          <el-table-column prop="teachersRecommend" label="名师点评" align="center">
          </el-table-column>
          <el-table-column prop="" label="在校证明" align="center">
            <template slot-scope="scope">
              <el-button type="primary" plain size="small" @click="getSchoolInfo(scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="" label="教育经历" align="center">
            <template slot-scope="scope">
              <el-button type="primary" plain size="small" @click="getEduInfo(scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="paginationDiv">
        <el-pagination ref="pages" layout=" total, prev, pager, next, jumper" :total="total" :page-size="size" @current-change="setCurrent">
        </el-pagination>
      </div>
      <el-dialog :data="jobHunterInfoData" title="教育经历" :visible.sync="dialogEducation" width="30%">
        <div prop="teachersRecommend">
        </div>
        <el-row>
          <el-col :offset="4" :span="3" class="title">学校:</el-col>
          <el-col :span="6">{{eduInfoData.school}}</el-col>
        </el-row>
        <el-row>
          <el-col :offset="4" :span="3" class="title">专业:</el-col>
          <el-col :span="6">{{eduInfoData.specialty}}</el-col>
        </el-row>
        <el-row>
          <el-col :offset="4" :span="3" class="title">学历:</el-col>
          <el-col :span="6">{{eduInfoData.educationBackground}}</el-col>
        </el-row>
        <el-row>
          <el-col :offset="4" :span="3" class="title">时间段:</el-col>
          <el-col :span="6">{{eduInfoData.startTime}}-{{eduInfoData.endTime}}</el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogEducation = false">关 闭</el-button>
        </div>
      </el-dialog>
      <el-dialog title="在校证明" :visible.sync="dialogSchool" width="30%">
        <div class="schoolImg">
          <img v-for="item in schoolInfoData" :key="item.id" class="viewPositionImg" :src="'/api/resources/findResourcesById?id=96'" alt="">
          <!-- +item.schoolCertificate.id -->
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 名师点评，教育经历，简历弹框判断
      dialogSchool: false,
      dialogEducation: false,
      dialogResume: false,
      eduInfoData: {
        school: "",
        specialty: "",
        educationBackground: "",
        startTime: "",
        endTime: ""
      },
      // 默认打开页
      current: 1,
      // 每页展示条数
      size: 12,
      // 数据展示页
      currentPage: 1,
      jobSeekerInfoData: [],
      jobHunterInfoData: [],
      schoolInfoData: null
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
      return this.jobSeekerInfoData.length;
    }
  },
  methods: {
    // 设置分页
    setCurrent(val) {
      console.log(val);
      this.current = val;
      this.currentPage = val;
    },
    // handleClose(done) {
    //   this.$confirm("确认关闭？")
    //     .then(_ => {
    //       done();
    //     })
    //     .catch(_ => {});
    // },
    getSchoolInfo(schoolData) {
      console.log("______________________________")
      console.log(schoolData)
      this.dialogSchool = true;
      // console.log("____________________________")
      // console.log(schoolData)
      let query = {
        userToken: this.$userToken,
        userId: schoolData.jobHunter.user.id
      };
      this.$axios
        .get("api/schoolCertificate/findSchoolCertificateByUserId", {
          params: query
        })
        .then(res => {
          console.log(res);
          if (res.status === 200) {
            this.schoolInfoData = res.data.data;
            // console.log(this.schoolInfoData)
            // this.dialogSchool = true;
            // console.log(this.schoolInfoData.schoolCertificate.id);
          }
        });
    },
    getEduInfo(eduData) {
      this.dialogEducation = true;
      let query = {
        userToken: this.$userToken,
        id: eduData.jobHunter.id
      };
      this.$axios
        .get("/api/jobHunterEducation/findJobHunterEducationById", {
          params: query
        })
        .then(res => {
          this.eduInfoData = res.data.data;
        });
    },
    getJobSeekerInfo() {
      let query = {
        userToken: this.$userToken
      };
      this.$axios
        .get("api/jobHunterPosition/findJobHunterPositionList", {
          params: query
        })
        .then(res => {
          // console.log(res);
          if ((res.data.code = "0")) {
            this.jobSeekerInfoData = res.data.data;
          } else {
            console.log("请求失败！");
          }
        });
    }
  },
  created() {
    this.getJobSeekerInfo();
    // this.getJobHunterPositionInfo();
  },
  mounted() {}
};
</script>
<style scoped>
.el-row {
  margin: 10px 0;
}
.el-row:last-child {
  margin-bottom: 20px;
}
.titlt {
  font-weight: bold;
  font-size: 26px;
}
.el-dialog {
  padding-bottom: 100px;
  overflow: hidden;
}
.schoolImg{
  padding:0 20%;
}
.viewPositionImg {
  width: 300px;
  margin: 30px auto;
}
</style>