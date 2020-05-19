//index.js
//获取应用实例
const app = getApp()
const db = wx.cloud.database({ env: "phmproj" });
const _ = db.command;
var datafunc = require("../datafunc/datafunc.js");

Page({
  data: {
    pw: ""
  },

  to_main() {
    var flag = 0;
    var that = this;
    app.globalData.canceled = false;
    db.collection('users').where({ name: app.globalData.user })
      .get({
        success: function (res) {
          if (res.data[0].pw == that.data.pw) {
            wx.navigateTo({
              url: '../useredit/useredit',
            })
          }
          else {
            wx.playBackgroundAudio({
              dataUrl: 'https://cri-asset.kirafan.cn/Voice_KinMosa_Shinobu/voice_103_0.mp3',
            })
            wx.showToast({
              title: '密码错误',
              icon: 'none'
            })
          }
        },
      })
  },

  password_input(e) {
    this.setData({
      pw: e.detail.value
    })
  },

  //事件处理函数

  onLoad: function () {

  },
  onShow: function () {
    this.setData({ pw: "" });
  }
})
