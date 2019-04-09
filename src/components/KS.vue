<template>
  <div>
    <div v-if="type == 1">
      <el-row type="flex" :span="24" justify="space-around">
        <el-col :span="8">
          <el-card shadow="always">
            <div class="logintext" style="text-align:center">
              <h4>口令登陆</h4>
            </div>
            <div class="logintext">
              <div class="logininput">
                <el-input placeholder="请输入姓名" v-model="user">
                  <template slot="prepend">姓名:</template>
                </el-input>
              </div>
              <div class="logininput" style="margin-top:20px">
                <el-input placeholder="请输入口令" v-model="kl">
                  <template slot="prepend">口令:</template>
                </el-input>
              </div>
              <div class="logintext" style="text-align:center">
                <el-button type="primary" @click="kllogin">登陆</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div v-if="type == 2">
      <el-row type="flex" :span="24" justify="space-around">
        <el-col :span="8">
          <el-card shadow="always">
            <div class="logintext" style="text-align:center">
              <h4>账号密码登陆</h4>
            </div>
            <div class="logintext">
              <div class="logininput">
                <el-input placeholder="请输入账号" v-model="user">
                  <template slot="prepend">账号:</template>
                </el-input>
              </div>
            </div>
            <div class="logintext">
              <el-input v-model="pass" placeholder="请输入密码" type="password">
                <template slot="prepend">密码:</template>
              </el-input>
            </div>
            <div class="logintext" style="text-align:center">
              <el-button type="primary" @click="kslogin">登陆</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div v-if="active == 2">
      <div class="sjtm">
        <div style="text-align:center">
          <h2>{{sj.name}}</h2>
        </div>
        <div v-if="sj.xzt.length>0">
          <h3>选择题</h3>
          <template v-for="(xzt, index) in sj.xzt">
            <div v-html="addnum(xzt.tigan,index,xzt.fz)" :key="'xzt'+index"></div>
            <el-radio
              v-model="xztda[index].da"
              v-for="(item1, index1) in xzt.xx"
              :key="'xztda'+index+index1"
              :label="dxt_label(index1)"
            >{{dxt_label(index1)}}：{{item1.text}}</el-radio>
          </template>
        </div>
        <div v-if="sj.dxt.length>0">
          <h3>多选题</h3>
          <template v-for="(dxt, index) in sj.dxt">
            <div v-html="addnum(dxt.tigan,index,dxt.fz)" :key="'dxt'+index"></div>
            <el-checkbox-group v-model="dxtda[index].da" :key="index">
              <el-checkbox
                v-for="(item, index1) in dxt.xx"
                :label="dxt_label(index1)"
                :key="'dxtda'+index+index1"
              >{{item.text}}</el-checkbox>
            </el-checkbox-group>
          </template>
        </div>
        <div v-if="sj.tkt.length>0">
          <h3>填空题</h3>
          <template v-for="(tkt, index) in sj.tkt">
            <div v-html="tktcontent(tkt,index,tkt.fz)" :key="'tkt'+index"></div>
            <el-input
              v-for="(item, index1) in tkt.da"
              :key="'tktda'+index+index1"
              v-model="tktda[index].da[index1].da"
              style="width:150px;margin-right:20px"
              :placeholder="tktdatext(index1)"
            ></el-input>
          </template>
        </div>
        <div v-if="sj.pdt.length>0">
          <h3>判断题</h3>
          <template v-for="(pdt, index) in sj.pdt">
            <div v-html="addnum(pdt.tigan,index,pdt.fz)" :key="'pdt'+index"></div>
            <el-radio v-model="pdtda[index].da" label="对" :key="'pdtda0'+index">对</el-radio>
            <el-radio v-model="pdtda[index].da" label="错" :key="'pdtda1'+index">错</el-radio>
          </template>
        </div>
        <div v-if="sj.jdt.length>0">
          <h3>简答题</h3>
          <template v-for="(jdt, index) in sj.jdt">
            <div v-html="addnum(jdt.tigan,index,jdt.fz)" :key="'jdt'+index"></div>
            <el-input autosize type="textarea" v-model="jdtda[index].da" :key="'jdtda'+index"></el-input>
          </template>
        </div>
        <div v-if="sj.zht.length>0">
          <h3>综合题</h3>
          <template v-for="(zht, index) in sj.zht">
            <div v-html="addnum(zht.tigan,index,zht.fz)" :key="'zht'+index"></div>
            <template v-for="(item, index1) in zht.da">
              <div style="margin:10px" v-html="item.tm" :key="'zhttm'+index+index1"></div>
              <el-input
                autosize
                type="textarea"
                v-model="zhtda[index].da[index1].da"
                :key="'zhtda'+index+index1"
              ></el-input>
            </template>
          </template>
        </div>
      </div>
      <div style="text-align:center">
        <el-button type="primary" @click="CheckSubmit">交卷</el-button>
      </div>
    </div>
    <div v-show="active == 3" style="margin:0 auto text-align:center">
      <div id="ksfs" :style="{width: '800px', height: '500px'}"></div>
      <el-button @click="finaly">完成考试</el-button>
    </div>
    <el-dialog title="提示" :visible.sync="submintDialog" width="30%" center>
      <div v-html="dialog"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="submintDialog = false">取 消</el-button>
        <el-button type="primary" @click="submit">确定交卷</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "KS",
  data() {
    return {
      sjID: this.$route.query.id,
      type: this.$route.query.type,
      sjkl: "",
      sj: [],
      xztda: [],
      dxtda: [],
      tktda: [],
      pdtda: [],
      jdtda: [],
      zhtda: [],
      active: 1,
      allfz:0,
      kl: "",
      user: "",
      pass: "",
      submintDialog: false,
      dialog: "<p>是否交卷</p>",
      ksreulst:[],
      ksreulstEchart:{},
      legendData:[],
      seriesData:[]
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    finaly(){
      this.$router.go(-1)
    },
    submit() {
      this.$http.post("/api/submitksda",{
        ksid:this.sjID,
        user:this.user,
        xzt:this.xztda,
        dxt:this.dxtda,
        tkt:this.tktda,
        pdt:this.pdtda,
        jdt:this.jdtda,
        zht:this.zhtda
      }).then(function(res){
        this.ksreulst = res.body
        
        if(this.xztda.length>0){
          this.legendData.push('选择题')
          this.seriesData.push({
            value:this.ksreulst.xzt,
            name:'选择题'
          })
        }
        if(this.dxtda.length>0){
          this.legendData.push('多选题')
          this.seriesData.push({
            value:this.ksreulst.dxt,
            name:'多选题'
          })
        }
        if(this.tktda.length>0){
          this.legendData.push('填空题')
          this.seriesData.push({
            value:this.ksreulst.tkt,
            name:'填空题'
          })
        }
        if(this.pdtda.length>0){
          this.legendData.push('判断题')
          this.seriesData.push({
            value:this.ksreulst.pdt,
            name:'判断题'
          })
        }
        if(this.jdtda.length>0){
          this.legendData.push('简答题')
          this.seriesData.push({
            value:this.ksreulst.jdt,
            name:'简答题'
          })
        }
        if(this.zhtda.length>0){
          this.legendData.push('综合题')
          this.seriesData.push({
            value:this.ksreulst.zht,
            name:'综合题'
          })
        }
        this.ksreulstEchart = {
        title:{
          text:'考试成绩(总分:'+this.ksreulst.allfz+'分)',
          x:'center'
        },
        tooltip:{
          trigger:'item',
          formatter:"{a}<br/>{b}:{c} ({d}%)"
        },
        legend:{
          orient:'vartical',
          left:'left',
          data:this.legendData
        },
        series:[
          {
            name:'题目类型',
            type:'pie',
            radius:'55%',
            canter:['50%','60%'],
            data:this.seriesData,
            itemStyle:{
              emphasis:{
                shadowBlur:10,
                shadowOffsetX:0,
                shadowColor:'rbga(0,0,0,0.5)'
              }
            },
            label:{
              normal:{
                formatter:'{b}:{c}({d}%)',
                textStyle:{
                  fontWeight:'normal',
                  fontSize:15
                }
              }
            }
          }
        ]
      }
      this.active = 3
      this.drawPie()
      this.submintDialog = false
      },function(res){
        this.$message.error(res.bodyText)
      })
    },
    drawPie(){
      var Pie = this.$echarts.init(document.getElementById('ksfs'))
      Pie.setOption(this.ksreulstEchart)
    },
    CheckSubmit() {
      var xzt = [];
      var alldiaolog=""
      for (var i = 0; i < this.xztda.length; i++) {
        if (this.xztda[i].da.length == 0) {
          var temp = i + 1;
          xzt.push(temp);
        }
      }
      if (xzt.length > 0) {
        var xztdialog = "<p>有选择题未完成：";
        for (var i = 0; i < xzt.length; i++) {
          if (i != xzt.length - 1) {
            xztdialog += xzt[i] + "，";
          } else {
            xztdialog += xzt[i]+"</p>";
          }
        }
        alldiaolog += xztdialog;
      }
      var dxt = [];
      for (var i = 0; i < this.dxtda.length; i++) {
        if (this.dxtda[i].da.length == 0) {
          var temp = i + 1;
          dxt.push(temp);
        }
      }
      if (dxt.length > 0) {
        var dxtdialog = "<p>有多选题未完成：";
        for (var i = 0; i < dxt.length; i++) {
          if (i != dxt.length - 1) {
            dxtdialog += dxt[i] + "，";
          } else {
            dxtdialog += dxt[i]+"</p>";
          }
        }
        alldiaolog += dxtdialog;
      }
      var tkt = []
      for(var i=0;i<this.tktda.length;i++){
        console.log(i)
        for(var j=0;j<this.tktda[i].da.length;j++){
          console.log(j)
          if(this.tktda[i].da[j].da.length == 0){
            var temp = i+1
            var temp1 = j+1
            tkt.push("第"+temp+"题"+"第"+temp1+"空")
          }
        }
      }
      if (tkt.length > 0) {
        var tktdialog = "<p>有填空题未完成：";
        for (var i = 0; i < tkt.length; i++) {
          if (i != tkt.length - 1) {
            tktdialog += tkt[i] + "，";
          } else {
            tktdialog += tkt[i]+"</p>";
          }
        }
        alldiaolog += tktdialog;
      }
      var pdt = [];
      for (var i = 0; i < this.pdtda.length; i++) {
        if (this.pdtda[i].da.length == 0) {
          var temp = i + 1;
          pdt.push(temp);
        }
      }
      if (pdt.length > 0) {
        var pdtdialog = "<p>有判断题未完成：";
        for (var i = 0; i < pdt.length; i++) {
          if (i != pdt.length - 1) {
            pdtdialog += pdt[i] + "，";
          } else {
            pdtdialog += pdt[i]+"</p>";
          }
        }
        alldiaolog += pdtdialog;
      }
      var jdt = [];
      for (var i = 0; i < this.jdtda.length; i++) {
        if (this.jdtda[i].da.length == 0) {
          var temp = i + 1;
          jdt.push(temp);
        }
      }
      if (jdt.length > 0) {
        var jdtdialog = "<p>有简答题未完成：";
        for (var i = 0; i < jdt.length; i++) {
          if (i != jdt.length - 1) {
            jdtdialog += jdt[i] + "，";
          } else {
            jdtdialog += jdt[i]+"</p>";
          }
        }
        alldiaolog += jdtdialog;
      }
      var zht = []
      for(var i=0;i<this.zhtda.length;i++){
        console.log(i)
        for(var j=0;j<this.zhtda[i].da.length;j++){
          console.log(j)
          if(this.zhtda[i].da[j].da.length == 0){
            var temp = i+1
            var temp1 = j+1
            zht.push("第"+temp+"题"+"第"+temp1+"小题")
          }
        }
      }
      if (zht.length > 0) {
        var zhtdialog = "<p>有综合题未完成：";
        for (var i = 0; i < zht.length; i++) {
          if (i != zht.length - 1) {
            zhtdialog += zht[i] + "，";
          } else {
            zhtdialog += zht[i]+"</p>";
          }
        }
        alldiaolog += zhtdialog;
      }
      if(xzt.length>0|dxt.length>0|tkt.length>0|pdt.length>0|jdt.length>0|zht.length>0){
        this.dialog = alldiaolog
      }else{
        this.dialog = "是否交卷"
      }
      this.submintDialog = true;
    },
    kslogin() {
      this.$http
        .post("/api/kslogin", {
          sjid: this.sjID,
          user: this.user,
          pass: this.pass
        })
        .then(
          function(res) {
            if (res.bodyText == "ture") {
              this.active = 2;
              this.type = 0;
            } else {
              this.$message.error(res.bodyText);
            }
          },
          function(res) {
            this.$message.error(res.bodyText);
          }
        );
    },
    kllogin() {
      if (this.sjkl == this.kl) {
        this.active = 2;
        this.type = 0;
      } else {
        this.$message.error("口令错误");
      }
    },
    tktdatext(index) {
      var temp = index + 1;
      return "请填写第" + temp + "个空格答案";
    },
    addnum(tigan, index,fz) {
      index = index + 1;
      return tigan.slice(0, 3) + index + "：" +"("+fz+"分)"+ tigan.slice(3);
    },
    tktcontent(tkt, index,fz) {
      var tigan = this.addnum(tkt.tigan, index,fz);
      for (var i = 0; i < tkt.da.length; i++) {
        var temp = i + 1;
        var re = "(__" + temp + "__)";
        tigan = tigan.replace("(___)", re);
      }
      return "<div>" + tigan + "</div>";
    },
    dxt_label(index) {
      var label = index + 65;
      return String.fromCharCode(label);
    },
    init() {
      this.sjkl = sessionStorage.getItem("kl");
      this.$http.post("/api/getSjContent?ID=" + this.sjID).then(function(res) {
        this.sj = res.body;
        console.log(this.sj);
        this.sj.xzt.forEach(element => {
          this.xztda.push({
            id: element.id,
            da: "",
            fz:element.fz
          });
        });
        this.sj.dxt.forEach(element => {
          this.dxtda.push({
            id: element.id,
            da: [],
            fz:element.fz
          });
        });
        for (var i = 0; i < this.sj.tkt.length; i++) {
          this.tktda.push({
            id:this.sj.tkt[i].id,
            fz:this.sj.tkt[i].fz,
            da: []
          });
          for (var j = 0; j < this.sj.tkt[i].da.length; j++) {
            this.tktda[i].da.push({
              kg: j,
              da: ""
            });
          }
        }
        this.sj.pdt.forEach(element => {
          this.pdtda.push({
            id: element.id,
            da: "",
            fz:element.fz
          });
        });
        this.sj.jdt.forEach(element => {
          this.jdtda.push({
            id: element.id,
            da: "",
            fz:element.fz
          });
        });
        for (var i = 0; i < this.sj.zht.length; i++) {
          this.zhtda.push({
            id:this.sj.zht[i].id,
            fz:this.sj.zht[i].fz,
            da: []
          });
          for (var j = 0; j < this.sj.zht[i].da.length; j++) {
            this.zhtda[i].da.push({
              tm: j,
              da: ""
            });
          }
        }
        this.allfz = this.sj.allfz
      });
    }
  }
};
</script>

<style>
.logintext {
  margin: 30px;
}
.sjtm {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  padding: 30px;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
