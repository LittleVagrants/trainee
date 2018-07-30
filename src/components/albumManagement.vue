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
        <el-table :data="albumInfoData" v-if="getAlbumInfo">
          <el-table-column prop="user.name" label="姓名" align="left" width="260">
          </el-table-column>
          <el-table-column label="照片" align="center" width="160">
            <template slot-scope="scope">
              <el-button type="primary" plain size="small" @click="dialogPicture = true">查看详情</el-button>
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
        <el-upload ref="">
          <img :src="1">
        </el-upload>
        <el-upload ref="">
          <img :src="1">
        </el-upload>
        <el-upload ref="">
          <img :src="1">
        </el-upload>
        <el-upload ref="">
          <img :src="1">
        </el-upload>
        <el-upload ref="">
          <img :src="1">
        </el-upload>
        <el-upload ref="">
          <img :src="1">
        </el-upload>
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
      albumInfoData: []
    };
  },
  watch: {},
  computed: {},
  methods: {
    getAlbumInfo() {
      this.$axios
        .get(
          "api/photo/findPhotoListByUser?userToken=4eaabded5c1f480d807a598187aef982"
        )
        .then(res => {
          if ((res.data.code = "0")) {
            this.albumInfoData = res.data.data;
            console.log(this.albumInfoData);
          } else {
            console.log("请求失败！");
          }
        });
    }
  },
  created() {
    this.getAlbumInfo();
  },
  mounted() {}
};
</script>
<style scoped>
</style>