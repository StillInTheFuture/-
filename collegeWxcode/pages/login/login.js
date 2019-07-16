var app = getApp();
Page({
  data: {
    server:app.globalData.server
  },
  formSubmit: function (e) {
    var that = this;
    if(e.detail.value.username==null||e.detail.value.username==''){
      wx.showToast({
        title: '用户名不为空',
        icon: 'none',
        duration: 2000,
      })
      return false
    }
   if(e.detail.value.password==null||e.detail.value.password==''){
     wx.showToast({
        title: '密码不为空',
        icon: 'none',
        duration: 2000,
      })
      return false
   }

    wx.login({
      success: res => {
        if (res.code) {
          wx.request({
            url: that.data.server+'/login',
            method: 'POST',
            data: {
              username: e.detail.value.username,
              password: e.detail.value.password,
              xcxcode: res.code
            },
            header: {
              'content-type': 'application/json'
            },
            success: function(res) {
              console.log(res);
              var error_title = res.data.msg;
              //访问正常
              if (res.statusCode == 200) { 
                wx.showToast({
                  title: "登陆成功",
                  icon: 'success',
                  duration: 2000,
                  success: function () {
                    app.globalData.userData = res.data.msg;
                    app.globalData.token = res.data.msg.token;
                    app.globalData.type = res.data.msg.type;
                    setTimeout(function () {
                      wx.switchTab({
                        url: '../index/index',
                      })
                    }, 2000)
                  }
                })
              }else{
                var title_content;
                if(typeof(error_title) == 'string'){
                  title_content = error_title;
                }else{
                  title_content = error_title.username;
                }
                wx.showToast({
                  title: title_content,
                  icon: 'none',
                  duration: 2000,
                  success: function () {
                    setTimeout(function () {
                      wx.switchTab({
                        url: '../login/login',
                      })
                    }, 2000)
                  }
                })
              }
            }
          })
        }else{
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  }
})