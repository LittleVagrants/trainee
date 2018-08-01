<!-- 历届管培生 -->
<template>
  <div>
    <div class="container">
      <div class="contentHeader">
        <h4>历届管培生</h4>
        <div class="functionalArea">
          <el-button type="primary" size="small" class="addButton">添加信息</el-button>
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
          <el-table-column prop="synopsis" label="评价" align="left" width="280px">
          </el-table-column>
          <el-table-column prop="content" label="心得体会" align="left">
          </el-table-column>
          <el-table-column label="头像" align="center">
          </el-table-column>
          <el-table-column label="操作" align="left">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" circle size="mini" @click.native.prevent="chooseTrainee(scope.row,scope.$index)"></el-button>
              <el-button type="danger" icon="el-icon-delete" circle size="mini" @click.native.prevent="dialogDeleteTrainee(scope.$index,postInfoData)"></el-button>
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
            <!-- <input type="file"> -->
            <!-- <el-upload action="string" :http-request="uploadSectionFile" ref="upload" list-type="picture-card" :file-list='positionVisibleArr' :on-preview="handlePictureCardPreview" :auto-upload="false" :limit="6" :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload> -->
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small">取 消</el-button>
          <el-button type="primary" size="small" @click="changePostInfo">确 定</el-button>
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

      allPosition:[],
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
      sexSelect: [
        {
          value: true,
          label: "男"
        },
        {
          value: false,
          label: "女"
        }
      ]
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
    // 设置分页
    setCurrent(val) {
      // console.log(val);
      this.current = val;
      this.currentPage = val;
    },
    getPosition(){
      this.$axios.get("api/position/findPositionList").then(res=>{
        // console.log(res)
        if(res.data.code==0){
          this.allPosition=res.data.data
          // console.log(this.allPosition)
        }
      })
    },
    getSuccessiveTrainee() {
      let query = {
        userToken: this.$userToken
      };
      this.$axios
        .get("api/successiveGuanPeiSheng/findSuccessiveGuanPeishengList", {
          params: query
        })
        .then(res => {
          // console.log(res);
          this.successiveInfoData = res.data.data;
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
      // console.log(data, i);
      // console.log(data.id);
      this.traineeId = data.id;
      this.title = "修改历届管培生信息";
      this.traineeName = data.name;
      this.traineeSex = data.sex;
      this.traineeAge = data.age;
      this.constellation = data.constellation;
      this.orientation = data.position.name;
      this.startTime = data.startTime;
      this.endTime = data.endTime;
      this.evaluate = data.synopsis;
      this.experience = data.content;
      this.dialogVisible = true;
    },
    // 删除行信息
    dialogDeleteTrainee() {},
    // 修改职位信息
    changePostInfo() {
      // console.log("____________________");
      let query = {
        userToken: this.$userToken,
        id: this.traineeId,
        name: this.traineeName,
        age: this.traineeAge,
        constellation: this.constellation,
        synopsis: this.evaluate,
        content: this.content,
        photoFiles: "111",
        positionId:this.orientation,
        startTime:this.startTime,
        endTime:this.endTime
        // positionId:
      };
      this.$axios
        .post("api/successiveGuanPeiSheng/update", qs.stringify(query))
        .then(res => {
          console.log(res)
        });
    }
  },
  created() {
    this.getSuccessiveTrainee();
    this.getPosition()
  }
};
</script>
<style scoped>
</style>