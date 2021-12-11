import { Router } from 'express';
import User from '../../models/User';
import BroadCast from '../../models/BroadCast';
import Event from '../../models/Event';
import Rate from '../../models/Rate';
import logger from '../../middleware/logger';

var mongo = require('mongodb');
const router = Router();

router.get('/', async (req, res) => {
  try {
    let userRes = []
    const users = await User.find({ 'type': 'broadcaster' });
    if (!users) throw Error('No users exist');
    const broadcasts = await BroadCast.find({isBroadcasting : true})
    let broadcastIds = []
    for(let i=0 ; i<broadcasts.length; i++){
      broadcastIds.push(broadcasts[i].user.toString())
    }
    for(let i=0 ; i<users.length; i++){
      if(broadcastIds.includes(users[i]._id.toString())){
        userRes.push({_id: users[i]._id, name: users[i].name, email: users[i].email, 
          phone: users[i].phone, country: users[i].country, timezone: users[i].timezone, type: users[i].type,
          register_date: users[i].register_date, status : true})
      }else{
        userRes.push({_id: users[i]._id, name: users[i].name, email: users[i].email, 
          phone: users[i].phone, country: users[i].country, timezone: users[i].timezone, type: users[i].type,
          register_date: users[i].register_date, status : false})
      }
    }
    res.json(userRes);
  } catch (e) {
    logger.error('get users error', e.message)
    res.status(400).json({ msg: e.message });
  }
});

router.get('/rate', async (req, res) => {
  try {
    const { eventId, userId} = req.query;
    var o_eventId = new mongo.ObjectID(eventId);
    const eventRes = await Event.findOne({ '_id' : o_eventId });
    if (!eventRes) throw Error('Event does not exist');

    var o_id = new mongo.ObjectID(userId);
    const userRes = await User.findOne({ '_id' : o_id });
    if (!userRes) throw Error('User does not exist');

    const rateRes = await Rate.findOne({eventId : o_eventId, userId: o_id})
    if (!rateRes) throw Error('Rate does not exist');
    res.json(rateRes);
  } catch (e) {
    logger.error('get rate error', e.message)
    res.status(400).json({ msg: e.message });
  }
});

router.post('/addUser', async (req, res) => {
  const { name, email, phone, country, timezone, type, broadcast} = req.body;

  try {
    const emailRes = await User.findOne({ email });
    if (emailRes) throw Error('Email already exists');

    const phoneRes = await User.findOne({ phone });
    if (phoneRes) throw Error('Phone number already exists');

    const newUser = new User({
      name, email, phone, country, timezone, type, broadcast
    });
    const resUser = await newUser.save();
    if (!resUser) throw Error('Something went wrong adding the user');

    res.status(200).json(resUser);
  } catch (e) {
    logger.error('add user error', e.message)
    res.status(400).json({ msg: e.message });
  }
});

router.post('/rateUser', async (req, res) => {
  const { eventId, userId, rating } = req.body;

  try {
    var o_eventId = new mongo.ObjectID(eventId);
    const eventRes = await Event.findOne({ '_id' : o_eventId });
    if (!eventRes) throw Error('Event does not exist');

    var o_id = new mongo.ObjectID(userId);
    const userRes = await User.findOne({ '_id' : o_id });
    if (!userRes) throw Error('User does not exist');

    const rateRes = await Rate.findOne({eventId : o_eventId, userId: o_id})
    if(rateRes){
      let ratingValue = ""
      if(rateRes.rating){
        ratingValue = ((parseFloat(rating) + parseFloat(rateRes.rating))/2).toFixed(2).toString()
      }else{
        ratingValue = rating
      }
      await Rate.updateOne({'_id': rateRes._id}, { rating: ratingValue })
    }else{
      const newRate = new Rate({
        eventId, userId, rating
      });
      const resRate = await newRate.save();
      if (!resRate) throw Error('Something went wrong adding the rate');
    }
    res.status(200).json({success : true});
   
  } catch (e) {
    logger.error('rate user error', e.message)
    res.status(400).json({ success : false, msg: e.message });
  }
});

export default router;
