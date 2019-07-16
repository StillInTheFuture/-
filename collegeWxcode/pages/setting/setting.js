var app = getApp();
Page({
    data: {
        server:app.globalData.server,
        token:'',
        inputStatus:true,
        hiddensubmit:true,
        hiddenalter:false,

        sel_coll: false,
        college: '请选择学院',
        collegeNum:null,
        arrCollege:'',

        sel_major: false,
        major: '请选择专业',
        majorNum:null,
        arrMajor:'',

        userInfo:null,
        type:null,
        img:null,

        isStud:true
    
    },
    
    onLoad: function () {
        this.setData({
          token:app.globalData.token
        })
        var that = this;
        
        //页面加载院系专业
        wx.request({
            url: that.data.server+'/college2class', 
            method: "GET",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                var arr = [];
                var oCollege = res.data.college;
                for (let i in oCollege) {
                    arr.push(oCollege[i]); 
                }
                that.setData({
                    arrCollege:arr
                })
            }
        })
        // wx.request({
        //     url: that.data.server+'/myuser', 
        //     method: "POST",
        //     header: {
        //         'content-type': 'application/x-www-form-urlencoded',
        //         'token':that.data.token
        //     },
        //     success: function (res) {
        //         console.log(res);
        //     }
        // })


        wx.request({
            url: that.data.server+'/myuser',
            method: 'POST',
            header: {
                'content-type': 'application/json',
                'token':that.data.token
            },
            success: function(res) {
              // console.log(res)

              if(res.statusCode==200){
                if(res.data.msg.type==2){
                    that.setData({
                        major:res.data.msg.class.title,
                        majorNum:res.data.msg.class.id,
                        isStud:true
                    })
                }else{
                    that.setData({
                        isStud:false
                    })
                }
                that.setData({
                    userInfo:res.data.msg,
                    college:res.data.msg.college.title,
                    collegeNum:res.data.msg.college.id,
                    type:res.data.msg.type,
                    img:res.data.msg.image,
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
    //选择学院
    bindShowColl() {
        var inputStatus = this.data.inputStatus;
        if(inputStatus==false){
            this.setData({
                sel_coll:!this.data.sel_coll,
                major:'请选择专业',
                majorNum:null
            })
        } 
    },
    selColl(e) {
        var name = e.currentTarget.dataset.name;
        var id = e.currentTarget.dataset.id;
        var that = this;
        this.setData({
            college: name,
            collegeNum:id,
            sel_coll: false
        })
        wx.request({
            url: that.data.server+'/college2class', 
            method: "GET",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                var oClass = res.data.class;
                var arr = [];
                for (let i in oClass) {//在对象中遍历
                    var arrLists = oClass[i];
                    for(let j in arrLists){
                        var oList = arrLists[j];
                        var id1 = oList.parent_id;
                        if(id1 == id){
                            arr.push(oList);
                        }
                    }   
                } 
                that.setData({
                    arrMajor:arr
                })
            }
        })
    },
    //选择专业
    bindShowMaj() {
        var inputStatus = this.data.inputStatus;
        if(inputStatus==false){
            this.setData({
                sel_major:!this.data.sel_major
            })
        } 
    },
    selMajor(e) {
        var name = e.currentTarget.dataset.name;
        var id = e.currentTarget.dataset.id;
        this.setData({
            major: name,
            sel_major: false,
            majorNum:id
        })
    },

    // 点击修改
    alterInfor(){
        this.setData({
            inputStatus: false,
            hiddensubmit:false,
            hiddenalter:true
        })
    },

   
    //提交
    submitInfo:function(e){
        if(e.detail.value.username==null||e.detail.value.username==''){
            wx.showToast({
                title: '请输入真实姓名',
                icon: 'none',
                duration: 2000,
            })
            return false
        }
        if(this.data.type==2){
            if(e.detail.value.studId==null||e.detail.value.studId==''){
                wx.showToast({
                    title: '学号不为空',
                    icon: 'none',
                    duration: 2000,
                })
                return false
            }
        }
        if(e.detail.value.number==null||e.detail.value.number==''){
            wx.showToast({
                title: '手机号码不为空',
                icon: 'none',
                duration: 2000,
            })
            return false
        }
        if (!(/^1\d{10}$/.test(e.detail.value.number))) {
           wx.showToast({
                title: '请输入正确的手机号码',
                icon: 'none',
                duration: 2000,
            })
            return false
        }
        if(e.detail.value.email==null||e.detail.value.email==''){
            wx.showToast({
                title: '邮箱不为空',
                icon: 'none',
                duration: 2000,
            })
            return false
        }
        var re = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/; 
        if (!re.test(e.detail.value.email)) {
           wx.showToast({
                title: '请输入正确的邮箱地址',
                icon: 'none',
                duration: 2000,
            })
            return false
        }
       
        var studID = e.detail.value.studId;
        if(this.data.type==1){
            this.data.majorNum=0;
            studID = undefined;
        }
        var _this = this;
        wx.request({
            url: _this.data.server+'/myuser/handle',
            method: 'POST',
            data: {
                img:_this.data.img,
                username:e.detail.value.username,
                college:_this.data.collegeNum,
                email:e.detail.value.email,
                number:e.detail.value.number,
                type:_this.data.type,
                student_id:studID,
                class:_this.data.majorNum
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'token':_this.data.token
            },
            success: function(res) {
                // console.log(res);
                if(res.statusCode==200){
                   var note = res.data.msg;
                    wx.showToast({
                      title: note,
                      icon: 'none',
                      duration: 2000,
                      success: function () {
                        _this.onLoad()
                        _this.setData({
                            inputStatus: true,
                            hiddensubmit:true,
                            hiddenalter:false
                        })
                      }
                    }) 
                  
                }else if(res.statusCode==401){
                    var note = res.data.msg;
                    wx.showToast({
                      title: note,
                      icon: 'none',
                      duration: 2000,
                      success: function () {
                        return 
                      }
                    })
                }
            }
        })
        
    }
    
})
