const app = getApp()
Page({
  data: {
    server:app.globalData.server,
    token:'',
    prosList:[],
    proDetail:'',
    globaltype:'',
    ischeck:true,
    chargeInfo:null
  },
  onLoad: function (option) {
    this.setData({
      globaltype:app.globalData.type,
      token:app.globalData.token
    })
    //老师
    if(this.data.globaltype==1){
      this.setData({
        ischeck:false
      })
      var that = this;
      wx.request({
        url: 'http://birdnight.cn:8080/myproject/detail',
        method: 'POST',
        data: {
          id: option.id
        },
        header: {
          'content-type': 'application/json',
          'token':that.data.token
        },
        success: function(res) {
          // console.log(res);
          if (res.statusCode==200){
            that.setData({
              chargeInfo: res.data.msg.detail
            })
          }
        }
      })
    }

  	var id = option.id;	
    this.prosList=app.globalData.prosList;
    for(var i=0;i<this.prosList.length;i++){
    	if(this.prosList[i].id==id){
    		this.setData({
    			proDetail:this.prosList[i]
    		})
    	}
    }
  },
  
})
