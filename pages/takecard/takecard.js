// pages/takecard/takecard.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileServer: app.globalData.fileServer,
    showModal: false,
    isLogin: false,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    visible: false,

    tempFilePaths: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showModalStatus: false,
    joinId : '',
    activityObj : '',
    fileServer: app.globalData.fileServer,//文件服务器地址,
  },
  manaGement() {
    var that = this;
    that.setData({
      isLogin: !this.data.isLogin
    })
  },
  moreActivity : function () {
    wx.switchTab({
      url: '../hot/hot'
    })
  },
  initPageData : function () {
    var that = this;
    wx.request({
      url: app.globalData.base_url + 'wx/wish/activity/getActivityAndWishByJoin',
      method: 'POST',
      header: app.globalData.header,
      data : {
        joinId : that.data.joinId
      },
      success (res) {
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
            that.setData({
              activityObj: obj
            })

          } else {
            wx.showToast({
              title: '该活动被下架或删除，将为您跳转至首页',
              icon: 'none',
              duration: 2000
            })
            wx.switchTab({
              url: '../index/index'
            })
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
  //事件处理函数
  show: function () {
    this.setData({ visible: true })
  },
  close: function () {
    this.setData({ visible: false })
  },
  //保存图片
  picturesDisplay(){
    let obj = JSON.stringify(this.data.activityObj);
    wx.navigateTo({
      url: '../canvas/canvasPhone/canvasPhone?id=' + obj
    })
  },
  // 分享朋友圈
  onShareAppMessage: function (options) {
    return {
      title: "转发给好友",
      imageUrl: "/images/welcome_bac.png",
      path: "/pages/welcome/welcome"
    }
  },
  onLoad: function (options) {
    var that = this;
    this.setData({
      joinId: options.joinId
    });
    app.userInfoReadyCallback = res => {//app.js的回调
      var userInfoStr = res.rawData;
      wx.request({
        url: app.globalData.base_url + 'wxUser/dologin',
        method: 'POST',
        data: {
          userInfo: encodeURI(res.rawData),
          openId: app.globalData.openId
        },
        header: app.globalData.header,
        success(res) {
          app.globalData.userInfo = res.data.datas.wxUser;
          wx.setStorageSync('userInfoStr', userInfoStr);
          wx.setStorageSync('openId', app.globalData.openId);
          wx.setStorageSync('isLogin', true);
          that.data.curPage = 1;
          that.initPageData();
        }
      })
    }
    if (!that.data.showModal) {
      that.data.curPage = 1;
      that.initPageData();
    }
    this.animateTrans = wx.createAnimation({
      duration: 600,
      timingFunction: 'ease',
    })

    this.animateFade = wx.createAnimation({
      duration: 600,
      timingFunction: 'ease',
    })
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
  // 分享链接按钮
  thecardLink(){
    console.log(666)
  },
  /**
     * 生命周期函数--监听页面初次渲染完成
     */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示 
   */
  onShow: function () {

  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
