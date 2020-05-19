// pages/others/others.js
var app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    console.log("others unload");
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

  gotoPage:function(res){
    wx.navigateTo({
      url: "../"+res.currentTarget.id+"/"+res.currentTarget.id,
    })
  },

  logout:function(res){
    wx.showModal({
      title: '登出',
      content: '确定要退出登录吗',
      success:function(res){
        if(res.confirm)
        {
          app.globalData.loggin = false;
          wx.playBackgroundAudio({
            dataUrl: 'https://cri-asset.kirafan.cn/Voice_Kirara_Kirara/voice_313_0.mp3',
          })
          wx.reLaunch({
            url: '/pages/index/index',
          })
        }
      }
    })
  }
})