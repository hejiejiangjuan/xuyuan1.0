// pages/picturesDisplay/viewMore/viewMore.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList:[],
    currentPage : 1 ,
    activityId : '',
    fileServer: app.globalData.fileServer,//文件服务器地址
    hidden : false,
    prizeList:[]
  },
  seeMore(){
    this.getInitData();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
  //  this.setData({
  //    activityId: options.activityId
  //  })
   if(options.winId){
     this.getWinData(options.winId)
   }else if(options.activityId){
     this.getInitData(options.activityId)
   }
  },
  //参与的人数
  getInitData(activityId) {
    const that = this;
    wx.request({
      url: app.globalData.base_url + 'wx/wish/activity/getJoinActivityUser',
      method: 'POST',
      data: {
        activityId: activityId,
        currentPage: that.data.currentPage
      },
      dataType: 'json',
      success: function (res) {
        var data = res.data;
        if (data.code == 200) {
          var imgList = that.data.imgList;
          var hidden = that.data.hidden;
          if (data.datas != null && data.datas.length > 0) {
            var user_join_activity = data.datas;
            for (var i = 0; i < user_join_activity.length; i++) {
              var oneObj = user_join_activity[i];
              if (oneObj.imgAddr.startsWith('upload')) {
                oneObj.imgAddr = that.data.fileServer + oneObj.imgAddr;
              }
            }
            imgList = imgList.concat(user_join_activity);
          } else { 
            hidden = !hidden;
          }

          that.setData({
            imgList: imgList,
            currentPage: that.data.currentPage + 1,
            hidden: hidden
          })
        } else {
          wx.showToast({
            title: '加载失败，请稍后重试',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //中奖的人数
  getWinData(winId){
    var that=this
    wx.request({
      url: app.globalData.base_url + 'wx/wish/activity/getActivityDetailOpenPrizeById',
      data: {activityId: winId},
      header: app.globalData.header,
      method: 'POST',
      success(res){
          var obj=res.data.datas
        console.log(obj)
        that.setData({
          prizeList: obj.user_prize,
          
       })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.getInitData();
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