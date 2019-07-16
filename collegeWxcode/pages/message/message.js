const app = getApp()
Page({
  data: {
    server:app.globalData.server,
    token:'',
    message:[],
    isMessage:true
  },
  onLoad: function () {

  	this.setData({
      token:app.globalData.token
    })


    var that = this;
    wx.request({
        url: that.data.server+'/mymessage',
        method: 'POST',
        header: {
            'content-type': 'application/json',
            'token':that.data.token
        },
        success: function(res) {
        	if(res.statusCode==200){
            if(res.data.msg.length>0){
              that.setData({
                isMessage:true
              })
            }else{
              that.setData({
                isMessage:false
              })
            }
            
            that.setData({
              message:res.data.msg
            })
            // console.log(res.data.msg)
        	}else{
        		wx.showToast({
			        title: '登录过期,请重新登录',
			        icon: 'none',
			        duration: 2000,
			        success: function () {
                setTimeout(function () {
                  wx.navigateTo({
                    url: '../login/login',
                  })
                }, 2000)
	            }
            })
        	}
        }
    })

  },
  
})
