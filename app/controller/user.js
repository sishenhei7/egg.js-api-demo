const Controller = require('egg').Controller;

const mobileAndPasswordRule = {
    mobile: {
        type: 'string',
        required: true,
        allowEmpty: false,
        format: /^[0-9]{11}$/
    },
    password: {
        type: 'string',
        required: true,
        allowEmpty: false
    }
};

const mobileAndPasswordAndTokenRule = {
    mobile: {
        type: 'string',
        required: true,
        allowEmpty: false,
        format: /^[0-9]{11}$/
    },
    password: {
        type: 'string',
        required: true,
        allowEmpty: false
    },
    token: {
        type: 'string',
        required: true,
        allowEmpty: false
    }
};

const mobileRule = {
    mobile: {
        type: 'string',
        required: true,
        allowEmpty: false,
        format: /^[0-9]{11}$/
    }
};

class UserController extends Controller {
    // api===============================================
    async test() {
        const { ctx } = this;
        const msg = '测试成功！';
        ctx.helper.success({ ctx, msg });
    }

    async index() {
        const { ctx, service } = this;
        const res = await service.user.findAllUsers();
        const msg = '查找所有用户成功！';
        ctx.helper.success({ ctx, res, msg });
    }

    async verifyLogin() {
        const { ctx } = this;
        //组装参数
        const token = ctx.request.body.token;
        //校验token
        ctx.helper.verifyJWT(token);
        //设置响应
        const msg = '登陆成功！';
        ctx.helper.success({ ctx, msg });
    }

    async signUp() {
        const { ctx, service } = this;
        //校验参数
        ctx.validate(mobileAndPasswordRule);
        //组装参数
        const params = ctx.request.body;
        //创建一个用户(这里需要加上token)
        const res = await service.user.createOneUser(params.mobile, params.password);
        const token = ctx.helper.generateJWT(params.mobile);
        //设置响应
        const msg = '注册成功！';
        ctx.helper.success({ ctx, res, token, msg });
    }

    async login() {
        const { ctx, service } = this;
        //校验参数
        ctx.validate(mobileAndPasswordRule);
        //组装参数
        const params = ctx.request.body;
        //查找password并比较
        const res = await service.user.findOneUser(params.mobile);
        const verifyPsw = await ctx.compare(params.password, res.password);
        //密码错误
        if(!verifyPsw) {
            ctx.throw(404, '密码错误！');
        }
        //设置响应
        const msg = '登录成功！';
        const token = ctx.helper.generateJWT(params.mobile);
        ctx.helper.success({ ctx, res, token, msg });
    }

    async changePassword() {
        const { ctx, service } = this;
        //校验参数
        ctx.validate(mobileAndPasswordAndTokenRule);
        //组装参数
        const params = ctx.request.body;
        //校验token
        ctx.helper.verifyJWT(params.token);
        //设置响应
        const res = await service.user.updateOneUser(params.mobile, params.password);
        const msg = '密码修改成功！';
        ctx.helper.success({ ctx, res, msg });
    }

    async deleteUser() {
        const { ctx, service } = this;
        //校验参数
        ctx.validate(mobileAndPasswordAndTokenRule);
        //组装参数
        const params = ctx.request.body;
        //校验token
        ctx.helper.verifyJWT(params.token);
        //设置响应
        const res = await service.user.deleteOneUser(params.mobile, params.password);
        const msg = '用户删除成功！';
        ctx.helper.success({ ctx, res, msg });
    }

}

module.exports = UserController;
