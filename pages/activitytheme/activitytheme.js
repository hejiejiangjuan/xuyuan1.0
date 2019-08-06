var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var src = wx.getStorageSync('isLogin');
const app = getApp();
Page({
  data: {
    myquery:{},
    fileServer: app.globalData.fileServer,
    showModal: false,
    isLogin: false,
    tabs: ["活动介绍", "心愿礼单介绍"],
    activeIndex: 0,
    sliderOffset: 0,
    showModal: false,
    sliderLeft: 0,
    activityId : '',
    fileServer: app.globalData.fileServer,//文件服务器地址
    detail : '',
    lastUserId:'',//分享人的ID
    tempFilePaths: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showModalStatus: false,
    visible: false,
    active:'',
    showCommand : false,
    publicCommand:'',
    showLotterBtn:true,//判断开奖按钮的显示隐藏
    user: app.globalData.userInfo,
    useramin:10,
    getUserId:""
  },
  manaGement() {
    var that = this;
    that.setData({
      isLogin: !this.data.isLogin
    })
    that.initOnLoad(that.data.myquery)
  },
  //跳转嵌套页面
  embedded(){
    var that=this
    wx.navigateTo({
      url: '../embeddedCanvas/embeddedCanvas?id=' + that.data.activityId,
    })
  },
  //参加活动
  joinActivity () {
    const activity = this.data.detail;
    const onlyFans = this.data.detail.onlyFans;
    // this.setData({
    //   current_data: activity
    // })
    if('1' != activity.status){
      wx.showToast({
        title: '活动已过期',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.setStorage({
      key: 'hot_activity_detail',
      data: activity,
    })
    if (onlyFans == 1) {
      //判断是否已输入过口令
      const has_command = wx.getStorageSync('has_command_' + activity.id)
      if (has_command) {
        wx.navigateTo({
          url: '../joinActivity/joinActivity?id=' + activity.id
        })
      } else {
        //输入口令
        this.setData({
          showCommand: !this.data.showCommand
        })
      }
    } else {
      //跳转到参加活动页
      wx.navigateTo({
        url: '../joinActivity/joinActivity?id=' + activity.id
      })
    }

  },
  //跳转到已参加
  goActivity(){
    wx.navigateTo({
      url: '../me-activities/me-activities',
    })
  },
  //解锁抽奖
  unlockPrize: function () {
    const activity = this.data.detail;
    if (activity.publicCommand == this.data.publicCommand) {
      //加入缓存
      wx.setStorageSync('has_command_' + activity.id, true);
      wx.navigateTo({
        url: '../joinActivity/joinActivity?id=' + activity.id
      })
    } else {
      wx.showToast({
        title: '口令不正确',
        icon: 'none',
        duration: 2000
      })
    }
  },
  copyBtn: function (e) {
    var that = this;
    wx.setClipboardData({
      //准备复制的数据
      data: that.data.detail.publicName,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    });
  },
  publicCommandInput: function (e) {
    this.setData({
      publicCommand: e.detail.value
    })
  },
  /**
    * 弹窗
    */
  showDialogBtn: function () {
    
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {

  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },

  // onReady: function () {
  //   if (src) {
  //     this.hideModal();
  //   }
  // },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    if (src == 'true') {
      this.hideModal();
    } else if (src == ''){
      this.setData({
        showModal: true
      })
    }
  },
  jumpToLogsPage: function (data) {
    this.hideModal();
  },

  initActivityPage: function () {
  //页面初始化
    var that = this;
    wx.request({
      url: app.globalData.base_url + 'wx/wish/activity/getActivityDetailById',
      data: {
        activityId: that.data.activityId,
        lastUserId: that.data.lastUserId
      },
      header: app.globalData.header,
      method: 'POST',
      success(res) {
        const data = res.data;
        if (data.code == 200) {
          var obj = data.datas;
          if (obj.id != null && obj.id != undefined) {
            var user_join_activity = obj.user_join_activity;
            for (var i = 0; i < user_join_activity.length; i++) {
              var oneObj = user_join_activity[i];
              if (oneObj.imgAddr.startsWith('upload')) {
                oneObj.imgAddr = that.data.fileServer + oneObj.imgAddr;
              }
            }
            obj.user_join_activity = user_join_activity;
            //封装content
            var detail_content = obj.detail_content;
            var content = JSON.parse(detail_content);
            //处理换行
            obj.detail_content = app.restoreNewLine(content);
            that.setData({
              detail: obj
            })
            that.setData({
              useramin: app.globalData.userInfo.id,
            })
          } else {
            wx.showToast({
              title: '该活动被下架或删除',
              icon: 'none',
              duration: 2000
            })
            setTimeout(function(){
              //返回上一页面
              wx.navigateBack({
                delta: 1
              })
            },2000);
            
          }
        } else {
          wx.showToast({
            title: '系统错误，请稍后重试',
            icon: 'none',
            duration: 2000
          })

        }
      }
    })
  },
  //点击开奖
  openLotter(){
    var that=this
    wx:wx.showModal({
      title: '提示',
      content: '是否需要开奖',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '',
      confirmText: '确认',
      confirmColor: '',
      success: function(res) {
        if (res.confirm=true){
          wx: wx.request({
            url: app.globalData.base_url + 'wx/wish/activity/handOpenPrize',
            data: { activityId: that.data.detail.id },
            header: app.globalData.header,
            method: 'get',
            success: function (res) {
              if (res.statusCode == 200) {
                that.initActivityPage()
              }else{
                wx:wx.showToast({
                  title: '开奖失败',
                  icon: 'none',
                  image: '',
                  duration:2000,
                  success: function(res) {},
                  fail: function(res) {},
                  complete: function(res) {},
                })
              }
            },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  onLoad: function (query) {
   
    var that = this;
    that.setData({
      myquery: query
    })
    if (!app.globalData.header){//未登陆
      app.myLogin().then(function (res) {
        if(!('unauth'==res)){
          that.initOnLoad(query)
        }
      })
    }else{
      that.initOnLoad(query)
      //获取登录时的userid
      that.setData({
        getUserId: app.globalData.userInfo.id
      })
    }
  },
  initOnLoad(query){//onload初始化
    var that = this;
    var user = app.globalData.userInfo;
    that.setData({
      user: user
    })
    //分享用户的useriD;
    const lastUserId = query.lastUserId;
    if (lastUserId != null && lastUserId != 'undefined') {
      that.setData({
        lastUserId: lastUserId
      })
    }
    //从二维码进入
    const scene = decodeURIComponent(query.scene)
    var id = '';
    if (scene != null && scene != 'undefined') {
      id = scene;
    }
    //从小程序进入
    const activityId = query.id;
    if (activityId != null && activityId != 'undefined') {
      id = activityId;
    }
    that.setData({
      activityId: id
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });

    //分享
    this.setData({
      joinId: id
    });
    this.animateTrans = wx.createAnimation({
      duration: 600,
      timingFunction: 'ease',
    })

    this.animateFade = wx.createAnimation({
      duration: 600,
      timingFunction: 'ease',
    })
    that.initActivityPage();
    // app.userInfoReadyCallback = res => {//app.js的回调
    //   var userInfoStr = res.rawData;
    //   wx.request({
    //     url: app.globalData.base_url + 'wxUser/dologin',
    //     method: 'POST',
    //     data: {
    //       userInfo: encodeURI(res.rawData),
    //       openId: app.globalData.openId
    //     },
    //     header: app.globalData.header,
    //     success(res) {
    //       app.globalData.userInfo = res.data.datas.wxUser;
    //       wx.setStorageSync('userInfoStr', userInfoStr);
    //       wx.setStorageSync('openId', app.globalData.openId);
    //       wx.setStorageSync('isLogin', true); 
    //       that.data.curPage = 1;
    //       that.initActivityPage();
    //     }
    //   })
    // }
    // if (!that.data.showModal) {
      
    // }
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  //分享图片
  activeCanvas: function (e) {
    let obj = JSON.stringify(this.data.detail);
    wx.navigateTo({
      url: '../canvas/themeCanvas/themeCanvas?activityId=' + obj
    })
  },
  // 分享朋友圈
  onShareAppMessage: function (options) {
    return {
      title: "转发给好友",
      imageUrl: "/images/welcome_bac.png",
      path: "/pages/activitytheme/activitytheme?lastUserId=" + app.globalData.userInfo.id+'&id='+this.data.activityId
    }
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //分享朋友模态框
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200,  //动画时长
      timingFunction: "linear", //线性
      delay: 0  //0则不延迟
    });

    // 第2步：这个动画实例赋给当前的动画实例
    this.animation = animation;

    // 第3步：执行第一组动画：Y轴偏移240px后(盒子高度是240px)，停
    animation.translateY(240).step();

    // 第4步：导出动画对象赋给数据对象储存
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画
    setTimeout(function () {
      // 执行第二组动画：Y轴不偏移，停
      animation.translateY(0).step()
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      this.setData({
        animationData: animation
      })

      //关闭抽屉
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示抽屉
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  },

  // 点击生成链接
  theLink(){
    var that = this;
    wx.request({
      url: app.globalData.base_url + 'wx/wish/activity/createMsgLink',
      method: 'POST',
      data: {
        activityId: that.data.activityId
      },
      header: app.globalData.header,
      success(res) {
        var data  = res.data;
        if (data.code != 200) {
          wx.showToast({
            title: '系统错误，请稍后重试',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  //查看更多
  viewMore(){
    wx.navigateTo({
      url: '../picturesDisplay/viewMore/viewMore?activityId=' + this.data.activityId,
    })
  },
   //点击图片放大图片
  clickImg: function (e) {
    var imgSrc = e.target.dataset.src
    wx.previewImage({
      current: imgSrc,
      urls: [imgSrc],
    })
  },
  activCliekImg(e){
  let imgUrl=e.target.dataset.src
  wx.previewImage({
    current:imgUrl,
    urls: [imgUrl],
  })
  }
});