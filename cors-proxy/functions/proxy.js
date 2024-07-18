const { createProxyMiddleware } = require('http-proxy-middleware');

const proxy = createProxyMiddleware({
  target: 'https://api.duishu.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/dxwapp/lhb/fpb?pagecount=-1&filter_type=4&activity_show_type=0&KEY_ACTIVITY_TAB_PV=%2Ffupan&page=1&sub_filter_type=3&apiversion=8.9' // 重写URL路径
  },
  onProxyRes: function (proxyRes, req, res) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, X-Auth-Token';
  }
});

exports.handler = async (event, context) => {
  return new Promise((resolve, reject) => {
    const res = {
      setHeader: (name, value) => {
        event.headers[name] = value;
      },
      writeHead: (status, headers) => {
        res.statusCode = status;
        res.headers = headers;
      },
      end: (body) => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body
        });
      }
    };

    proxy(event, res, (err) => {
      if (err) {
        reject(err);
      }
    });
  });
};
