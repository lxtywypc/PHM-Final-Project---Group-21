function reqFunc(url,data,callback){
   wx.request({
    url: url,
    method: "POST",
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data:data,
    success(res){
      callback(res);
    }
    })
}
module.exports = {
  reqFunc: reqFunc
}
