import { Router } from 'express';
import Event from '../../models/Event';
import User from '../../models/User';
import SubCategory from '../../models/SubCategory';
import Category from '../../models/Category';
import Language from '../../models/Language';
import BroadCast from '../../models/BroadCast';
import Feature from '../../models/Feature';
import axios from 'axios';
import config from '../../config';
import logger from '../../middleware/logger';

var mongo = require('mongodb');
const router = Router();

const { ANT_URL } = config;

const configHeader = {
  headers: {
    'Content-Type': 'application/json',
  },
};

router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    if (!events) throw Error('No events exist');

    // res.status(200).send({
    //   data: events
    // });

    res.json(events);
  } catch (e) {
    logger.error('event get error', e.message);
    res.status(400).json({ msg: e.message });
  }
});

router.post('/add', async (req, res) => {
  const {
    category,
    city,
    country,
    description,
    name,
    state,
    subCat,
    timeZone,
  } = req.body;

  try {
    const event = await Event.findOne({ name });
    if (event) throw Error('Event name already exists');

    const cat = await Category.findOne({ name: category });
    if (!cat) throw Error('Category does not exist');

    const sub = await SubCategory.findOne({ subCategory: subCat });
    if (!sub) throw Error('SubCategory does not exist');

    const sub2 = await SubCategory.findOne({ category, subCategory: subCat });
    if (!sub2) throw Error('Category and sub category not matched');

    const newEvent = new Event({
      name,
      description,
      category,
      subCat,
      country,
      city,
      state,
      timeZone,
    });
    const savedEvent = await newEvent.save();
    if (!savedEvent) throw Error('Something went wrong saving the event');

    res.status(200).json(savedEvent);
  } catch (e) {
    logger.error('event add error', e.message);
    res.status(400).json({ msg: e.message });
  }
});

router.post('/delete', async (req, res) => {
  const { id } = req.body;

  try {
    const item = await Event.findById(id);
    if (!item) throw Error('No Event found');
    const removed = await item.remove();
    if (!removed)
      throw Error('Something went wrong while trying to delete the event');

    res.status(200).json({ success: true });
  } catch (e) {
    logger.error('event delete error', e.message);
    res.status(400).json({ msg: e.message });
  }
});

router.post('/edit', async (req, res) => {
  const {
    id,
    category,
    city,
    country,
    description,
    name,
    state,
    subCat,
    timeZone,
  } = req.body;

  try {
    const event = await Event.findById(id);
    if (!event) throw Error('Event ID does not exists');

    var o_id = new mongo.ObjectID(id);

    if (name) {
      const eventName = await Event.findOne({ _id: { $ne: o_id }, name });
      if (eventName) throw Error('Event name already exists');
    }

    if (category) {
      const cat = await Category.findOne({ name: category });
      if (!cat) throw Error('Category does not exist');
    }

    if (subCat) {
      const sub = await SubCategory.findOne({ subCategory: subCat });
      if (!sub) throw Error('SubCategory does not exist');
    }

    if (category && subCat) {
      const sub2 = await SubCategory.findOne({ category, subCategory: subCat });
      if (!sub2) throw Error('Category and sub category not matched');
    }

    const updatedEvent = await Event.updateOne(
      { _id: o_id },
      { name, description, category, subCat, country, city, state, timeZone }
    );

    if (!updatedEvent) throw Error('Something went wrong updating the event');

    res.status(200).json({ success: true });
  } catch (e) {
    logger.error('event edit error', e.message);
    res.status(400).json({ success: false, msg: e.message });
  }
});

