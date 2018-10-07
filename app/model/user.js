module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const UserSchema = new Schema({
        mobile: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        nickname: {
            type: String,
            default: 'default'
        },
        createAt: {
            type: Date,
            default: Date.now
        },
        authority: {
            type: String,
            default: 'user'
        },
        postTimes: {
            type: Number,
            default: 3
        }
    });

    return mongoose.model('User', UserSchema);
}
