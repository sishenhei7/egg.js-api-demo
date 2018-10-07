const Service = require('egg').Service;

class UserService extends Service {
    // api==========================================
    async verifyMobile(mobile) {
        const user = await this._findMobile(mobile);
        if(!user) {
            return false;
        } else {
            return true;
        }
    }

    async verifyNickname(nickname) {
        const user = await this._findNickname(nickname);
        if(!user) {
            return false;
        } else {
            return true;
        }
    }

    async createOneUser(mobile, password, nickname) {
        const { ctx } = this;
        const hasMobile = await this.verifyMobile(mobile);
        if(hasMobile) {
            ctx.throw(404, '用户已存在！');
        }
        const hasNickname = await this.verifyNickname(nickname);
        if(hasNickname) {
            ctx.throw(404, '昵称已存在！');
        }
        //验证管理员和超级管理员
        let authority = 'user';
        let postTimes = 3;
        const isAdmin = ctx.helper.verifyAdmin(mobile, password);
        if(isAdmin) {
            authority = 'admin';
            postTimes = 99999;
        }
        const isSuperAdmin = ctx.helper.verifySuperAdmin(mobile, password);
        if(isSuperAdmin) {
            authority = 'superAdmin';
            postTimes = 999999;
        }
        //密码加密
        password = await ctx.genHash(password);
        return this._create(mobile, password, nickname, authority, postTimes);
    }

    async deleteOneUser(mobile) {
        const { ctx } = this;
        const hasMobile = this.verifyMobile(mobile);
        if(!hasMobile) {
            ctx.throw(404, '没有找到用户！');
        }
        return this._delete(mobile);
    }

    async updatePassword(mobile, password) {
        const { ctx } = this;
        const hasMobile = this.verifyMobile(mobile);
        if(!hasMobile) {
            ctx.throw(404, '没有找到用户！');
        }
        return this._updatePassword(mobile, password);
    }

    async findOneUser(mobile) {
        const { ctx } = this;
        const user = await this._findMobile(mobile);
        if(!user) {
            ctx.throw(404, '没有找到用户！');
        }
        return user;
    }

    async findAllUsers() {
        const { ctx } = this;
        const users = await this._findAll();
        if(!users) {
            ctx.throw(404, '找不到用户！');
        }
        return users;
    }

    async getAuthority(mobile) {
      const { ctx } = this;
      const user = await this._findMobile(mobile);
      if(!user) {
        ctx.throw(404, '权限查找出错！');
      }
      return user.authority;
    }

    async hoistToAdmin(mobile) {
      const { ctx } = this;
      const condition = { mobile: mobile };
      const query = { $set: { authority: 'admin', postTimes: 99999 }};
      const user = await ctx.model.User.findOneAndUpdate(condition, query);
      if(!user) {
        ctx.throw(404, '没有这个用户！');
      }
      return user;
    }

    async updateNickname(mobile, nickname) {
        const { ctx } = this;
        const hasMobile = this.verifyMobile(mobile);
        if(!hasMobile) {
            ctx.throw(404, '没有找到用户！');
        }
        const hasNickname = this.verifyNickname(nickname);
        if(!hasNickname) {
            ctx.throw(404, '昵称已存在！');
        }
        return this._updateNickname(mobile, nickname);
    }

    // common==========================================
    async _create(mobile, password, nickname, authority, postTimes) {
        const doc = {
            mobile: mobile,
            password: password,
            nickname: nickname,
            authority: authority,
            postTimes: postTimes
        };
        return this.ctx.model.User.create(doc);
    }

    async _delete(mobile) {
        const condition = { mobile: mobile };
        return this.ctx.model.User.findOneAndRemove(condition);
    }

    async _updatePassword(mobile, password) {
        const condition = { mobile: mobile };
        const query = { $set: { password: password }};
        return this.ctx.model.User.findOneAndUpdate(condition, query);
    }

    async _updateNickname(mobile, nickname) {
        const condition = { mobile: mobile };
        const query = { $set: { nickname: nickname }};
        return this.ctx.model.User.findOneAndUpdate(condition, query);
    }

    async _findMobile(mobile) {
        const condition = { mobile: mobile };
        return this.ctx.model.User.findOne(condition);
    }

    async _findNickname(nickname) {
        const condition = { nickname: nickname };
        return this.ctx.model.User.findOne(condition);
    }

    async _findAll() {
        return this.ctx.model.User.find();
    }

}

module.exports = UserService;