//creating broadcast channel
router.post('/broadcastChannel', async (req, res) => {
  const { userId, eventId, language } = req.body;

  logger.info(`broadcast channel param ${JSON.stringify(req.body)}`);

  try {
    var user_id = new mongo.ObjectID(userId);
    const user = await User.findOne({ _id: user_id });
    if (!user) throw Error('User does not exist');

    var event_id = new mongo.ObjectID(eventId);
    const resEvent = await Event.findOne({ _id: event_id });
    if (!resEvent) throw Error('Event does not exist');

    const resLang = await Language.findOne({ language: language });
    if (!resLang) throw Error('Language does not exist');

    const resPop = await resEvent.populate('broadcasts').execPopulate();
    const resBroadCast = resPop.broadcasts.find((item) => item.user == userId);
    const resAnt = await axios.post(
      `${ANT_URL}/rest/v2/broadcasts/create`,
      {},
      configHeader
    );
    if (resAnt.data && resAnt.data.streamId) {
      if (resBroadCast) {
        const delRes = await axios.delete(
          `${ANT_URL}/rest/v2/broadcasts/${resBroadCast.streamId}`
        );
        if ((delRes.status = 200)) {
          console.log('delete stream ID', resBroadCast.streamId);
          await BroadCast.deleteOne({ streamId: resBroadCast.streamId });
        }
      }
      const newBroadcast = new BroadCast({
        streamId: resAnt.data.streamId,
        user: userId,
        language,
      });
      const resNewBroadcast = await newBroadcast.save();
      if (!resNewBroadcast)
        throw Error('Something went wrong saving the broadcast');

      const updatedEvent = await Event.updateOne(
        { _id: eventId },
        { $push: { broadcasts: resNewBroadcast._id } }
      );
      if (!updatedEvent) throw Error('Something went wrong updating the event');
    }
    res.status(200).json({ data: resAnt.data });
  } catch (e) {
    logger.error('broadcast channel error', e.message);
    res.status(400).json({ msg: e.message });
  }
});

router.post('/startBroadcast', async (req, res) => {
  const { streamId, selectedEvent } = req.body;
  logger.info(`startBroadcast channel streamId ${streamId}`);

  try {
    var o_id = new mongo.ObjectID(streamId);
    const updated = await BroadCast.updateOne(
      { streamId: o_id },
      { eventId: selectedEvent },
      { isBroadcasting: true }
    );
    if (!updated) throw Error('Something went wrong updating the broadcast');
    res.status(200).json({ success: true });
  } catch (e) {
    logger.error('start broadcast error', e.message);
    res.status(400).json({ success: false, msg: e.message });
  }
});

router.post('/stopBroadcast', async (req, res) => {
  const { streamId, selectedEvent } = req.body;
  logger.info(`stopBroadcast channel streamId ${streamId}`);

  try {
    var o_id = new mongo.ObjectID(streamId);
    const updated = await BroadCast.updateOne(
      { streamId: o_id },
      { isBroadcasting: false }
    );
    if (!updated) throw Error('Something went wrong updating the broadcast');
    res.status(200).json({ success: true });
  } catch (e) {
    logger.error('stop broadcast error', e.message);
    res.status(400).json({ success: false, msg: e.message });
  }
});

router.post('/getBroadcasts', async (req, res) => {
  const { category, language } = req.body;
  try {
    if (category) {
      const resCat = await Category.findOne({ name: category });
      if (!resCat) throw Error('Category does not exist');
    }

    const resLang = await Language.findOne({ language });
    if (!resLang) throw Error('Language does not exist');

    let data = [];
    const broadcasts = await BroadCast.find({ isBroadcasting: true, language });
    for (let i = 0; i < broadcasts.length; i++) {
      const res = category
        ? await Event.findOne({ broadcasts: broadcasts[i]._id, category })
        : await Event.findOne({ broadcasts: broadcasts[i]._id });
      const isDuplicated = data.find(
        (event) => event._id == res._id.toString()
      );

      if (!isDuplicated && res) {
        const resPop = await res
          .populate({
            path: 'broadcasts',
            model: 'BroadCast',
            match: { isBroadcasting: true },
            populate: {
              path: 'user',
              model: 'User',
            },
          })
          .execPopulate();

        data.push(resPop);
      }
    }
    res.json(data);
  } catch (e) {
    logger.error('get broadcasts error', e.message);
    res.status(400).json({ msg: e.message });
  }
});

