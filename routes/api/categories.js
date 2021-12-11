import { Router } from 'express';
import Category from '../../models/Category';
import SubCategory from '../../models/SubCategory';
import logger from '../../middleware/logger';
var mongoose = require('mongoose');

const router = Router();

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    if (!categories) throw Category('No events exist');
    res.json(categories);
  } catch (e) {
    logger.error('get category error', e.message)
    res.status(400).json({ msg: e.message });
  }
});

router.post('/create_category', async (req, res) => {
  const { name } = req.body;

  try {
    const category = await Category.findOne({ name });
    if (category) throw Error('Category already exists');

    const newCategory = new Category({
      name,
    });
    const savedCategory = await newCategory.save();
    if (!savedCategory) throw Error('Something went wrong saving the item');

    res.status(200).json(savedCategory);
  } catch (e) {
    logger.error('category create error', e.message)
    res.status(400).json({ msg: e.message });
  }
});

router.post('/delete', async (req, res) => {
  const { name } = req.body;
  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    const opts = {session, returnOriginal: false};
    await Category.deleteOne({name}, opts);
    await SubCategory.deleteMany({category : name}, opts)
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({ success: true });
  } catch (e) {
    await session.abortTransaction();
    await session.endSession();
    logger.error('category delete error', e.message)
    res.status(400).json({ msg: e.message });
  }
});

router.post('/edit', async (req, res) => {
  const { name, newName } = req.body;

  try{
    const categoryRes = await Category.findOne({name})
    if(!categoryRes){
      throw Error('Category does not exist');
    }

    const categoryRes1 = await Category.findOne({name: newName})
    if(categoryRes1){
      throw Error('Category already exists');
    }
  } catch (e) {
    logger.error('category edit error', e.message)
    res.status(400).json({ msg: e.message });
  }

  const session = await mongoose.startSession();
  try {
    await session.startTransaction();
    const opts = {session, returnOriginal: false};
    const resCat = await Category.updateOne({name}, {name: newName}, opts);
    if (!resCat) throw Error('Error updating category');
    await SubCategory.updateMany({category : name}, {category : newName}, opts)
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({ success: true });
  } catch (e) {
    await session.abortTransaction();
    await session.endSession();
    logger.error('category edit error', e.message)
    res.status(400).json({ msg: e.message });
  }
});

export default router;
