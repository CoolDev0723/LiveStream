import { Router } from 'express';
import User from '../../models/User';
import SubscribedUser from '../../models/SubscribedUser';
import logger from '../../middleware/logger';

var mongo = require('mongodb');
const router = Router();

router.post('/addUserMailAddress', async (req, res) => {
  const { email } = req.body;
  try {
    const emailRes = await SubscribedUser.findOne({ email });
    if (emailRes){
      //Email already exists
      res.status(200).json({exist:1});
    } else {
      const newSubscribedUser = new SubscribedUser({email});
      const resSubscribedUser = await newSubscribedUser.save();
      if (!resSubscribedUser){
        //Something went wrong adding the user
        res.status(200).json({error:1});
      } else {
        res.status(200).json({success:1});
       }
    }
  } catch (e) {
    logger.error('add user error', e.message)
    res.status(400).json({ msg: e.message });
  }
});

export default router;
