<!-- 历届管培生 -->
<template>
  <div>
    <div class="container">
      <div class="contentHeader">
        <h4>历届管培生</h4>
        <div class="functionalArea">
          <input type="text" class="searchInput" placeholder="搜索姓名">
          <el-button type="primary" size="small" class="searchButton">搜索</el-button>
        </div>
        <div class="functionalArea">
          <input type="tel" class="searchInput" placeholder="搜索电话号码">
          <el-button type="primary" size="small" class="searchButton">搜索</el-button>
        </div>
        <div class="functionalArea">
          <el-button type="primary" size="small" class="searchButton">全部用户信息</el-button>
        </div>
      </div>
      <div class="contentDiv">
        <el-table v-if="getSuccessiveTrainee" :data="successiveInfoData.slice((currentPage-1)*size,currentPage*size)">
          <el-table-column prop="name" label="姓名" align="left" width="120px">
          </el-table-column>
          <el-table-column prop="sex" label="男" align="left" width="100px">
          </el-table-column>
          <el-table-column prop="age" label="年龄" align="left" width="100px">
          </el-table-column>
          <el-table-column prop="position.name" label="培养方向" align="left" width="120px">
          </el-table-column>
          <el-table-column prop="startTime" label="培养开始时间" align="left" width="120px">
          </el-table-column>
          <el-table-column prop="endTime" label="培养结束时间" align="left" width="140px">
          </el-table-column>
          <el-table-column prop="synopsis" label="评价" align="left" width="280px">
          </el-table-column>
          <el-table-column prop="content" label="心得体会" align="left">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" circle size="mini"></el-button>
            </template>
          </el-table-column>
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
      successiveInfoData: [],
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
      return this.successiveInfoData.length;
    }
  },
  methods: {
    // 设置分页
    setCurrent(val) {
      console.log(val);
      this.current = val;
      this.currentPage = val;
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
          console.log(res);
          this.successiveInfoData = res.data.data;
          for (let i = 0; i < this.successiveInfoData.length; i++) {
            if (this.successiveInfoData[i].sex == false) {
              this.successiveInfoData[i].sex = "女";
            } else if (this.successiveInfoData[i].sex == true) {
              this.successiveInfoData[i].sex = "男";
            }
          }
        });
    }
  },
  created() {
    this.getSuccessiveTrainee();
  }
};
</script>
<style scoped>
</style>