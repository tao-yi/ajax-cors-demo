const express = require("express");
const https = require("https");
const fs = require("fs");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");

//同步读取密钥和签名证书
var options = {
  key: fs.readFileSync("./backend/server.key"),
  cert: fs.readFileSync("./backend/server.crt")
};

const httpsServer = https.createServer(options, app);

app.use(express.json());
app.use(cookieParser());
// app.use(cors());
app.use((req, res, next) => {
  console.log("Request Received ===============================");

  // 开启跨域访问，前端页面fetch必须同时开启 credentials: true 选项
  res.setHeader(
    "Access-Control-Allow-Origin",
    req.header("Origin") || req.header("Referer")
  );
  res.setHeader("Access-Control-Allow-Credentials", true);

  // 开启跨域接收post请求，会导致浏览器发送一个preflight option请求
  // 前端页面发送post请求必须同时设置header: {'Content-Type': 'application/json'}
  // 服务器端需要允许接收这个header，然后服务器端才能用req.body收到请求体
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, X-Custom-Header"
  );
  // 允许服务器传header给跨域请求，否则只能传递content-type这个header
  // 在这里添加Set-Cookie是没用的，
  // 跨域AJAX请求无法通过res.headers.get('Set-Cookie')读取cookie值
  // cookie只能由浏览器管理，自动随请求发送过来
  res.setHeader("Access-Control-Expose-Headers", "X-Custom-Header,  Date");
  // AJAX现在可以得到这个值res.headers.get('X-Customer-Header')
  res.setHeader("X-Custom-Header", "testValue");
  next();
});

app.use("/product", (req, res, next) => {
  console.log("Origin: " + req.header("Origin"));
  console.log("Referer: " + req.header("Referer"));
  console.log("User-Agent: " + req.header("User-Agent"));
  console.log("Content-Type: " + req.header("Content-Type"));
  console.log("Cookie: " + req.header("Cookie"));
  console.log("X-Custom-Header: " + req.header("X-Custom-Header"));
  console.log("body: " + JSON.stringify(req.body));
  console.log("Response Sent ===============================\n");

  // 因为开启了CORS，这里设置的Cookie不仅Origin能够得到，而且AJAX请求也能携带这个Cookie
  // Domain 表示可以访问该Cookie的域名
  // Secure 表示只允许HTTPS访问该Cookie
  res.setHeader("Set-Cookie", [
    "wxuin=366304200; Domain=.wechat.com; Path=/; Expires=Tue, 12-Mar-2019 19:05:26 GMT; Secure",
    "wxsid=/J12f1TCWlWkiQgA;",
    "wxloadtime=1552374326;  Path=/;  Secure",
    "mm_lang=zh_CN; Path=/; Expires=Tue, 29-Mar-2019 19:05:26 GMT; ",
    "webwx_data_ticket=gSdpnc4xiZsYbWTr2JYn44bR; Path=/;  Secure",
    "webwx_data_ticket=gSdpnc4xiZsYbWTr2JYn44bR; Domain=.wechat.com; Path=/; Expires=Tue, 12-Mar-2019 19:05:26 GMT; Secure",
    "key1=value1",
    "key2=value2"
  ]);
  // console.log(res.getHeaders());
  console.log("cookies");
  console.log(req.cookies);

  // const name = req.cookies["name"];
  // if (!name) {
  //   res.json({ msg: "首次访问" });
  // } else {
  //   res.json({ msg: "又来🌶！" });
  // }
  res.json({ msg: "hello world!" });
});

httpsServer.listen(3000);
