// pages/useradd/useradd.js
const db = wx.cloud.database({ env: "phmproj" });
const _ = db.command;
var datafunc=require("../datafunc/datafunc.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pw: "",
    _pw: "",
    name: "",
    nickname: "",
    devices:[],
    devices_ori:[]
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

  submit:function()
  {
    var flag=((this.data.name!="")&&(this.data.pw!="")&&(this.data._pw!="")&&(this.data.nickname!=""));
    if(!flag)
    {
      wx.showToast({
        title: '请完整填写所有信息',
        icon:'none'
      })
      return;
    }
    flag=(this.data.pw==this.data._pw);
    if(!flag)
    {
      wx.showToast({
        title: '两次输入的密码不一致',
        icon: 'none'
      })
      return;
    }
    var that=this;
    db.collection('users').get({
      success:function(res){
        var len=res.data.length;
        for(var i=0;i<len;i++)
        {
          if(that.data.name==res.data[i].name)
          {
            return wx.showToast({
              title: '用户名已存在',
              icon:'none'
            })
          }
        }
        var _devices=[];
        var devices=that.data.devices;
        for(var i=0;i<devices.length;i++)
        {
          if(devices[i].checked==true)
          {
            _devices.push({device_id:devices[i].device_id,id:devices[i].id})
          }
        }
        db.collection('users').add({
          data:{
            name:that.data.name,
            nickname:that.data.nickname,
            pw:that.data.pw,
            devices:_devices
          },
          success:function(){
            wx.showToast({
              title: '注册成功',
            })
            setTimeout(function(){
              wx.navigateBack({
                delta:2
              })
            },1500)
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    db.collection('devices').get({
      success:function(res){
        var devices=res.data[0].devices.sort(datafunc.arrsort);
        for(var i=0;i<devices.length;i++)
        {
          devices[i].checked=false;
        }
        that.setData({devices:devices,devices_ori:devices})
      }
    })
  },

  check:function(res){
    var devices=this.data.devices;
    devices[res.currentTarget.id].checked = !devices[res.currentTarget.id].checked;
    this.setData({devices:devices});
  },

  turncheck:function(res){
    var devices=this.data.devices;
    for(var i=0;i<devices.length;i++)
    {
      devices[i].checked=!devices[i].checked;
    }
    this.setData({devices:devices});
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
    this.setData({
      name:"",
      nickname:"",
      pw:"",
      _pw:"",
      devices:this.data.devices_ori
    })
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