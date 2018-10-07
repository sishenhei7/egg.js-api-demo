const Controller = require('egg').Controller;

class InviteCodeController extends Controller {
  async index() {
    const { ctx, service } = this;
    //设置响应
    const res = await service.inviteCode.findAll();
    const msg = '邀请码查询成功！';
    ctx.helper.success({ ctx, res, msg });
  }
}

module.exports = InviteCodeController;
