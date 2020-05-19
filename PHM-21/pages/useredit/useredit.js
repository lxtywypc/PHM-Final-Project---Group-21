// pages/useradd/useradd.js
const db = wx.cloud.database({env:"phmproj"});
const _ = db.command;
var datafunc = require("../datafunc/datafunc.js");
var app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pw: "",
    _pw: "",
    nickname: "",
    devices: [],
  },

  name_input(e) {
    this.setData({
      name: e.detail.value
    })
  },

  nickname_input(e) {
    this.setData({
      nickname: e.detail.value
    })
  },

  password_input(e) {
    this.setData({
      pw: e.detail.value
    })
  },

  _password_input(e) {
    this.setData({
      _pw: e.detail.value
    })
  },

  submit: function () {
    var flag = ((this.data.pw != "") && (this.data._pw != "") && (this.data.nickname != ""));
    if (!flag) {
      wx.showToast({
        title: '请完整填写所有信息',
        icon: 'none'
      })
      return;
    }
    flag = (this.data.pw == this.data._pw);
    if (!flag) {
      wx.showToast({
        title: '两次输入的密码不一致',
        icon: 'none'
      })
      return;
    }
    var that = this;
    var _devices = [];
    var devices = that.data.devices;
    for (var i = 0; i < devices.length; i++) {
      if (devices[i].checked == true) {
        _devices.push({ device_id: devices[i].device_id, id: devices[i].id })
      }
    }
    db.collection('users').where({name:app.globalData.user})
    .update({
      data: {
        nickname: that.data.nickname,
        pw: that.data.pw,
        devices: _devices
      },
      success: function () {
        wx.showToast({
          title: '更新成功，重启后生效',
        })
        setTimeout(function(){
          wx.reLaunch({
            url: '/pages/index/index',
          })
        },1500);
        
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    db.collection('devices').get({
      success: function (res) {
        var devices = res.data[0].devices.sort(datafunc.arrsort);
        for (var i = 0; i < devices.length; i++) {
          devices[i].checked = false;
        }
        db.collection('users').where({name:app.globalData.user})
        .get({
          success:function(res){
            var list=res.data[0].devices.sort(datafunc.arrsort)
            for(var i=0;i<list.length;i++)
            {
              devices[list[i].id].checked=true;
            }
            that.setData({
              nickname:res.data[0].nickname,
              pw:res.data[0].pw,
              _pw:res.data[0].pw,
              devices:devices
            })
            console.log("success")
          }
        })
      }
    })
  },

  delaccount:function(){
    wx.showModal({
      title: '删除账户',
      content: '此操作将不可逆地删除您的账户数据，是否继续',
      success:function(res){
        if(res.confirm){
          db.collection('users').where({name:app.globalData.user}).remove({
            success:function(info){
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
              console.log(info)
              console.log("delete success")
              wx.showToast({
                title: '删除成功',
              })
              setTimeout(function(){
                wx.reLaunch({
                  url: '../index/index',
                })
              },1500)
            },
            fail:function(err){
              console.log(err)
            }
          })
        }
      }
    })
  },

  check: function (res) {
    var devices = this.data.devices;
    devices[res.currentTarget.id].checked = !devices[res.currentTarget.id].checked;
    this.setData({ devices: devices });
  },

  turncheck: function (res) {
    var devices = this.data.devices;
    for (var i = 0; i < devices.length; i++) {
      devices[i].checked = !devices[i].checked;
    }
    this.setData({ devices: devices });
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

  }
})