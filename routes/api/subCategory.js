import { Router } from 'express';
import Category from '../../models/Category';
import SubCategory from '../../models/SubCategory';
import logger from '../../middleware/logger';
var mongo = require('mongodb');
const router = Router();


router.get('/', async (req, res) => {
  try {
    const categories = await SubCategory.find();
    if (!categories) throw SubCategory('No events exist');
    res.json(categories);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});



router.post('/create_sub_category', async (req, res) => {
  const { category, subCategory } = req.body;

  try {
    const categoryRes = await Category.findOne({ name: category });
    if (!categoryRes) throw Error('Category does not exist');

    const cat = await SubCategory.findOne({ subCategory });
    if (cat) throw Error('SubCategory already exists');

    const newCategory = new SubCategory({
      category,
      subCategory
    });
    const savedCategory = await newCategory.save();
    if (!savedCategory) throw Error('Something went wrong saving the item');

    res.status(200).json(savedCategory);
  } catch (e) {
    logger.error('subcategory create error', e.message)
    res.status(400).json({ msg: e.message });
  }
});

router.post('/delete', async (req, res) => {
  const { id } = req.body;

  try {
    const item = await SubCategory.findById(id);
    if (!item) throw Error('No Event found');
    const removed = await item.remove();
    if (!removed)
      throw Error('Something went wrong while trying to delete the subcategory');
 
    res.status(200).json({ success: true });
  } catch (e) {
    logger.error('subcategory delete error', e.message)
    res.status(400).json({ msg: e.message });
  }
});

router.post('/edit', async (req, res) => {
  const { id, newName, category } = req.body;

  try {
    var o_id = new mongo.ObjectID(id);
    const item = await SubCategory.findById(id);
    if (!item) throw Error('No SubCategory found');
    await SubCategory.updateOne({'_id': o_id}, {subCategory: newName, category})
    res.status(200).json({ success: true });
  } catch (e) {
    logger.error('subcategory edit error', e.message)
    res.status(400).json({ success : false, msg: e.message });
  }
});


export default router;
