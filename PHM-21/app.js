//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.cloud.init()
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  watch: function (method,dname) {
    var obj = this.globalData;
    Object.defineProperty(obj, dname, { //这里的 data 对应 上面 globalData 中的 data
      configurable: true,
      enumerable: true,
      set: function (value) { //动态赋值，传递对象，为 globalData 中对应变量赋值
        this.tdata[dname]=value;
        method(value);
      },
      get: function () { //获取全局变量值，直接返回全部
        return this.globalData;
      }
    })
  },
  globalData: {
    userInfo: null,
    token: "f03c4d16789e42568c4a9f59893ffdc1.0dae9d1fd9dc8998d7ae903094d9fa95",
    user:"",
    nickname:"",
    phmData:{
      pre:[],
      DE_time:[],
      FE_time:[],
      pre_match:[]
    },
    reqList:[],
    len: 0,
    finished: 0,
    percentage:0,
    tdata:{},
    curlist:[],
    canceled:false,
    loggin:false
  },
})
