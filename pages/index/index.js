//index.js
const app = getApp();
var sliderWidth = 96;

Page({
  data: {
    reSubmit: false, //防重复提交
    fileServer: app.globalData.fileServer,
    showModal: false,//是否显示授权窗
    isLogin: false,
    curPage: 1,
    pageSize: 10,
    tabs: ["热门", "最新"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    list: [],
    num: '',
    zan: false,
    hasMoreData: true,
    isRefreshing: false,
    isLoadingMoreData: false
  },
  onPullDownRefresh: function() {
    this.data.curPage = 1;
    if (this.data.isRefreshing || this.data.isLoadingMoreData) {
      return
    }
    this.setData({
      isRefreshing: true,
      hasMoreData: true
    })
    this.getWishList() //数据请求
  },
  onReachBottom: function() {
    if (this.data.isRefreshing || this.data.isLoadingMoreData || !this.data.hasMoreData) {
      return
    }
    
    this.setData({
      isLoadingMoreData: true
    })
    this.getWishList() //数据请求
  },

  onLoad: function() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    // app.userInfoReadyCallback = res => { //app.js的回调
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
    //       that.getWishList();
    //     }
    //   })
    // }
    
  },
  //页面数据渲染
  onReady: function() {

  },
  onShow: function () {
    var that = this;
    this.setData({
      activeIndex: 0,
      sliderOffset: 0,
      sliderLeft: 0,
      list: [],
      num: '',
      zan: false,
      hasMoreData: true,
      isRefreshing: false,
      isLoadingMoreData: false
    })
    that.data.curPage = 1;
    app.scrollToTop();
    if (!app.globalData.header) {//未登陆
      app.myLogin().then(function (res) {
        if (!('unauth'==res)){//已授权
          that.getWishList();
        }
      })
    } else {
      that.getWishList();
    }
  },
  //页面数据渲染
  onReady: function() {

  },
  getWishList() {
    var that = this;
    var p = new Promise(function(resolve,reject){
      if (that.data.reSubmit) {
        return;
      }
      that.data.reSubmit = true;
      if (that.data.curPage == 1) {
        that.data.list = [];
      }
      var detailUrl = "getWishDetailList";
      if (that.data.activeIndex == '1') {
        detailUrl = "getWishDetailCreateList";
      }
      wx.request({
        url: app.globalData.base_url + 'wishDetail/' + detailUrl,
        method: 'GET',
        data: {
          curPage: that.data.curPage,
          pageSize: that.data.pageSize
        },
        header: app.globalData.header,
        success(res) {
          if (res.data.datas) {
            for (var i = 0; i < res.data.datas.length; i++) {
              res.data.datas[i].flag = false;
              if (res.data.datas[i].wishListStr) {
                for (var j = 0; j < res.data.datas[i].wishListStr.length; j++) {
                  if (!res.data.datas[i].wishListStr[j].icon) {
                    res.data.datas[i].wishListStr[j].icon = 'default/default.png';
                  }
                }
              }
            }
            that.setData({
              list: that.data.list.concat(res.data.datas)
            })
          }
          that.data.curPage = that.data.curPage + 1;
          that.setData({
            isRefreshing: false,
            isLoadingMoreData: false
          })
          if (!res.data.datas || res.data.datas.length < that.data.pageSize) {
            that.setData({
              hasMoreData: false
            })
          } else {
            that.setData({
              hasMoreData: true
            })
          }
          that.data.reSubmit = false;
        }
      })
    })
    return p;
  },
  //展开收起动态绑定idx
  showRule: function(e) {
    var idx = e.currentTarget.dataset.idx, // 获取当前下标
      key = "list[" + idx + "].flag",
      val = this.data.list[idx].flag;
    this.setData({
      [key]: !val
    });
  },
  //点赞支持
  dianZanzhichi(e) {
    let thit = this;
    var idx = e.currentTarget.dataset.idx, // 获取当前下标
      key = "list[" + idx + "].isSurport",
      isSurport = thit.data.list[idx].isSurport,
      numKey = "list[" + idx + "].supportNum",
      id = thit.data.list[idx].id,
      supportNum = thit.data.list[idx].supportNum;
    var toIsSurport = thit.data.list[idx].isSurport == 0 ? '1' : '0';
    this.setData({
      [key]: toIsSurport
    });
    if (toIsSurport == 1) {
      supportNum += 1
      this.setData({
        [numKey]: supportNum
      })
    } else {
      supportNum -= 1
      this.setData({
        [numKey]: supportNum
      })
    }
    var that = this;
    wx.request({
      url: app.globalData.base_url + 'wishDetail/changeSupport',
      method: 'GET',
      data: {
        detailId: id,
        toSupport: toIsSurport
      },
      header: app.globalData.header,
      success(res) {}
    })
  },
  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    this.data.curPage = 1;
    this.getWishList();
  },
  manaGement() { //允许授权
    var that = this;
    that.onShow()
  }
})