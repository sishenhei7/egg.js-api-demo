const Service = require('egg').Service;

class ArticleService extends Service {
    // api==========================================
    async findAllArticles(params) {
        const { ctx } = this;
        const { search, page, pageSize } = params;
        let articles = [];
        if(page) {
            if(search) {
                articles = await this._fuzzySearch(search);
            } else {
                articles = await this._pagedSearch(page, pageSize);
            }
        } else {
            articles = await this._findAll();
        }
        if(!articles) {
            ctx.throw(404, '找不到文章！');
        }
        return articles;
    }

    async createOneArticle(params) {
        const { ctx } = this;
        const article = await this._findTitle(params.title);
        if(article) {
            ctx.throw(404, '文章已存在！');
        }
        return this._create(params);
    }

    async findOneArticle(id) {
        const { ctx } = this;
        const article = await this._find(id);
        if(!article) {
            ctx.throw(404, '没有找到文章！');
        }
        return article;
    }

    async updateOneArticle(id, params) {
        const { ctx } = this;
        //校验id
        let article = await this._find(id);
        if(!article) {
            ctx.throw(404, '没有找到文章！');
        }
        //校验title
        article = await this._findTitle(params.title, id);
        if(article) {
            ctx.throw(404, '文章标题已存在！');
        }
        return this._update(id, params);
    }

    async deleteOneArticle(id) {
        const { ctx } = this;
        const article = await this._find(id);
        if(!article) {
            ctx.throw(404, '没有找到文章！');
        }
        return this._delete(id);
    }

    // common==========================================
    async _create(params) {
        return this.ctx.model.Article.create(params);
    }

    async _delete(id) {
        const condition = { _id: id };
        return this.ctx.model.Article.findOneAndRemove(condition);
    }

    async _update(id, params) {
        const condition = { _id: id };
        const query = { $set: params };
        return this.ctx.model.Article.findOneAndUpdate(condition, query);
    }

    async _find(id) {
        const condition = { _id: id };
        return this.ctx.model.Article.findOne(condition);
    }

    async _findTitle(title, id) {
        let condition = { title: title };
        if(id) {
            condition = { title: title, _id: { $ne: id }};
        }
        return this.ctx.model.Article.findOne(condition);
    }

    async _findAll() {
        return this.ctx.model.Article.find();
    }

    //模糊查询(仅限标题)
    async _fuzzySearch(search) {
        const condition = { title: { $regex: search, $options: 'i' } };
        const sortCondition = { createdAt: -1 };
        const res = await this.ctx.model.Article.find(condition).sort(sortCondition);
        return res;
    }

    //分页查询
    async _pagedSearch(page = 1, pageSize = 10) {
        const skip = (page - 1) * pageSize;
        const sortCondition = { createdAt: -1 };
        const res = await this.ctx.model.Article.find().skip(skip).limit(pageSize).sort(sortCondition);
        return res;
    }
}

module.exports = ArticleService;




