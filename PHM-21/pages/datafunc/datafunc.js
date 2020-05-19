var util = require('../../utils/util.js');
var app = getApp();
var apiurl = ["https://api.phmlearn.com/component/data/zhoucheng",
"https://api.phmlearn.com/component/upload/1/68",
"https://api.phmlearn.com/component/upload/2/157",
"https://api.phmlearn.com/component/upload/ML/model/57/115"];

//检测是否中断数据请求
function detectLog(){
  if (app.globalData.canceled == true) {
    console.log("canceled")
    app.globalData.user = "";
    app.globalData.nickname = "";
    app.globalData.phmData = {
      pre: [],
      DE_time: [],
      FE_time: [],
      pre_match: []
    };
    app.globalData.curlist = [];
    app.globalData.tdata = {};
    app.globalData.loggin = false;
    return true;
  }
  return false;
}

//检测数据接收完成率
function checkcomp(){
  if(detectLog())
  {
    return;
  }
  if (app.globalData.tdata.percentage === 100) {
    app.globalData.phmData.pre = app.globalData.phmData.pre.sort(arrsort);
    app.globalData.phmData.DE_time = app.globalData.phmData.DE_time.sort(arrsort);
    app.globalData.phmData.FE_time = app.globalData.phmData.FE_time.sort(arrsort);      //将获得的数据按机组id排序
    var devices = app.globalData.reqList;
    for(var i=0;i<devices.length;i++)
    {
      app.globalData.phmData.pre_match.push({
        id:devices[i].id,
        data:[]
      })
      for(var j=0;j<10+2*(devices[i].id===13);j++)      //将机组对应数个文件的预测值拼接成一组完整数据
      {
        app.globalData.phmData.pre_match[i].data=
          app.globalData.phmData.pre_match[i].data.concat(
          app.globalData.phmData.pre[i*10+j].error?[0,0]:
            app.globalData.phmData.pre[i*10+j].data);
      }
    }
    wx.switchTab({
      url: '/pages/main_page/main_page'
    })
  }
}

function addError(data,dname,cur){
  if (detectLog()) {
    return;
  }
  data.error=true;
  app.globalData.phmData[dname].push(data);
  if (cur>1){
  app.globalData.finished = app.globalData.finished + 4-cur;
  }
  app.globalData.percentage =
    Math.floor(app.globalData.finished / app.globalData.len*100);
  checkcomp();
}

function addRes(res,data,dname,cur){
  if (detectLog()) {
    return;
  }
  if (cur > 1) {
    app.globalData.finished = app.globalData.finished + 4 - cur;
    data.data=res.data.data.predict;
  }
  else{
    data.data=res.data.data;
  }
  app.globalData.phmData[dname].push(data);
  app.globalData.percentage = 
    Math.floor(app.globalData.finished / app.globalData.len*100);
  checkcomp();
}

function toNext(cur,filepath,data,attri) {
  if (detectLog()) {
    return;
  }
  util.reqFunc(apiurl[cur],
  cur==0?{
      access_token:app.globalData.token,
      divice_id: filepath,
      atrribute:attri
    } : {
          access_token: app.globalData.token,
          file_name: filepath,
        } ,function(res){
    if (detectLog()) {
      return;
    }
    app.globalData.finished = app.globalData.finished + 1;
    console.log(app.globalData.finished)
    app.globalData.percentage = 
      Math.floor(app.globalData.finished / app.globalData.len*100);     //计算已获取得文件数 更新百分比
    cur = ++cur;
    var flag=((cur==4)||(cur==1));
    var dname=(cur==1?attri:'pre');
    res.statusCode === 200 ?
      (res.data.success ?
        (flag?
          addRes(res,data,dname,cur):
          toNext(cur,res.data.data.file_name,data)) :
        addError(data,dname,cur)) :
      addError(data,dname,cur);
  })
};

function initData(devices)
{
  if (detectLog()) {
    return;
  }
  toNext(0,devices.device_id,{
    id:devices.id,
    data:[],
    error:false
  },"DE_time");
  toNext(0, devices.device_id, {
    id: devices.id,
    data: [],
    error: false
  }, "FE_time");
  for(var i=1;i<=10+2*(devices.id==13);i++)     //id=13时文件数为12 其余为10
  {
    var _id = devices.id * 10 + i;
    toNext(1, "TEST" + _id + ".csv",{
      id: _id,
      data: [],
      error: false
    });
  }
}

function arrsort(a,b)
{
  return a.id-b.id;
}

module.exports = {
  initData: initData,
  arrsort:arrsort
}

