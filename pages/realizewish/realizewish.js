// pages/realizewish/realizewish.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileServer: app.globalData.fileServer,
    curPage: 1,
    pageSize: 10,
    hasMoreData: true,
    isRefreshing: false,
    isLoadingMoreData: false,
    myImpllist:[]
  },
  toOpenPrizeRet(e) {
    wx.navigateTo({
      url: '../wishResults/wishResults?activityId=' + e.currentTarget.id
    })
  },
  getMyImpl() {
    //获取list
    var that = this;
    if (that.data.curPage == 1) {
      this.data.myImpllist = [];
    }
    wx.request({
      url: app.globalData.base_url + 'personal/getMyImpl',
      method: 'GET',
      data: {
        curPage: this.data.curPage,
        pageSize: this.data.pageSize
      },
      header: app.globalData.header,
      success(res) {
        if (res.data.code == 200) {
          const ret = that.data.myImpllist.concat(res.data.datas);
          that.setData({
            myImpllist: ret,
            curPage: that.data.curPage + 1
          })
          that.setData({
            isRefreshing: false,
            isLoadingMoreData: false
          })
          if (res.data.datas.length < that.data.pageSize) {
            that.setData({
              hasMoreData: false
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
    });

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMyImpl();
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
    this.data.curPage = 1;
    if (this.data.isRefreshing || this.data.isLoadingMoreData) {
      return
    }
    this.setData({
      isRefreshing: true,
      hasMoreData: true
    })
    this.getMyImpl()//数据请求
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isRefreshing || this.data.isLoadingMoreData || !this.data.hasMoreData) {
      return
    }
    this.setData({
      isLoadingMoreData: true
    })
    this.getMyImpl()//数据请求
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})