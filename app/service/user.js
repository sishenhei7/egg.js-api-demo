const Service = require('egg').Service;

class UserService extends Service {
    // api==========================================
    async verifyMobile(mobile) {
        const user = await this._find(mobile);
        if(!user) {
            return false;
        } else {
            return true;
        }
    }

    async createOneUser(mobile, password) {
        const { ctx } = this;
        const hasMobile = await this.verifyMobile(mobile);
        if(hasMobile) {
            ctx.throw(404, '用户已存在！');
        }
        password = await this.ctx.genHash(password);
        return this._create(mobile, password);
    }

    async deleteOneUser(mobile) {
        const { ctx } = this;
        const hasMobile = this.verifyMobile(mobile);
        if(!hasMobile) {
            ctx.throw(404, '没有找到用户！');
        }
        return this._delete(mobile);
    }

    async updateOneUser(mobile, password) {
        const { ctx } = this;
        const hasMobile = this.verifyMobile(mobile);
        if(!hasMobile) {
            ctx.throw(404, '没有找到用户！');
        }
        return this._update(mobile, password);
    }

    async findOneUser(mobile) {
        const { ctx } = this;
        const user = await this._find(mobile);
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

    // common==========================================
    async _create(mobile, password) {
        const doc = {
            mobile: mobile,
            password: password
        };
        return this.ctx.model.User.create(doc);
    }

    async _delete(mobile) {
        const condition = { mobile: mobile };
        return this.ctx.model.User.findOneAndRemove(condition);
    }

    async _update(mobile, password) {
        const condition = { mobile: mobile };
        const query = { $set: { password: password }};
        return this.ctx.model.User.findOneAndUpdate(condition, query);
    }

    async _find(mobile) {
        const condition = { mobile: mobile };
        return this.ctx.model.User.findOne(condition);
    }

    async _findAll() {
        return this.ctx.model.User.find();
    }
}

module.exports = UserService;

