// pages/active/active.js
// var WxParse = require('../../libs/wxParse/wxParse.js');
var sliderWidth = 130;
var re = /^1(3|4|5|7|8)\d{9}$/;
var reg = /^\d*$/;
function Detail(prize_name, prize_num, chooseType) {
  this.prize_name = prize_name;
  this.prize_num = prize_num;
  this.chooseType = chooseType;
}
//获取时间的方法
  const date = new Date()
  const years = []
  const months = []
  const days = []
  for (let i = 2000; i <= date.getFullYear(); i++) {
    years.push(i)
    // console.log(i)
  }
  for (let i = 1; i <= 12; i++) {
    months.push(i)
  }

  for (let i = 1; i <= 31; i++) {
    days.push(i)
  }

const app = getApp();
Page({

  /**
   *  页面的初始数据
   */
  data: {
    tempFilePaths: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showModalStatus: false,

    width:375,
    str:'',
    info: [],
    lead: false,//引导关注与连接导流
    only_fans: false,//是否仅公众号粉丝可参与
    wish_condition: false,//是否设置心愿条件
    wish_index : 0,//性别
    need_help: false,//是否开启助力
    share: false,//允许分享
    date: '',
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    uploadedImages: [],
    imgBoolean: true,
    logoBoolean : true,
    countries: ["男", "女","不限",],
    countryIndex: 0,
    activity_theme: '',//主题
    creativity_explain: '',//创意
    fileServer: app.globalData.fileServer,//文件服务器地址,
    digest : '',//摘要
    detail_content : [],//详情
    openPrize: ['按时间自动开奖', '按人数自动开奖', '手动开奖'],
    open_prize_con : 1,
    open_describe : '',//开奖人数
    public_name : '',//公众号名称
    prompt_msg : '',//提示信息
    public_command : '',
    logo : '',
    lead_explain : '',//引导描述
    public_id : '',//公众号ID
    help_num : '',
    phone : '',
    isdate : false,
    state: true,//验证码按钮的状态
    timwCode: '已发送',//90秒后重发
    yanzheng:"正确",
    yanzhengcode:'',//获取的验证码
    state1:true,//验证码正确的状态
    returnPhone:'',//后台返回的电话
    codeCont:'',//
    jiangshuLiang:'',//奖品数量
    date:"",//用户关注的时间
    showDialog: false,
  },
  // 打开弹框
  modileTakue() {
    this.setData({
      showDialog: !this.data.showDialog
    });
  },
  // 关不弹框
  removeGb() {
    this.setData({
      showDialog: !this.data.showDialog
    });
  },

  showToast : function (text) {
    wx.showToast({
      title: text,
      icon: 'none',
      duration: 2000
    })
  },
  //模态框
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
        if (this.data.isdate) {
          this.setData(
            {
              showModalStatus: false
            }
          );
        } else {
          this.showToast('时间不能早于当前');
        }
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
    //时间上拉框
  bindDateChange: function (e) {
    console.log(e)
    this.setData({
      date: e.detail.value
    })
  },


  saveActivity : function () {
    
    //封装参数
    const param = {};
    const that = this;
    // if(that.data.state1==true){
    //   that.showToast('请填写正确的验证码');
    //   return;
    // }
    if (that.data.jiangshuLiang==''||reg.test(that.data.jiangshuLiang)==false){
      that.showToast('请填写奖品数量');
      return;
    }
    if (that.data.activity_theme.length<1) {
      that.showToast('请填写活动主题');
      return;
    }
    param.activity_theme = that.data.activity_theme;
    if (that.data.creativity_explain.length < 1) {
      that.showToast('请填写创意说明');
      return;
    }
    param.creativity_explain = that.data.creativity_explain;
    if (that.data.theme_addr == undefined || that.data.theme_addr.length < 1) {
      that.showToast('请选择主题图片');
      return;
    }
    param.theme_addr = that.data.theme_addr;
    if (that.data.phone.length < 1&&this.data.phone!=this.data.returnPhone) {
      that.showToast('请填写手机号');
      return;
    }
    param.phone = that.data.phone;
    param.digest = that.data.digest;
    if (this.data.info == null || this.data.info.length == 0) {
      that.showToast('请至少选择一个心愿类型');
      return
    }
    for (var i = 0; i < this.data.info.length; i++) {
      if (this.data.info[i].chooseType == null) {
        that.showToast('请选择心愿类型');
        return
      }
      if (this.data.info[i].prize_name.length < 1 ) {
        that.showToast('请填写心愿奖品名称');
        return
      }
      if (this.data.info[i].prize_num < 1) {
        that.showToast('请填写奖品数量');
        return
      }
    }
    param.wish_List = that.data.info;
    param.open_prize_con = that.data.open_prize_con;
    if (param.open_prize_con == 1) {
      param.open_describe = that.data.date;
      if (param.open_describe.length < 1 || that.data.str.length < 1) {
        that.showToast('请填写开启心愿条件');
        return
      }
    } else if (param.open_prize_con == 2) {
      param.open_describe = that.data.open_describe;
      if (param.open_describe.length < 1) {
        that.showToast('请填写开启心愿条件');
        return
      }
    }
   
    param.lead = that.data.lead ? 1 : 0;
    if (that.data.lead) {
      if (this.data.public_id.length < 1) {
        that.showToast('请填写公众号ID');
        return
      }
      param.public_id = that.data.public_id;
      if (this.data.lead_explain.length < 1) {
        that.showToast('请填写引导描述');
        return
      }
      param.lead_explain = that.data.lead_explain;
      if (this.data.logo.length < 1) {
        that.showToast('请选择品牌logo');
        return
      }
      param.logo = that.data.logo;
    }
    //处理文字换行问题
    param.detail_content = app.replaceNewLine(that.data.detail_content);
    param.only_fans = that.data.only_fans ? 1 : 0;
    if (that.data.only_fans) {
      if (this.data.public_name.length < 1) {
        that.showToast('请填写公众号名称');
        return
      }
      param.public_name = that.data.public_name;
      if (this.data.prompt_msg.length < 1) {
        that.showToast('请填写口令');
        return
      }
      param.public_command = that.data.public_command;
      if (this.data.prompt_msg.length < 1) {
        that.showToast('请填写提示信息');
        return
      }
      param.prompt_msg = that.data.prompt_msg;
    }
    if (that.data.wish_condition) {
      param.wish_condition = that.data.wish_index + 1;
    }
    param.share = that.data.share ? 1 : 0;
    param.need_help = that.data.need_help ? 1 : 0;
    if (that.data.need_help) {
      if (this.data.help_num.length < 1) {
        that.showToast('请填写助力人数');
        return
      }
      param.help_num = that.data.help_num;
    }
    param.userId = app.globalData.userInfo.id;
    
    
    wx.request({
      url: app.globalData.base_url +'wx/wish/activity/addActivity',
      header: app.globalData.header,
      data : {
        activityObj: encodeURI(JSON.stringify(param))
      },
      method: 'POST',
      success(res) {
        const data = res.data;
        if (data.code== 200) {
          that.setData({
            activity_theme: '',
            creativity_explain: '',
            phone:'',
            codeCont:'',
            yanzhengcode:'',

            public_name:'',
            public_id:'',
            lead_explain:'',
            prompt_msg:'',
            help_num:'',
            public_command:'',
            open_describe:'',
            wish_condition:false,
            state: true,
            state1:true,
          })
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
          that.returnToStart();
          wx.navigateTo({
            url: '../activitytheme/activitytheme?id=' + data.datas
          })
        } else {
          wx.showToast({
            title: data.message,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })

  },
  returnToStart:function () {
    this.setData({
      tempFilePaths: '',
      userInfo: {},
      hasUserInfo: false,
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
      showModalStatus: false,
      width: 375,
      str: '',
      info: [],
      lead: true,
      only_fans: false,
      wish_condition: false,
      wish_index: 0,
      need_help: false,
      share: false,
      date: '',
      activeIndex: 0,
      sliderOffset: 0,
      sliderLeft: 0,
      uploadedImages: [],
      imgBoolean: true,
      logoBoolean: true,
      countries: ["男", "女", "不限",],
      countryIndex: 0,
      activity_theme: '',//主题
      creativity_explain: '',//创意
      fileServer: app.globalData.fileServer,//文件服务器地址,
      digest: '',//摘要
      detail_content: [],//详情
      openPrize: ['按时间自动开奖', '按人数自动开奖', '手动开奖'],
      open_prize_con: 1,
      open_describe: '',
      public_name: '',
      prompt_msg: '',
      public_command: '',
      logo: '',
      lead_explain: '',
      public_id: '',
      help_num: '',//助力人数
      phone: '',
      isdate: false,
    })
    this.onLoad();
  },
  // 修改条件
  open: function () {

    const thiz = this;
    wx.showActionSheet({
      itemList: ['按时间自动开奖', '按人数自动开奖', '手动开奖'],
      success: function (res) {
        if (!res.cancel) {
          thiz.setData({
            open_prize_con: res.tapIndex+1
          });
        }
      }
    });
  },
  toImpower(){
   wx.navigateTo({
     url: '../impower/impower',
   })
  },
  //引导
  changeSwitch1(e) {
    
    this.setData({
      lead: e.detail.value
    })
  },
  //仅粉丝
  changeSwitch2(e) {
    this.setData({
      only_fans: e.detail.value
    })
  },
  //抽奖条件
  changeSwitch3(e) {
    this.setData({
      wish_condition: e.detail.value
    })
  },
  //助力
  changeSwitch4(e) {
    this.setData({
      need_help: e.detail.value
    })
  },
  //分享
  changeSwitch5(e) {
    console.log(e.detail.value)
    this.setData({
      share: e.detail.value
    })
  },

  bindSelect: function (e) {
  },

  //跳转更换类型
  tiaoZym(e) {
    let index = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../elect/elect?id='+index
    })
  },
  //上传主题图片
  chooseImage: function () {
    var that = this;
    // 选择图片
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: app.globalData.fileServer + 'fileUpload', // 仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          success(res) {
            const data = res.data
            const dataObj = JSON.parse(data);
            if (dataObj.code == 200) {
              that.setData({
                theme_addr: dataObj.datas,
                imgBoolean: false
              });
            } else {
              wx.showToast({
                title: '上传失败',
                icon: 'none',
                duration: 2000
              })
            }
          }
        })

      }
    })
  },
  // 图片预览
  previewImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: [current],
      success(res){
      }
    })
  },
  //删除图片
  deleteImg: function (e) {
    var that = this;
    that.setData({
      theme_addr: '',
      imgBoolean: true
    });
  },
  goRichTextDemo() {
    wx.navigateTo({
      url: '../richtext_demo/richtext_demo?detail=' + JSON.stringify(this.data.detail_content),
    })
  },

  // 上传头像
  upload() {
    var that = this;
    // 选择图片
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: app.globalData.fileServer + 'fileUpload', // 仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          success(res) {
            const data = res.data
            const dataObj = JSON.parse(data);
            if (dataObj.code == 200) {
              that.setData({
                logo: dataObj.datas,
                logoBoolean: false
              });
            } else {
              wx.showToast({
                title: '上传失败',
                icon: 'none',
                duration: 2000
              })
            }
          }
        })

      }
    })
  },
  // 性别
  bindCountryChange: function (e) {
    this.setData({
      wish_index: e.detail.value
    })
  },
  init: function () {
    let that = this;
    this.setData({
      info: [],
    });
  },
  //活动主题
  ActivityThemeInput: function (e) {
    this.setData({
      activity_theme: app.filterEmoji(e.detail.value)
    })
  },
  //创意说明
  creativityExplainInput: function (e) {
    this.setData({
      creativity_explain: app.filterEmoji(e.detail.value)
    })
  },
  //心愿奖品名称
  WishPrizeInput : function (e) {
    const index = e.currentTarget.id;
    const info = this.data.info;
    info[index].prize_name = e.detail.value;
    this.setData({
      info : info,
    });
  },
  //奖品数量
  PrizeNumInput: function (e) {
    const index = e.currentTarget.id;
    const info = this.data.info;
    if (reg.test(e.detail.value)){
      info[index].prize_num = e.detail.value;
      this.setData({
        info: info,
        jiangshuLiang: e.detail.value 
      });
    }else{
      wx, wx.showToast({
        title: '请输入数字',
        icon: 'none',
        image: '',
        duration: 2000,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },
 
  //摘要
  digestInput : function (e) {
    this.setData({
      digest: app.filterEmoji(e.detail.value)
    })
  },
  //开奖描述
  openPrizeConIuput: function (e) {
    this.setData({
      open_describe: app.filterEmoji(e.detail.value)
    })
  },
  //口令
  publicCommandInput: function (e) {
    this.setData({
      public_command: app.filterEmoji(e.detail.value)
    })
  },
  //公众号名称
  publicNameInput: function (e) {
    this.setData({
      public_name: app.filterEmoji(e.detail.value)
    })
  },
  //提示信息
  promptMsgInput: function (e) {
    this.setData({
      prompt_msg: app.filterEmoji(e.detail.value)
    })
  },
  //公众号ID
  publicIdInput: function (e) {
    this.setData({
      public_id: app.filterEmoji(e.detail.value)
    })
  },
  //提示信息
  leadExplainInput: function (e) {
    this.setData({
      lead_explain: app.filterEmoji(e.detail.value)
    })
  },
  //助力人数
  helpNumInput: function (e) {
    this.setData({
      help_num: e.detail.value
    })
  },
  //手机号
  phoneInput : function (e) {
    this.setData({
      phone: app.filterEmoji(e.detail.value)
    })
  },
  //获取验证码 
  huoquCode:function(){
    var _this = this
    if(re.test(this.data.phone)){
      wx.request({
        url: app.globalData.base_url + '/wx/wish/public/getPhoneCode',
        method: "get",
        header: app.globalData.header,
        data: {
          phone: this.data.phone
        },
        success(res) {
          if (res.data.code == 200) {
            console.log(res)
            _this.setData({
              state: false,
              yanzhengcode:res.data.datas.code,
              returnPhone: res.data.datas.phone
            })
            // var time = 10
            // var Interval = setInterval(function () {
            //   time--;
            //   if (time > 0) {
            //     _this.setData({
            //       timwCode: time + '秒后重发'
            //     })
            //   } else {
            //     clearInterval(Interval);
            //     _this.setData({
            //       state: true,
            //       state1: true,
            //       yanzhengcode:''
            //     })
            //   }
            // }, 1000)
          }
        }
      })
    }else{
      wx.showToast({
        title: '请输入正确的电话号码',
        icon: 'none',
        duration: 2000
      })
    }
  },
  
  //失焦判断验证码是否正确
  blurYanZheng:function(e){
    let val = e.detail.value
    if (val!=''&&val == this.data.yanzhengcode&&this.data.phone==this.data.returnPhone){
      this.setData({
        state1:''
      })
    } else {
      this.setData({
        state1:true
      })
      wx.showToast({
        title: '验证码不匹配',
        icon: 'none',
        duration: 2000
      })
    }
  },
  //失焦判断是否修改电话
  blurPone:function(e){
    var valIphon=e.detail.value
    if (this.data.returnPhone != '' && this.data.phone != this.data.returnPhone){
      this.setData({
        state1:true,
        state:true
      })
      wx:wx.showToast({
        title: '电话号码与验证码不一致',
        icon: 'none',
        image: '',
        duration:2000,
      })
    } else if (valIphon != '' && this.data.phone == this.data.returnPhone) {
      this.setData({
        // state1:'',
        state:false
      })
    }
  },
  onLoad: function (option) {
    var that = this;
    that.init();
    //默认添加一个心愿
    that.insert()
    let {
      avatar
    } = option
    if (avatar) {
      this.setData({
        src: avatar
      })
    }
  },
  //增加类型
  insert: function () {
    let info = this.data.info;
    if (info.length < 6) {
      info.push(new Detail());
      this.setData({
        info: info
      });
    }
  },
  //移除类型
  remove: function (e) {
    let info = this.data.info;
    info.splice(e.currentTarget.id,1);
    this.setData({
      info: info
    });
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that=this
    var myDate= new Date()
    var myNewDay = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate()
    that.setData({
      date:myNewDay
    })
   
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