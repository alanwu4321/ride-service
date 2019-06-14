var rideLib = require('../lib/_RideDB')
mongoose = require('mongoose'),

module.exports = {
    getRideByID: async (req, res, next) => {
    var ride_id = req.params.ride_id
    await rideLib.initConnection();
    var Ride = mongoose.models.ride 
    Ride.findById(ride_id, function (err, user) {
      if (err) {
          reject(err)
      }
          resolve(ride)
    });


    res.send(response);
  }

}