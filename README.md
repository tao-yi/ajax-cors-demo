### Demo CORS Ajax client side and server side

### Enable CORS on server side

```js
res.setHeader("Access-Control-Allow-Origin", req.header("Origin"));
res.setHeader("Access-Control-Allow-Credentials", true);
```

### Enable CORS POST on server side

```js
// 开启跨域接收post请求，会导致浏览器发送一个preflight option请求
// 前端页面发送post请求必须同时设置header: {'Content-Type': 'application/json'}
// 服务器端需要允许接收这个header，然后服务器端才能用req.body收到请求体
res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Custom-Header");
```

### Enable Headers sent to the browser

```js
// 允许服务器传header给跨域请求，否则只能传递content-type这个header
// 在这里添加Set-Cookie是没用的，
// 跨域AJAX请求无法通过res.headers.get('Set-Cookie')读取cookie值
// cookie只能由浏览器管理，自动随请求发送过来
res.setHeader("Access-Control-Expose-Headers", "X-Custom-Header,  Date");
// AJAX现在可以得到这个值res.headers.get('X-Customer-Header')
res.setHeader("X-Custom-Header", "testValue");
```

### Sending CORS Ajax on client side

```js
fetch("http://localhost:3000/product", {
  method: "post",
  headers: {
    "Content-Type": "application/json",
    // MyTestHeader: "value",
    "X-Custom-Header": "value1",
    // 在这里设置Cookie值是没用的
    Cookie: "myCookie=myValue"
  },
  body: JSON.stringify({
    msg: "my msg"
  }),
  credentials: "include"
})
  .then(x => {
    x.headers.forEach(x => console.log(x));
    // 这里的header中也得不到'Set-Cookie'
    return x.json();
  })
  .then(json => {
    document.getElementById("root").innerHTML = JSON.stringify(json);
  });
```

### Receiving cookies

As with XMLHttpRequest, the `Set-Cookie` response header returned from the server is a forbidden header name and therefore can't be <b>programmatically</b> read with `response.headers.get('Set-Cookie')`. Instead, it's the browser's responsibility to handle new cookies being set (if applicable to the current URL). Unless they are HTTP-only, new cookies will be available through `document.cookie`
