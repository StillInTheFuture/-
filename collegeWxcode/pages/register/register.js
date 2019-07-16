var app = getApp();
var interval = null //倒计时函数
Page({
    data: {
        server:app.globalData.server,
        sel_coll: false,
        sel_major: false,
        college: '请选择学院',
        collegeNum:null,
        majorNum:null,
        major: '请选择专业',
        arrCollege:'',
        arrMajor:'',
        hiddenStu:false,
        time: '获取验证码', 
        currentTime:60,
        number:'',
        sign:'',
        identity:'',
        sex:''  
    },
    //页面加载院系专业
    onLoad: function () {
        var that = this;
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
    },
    //选择学院
    bindShowColl() {
        this.setData({
            sel_coll:!this.data.sel_coll,
            major:'请选择专业',
            majorNum:null
        })
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
        this.setData({
            sel_major:!this.data.sel_major
        })
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
    //判断身份
    chosedT(){
        this.setData({
            hiddenStu:true,
            identity:1
        })
    },
    chosedS(){
        this.setData({
            hiddenStu:false,
            identity:2
        })
    },
    //获取用户输入的手机号码
    phoneNumber: function (e) {
        this.setData({
          number: e.detail.value
        });
    },
    //获取用户输入性别
    radioSex: function(e) {
        this.setData({
            sex:e.detail.value 
        }) 
    },
    //60秒倒计时
    getCode: function (options){
        var that = this;
        var currentTime = that.data.currentTime;
        interval = setInterval(function () {
            currentTime--;
            that.setData({
                time: currentTime+'秒'
            })
            if (currentTime <= 0) {
                clearInterval(interval);
                that.setData({
                    time: '重新发送',
                    currentTime:60,
                    disabled: false
                })
            }
        }, 1000) 
    },
    //点击获取验证码
    getVerificationCode:function(e){
        var that = this;
        if(that.data.number==null||that.data.number==''){
            wx.showToast({
                title: '手机号码不为空',
                icon: 'none',
                duration: 2000,
            })
            return false
        }
        if (!(/^1\d{10}$/.test(that.data.number))) {
           wx.showToast({
                title: '请输入正确的手机号码',
                icon: 'none',
                duration: 2000,
            })
            return false
        }
        wx.request({
            url: that.data.server+'/login/sms', 
            method: "POST",
            data: {
              number:that.data.number
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                var tips;
                //手机号码验证成功
                if (res.data.code == 201) { 
                    //调用60秒倒计时函数
                    that.getCode();
                    that.setData({
                        disabled:true,
                        sign:res.data.msg.sign
                    }),
                    //获取后台传过来的验证码信息
                    tips = res.data.msg.data;
                    wx.showToast({
                      title: tips,
                      icon: 'none',
                      duration: 2000,
                      success: function () {
                        return
                      }
                    })
                }else{
                    tips = res.data.msg.number;
                    wx.showToast({
                      title: tips,
                      icon: 'none',
                      duration: 2000,
                      success: function () {
                        return
                      }
                    })
                } 
            }
        })
    },
    //点击注册
    registerSubmit: function (e) {
        // console.log(this.data.majorNum);
        var that = this;
        if(that.data.identity==null||that.data.identity==''){
                wx.showToast({
                    title: '请选择身份',
                    icon: 'none',
                    duration: 2000,
                })
            return false
        }
        if(e.detail.value.username==null||e.detail.value.username==''){
                wx.showToast({
                    title: '用户名不为空',
                    icon: 'none',
                    duration: 2000,
                })
            return false
        }
        if(!that.data.hiddenStu){
            if(e.detail.value.student_id==null||e.detail.value.student_id==''){
                wx.showToast({
                    title: '学号不为空',
                    icon: 'none',
                    duration: 2000,
                })
                return false
            }
        }
        if(that.data.sex==null||that.data.sex==''){
                wx.showToast({
                    title: '请选择性别',
                    icon: 'none',
                    duration: 2000,
                })
            return false
        }
        if(that.data.collegeNum==null||that.data.collegeNum==''){
                wx.showToast({
                    title: '请选择院系',
                    icon: 'none',
                    duration: 2000,
                })
            return false
        }
        if(!that.data.hiddenStu){
            if(that.data.majorNum==null||that.data.majorNum==''){
                wx.showToast({
                    title: '请选择专业',
                    icon: 'none',
                    duration: 2000,
                })
                return false
            }
        }
        if(e.detail.value.email==null||e.detail.value.email==''){
                wx.showToast({
                    title: '邮箱不为空',
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
        if(e.detail.value.password2==null||e.detail.value.password2==''){
                wx.showToast({
                    title: '请再次输入密码',
                    icon: 'none',
                    duration: 2000,
                })
            return false
        }
        if(that.data.number==null||that.data.number==''){
                wx.showToast({
                    title: '手机号码不为空',
                    icon: 'none',
                    duration: 2000,
                })
            return false
        }
        if(e.detail.value.smscode==null||e.detail.value.smscode==''){
                wx.showToast({
                    title: '验证码不为空',
                    icon: 'none',
                    duration: 2000,
                })
            return false
        }
        if(e.detail.value.password!=e.detail.value.password2){
            wx.showToast({
                title: '两次密码输入不一致',
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
        if (!(/^1[34578]\d{9}$/.test(that.data.number))) {
           wx.showToast({
                title: '请输入正确的手机号码',
                icon: 'none',
                duration: 2000,
            })
            return false
        }

    
        wx.login({
            success: res => {   
                var getCode = res.code;
                var studID = e.detail.value.student_id;

                if(that.data.identity==1){
                   that.data.majorNum=0;
                   studID = undefined;
                }
                if (getCode) {
                    wx.request({
                        url: that.data.server+'/login/register',
                        method: 'POST',
                        data: {
                            type:that.data.identity,
                            student_id:studID,
                            username:e.detail.value.username,
                            sex:that.data.sex,
                            college:that.data.collegeNum,
                            class:that.data.majorNum,
                            email:e.detail.value.email,
                            password:e.detail.value.password,
                            password2:e.detail.value.password2,
                            number:that.data.number,
                            smscode:e.detail.value.smscode,
                            xcxcode:getCode,
                            sign:that.data.sign
                        },
                        header: {
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        success: function(res) {
                            var oTigs = res.data.msg;
                            var note;
                            if(typeof(oTigs)=='object'){
                                var arr = [];
                                for (let i in oTigs) {
                                  arr.push(oTigs[i]); 
                                }
                                note = arr[0];
                            }else{
                                note = res.data.msg;
                            }
                            //信息有误
                            if(res.data.code == 401){
                                wx.showToast({
                                  title: note,
                                  icon: 'none',
                                  duration: 2000,
                                  success: function () {
                                    return 
                                  }
                                })
                            }else{
                                //注册成功
                                // console.log(res);
                                wx.showToast({
                                  title:'注册成功',
                                  icon: 'none',
                                  duration: 2000,
                                    success: function () {
                                        setTimeout(function () {
                                            wx.redirectTo({
                                                url: './../login/login'
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