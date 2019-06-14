mongoose = require('mongoose'),
    Schema = mongoose.Schema;
mongoosastic = require('mongoosastic')
const {
    Client
} = require('@elastic/elasticsearch')
var es_host = (process.env.ES_SERVICE_HOST || 'localhost');
var es_port = (process.env.ES_SERVICE_PORT || 9200);
const ESclient = new Client({
    node: `http://${es_host}:${es_port}`
})

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
  

}