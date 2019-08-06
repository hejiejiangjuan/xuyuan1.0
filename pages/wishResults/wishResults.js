var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const app = getApp();
Page({
  data: {
    fileServer: app.globalData.fileServer,
    showModal: false,
    handModal: false,
    isLogin: false,
    navbar: ['达成心愿名单', '活动介绍'],
    currentTab: 0,
    tabs: ["心愿开启结果", "心愿礼单详情"],
    currentData: 0,
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    fileServer: app.globalData.fileServer,//文件服务器地址
    activityId : '',
    detail:'',
    prizeDetail:'',
    joinData:'',
    active: null,
    lastUserId:'',
    wishData:'',
  },
  manaGement() {
    var that = this;
    that.setData({
      isLogin: !this.data.isLogin
    })
  },
// //中奖查看更多
//   winningMore(){
//     wx.navigateTo({
//       url: '../picturesDisplay/viewMore/viewMore?winId=' + this.data.activityId,
//     })
//   },

  viewMore(){
    wx.navigateTo({
      url: '../picturesDisplay/viewMore/viewMore?activityId=' + this.data.activityId,
    })
  },
  initResultPape : function () {
    var that = this;
    wx.request({
      url: app.globalData.base_url + 'wx/wish/activity/getActivityDetailOpenPrizeById',
      data: {
        activityId: that.data.activityId
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
          
            // obj.user_join_activity = user_join_activity;
            //封装content
            var detail_content = obj.detail_content;
            var content = JSON.parse(detail_content);
            //处理换行
            obj.detail_content = app.restoreNewLine(content);
           var arr=obj.user_join_activity.slice(0,5)
            that.setData({
              detail: obj,
              prizeDetail: obj.user_prize,
              joinData: obj.user_join_activity,
              wishData: obj.activity_wish_list
            })
          
            // that.setData({
            //   detail: obj
            // })

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
   // 自定义心愿名单选项卡
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  onLoad: function (e) {
    var that = this;
    const active = wx.getStorageSync('active')
    if (active.dataList == ''){
    }
    that.setData({
      active: active
    }),
     
    
    that.setData({
      activityId: e.activityId
    })
    that.initResultPape()
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  flauntWish(){
    this.setData({
      handModal: true
    })
  },
  // 分享朋友圈
  onShareAppMessage: function (options) {
    return {
      title: "转发给好友",
      imageUrl: "/images/welcome_bac.png",
      path: "pages/wishResults/wishResults?lastUserId=" + app.globalData.userInfo.id + '&id=' + this.data.activityId
    }
  },
  //生成图片
  wishCanvas(){
    let obj = JSON.stringify(this.data.detail);
    wx.navigateTo({
      url: '../canvas/wishCanvas/wishCanvas?activityId=' + obj,
    })
  },
  //参与更多活动
  canyuhuoDong(){
    wx.switchTab({
      url: '/pages/hot/hot'
    })
  },
  //点击看大图
  clikeImg(e){
    var imgsrc =e.target.dataset.src
    wx.previewImage({
      current: imgsrc,
      urls: [imgsrc],
    })
  }
});