router.post('/getBroadcastStatus', async (req, res) => {
  const { streamId } = req.body;
  try {
    const resAnt = await axios.get(`${ANT_URL}/rest/v2/broadcasts/${streamId}`);
    if (resAnt.data) {
      logger.info(`broadcast object ${JSON.stringify(resAnt.data)}`);
      let o_id = new mongo.ObjectID(streamId);
      await BroadCast.updateOne(
        { streamId: o_id },
        { isBroadcasting: resAnt.data.status == 'finished' ? false : true }
      );
      res.json({ status: resAnt.data.status == 'finished' ? false : true });
    } else {
      res.json({ status: false });
    }
  } catch (e) {
    logger.error('get broadcast status error', e.message);
    res.status(400).json({ msg: e.message });
  }

  // const max = 4
  // try {
  //   const resAnt = await axios.get(`${ANT_URL}/rest/v2/broadcasts/count`)
  //   if(resAnt.data){
  //     logger.info(`broadcast count ${JSON.stringify(resAnt.data)}`)
  //     let size = resAnt.data.number
  //     let offset = 0
  //     let quo = Math.floor(size/max);
  //     let rem = size % max;
  //     logger.info(`broadcast block ${quo} broadcast rem ${rem}`)

  //     if(rem > 0){
  //       let resBroadcastList = await axios.get(`${ANT_URL}/rest/v2/broadcasts/list/${quo * max}/${rem}`)
  //       logger.info(`broadcast list ${JSON.stringify(resBroadcastList.data)}`)
  //       if(resBroadcastList.data){
  //         let filterResult = resBroadcastList.data.find(data => data.streamId == streamId)
  //         if(filterResult){
  //           logger.info(`broadcast filter result ${JSON.stringify(filterResult)}`)
  //           let o_id = new mongo.ObjectID(streamId);
  //           await BroadCast.updateOne({'streamId': o_id}, {isBroadcasting : filterResult.status == "finished" ? false : true})
  //           res.json({status: filterResult.status == "finished" ? false : true});
  //           return
  //         }
  //       }
  //     }

  //     for(let i = 0; i < quo; i++){
  //       offset = i * max
  //       let resBroadcastList = await axios.get(`${ANT_URL}/rest/v2/broadcasts/list/${offset}/${max}`)
  //       if(resBroadcastList.data){
  //         let filterResult = resBroadcastList.data.find(data => data.streamId == streamId)
  //         if(filterResult){
  //           logger.info(`broadcast filter result ${JSON.stringify(filterResult)}`)
  //           let o_id = new mongo.ObjectID(streamId);
  //           await BroadCast.updateOne({'streamId': o_id}, {isBroadcasting : filterResult.status == "finished" ? false : true})
  //           res.json({status: filterResult.status == "finished" ? false : true});
  //           return
  //         }
  //       }
  //     }
  //   }
  //   res.json({status: false});
});

//Feature
router.post('/getFeatures', async (req, res) => {
  try {
    const features = await Feature.find()
      .populate({
        path: 'broadcasts',
        model: 'BroadCast',
        populate: {
          path: 'user',
          model: 'User',
        },
      })
      .exec();
    if (!features) throw Error('No Feature exist');
    res.json(features);
  } catch (e) {
    logger.error('get features error', e.message);
    res.status(400).json({ msg: e.message });
  }
});

router.post('/addFeature', async (req, res) => {
  try {
    const {
      userId,
      language,
      category,
      subCat,
      name,
      description,
      country,
      city,
      state,
      timeZone,
    } = req.body;
    var feature = new Feature();
    var broadcast = new BroadCast();
    broadcast.user = userId;
    broadcast.language = language;
    const resBroadcast = await broadcast.save();
    feature.broadcasts.push(resBroadcast._id);
    feature.category = category;
    feature.subCat = subCat;
    feature.name = name;
    feature.description = description;
    feature.country = country;
    feature.city = city;
    feature.state = state;
    feature.timeZone = timeZone;
    const newFeature = await feature.save();
    res.json(newFeature);
  } catch (e) {
    logger.error('get features error', e.message);
    res.status(400).json({ msg: e.message });
  }
});

export default router;
