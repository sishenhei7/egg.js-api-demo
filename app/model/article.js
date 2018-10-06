module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const ArticleSchema = new Schema({
        title: {
            type: String,
            unique: true,
            required: true
        },
        author: {
            type: String,
            default: 'admin'
        },
        tag: {
            type: String,
            required: true
        },
        summary: {
            type: String
        },
        content: {
            type: String,
            required: true
        },
        createAt: {
            type: Date,
            default: Date.now
        }
    });

    return mongoose.model('Article', ArticleSchema);
}
