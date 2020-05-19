//index.js
//获取应用实例
const app = getApp()
var datafunc=require("../datafunc/datafunc.js")
const db = wx.cloud.database({ env: "phmproj" });
const _ = db.command;

Page({
  data: {
    _app:app,
    percent:0,
  },
  //事件处理函数

  getOrigin: function(){
        var devices=app.globalData.reqList;
        var len = devices.length;
        app.globalData.len = (devices.some(item=>{
          if(item.id===13)
          {
            return true;
          }
        })?(len*10+2)*3+len*2:(len*10)*3+len*2);
        app.globalData.percentage=0;
        app.globalData.finished=0;
        app.globalData.canceled=false;
        for (var i = 0; i < len; i++) {
          if(app.globalData.canceled==true)
          {
            return;
          }
          datafunc.initData(devices[i])
        }    
  },

  kureavoice:function(){
    wx.playBackgroundAudio({
      dataUrl: 'https://cri-asset.kirafan.cn/Voice_Kirara_Claire/voice_006_1.mp3',
    });
  },

  onLoad: function () {
    app.watch(this.percentage_wb,'percentage');
    wx.playBackgroundAudio({
      dataUrl: 'https://cri-asset.kirafan.cn/Voice_Kirara_Claire/voice_006_1.mp3',
    });
    this.getOrigin();
  },
  percentage_wb: function (value) { //这里的value 就是 app.js 中 watch 方法中的 set, 返回整个 globalData
    this.setData({
      percent: value,
    });
  },
  
  onUnload:function(){
    app.globalData.canceled = true;
  }
})
