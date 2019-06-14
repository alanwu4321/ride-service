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
    initConnection: async () => {
        var mongo_host = (process.env.MONGO_SERVICE_HOST || 'localhost');
        var mongo_port = (process.env.MONGO_SERVICE_PORT || 27017);
        return new Promise(function (resolve, reject) {
            mongoose.connect(`mongodb://${mongo_host}:${mongo_port}/rides`, function (err) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                console.log("connection established")
                resolve(true)
            });
        })
    },
    getRideModel: () => {
        var rideSchema = new Schema({
            "_id": {type: String, es_indexed:true},
            "user": {type: String},
            "timestamp": {type: String},
            "message": {type: String},
            "intent": {type: String},
            "origin": {type: String, es_indexed:true},
            "destination": {type: String, es_indexed:true},
            "datetime": {type: String, es_indexed:true},
            "note": {type: Object},
            "link": {type: String}
        });
        rideSchema.plugin(mongoosastic,{
            esClient: ESclient
          });
        return mongoose.models.ride || mongoose.model('ride', rideSchema);
    },
    createRide: (payload) => {
        var rideSchema = new Schema({
            "_id": {type: String, es_indexed:true},
            "user": {type: String},
            "timestamp": {type: String},
            "message": {type: String},
            "intent": {type: String},
            "origin": {type: String, es_indexed:true},
            "destination": {type: String, es_indexed:true},
            "datetime": {type: String, es_indexed:true},
            "note": {type: Object},
            "link": {type: String}
        });
        rideSchema.plugin(mongoosastic,{
            esClient: ESclient
          });
        var ride = mongoose.models.ride || mongoose.model('ride', rideSchema);
        return new ride(payload);
    },
    getRidebyID: (ride_id) => {
        return new Promise(function (resolve, reject) {
            ESclient.search({
                index: 'rides',
                body: {
                    "query": {
                      "terms": {
                        "_id": [ride_id]
                      }
                    }
                  }
            }).then(res => {
                resolve(res.body.hits.hits[0])
            }).catch(err => {
                reject(err)
            })
        })
    }, getRidebyIDs: (ride_ids) => {
        return new Promise(function (resolve, reject) {
            ESclient.search({
                index: 'rides',
                body: {
                    "query": {
                      "terms": {
                        "_id": ride_ids
                      }
                    }
                  }
            }).then(res => {
                resolve(res.body.hits.hits)
            }).catch(err => {
                reject(err)
            })
        })
    },
    filterRides: (origin, destination,startDate = "now", endDate = "now+1w") => {
        if (origin == "" || destination == "") {
            origin = "waterloo"
            destination = "toronto"
        }
        if (startDate == "" || endDate == "") {
            startDate = "now"
            destinendDateation = "now+1w"
        }
        return new Promise(function (resolve, reject) {
            ESclient.search({
                index: 'rides',
                body: {
                    "query": {
                        "constant_score": {
                            "filter": {
                                "bool": {
                                    "must": [{
                                            "match": {
                                                "origin": origin
                                            }
                                        },
                                        {
                                            "match": {
                                                "destination": destination
                                            }
                                        },
                                        {
                                            "range": {
                                                "datetime": {
                                                    "lte": endDate,
                                                    "gte": startDate
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    },"sort" : [
                        { "datetime" : {"order" : "desc"}}
                        ]
                }
            }).then(res => {
                resolve(res.body.hits.hits)
            }).catch(err => {
                reject(err)
            })
        })

    }
}