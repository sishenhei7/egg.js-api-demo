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

  verifyJWT(token) {
    const { ctx } = this;
    if(!token) {
      ctx.throw(404, 'token不能为空！');
    }
    const decoded = ctx.app.jwt.verify(token, ctx.app.config.jwt.secret);
    if(!decoded) {
      ctx.throw(404, 'token已失效！');
    }
  },

  success({ ctx, res = null, token = null, msg = '请求成功'}) {
    ctx.body = {
      code: 0,
      data: res,
      token: token,
      msg
    };
    ctx.status = 200;
  }
}
