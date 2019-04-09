<template>
  <div id="app">
    <el-container>
      <el-header style="margin:0 auto" v-if="click==0">
        <h1>考试系统</h1>
      </el-header>
      <el-main height>
        <div v-if="click==0">
          <el-table
            :data="sj"
            style="width: 100%"
            highlight-current-row
            @current-change="handleCurrentChange"
          >
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column property="name" label="考试名称"></el-table-column>
            <el-table-column property="ksxz" label="考试"></el-table-column>
            <el-table-column label="考试类型">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.type==1">口令登陆</el-tag>
                <el-tag v-if="scope.row.type == 2">指定考生登陆</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="width:70%;margin:0 auto;">
            <router-view/>
        </div>
        <!-- Main content -->
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      sj: [],
      click: ""
    };
  },
  watch:{
    '$route'(to,from){
      console.log(to.name)
      console.log(from.name)
      if(to.name=='Home'){
        sessionStorage.setItem("click",0)
        this.init()
      }
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$http.get("/api/querySjAll").then(
        function(res) {
          this.sj = res.body;
          if (sessionStorage.getItem("click")) {
            this.click = sessionStorage.getItem("click");
          } else {
            this.click = 0;
          }
        },
        function(res) {
          this.$message.erro(res.bodyText);
        }
      );
    },
    handleCurrentChange(val) {
      console.log(val.kl);
      sessionStorage.setItem("id", val.id);
      sessionStorage.setItem("type", val.type);
      sessionStorage.setItem("click", 1);
      sessionStorage.setItem("kl",val.kl)
      this.$router.push({
        path: "/ks",
        query: {
          id: val.id,
          type:val.type
        }
      });
      this.click = 2;
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
