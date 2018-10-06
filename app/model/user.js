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
        createAt: {
            type: Date,
            default: Date.now
        }
    });

    return mongoose.model('User', UserSchema);
}
