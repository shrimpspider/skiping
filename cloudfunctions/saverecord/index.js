// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  
  try {
    return await db.collection('records').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        name:event.name,
        avatarurl: event.avatarurl,
        count:event.count,
        time:event.time,
        timestamp:event.timestamp
      }
    })
  } catch (e) {
    console.error(e)
  }
}