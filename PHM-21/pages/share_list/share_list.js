// pages/share_list/share_list.js
const db = wx.cloud.database({ env: "phmproj" });
const _ = db.command;

Page({

  /**
   * 页面的初始数据
   */
  data: { 
    list:[],
    l:[]
  },

  selected(e){
    console.log(e);
    console.log(e.detail.value);
    const l=e.detail.value;
    this.setData({
      l:l
    })
    this.setData({
      'list[1].value':!e.detail.value[1]
    });
    let see = this.data.list[1].value;
    console.log(see)
  },

  msg(){
    wx.showToast({
      title: '分享成功',
      icon: 'none',
      duration: 2000
    });
    setTimeout(
      function(){
        console.log("开始跳转");
        wx.navigateBack({
          delta:1
        })
      }
      ,1000)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    db.collection('users').get({
      success:function(res){
        var len=res.data.length;
        for(var i=0;i<len;i++)
        {
          that.setData({list:that.data.list.concat([{id:i,name:res.data[i].nickname,value:false}])});
        }
      }
    })
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