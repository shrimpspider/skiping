//index.js
var util = require('../../utils/util.js');
//获取应用实例
const app = getApp()
/** 
 * 需要一个目标日期，初始化时，先得出到当前时间还有剩余多少秒
 * 1.将秒数换成格式化输出为XX天XX小时XX分钟XX秒 XX
 * 2.提供一个时钟，每10ms运行一次，渲染时钟，再总ms数自减10
 * 3.剩余的秒次为零时，return，给出tips提示说，已经截止
 */

// 定义一个总毫秒数，以一分钟为例。TODO，传入一个时间点，转换成总毫秒数
var total_micro_second = 1 * 60 * 1000;
var interval = null;
/* 毫秒级倒计时 */
var count_down = function(that, end) {
  if (that.data.isrun == false) {
    clearInterval(interval)
  }
  var date = new Date();
  var now = date.getTime();
  var leftsecond = end - now;
  if (leftsecond <= 1000) {
    that.setData({
      clock: "时间到!",
      jumpenable: false,
      isrun: false,
      timestamp: now,
      jumptext: '../res/end.png'

    });
    // timeout则跳出递归
    clearInterval(interval)
  } else {
    // 渲染倒计时时钟
    that.setData({
      clock: date_format(leftsecond)
    });
  }
}


// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
function date_format(micro_second) {
  // 秒数
  var second = Math.floor(micro_second / 1000);
  // 小时位
  var hr = Math.floor(second / 3600);
  // 分钟位
  var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  // 秒位
  var sec = fill_zero_prefix((second - hr * 3600 - min * 60)); // equal to => var sec = second % 60;

  return hr + ":" + min + ":" + sec;
}

// 位数不足补零
function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}

Page({
  data: {
    count: 0,
    timestamp: 0,
    clock: '0:01:00',
    colckarray: ['1', '2', '3', '4', '5'],
    colckindex: 0,
    isrun: false,
    jumptext: '../res/start.png',
    jumpenable: true,
    voiceSetImg: '../res/voiceon.png',
    voiceSet: true,
    record: null,
    hideShareModal: true
  },
  //选择跳绳分钟数
  bindPickerChange: function(e) {
    var date = new Date();
    var now = date.getTime();
    var end = now + (Number(e.detail.value) + 1) * total_micro_second;

    var leftsecond = end - now;
    console.log(date_format(leftsecond))
    // 渲染倒计时时钟
    this.setData({
      clock: date_format(leftsecond),
      colckindex: e.detail.value
    });
  },
  onShow: function() {

  },
  //声音开关事件
  voiceSetHandler: function() {
    if (this.data.voiceSet) {

      wx.setStorageSync('voiceSet', !this.data.voiceSet)

      this.setData({
        voiceSet: !this.data.voiceSet,
        voiceSetImg: '../res/voiceoff.png',
      })
    } else {
      wx.setStorageSync('voiceSet', !this.data.voiceSet)

      this.setData({
        voiceSet: !this.data.voiceSet,
        voiceSetImg: '../res/voiceon.png',
      })
    }
  },
  bindHistory: function(e) {
    if (!this.data.isrun) {
      wx.navigateTo({
        url: 'records',
      })
    } else {
      wx.showToast({
        title: '还没跳完呢!',
      })
    }

  },
  //保存按钮事件
  bindSave: function(e) {
    var date = new Date();
    var self = this;
    if (self.data.isrun) {
      wx.showToast({
        title: '时间还没到呢!',
        icon: 'none'
      })
    } else if (self.data.timestamp == 0) {
      wx.showToast({
        title: '还没跳呢!',
        icon: 'none'
      })
    } else {
      if (wx.getStorageSync('record').timestamp == self.data.timestamp) {
        wx.showToast({
          title: '已经保存过了!',
          icon: 'none'
        })
      } else {
        if (e.detail.userInfo) {

          wx.showLoading({
            title: '正在保存...',
          })
          app.userInfo = e.detail.userInfo
          // console.log(e)
          var rcd = {
            name: e.detail.userInfo.nickName,
            avatarurl: e.detail.userInfo.avatarUrl,
            time: util.formatTime(date),
            count: self.data.count,
            minutes: Number(self.data.colckindex) + 1,
            timestamp: self.data.timestamp
          }
          wx.cloud.init()

          if (!wx.cloud) {
            wx.showToast({
              title: '请使用 2.2.3 或以上的基础库以使用云能力',
            })
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
          } else {
            wx.cloud.callFunction({
              name: 'saverecord',
              data: rcd,
            }).then(res => {
              // console.log(rcd)
              wx.hideLoading()
              wx.setStorageSync('record', rcd)
              self.setData({
                record: rcd,
                hideShareModal: false
              })
              // console.log(res.result)
            }).catch(console.error)
          }
        } else {
          wx.showToast({
            title: '操作需要授权',
          })
        }
      }
    }
  },
  //重置按钮事件
  bindReset: function() {
    var self = this;
    var date = new Date();
    var now = date.getTime();
    var end = now + (Number(self.data.colckindex) + 1) * total_micro_second;

    var leftsecond = end - now;
    clearInterval(interval)
    // 渲染倒计时时钟
    self.setData({
      count: 0,
      timestamp: 0,
      jumpenable: true,
      isrun: false,
      jumptext: '../res/start.png',
      clock: date_format(leftsecond)
    })
  },
  //调一下按钮事件
  bindJump: function() {
    var that = this
    if (!this.data.isrun && this.data.jumpenable) {
      var date = new Date();
      var now = date.getTime();
      var end = now + (Number(that.data.colckindex) + 1) * total_micro_second + 1000;

      interval = setInterval(count_down, 100, this, end)
      this.setData({
        isrun: true,
        jumptext: '../res/jump.png'
      })
    } else {
      if (this.data.voiceSet) {
        var innerAudioContext = wx.createInnerAudioContext()
        innerAudioContext.src = "pages/res/jump.mp3"
        innerAudioContext.onError((res) => {
          // 播放音频失败的回调
          console.log('播放音频失败', res);
          innerAudioContext.play()
        })
        innerAudioContext.onEnded((res) => {
          // 播放音频失败的回调
          innerAudioContext.destroy()
        })
        innerAudioContext.play()
      }

      this.setData({
        count: this.data.count + 1,
      })
    }
  },
  bindNotShare: function() {

    this.setData({
      hideShareModal: true
    })
  },
  bindShare: function() {

  },
  onLoad: function() {
    var t = wx.getStorageSync('voiceSet')
    var rcd = wx.getStorageSync('record')
    if (t) {
      this.setData({
        voiceSet: t,
        voiceSetImg: '../res/voiceon.png',
        record: rcd
      })
    } else {
      this.setData({
        voiceSet: t,
        voiceSetImg: '../res/voiceoff.png',
        record: rcd
      })
    }

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var self = this;
    self.setData({
      hideShareModal: true
    })
    return {
      title: app.userInfo.nickName + '刚刚跳绳' + self.data.record.minutes + '分钟' + self.data.record.count + '下',
      path: '/miniapp/pages/index/index' // 路径，传递参数到指定页面。
    }
  }

})