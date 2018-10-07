const Service = require('egg').Service;
const base64 = require('base-64');

class InviteCodeService extends Service {
  async getCode(code) {
    const condition = { code: code };
    const codeItem = await this.ctx.model.InviteCode.findOne(condition);
    if(codeItem) {
      this.ctx.throw(404, '邀请码已经被使用！');
    }
  }

  async findAll() {
    const codes = await this.ctx.model.InviteCode.find();
    return codes;
  }

  async writeCode(code) {
    const doc = {
        code: code
    };
    await this.ctx.model.InviteCode.create(doc);
  }

  async verifyCode(code) {
    const { ctx } = this;
    code = ctx.helper.decodeStr(code);
    const decode = base64.decode(code);
    if(decode >= ctx.app.config._local.inviteMin && decode <= ctx.app.config._local.inviteMax) {
      await this.getCode(code);
    } else {
      ctx.throw(404, '邀请码错误！');
    }
  }
}

module.exports = InviteCodeService;
