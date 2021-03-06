//index.js
//获取应用实例
const app = getApp()
const db = wx.cloud.database({ env: "phmproj" });
const _ = db.command;
var datafunc = require("../datafunc/datafunc.js");

Page({
  data: {
    name: "",
    pw: ""
  },

  to_main() {
    var flag = 0;
    var that = this;
    app.globalData.canceled = false;
    db.collection('users').where({ name: this.data.name })
      .get({
        success: function (res) {
          if (res.data.length != 0) {
            if (res.data[0].pw == that.data.pw) {
              app.globalData.user = that.data.name;
              app.globalData.nickname = res.data[0].nickname;
              app.globalData.reqList = res.data[0].devices.sort(datafunc.arrsort);
              flag = 1;
            }
          }
          if (flag == 1) {
            wx.navigateTo({
              url: '../useradd/useradd',
            })
          }
          else {
            wx.playBackgroundAudio({
              dataUrl: 'https://cri-asset.kirafan.cn/Voice_KinMosa_Shinobu/voice_103_0.mp3',
            })
            wx.showToast({
              title: '用户名或密码错误',
              icon: 'none'
            })
          }
        },
      })
  },

  name_input(e) {
    this.setData({
      name: e.detail.value
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
    this.setData({ name: "", pw: "" });
  }
})
