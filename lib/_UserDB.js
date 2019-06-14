mongoose = require('mongoose'),
    Schema = mongoose.Schema;

module.exports = {
    initConnection: async (db) => {
        var mongo_host = (process.env.MONGO_SERVICE_HOST || 'localhost');
        var mongo_port = (process.env.MONGO_SERVICE_PORT || 27017);
        return new Promise(function (resolve, reject) {
            mongoose.connect(`mongodb://${mongo_host}:${mongo_port}/${db}`, function (err) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                console.log("connection established")
                resolve(true)
            });
        })
    },
    createUser: (payload) => {
        var userSchema = new Schema({
            "name": {
                type: String
            },
            "fav_origin": {
                type: String
            },
            "fav_destination": {
                type: String
            },
            "booked": {
                type: Array
            },
        });
        var users = mongoose.models.users || mongoose.model('users', userSchema);
        return new users(payload);
    },
    getUser: () => {
        var userSchema = new Schema({
            "name": {
                type: String
            },
            "fav_origin": {
                type: String
            },
            "fav_destination": {
                type: String
            },
            "booked": {
                type: Array
            },
        });
        return mongoose.models.users || mongoose.model('users', userSchema);
    },
    findUserByID: (User, user_id) => {
        return new Promise((resolve, reject) => {
            User.findById(user_id, function (err, user) {
                if (err) {
                    reject(err)
                }
                    resolve(user)
            });
        })
    }
}