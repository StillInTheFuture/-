//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo:'',
  },
  
  onLoad: function () {
    this.setData({
      userInfo:app.globalData.userData.info
    })
    // console.log(this.data.userInfo)
  },
  
  goMyProject:function(){
    wx.navigateTo({
      url: '/pages/project/project'
    })
  }
})
