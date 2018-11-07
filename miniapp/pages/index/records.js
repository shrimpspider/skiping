// pages/index/records.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageSize: 10,
    pageIndex: 1,
    records: null,
    loadingHidden: false,
    moreDataHidden: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var self = this
    wx.cloud.init()
    if (!wx.cloud) {
      wx.showToast({
        title: '请使用 2.2.3 或以上的基础库以使用云能力',
      })
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      let params = {
        pageSize: self.data.pageSize,
        pageIndex: self.data.pageIndex
      }
      wx.cloud.callFunction({
        name: 'listrecords',
        data: params,
      }).then(res => {
        var moreData = true
        var showMore = true
        if (res.result.data.length < self.data.pageSize) {
          moreData = false
          showMore = true
        } else {
          moreData = true
          showMore = true
        }
        self.setData({
          records: res.result.data,
          loadingHidden: !showMore,
          moreDataHidden: !moreData
        })
        console.log(res.result)
      }).catch(console.error)
    }
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
    let self = this;

    if (!wx.cloud) {
      wx.showToast({
        title: '请使用 2.2.3 或以上的基础库以使用云能力',
      })
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      let params = {
        pageSize: self.data.pageSize,
        pageIndex: 1
      }
      wx.cloud.callFunction({
        name: 'listrecords',
        data: params,
      }).then(res => {
        var moreData = true
        var showMore = true
        if (res.result.data.length < self.data.pageSize) {
          moreData = false
          showMore = true
        } else {
          moreData = true
          showMore = true
        }
        self.setData({
          records: res.result.data,
          loadingHidden: !showMore,
          moreDataHidden: !moreData,
          pageIndex: 1
        }, function() {
          wx.stopPullDownRefresh()
        })

      }).catch(console.error)
    }


  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let self = this;
    if (!self.data.moreDataHidden) {

      if (!wx.cloud) {
        wx.showToast({
          title: '请使用 2.2.3 或以上的基础库以使用云能力',
        })
        console.error('请使用 2.2.3 或以上的基础库以使用云能力')
      } else {
        let params = {
          pageSize: self.data.pageSize,
          pageIndex: self.data.pageIndex + 1
        }
        wx.cloud.callFunction({
          name: 'listrecords',
          data: params,
        }).then(res => {
          var moreData = true
          var showMore = true
          var index = self.data.pageIndex
          if (res.result.data.length < self.data.pageSize) {
            moreData = false
            showMore = true
          } else {
            moreData = true
            showMore = true
            index = params.pageIndex
          }
          let records = self.data.records.concat(res.result.data);

          self.setData({
            records: records,
            loadingHidden: !showMore,
            moreDataHidden: !moreData,
            pageIndex: index
          }, function() {

          })

        }).catch(console.error)
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})