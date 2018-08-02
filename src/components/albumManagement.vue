  // 相册管理

<template>
  <div>
    <div class="container">
      <div class="contentHeader">
        <h4>相册管理列表</h4>
        <div class="functionalArea">
          <!-- <input type="text" class="searchInput" placeholder="请输入搜索内容">
          <el-button type="primary" size="small" class="searchButton">搜索</el-button> -->
        </div>

      </div>
      <div class="contentDiv">
        <el-table :data="tableInfoData.slice((currentPage-1)*size,currentPage*size)" v-if="getAlbumInfo">
          <el-table-column prop="name" label="姓名" align="left" width="260">
          </el-table-column>
          <el-table-column label="照片" align="center" width="160">
            <template slot-scope="scope">
              <el-button type="primary" plain size="small" @click="getAlbumInfo(scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center">
          </el-table-column>

        </el-table>
      </div>
      <div class="paginationDiv">
        <el-pagination ref="pages" layout=" total, prev, pager, next, jumper" :total="total" :page-size="size" @current-change="setCurrent">
        </el-pagination>
      </div>
      <!-- 照片详情查看弹框 -->
      <el-dialog title="照片详情" :visible.sync="dialogPicture" width="30%">
        <div class="albumImg">
          <img v-for="item in albumInfoData" :key="item.id" class="viewAlbumImg" :src="'/api/resources/findResourcesById?id='+item.resources" alt="">
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogPicture: false,
      albumInfoData: [],
      tableInfoData: [],
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
      return this.tableInfoData.length;
    }
  },
  methods: {
    // 设置分页
    setCurrent(val) {
      // console.log(val);
      this.current = val;
      this.currentPage = val;
    },
    getTableInfo() {
      let query = {
        userToken: "4eaabded5c1f480d807a598187aef982"
      };
      this.$axios.get("api/user/findUserList", { params: query }).then(res => {
        // console.log(res)
        if ((res.data.code = "0")) {
          this.tableInfoData = res.data.data;
        } else {
          console.log("请求失败！");
        }
      });
    },
    getAlbumInfo(albumData) {
      let query = {
        userToken: this.$userToken,
        userId: albumData.id
      };
      console.log(query)
      this.$axios
        .get("api/photo/findPhotoListByUserId", {
          params: query
        })
        .then(res => {
          // console.log(res);
          if ((res.status === 200) & (res.data.data != null)) {
            this.dialogPicture = true;
            this.albumInfoData = res.data.data;
          } else {
            this.dialogPicture = false;
            this.$message({
              type: "success",
              message: "该用户没有上传照片!"
            });
          }
        });
    }
  },
  created() {
    this.getTableInfo();
  },
  mounted() {}
};
</script>
<style scoped>
.albumImg {
  padding: 0 21%;
}
.viewAlbumImg {
  width: 300px;
  margin: 30px auto;
}
</style>