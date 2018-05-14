/**
 * @Services Http请求
 *
 * @export get/post <function>
 * 
 * @param url: string 请求地址
 * @param param: object 请求参数
 * @return Promise
 * 
 * @author phuhoang
 * @time 2018-01-16
 */

const Domain = getApp().domain;

const Get = (url, param) => {
  return new Promise((resolve, reject) => {
    let requestPath = url.substr(0, 4) === 'http' ? url : `${Domain}${url}`;
    wx.request({
      url: requestPath,
      method: 'GET',
      data: param,
      dataType: 'json',
      success(res) {
        resolve(res.data);
      },
      fail(err) {
        reject(err);
      }
    });
  });
}

const Post = (url, param) => {
  return new Promise((resolve, reject) => {
    let requestPath = url.substr(0, 4) === 'http' ? url : `${Domain}${url}`;
    wx.request({
      url: requestPath,
      method: "POST",
      data: Serialize(param),
      dataType: 'json',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        resolve(res.data);
      },
      fail(err) {
        reject(err);
      }
    })
  })
}

const Serialize = (data) => {
  var val = "", str = "";
  for (var v in data) {
    str = v + "=" + data[v];
    val += str + '&';
  }
  return val.slice(0, val.length - 1);
}


module.exports = {
  get: Get,
  post: Post
}
