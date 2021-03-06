const Service = require('egg').Service;

class AuthorityService extends Service {
  async verifyAuthority(mobile) {
    const { ctx } = this;
    const condition = { mobile: mobile };
    const user = await ctx.model.User.findOne(condition);
    if(!user) {
      ctx.helper.response(ctx, 1, '没有权限！');
      return;
      // ctx.throw(404, '权限查找出错！');
    }
    return user.authority;
  }
}

module.exports = AuthorityService;
