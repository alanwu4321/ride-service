var express = require('express');
var router = express.Router();
var userLib = require('../lib/_userDb')
var rideLib = require('../lib/_rideDb')

/**
 * @api {post} /rides/  Create new Ride
 * @apiName createRide
 * @apiDescription Create Rides for user 
 * @apiGroup Rides
 *
 * @apiParam {String} _id Users unique ID.
 * @apiParam {String} user Users name.
 * @apiParam {String} timestamp Time that the post is made.
 * @apiParam {String} origin Origin.
 * @apiParam {String} destination Destination.
 * @apiParam {String} datetime Datetime.
 * @apiParam {Array} note Special Notes.
 * @apiParam {Boolean} isFB Whether it is a Facebook post or not.
 * @apiParam {String} link URL to the original post.

 * @apiSuccess {String} firstname Firstname of the User.

 */

router.post('/', async function (req, res, next) {
  try {
    payload = req.body.payload
    await rideLib.initConnection()
    var newRide = rideLib.createRide(payload)
    newRide.save(function (err) {
      if(err) res.status(400).json({
        "status": "error",
        "res": err
      });
      newRide.on('es-indexed', function () {
        res.status(200).json({
          "status": "success"
        });
      });
    });
  } catch (err) {
    console.log(err)
    res.status(400).json({
      "status": "error",
      "res": err
    });
  }
});

router.get('/:ride_id', async (req, res, next) => {
  var ride_id = req.params.ride_id
  await rideLib.initConnection();
  Ride = rideLib.getRideModel();
  Ride.findById(ride_id, function (err, ride) {
    if (err) {
      res.send(err);
    }
      res.send(ride);
  });
});


/**
 * @api {get} /rides?origin=&destination=&startDate=&endDate=  Filter Rides
 * @apiName filterRides
 * @apiDescription Get rides filtered by origin, destination, startDate or endDate
 * @apiGroup Rides
 *
 * @apiParam {String} origin Origin location.
 * @apiParam {String} destination Destination location.
 * @apiParam {String} startDate Start Date.
 * @apiParam {String} endDate End Date.

 * @apiSuccess {array} Filtered rides based on query parameters

 */

router.get('/', async function (req, res, next) {
  try{
  filters = req.query
  //endDate is the target date if start date not specified then it is now to the day of the ride
  response = await rideLib.filterRides(filters.origin,filters.destination,filters.startDate,filters.endDate)
  res.send(response);
  }catch(err){
    console.log
  }
});


/**
 * @api {get} /rides/:user_id/all  Get All Rides
 * @apiName allRides
 * @apiDescription Get all rides that belong to a user 
 * @apiGroup Rides
 *
 * @apiParam {String} user_id User ID.

 * @apiSuccess {array} All rides that belong to the user 
 */

router.get('/:user_id/all', async function (req, res, next) {
  var user_id = req.params.user_id
  res.send(user_id);
});


/**
 * @api {get} /rides/:user_id/recommend  Get Recommended Rides
 * @apiName recommendRides
 * @apiDescription Get recommended rides based on user preference and currently booked rides
 * @apiGroup Rides
 *
 * @apiParam {String} user_id User ID.

 * @apiSuccess {array} Recommended Rides based on user preference and current booked rides
 */


// =========== LOGIC ==============
// 1. If booked ride AND it's odd number search the ride_id and search again with to, from and datetime of the return ride
// 2. Else fav_from, fav_to from user object and show from now to 1 week later
router.get('/:user_id/recommend', async function (req, res, next) {
  try {
    var user_id = req.params.user_id
    await userLib.initConnection('users')
    var {
      fav_origin,
      fav_destination,
      booked
    } = await userLib.findUserByID(userLib.getUser(), user_id)
    console.log(fav_origin, fav_destination, booked)
    var filteredRides = async () => {
      if (booked.length > 0) {
        //grab the last one's Ride _id if there is booked rides
        var {
          _source
        } = await rideLib.getRidebyID(booked[booked.length - 1])
        tempDate = new Date(_source.datetime)
        tempDate.setDate(tempDate.getDate()+7);
        predictReturnDate = tempDate.toISOString().replace(/.000(.*)$/,"")
        tempResult = await rideLib.filterRides(_source.destination, _source.origin, _source.datetime, predictReturnDate);
        return (tempResult.length == 0) ? await rideLib.filterRides(fav_origin, fav_destination) : tempResult;
      } else {
        console.log("no date filter")
        return await rideLib.filterRides(fav_origin, fav_destination);
      }
    }
    res.status(200).json({
      "status": "success",
      "res": await filteredRides()
    });
  } catch (err) {
    res.status(400).json({
      "status": "error",
      "res": err
    });
  }
});


/**
 * @api {get} /rides/:user_id/all  Get All Rides
 * @apiName allRides
 * @apiDescription Get all rides that belong to a user 
 * @apiGroup Rides
 *
 * @apiParam {String} user_id User ID.

 * @apiSuccess {array} All rides that belong to the user 
 */

router.get('/:user_id/all', async function (req, res, next) {
  var user_id = req.params.user_id
  res.send(user_id);
});


/**
 * @api {get} /rides/:user_id/upcoming  Get Upcomming Rides
 * @apiName upcomingRides
 * @apiDescription Get upcoming rides for a user
 * @apiGroup Rides
 *
 * @apiParam {String} user_id User ID.

 * @apiSuccess {array} Upcomming rides for a user
 */


// GET upcoming user array of rides 
router.get('/:user_id/upcoming', async function (req, res, next) {
  try{
  var user_id = req.params.user_id
  await userLib.initConnection('users')
  var {
    fav_origin,
    fav_destination,
    booked
  } = await userLib.findUserByID(userLib.getUser(), user_id)
  console.log(booked)
  var filteredRides = async () => {
    if (booked.length > 0) {
      //grab the last one's Ride _id if there is booked rides
      return await rideLib.getRidebyIDs(booked)
    }
  }

  res.status(200).json({
    "status": "success",
    "res": await filteredRides()
  });
}catch(err){
  res.status(400).json({
    "status": "error",
    "res": err
  });

}
});

module.exports = router;