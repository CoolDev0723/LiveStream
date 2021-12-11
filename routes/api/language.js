import { Router } from 'express';
import Language from '../../models/Language';
import logger from '../../middleware/logger';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const langs = await Language.find();
    if (!langs) throw Error('No events exist');
    res.json(langs);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});



router.post('/addLanguage', async (req, res) => {
  const { language } = req.body;

  try {
    const lang = await Language.findOne({ language });
    if (lang) throw Error('Lagnuage already exists');

    const newLang = new Language({
      language
    });
    const savedLang = await newLang.save();
    if (!savedLang) throw Error('Something went wrong saving the language');

    res.status(200).json(savedLang);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

export default router;
