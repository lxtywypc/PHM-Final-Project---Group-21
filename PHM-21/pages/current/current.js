// pages/demo09/demo09.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showlist: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var list = [
      {
        id: 0,
        device_id: 100
      },
      {
        id: 2,
        device_id: 108
      },
      {
        id: 6,
        device_id: 172
      },
      {
        id: 13,
        device_id: 261
      }
    ];
    for (var i = 0; i < list.length; i++) {
      list[i].checked = false;
      list[i].index = i;
    }
    console.log(list);
    this.setData({
      showlist: list
    })
  },

  check(e) {
    console.log(e);
    var index = e.currentTarget.dataset.index;
    console.log(index)
    var changedlist = this.data.showlist;
    changedlist[index].checked = !changedlist[index].checked;
    this.setData(
      {
        showlist: changedlist
      }
    )
    console.log(this.data.showlist)
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