const Controller = require('egg').Controller;

const rules = {
    mobile: {
        type: 'string',
        required: true,
        allowEmpty: false,
        format: /^[0-9]{11}$/
    },
    token: {
        type: 'string',
        required: true,
        allowEmpty: false
    },
    superAdminToken: {
        type: 'string',
        required: false,
        allowEmpty: true
    },
    title: {
        type: 'string',
        required: true,
        allowEmpty: false
    },
    titleWeak: {
        type: 'string',
        required: false,
        allowEmpty: false
    },
    author: {
        type: 'string',
        required: true,
        allowEmpty: false
    },
    authorWeak: {
        type: 'string',
        required: false,
        allowEmpty: false
    },
    tag: {
        type: 'string',
        required: true,
        allowEmpty: false
    },
    tagWeak: {
        type: 'string',
        required: false,
        allowEmpty: false
    },
    summary: {
        type: 'string',
        required: true,
        allowEmpty: false
    },
    summaryWeak: {
        type: 'string',
        required: false,
        allowEmpty: false
    },
    content: {
        type: 'string',
        required: true,
        allowEmpty: false
    },
    contentWeak: {
        type: 'string',
        required: false,
        allowEmpty: false
    },
    search: {
        type: 'string',
        required: false,
        allowEmpty: true
    },
    page: {
        type: 'number',
        required: false,
        allowEmpty: true
    },
    pageSize: {
        type: 'number',
        required: false,
        allowEmpty: true
    }
};

const searchAndPageRule = {
    search: rules.search,
    page: rules.page,
    pageSize: rules.pageSize
};

const articleRule = {
    mobile: rules.mobile,
    token: rules.token,
    title: rules.title,
    tag: rules.tag,
    summary: rules.summary,
    content: rules.content
};

const articleUpdateRule = {
    mobile: rules.mobile,
    token: rules.token,
    superAdminToken: rules.superAdminToken,
    title: rules.titleWeak,
    tag: rules.tagWeak,
    summary: rules.summaryWeak,
    content: rules.contentWeak
};

const articleDestroyRule = {
    mobile: rules.mobile,
    token: rules.token,
    superAdminToken: rules.superAdminToken
}

class ArticleController extends Controller {
    // api===============================================
    async test() {
        const { ctx } = this;
        const msg = '测试成功！';
        ctx.helper.success({ ctx, msg });
    }

    //展示不需要token验证
    async index() {
        const { ctx, service } = this;
        //校验参数
        ctx.validate(searchAndPageRule);
        //组装参数（模糊、分页查询）
        const query = ctx.query;
        const res = await service.article.findAllArticles(query);
        //设置响应
        const msg = '查找文章成功！';
        ctx.helper.success({ ctx, res, msg });
    }

    //新建需要token验证
    async create() {
        const { ctx, service } = this;
        //校验参数
        ctx.validate(articleRule);
        //组装参数
        let params = ctx.request.body;
        //添加author
        const user = await service.user.findOneUser(params.mobile);
        params.author = user.nickname;
        //校验token
        ctx.helper.verifyJWT(params.token, params.mobile);
        const res = await service.article.createOneArticle(params);
        //设置响应
        const msg = '创建文章成功！';
        ctx.helper.success({ ctx, msg });
    }

    //单个展示也不需要token验证
    async show() {
        const { ctx, service } = this;
        //组装参数
        const { id } = ctx.params;
        const res = await service.article.findOneArticle(id);
        //设置响应
        const msg = '查找文章成功！';
        ctx.helper.success({ ctx, res, msg });
    }

    //修改需要验证token和昵称
    async update() {
        const { ctx, service } = this;
        //校验参数
        ctx.validate(articleUpdateRule);
        //组装参数
        const { id } = ctx.params;
        const params = ctx.request.body;
        //校验token
        ctx.helper.verifyJWT(params.token, params.mobile);
        //校验昵称
        await this.verifyNickname(params.superAdminToken, params.mobile, id);
        const res = await service.article.updateOneArticle(id, params);
        //设置响应
        const msg = '修改文章成功！';
        ctx.helper.success({ ctx, msg });
    }

    //删除需要验证token和昵称
    async destroy() {
        const { ctx, service } = this;
        //校验参数
        ctx.validate(articleDestroyRule);
        //组装参数
        const { id } = ctx.params;
        const params = ctx.request.body;
        //校验token
        ctx.helper.verifyJWT(params.token, params.mobile);
        //校验昵称
        await this.verifyNickname(params.superAdminToken, params.mobile, id);
        const res = await service.article.deleteOneArticle(id);
        //设置响应
        const msg = '删除文章成功！';
        ctx.helper.success({ ctx, msg });
    }

    // common===============================================
    // 校验昵称，超级管理员无视
    async verifyNickname(superAdminToken, mobile, id) {
        const { ctx, service } = this;
        let isSuperAdmin = false;
        let user = 'null';
        let article = null;
        if(superAdminToken) {
            isSuperAdmin = ctx.helper.verifyJWT(superAdminToken, mobile, 'superAdmin');
        }
        if(!isSuperAdmin) {
            user = await service.user.findOneUser(mobile);
            article = await service.article.findOneArticle(id);
            if(user.nickname != article.author) {
                ctx.helper.response(ctx, 1, '这篇文章不是您写的，您没有权限修改！');
                return;
                // ctx.throw(404, '这篇文章不是您写的，您没有权限修改！');
            }
        }
    }
}

module.exports = ArticleController;

