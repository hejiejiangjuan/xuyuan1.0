// pages/takecard/takecard.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName:'',
    avatarUrl:'',
    userInfo:app.globalData.userInfo,
    createActivityCount: 0,
    userImplCount: 0,
    userJoinCount: 0,
    wishDetailCount: 0
  },
  memakeWish(){
    wx.navigateTo({
      url: '../me-makewish/me-makewish'
    })
  },
  meActivities(){
    wx.navigateTo({
      url: '../me-activities/me-activities'
    })
  },
  realizeWish(){
    wx.navigateTo({
      url: '../realizewish/realizewish'
    })
  },

  getPersonStaticInfo() {
    var that = this;
    //获取静态统计数据
    wx.request({
      url: app.globalData.base_url + 'personal/getPersonStaticInfo',
      method: 'GET',
      header: app.globalData.header,
      success(res) {
        const data = res.data;
        if (data.code == 200) {
          that.setData({
            createActivityCount: data.datas.createActivityCount,
            userImplCount: data.datas.userImplCount,
            userJoinCount: data.datas.userJoinCount,
            wishDetailCount: data.datas.wishDetailCount,
            nickName: data.datas.nickName,
            avatarUrl: data.datas.avatarUrl
          })
        } else {
          wx.showToast({
            title: '系统错误，请稍后重试',
            icon: 'none',
            duration: 2000
          })
        }
      }
    });
  },
  founDing() {
    wx.navigateTo({
      url: '../founding/founding',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  businessCooperation(){
    wx.navigateTo({
      url: '../businessCooperation/businessCooperation',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  //常见问题页面跳转
  wishResults(){
    wx.navigateTo({
      url: '../commonProblems/commonProblems',
    })
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    this.getPersonStaticInfo();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.onLoad();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})