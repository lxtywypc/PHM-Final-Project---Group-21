var Charts = require("./../../utils/wxcharts.js");//引入一个绘图的插件
var app = getApp();
const db = wx.cloud.database({ env: "phmproj" });
var datafunc=require("../datafunc/datafunc.js");

Page({
  data: {
    selected:false, //标记下拉复选框菜单是否选中
    state_list:[],  //标记画布是否显隐
    pre:[]          //故障信息列表
  },

  onUnload:function(){
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
  },
  /**
   * @description 页面加载生命周期
   */
  onLoad: function () {
    //每一秒更新一次故障预测结果
    var timer = setInterval(() => {
      if (!app.globalData.loggin) {
        clearInterval(timer);
        console.log("check_page clear")
        wx.reLaunch({
          url: '../index/index',
        })
      }
      var list = app.globalData.curlist;
      var pre=[0,0,0,0,0,0,0,0,0,0,0,0,0,0];
      for (var i = 0; i < list.length; i++){           
        var chart_id = 'lineChart' + list[i].id;
        this.data_update(list[i].DE_time,list[i].FE_time,chart_id);
        pre[list[i].id]=list[i].pre;
      };
      this.setData({pre:pre});
    }, 1000)
    var begin_list = app.globalData.curlist;
    //创建图表
    for(var i = 0; i < begin_list.length; i++){
      var  canvas_id= 'canvas' + begin_list[i].id;
      var chart_id = 'lineChart' + begin_list[i].id;
      this.create_one_chart(begin_list[i].DE_time, begin_list[i].FE_time, chart_id, canvas_id,begin_list[i].device_id)
    }

    var that=this;

    db.collection("devices").get({
      success:function(res){
        console.log(res);
        var devices=res.data[0].devices.sort(datafunc.arrsort);
        var state_list = [];
        for (var i = 0; i < 14; i++) {
          state_list.push({ id: i, exist: false, hide: false, device_id: devices[i].device_id });
          for (var j = 0; j < begin_list.length; j++) {
            if (i == begin_list[j].id) {
              state_list[i].exist = true;
              break
            }
          }
        }

        that.setData({
          state_list: state_list
        })

      }
    })
    
  },
  //图表创建函数
  create_one_chart: function(data_DE, data_FE, chart_id, canvas_id,title){                                        
    var windowWidth = 320;    
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    //创建图表，定义图表的各参数
    this[chart_id] = new Charts({    
    canvasId: canvas_id,
    title:{
      name:title
    },
    dataPointShape: "circle",
    type: 'line',
    animation: false,
    extra: {
      lineStyle: 'curve'
    },
    categories: [-4,-3,-2,-1,0],
    series: [{
      name: 'DE_time',
      data: data_DE, 
      format: function (val) {
        return val.toFixed(2)
      }
    },
    {
      name: 'FE_time',
      data: data_FE, 
      format: function (val) {
        return val.toFixed(2)
      }
    }],
    yAxis: {
      title: 'Value',
      format: function (val) {
        return val.toFixed(2);
      },
      max: 0.6,
      min: -0.6,
    },
    width: windowWidth*0.8,
    height: 160,
    dataLabel: true
    });
  },
  //更新y轴数据
  data_update: function(data_DE, data_FE, chart_id){
    this[chart_id].updateData({
      series: [{
        name: 'DE_time',
        data: data_DE,
        format: (val) => val.toFixed(2)
      },{
        name: 'FE_time',
        data: data_FE,
        format: (val) => val.toFixed(2)
      }]
    })
  },
  //勾选复选框时触发，更新画布显隐信息
  check(e) {
    console.log(e);
    var id = e.currentTarget.dataset.id;
    console.log(id)
    var changedlist = this.data.state_list;
    changedlist[id].hide = !changedlist[id].hide;
    this.setData(
      {
        state_list: changedlist
      }
    )
    console.log(this.data.state_list)
  },
  //点击“点击选择”时触发，打开/关闭下拉复选框菜单
  bindShowMsg(e) {
    this.setData({
      select: !this.data.select
    })
  }

})


