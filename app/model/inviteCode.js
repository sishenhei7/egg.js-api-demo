module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const InviteCodeSchema = new Schema({
        code: {
            type: String,
            unique: true,
            required: true
        }
    });

    return mongoose.model('InviteCode2', InviteCodeSchema);
}
