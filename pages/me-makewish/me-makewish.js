// pages/me-makewish/me-makewish.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileServer: app.globalData.fileServer,
    curPage:1,
    pageSize:10,
    myWishDetailList:[],
    hasMoreData: true,
    isRefreshing: false,
    isLoadingMoreData: false
  },
  //展开收起动态绑定idx
  showRule: function (e) {
    var idx = e.currentTarget.dataset.idx, // 获取当前下标
      key = "myWishDetailList[" + idx + "].flag",
      val = this.data.myWishDetailList[idx].flag;
    this.setData({
      [key]: !val
    });
  },
  getMyWishDetailList(){debugger
    //获取list
    var that = this;
    if(that.data.curPage == 1){
      this.data.myWishDetailList=[];
    }
    wx.request({
      url: app.globalData.base_url + 'personal/getMyWishDetailList',
      method: 'GET',
      data:{
        curPage:this.data.curPage,
        pageSize:this.data.pageSize
      },
      header: app.globalData.header,
      success(res) {
        if (res.data.code == 200) {
          for(var i = 0;i<res.data.datas.length;i++){
            res.data.datas[i].flag=false;
            for (var j = 0; j < res.data.datas[i].wishListStr.length; j++) {
              if (!res.data.datas[i].wishListStr[j].icon) {
                res.data.datas[i].wishListStr[j].icon = 'default/default.png';
              }
            }
          }
          const ret = that.data.myWishDetailList.concat(res.data.datas);
          that.setData({
            myWishDetailList: ret,
            curPage:that.data.curPage+1
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
    // this.getMyWishDetailList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getMyWishDetailList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.setData({
    //   curPage: 1,
    //   myWishDetailList: [],
    //   hasMoreData: true,
    //   isRefreshing: false,
    //   isLoadingMoreData: false
    // })
    // this.onLoad();
    // app.scrollToTop();
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
    this.getMyWishDetailList()//数据请求
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
    this.getMyWishDetailList()//数据请求
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})