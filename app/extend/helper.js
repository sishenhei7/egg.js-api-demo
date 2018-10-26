module.exports = {
  generateJWT(mobile) {
    const { ctx } = this;
    return ctx.app.jwt.sign({
      data: {
        mobile: mobile
      },
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)
    }, ctx.app.config.jwt.secret);
  },

  generateAdminJWT(mobile) {
    const { ctx } = this;
    return ctx.app.jwt.sign({
      data: {
        mobile: mobile
      },
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)
    }, ctx.app.config._local.adminJwt);
  },

  generateSuperAdminJWT(mobile) {
    const { ctx } = this;
    return ctx.app.jwt.sign({
      data: {
        mobile: mobile
      },
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)
    }, ctx.app.config._local.superAdminJwt);
  },

  verifyJWT(token, mobile, authority) {
    const { ctx } = this;
    let secretKey = ctx.app.config.jwt.secret;
    if(!token) {
      if(authority != 'admin' || authority != 'superAdmin') {
        ctx.helper.response(ctx, -1, 'adminToken不能为空！');
        return;
        // ctx.throw(404, 'adminToken不能为空！');
      } else if(authority == 'superAdmin') {
        ctx.helper.response(ctx, -1, 'superAdminToken不能为空！');
        return;
        // ctx.throw(404, 'superAdminToken不能为空！');
      } else {
        ctx.helper.response(ctx, -1, 'token不能为空！');
        return;
        // ctx.throw(404, 'token不能为空！');
      }
    }
    if(authority == 'admin') {
      secretKey = ctx.app.config._local.adminJwt;
    } else if(authority == 'superAdmin') {
      secretKey = ctx.app.config._local.superAdminJwt;
    }
    const decoded = ctx.app.jwt.verify(token, secretKey);
    if(!decoded) {
      ctx.helper.response(ctx, 2, 'token已失效！');
      return;
      // ctx.throw(404, 'token已失效！');
    }
    if(decoded.data.mobile != mobile) {
      ctx.helper.response(ctx, -1, 'token错误！');
      return;
      // ctx.throw(404, 'token错误！');
    }
  },

  success({ ctx, nickname = null, res = null, token = null, adminToken = null, superAdminToken = null, msg = '请求成功'}) {
    ctx.body = {
      code: 0,
      data: res,
      token: token,
      nickname: nickname,
      adminToken: adminToken,
      superAdminToken: superAdminToken,
      msg
    };
    ctx.status = 200;
  },

  /*
  ** 参数错误：-1
  ** 权限不足：1
  ** 失效：2
  ** 没找到：3
  ** 已存在：4
  ** 已被使用：5
  */
  response(ctx, code , msg) {
    ctx.body = {
      code: code,
      msg: msg
    };
    ctx.status = 200;
  },

  verifySuperAdmin(mobile, psw) {
    const { ctx } = this;
    return mobile == ctx.app.config._local.mobile && psw == ctx.app.config._local.password;
  },

  verifyAdmin(mobile, psw) {
    const { ctx } = this;
    mobile = Number(mobile);
    return ctx.app.config._local.adminMobile.indexOf(mobile) !== -1 && mobile == psw;
  },

  verifyAdminOrSuperAdmin(mobile, psw) {
    return this.verifySuperAdmin(mobile, psw) || this.verifyAdmin(mobile, psw);
  },

  //decode-invite code()
  decodeStr(str) {
    const length = str.length;
    const lastTwoChars = str.slice(-2);
    return (lastTwoChars + str).slice(0, length);
  }

}
