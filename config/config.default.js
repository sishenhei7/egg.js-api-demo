module.exports = appInfo => {
  const config = exports = {}

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1513779989145_1652';

  // add your config here
  // 加载 errorHandler 中间件
  config.middleware = [ 'errorHandler' ];

  // 只对 /api 前缀的 url 路径生效
  // config.errorHandler = {
  //   match: '/api',
  // };

  //关闭csrf
  config.security = {
    csrf: {
      enable: false
    },
    domainWhiteList: [ 'http://localhost:8000', 'http://localhost:3000', 'http://192.168.1.142:3000' ]
  };

  //设置cors
  config.cors = {
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    credentials: true
  };

  //使用mongodb数据库
  config.mongoose = {
    url: 'mongodb://127.0.0.1:27017/egg_x',
    options: {
      useNewUrlParser: true,
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      bufferMaxEntries: 0,
    },
  };

  //bcrypt加密设置
  config.bcrypt = {
    saltRounds: 10 // default 10
  };

  //validate校验设置
  config.validate = {
    convert: false,
    validateRoot: false,
  };

  //jwt设置
  config.jwt = {
    secret: 'Yang-secret',
    enable: true, // default is false
    match: '/jwt', // optional
  };

  //模板设置
  config.view = {
    mapping: {
      '.js': 'react',
      '.jsx': 'react',
    }
  };

  //个人设置
  config._local = {
    mobile: '13610161234', //超级管理员账号
    password: 'admin.', //超级管理员密码
    superAdminJwt: 'secret-super-admin', //超级管理员的jwt密钥
    adminMobile: [13600000001, 13600000002, 13600000003, 13600000004, 13600000005], //管理员账号，密码和账号相同
    adminJwt: 'secret-admin', //管理员的jwt密钥
    disableInviteCode: true, //是否关闭邀请码注册
    inviteMin: 100000, //邀请码最小值
    inviteMax: 999999, //邀请码最大值
  };

  return config;

}
