<template>
  <div id="login">
    <div id="content">
      <h2>Ant管培生——管理员登录系统</h2>
    </div>
    <div class="wrap">
      <el-form ref="" label-width="70px">
        <div class="input">
          <p>用户名</p>
          <input type="text" v-model="username" placeholder="请输入用户名">
        </div>
        <div class="input">
          <p>密码</p>
          <input type="password" v-model="password" placeholder="请输入密码">
        </div>
        <!-- <div class="remeber">
          <el-form-item class="rem" label="记住密码">
            <el-switch v-model="isRemeber"></el-switch>
          </el-form-item>
        </div> -->
        <div class="login_btn">
          <el-form-item class="login_btn_a">
            <el-button type="primary" @click="submitForm" size="small">登录</el-button>
            <el-button @click="resetForm" size="small">重置</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import qs from "qs";
export default {
  name: "login",
  data() {
    return {
      _dom: "",
      // isRemeber: "",
      username: "",
      password: ""
    };
  },
  computed: {},
  created() {
    // if (window.localStorage.getItem("isRemeber") == "true") {
    //   this.isRemeber = true;
    // } else {
    //   this.isRemeber = false;
    // }
    // if (this.isRemeber) {
    //   this.username = window.localStorage.getItem("logName");
    //   this.password = window.localStorage.getItem("logPwd");
    // }
  },

  methods: {
    submitForm() {
      let query = {
        phoneNumber: this.username,
        password: this.password
      };
      this.$axios
        .post("api/user/loginByPhoneNumberAndPassword", qs.stringify(query))
        .then(res => {
          console.log(res)
          if (res.status == "200") {
            if (res.data.code == "1") {
              console.log("密码或用户名错误")
            } else if(res.data.code == "0"){
              console.log("登陆成功")
              sessionStorage.setItem('isLog','true');
              this.$router.push("/home");
            }
        } else {

        }
        })
        .catch(err => {
          console.log(err);
        });
    },
    resetForm() {
      this.username = "";
      this.password = "";
    },
    // remeberAdmin() {
    //   if (this.isRemeber) {
    //     window.localStorage.setItem("isRemeber", true);
    //     window.localStorage.setItem("logName", this.username);
    //     window.localStorage.setItem("logPwd", this.password);
    //   } else {
    //     window.localStorage.setItem("isRemeber", false);
    //     window.localStorage.removeItem("logName");
    //     window.localStorage.removeItem("logPwd");
    //   }
    // }
  }
};
</script>

<style scoped>
#myvideo {
  width: 100%;
  height: 100%;
  object-fit: initial;
}

#login {
  width: 100%;
  height: 100%;
  background: url("../../static/image/bgImg.jpg");
  background-size: cover;
  background-repeat: no-repeat;
}
#content {
  width: 100%;
  height: 180px;
  padding: 0 auto;
}

#content > h2 {
  line-height: 180px;
  color: white;
  margin: auto;
  text-align: center;
  margin-bottom: 15px;
  font-size: 26px;
  font-family: "Courier New", Courier, monospace;
}
.wrap {
  margin: auto;
  width: 350px;
  height: 350px;
  border-radius: 5px;
  box-shadow: 1px 1px 4px 1px lightgray;
  background: rgba(255, 255, 255, 0.6);
}

.input {
  margin: 0 auto;
  width: 260px;
  margin-top: 20px;
  padding: 15px 0 0 0;
}

.input > input {
  width: 250px;
  height: 35px;
  border-radius: 5px;
  padding-left: 5px;
  margin-bottom: 10px;
  margin: 0 auto;
  border: 1px solid #cad2db;
}

.input > p {
  font-size: 16px;
  margin-bottom: 15px;
}

.remeber {
  height: 40px;
  padding-left: 40px;
  margin-top: 10px;
  margin-bottom: 35px;
  color: white;
}

.login_btn {
  padding-left: 45px;
}
</style>
