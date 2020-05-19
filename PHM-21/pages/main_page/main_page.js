// pages/main_page/main_page.js
var app=getApp();
var times=-1;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname:"",
    curlist:[], //记录当前时间窗下的工况数据
    errpos:{
      0:"Normal", //预测结果对应关系
      1:"Ball",
      2:"Outer Race",
      3:"Inner Race"
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.loggin=true;
    times=-1;
    console.log(app.globalData)
    //播放音频
    wx.playBackgroundAudio({
      dataUrl: 'https://cri-asset.kirafan.cn/Voice_Kirara_Kirara/voice_017_0.mp3',
    })
    this.setData({nickname:app.globalData.nickname});
    //每一秒用时间窗截取一组故障预测结果与工况数据
    var timer = setInterval(function () {
      if (!app.globalData.loggin) {
        clearInterval(timer);
        wx.reLaunch({
          url: '../index/index',
        })
      }
      times = times + 1; //记录当前时间窗移动位置
      var prelist=[];
      var devices = app.globalData.reqList; //载入用户管理机组数据     
      for (var i = 0; i < devices.length; i++) {
        if (times == 0) {
          app.globalData.curlist.push({
            device_id: devices[i].device_id,
            id: devices[i].id,
            DE_time: [0, 0, 0, 0, 0],
            FE_time: [0, 0, 0, 0, 0],
            pre: 0,
          });
        }
        //curlist赋值
        app.globalData.curlist[i].DE_time.push(
          app.globalData.phmData.DE_time[i].error ? 0 :
            app.globalData.phmData.DE_time[i].data.data[(875 + times * 1750) % (3500 * (10 + 2 * (devices[i].id == 13)))] //(devices[i].id == 13):由于14号机组有12个文件，这个语句保证了所有机组的所有文件均可遍历
        );
        app.globalData.curlist[i].FE_time.push(
          app.globalData.phmData.FE_time[i].error ? 0 :
            app.globalData.phmData.FE_time[i].data.data[(875 + times * 1750) % (3500 * (10 + 2 * (devices[i].id == 13)))]
        );
        //故障预测结果赋值
        var pre = app.globalData.phmData.pre_match[i].data[times % (2 * (10 + 2 * (devices[i].id == 13)))];
        app.globalData.curlist[i].pre = pre;
        if(pre!=0)
        {
          prelist.push({device_id:devices[i].device_id,pre:pre});
        }
        app.globalData.curlist[i].DE_time.shift();
        app.globalData.curlist[i].FE_time.shift();
      }
      this.setData({
        curlist: prelist
      })
    }.bind(this),1000)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("main_page unload");
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  show:function(){
  },
})