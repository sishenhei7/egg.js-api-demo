# example

a demo of egg.js api（include restful api）

### 本地调试

$ npm i
$ npm run dev
$ open http://localhost:7001/

### todo

- [x] 后台api
- [x] 加入jwt验证
- [ ] 权限系统
- [ ] 邀请码系统
- [ ] 后台react页面

### api

（待写成文档）

get '/'                          --> 主页
get '/test'                      --> 主页测试
get '/api/test'                  --> api测试
get '/api/user'                  --> user
post '/api/user/verifyLogin'     --> user验证token登录
post '/api/user/signUp'          --> user注册
post '/api/user/login'           --> user电话和密码登录
post '/api/user/changePassword'  --> user修改密码
get '/api/article/test'          --> article测试
get '/api/article'               --> 查看全部article（restful风格）
post '/api/article'              --> 新建一个article（restful风格）
get '/api/article/:id'           --> 查看指定id的article（restful风格）
put '/api/article/:id'           --> 修改指定id的article（restful风格）
delete '/api/article/:id'        --> 删除指定id的article（restful风格）







