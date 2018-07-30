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
        <el-table :data="tableInfoData" v-if="getAlbumInfo">
          <el-table-column prop="name" label="姓名" align="left" width="260">
          </el-table-column>
          <el-table-column label="照片" align="center" width="160">
            <template slot-scope="scope">
              <el-button type="primary" plain size="small" @click="getAlbumInfo(scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center">
            <!-- <template slot-scope="scope">
              <el-button icon="el-icon-search" circle size="mini"></el-button>
              <el-button type="primary" icon="el-icon-edit" circle size="mini"></el-button>
              <el-button type="danger" icon="el-icon-delete" circle size="mini"></el-button>
            </template> -->
          </el-table-column>

        </el-table>
      </div>
      <!-- <div class="paginationDiv">
        <el-pagination ref="pages" layout=" prev, pager, next, jumper" @current-change="currentChange" @size-change="sizeChange" :page-size="pageSize" :current-page="currentPage">
        </el-pagination>
      </div> -->
      <!-- 照片详情查看弹框 -->
      <el-dialog title="照片详情" :visible.sync="dialogPicture" width="30%">
        <div class="albumImg">
          <img v-for="item in albumInfoData" :key="item.id" class="viewAlbumImg" :src="'/api/resources/findResourcesById?id='+item.resources.id" alt="">
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
      
    };
  },
  watch: {},
  computed: {},
  methods: {
    getTableInfo() {
      let query = {
        userToken: "4eaabded5c1f480d807a598187aef982"
      };
      this.$axios.get("api/user/findUserList", { params: query }).then(res => {
        if ((res.data.code = "0")) {
          this.tableInfoData = res.data.data;
        } else {
          console.log("请求失败！");
        }
      });
    },
    getAlbumInfo(albumData) {
      this.dialogPicture = true;
      let query = {
        userToken: this.$userToken,
        userId: albumData.id
      };
      this.$axios
        .get("api/photo/findPhotoListByUserId", {
          params: query
        })
        .then(res => {
          if (res.status === 200) {
            this.albumInfoData = res.data.data;
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
.albumImg{
  padding:0 21%;
}
.viewAlbumImg {
  width: 300px;
  margin: 30px auto;
}
</style>