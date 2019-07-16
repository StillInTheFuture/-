const app = getApp()
Page({

  data: {
    server:app.globalData.server,
    globaltype:'',
    token:'',
    product:true,
    thisYearPro:[],
    pastYearsPro:[]
  },

  onLoad: function () {

  	this.setData({
      token:app.globalData.token,
      globaltype:app.globalData.type,
    })

    var currUrl;
    if(this.data.globaltype==2){ 
      //学生
      currUrl = '/myproject';
    }else{
      currUrl = '/myproject/teacher';
    }


    var that = this;
    wx.request({
        url: that.data.server+currUrl,
        method: 'POST',
        header: {
            'content-type': 'application/json',
            'token':that.data.token
        },
        success: function(res) {
          console.log(res.data.msg)
          if(res.statusCode==200){
            var pros = res.data.msg;
            app.globalData.prosList = pros;
            if(pros.length>0){
              that.setData({
                product:true
              })
            }else{
              that.setData({
                product:false
              })
            }

            var thisYear = [];
            var pastYears = [];
            //获取当前年份
            var timestamp = Date.parse(new Date());
            var date = new Date(timestamp);
            var year =date.getFullYear();

            for(var i=0;i<pros.length;i++){
              if(pros[i].year==year){
                thisYear.push(pros[i])
              }else{
                pastYears.push(pros[i])
              }
            }

            that.setData({
              thisYearPro:thisYear,
              pastYearsPro:pastYears
            })
                
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
