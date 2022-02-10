import { Router } from 'express';
import _ from 'loadsh';
import config from '../../config';
import jwt from 'jsonwebtoken';
import auth from '../../middleware/auth';
import User from '../../models/User';
import nodemailer from 'nodemailer';
import logger from '../../middleware/logger';

const { JWT_SECRET } = config;
const router = Router();

router.post('/login', async (req, res) => {
  const { email } = req.body;

  try {
    // Check for existing user
    const user = await User.findOne({
      email: { $regex: new RegExp('^' + email.toLowerCase(), 'i') },
    });
    if (!user) throw Error('User does not exist');

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      country: user.country,
      timezone: user.timezone,
      type: user.type,
    };
    logger.info(`login user: ${JSON.stringify(userData)}`);

    const token = jwt.sign(userData, JWT_SECRET, { expiresIn: 60 * 5 });
    if (!token) throw Error('Couldnt sign the token');

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'blackhorse00911@gmail.com',
        pass: 'Adam$0911!',
      },
      secureConnection: false,
      secure: false,
      requireTLS: true,
      port: 2525,
      tls: {
        rejectUnauthorized: false,
      },
    });

    let mailOptions = {
      from: '"MicHero team" <noreply@ipsum.com>',
      to: user.email.toString(),
      subject: 'Account Activation Link',
      html: `
      Hello,<br/><br/>You requested a magic link to login.<br/>Please click on the link below to login.<br/>
      <a href='${process.env.CLIENT_URL}/activateLogin/${token}'>Click Here</a><br/><br/>
      Regards,<br/><br/>
      MicHero team
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) throw Error(`Sending Email went wrong: ${mailOptions}`);
      res.json({ msg: 'Email has been sent, kindly activate your account' });
    });
  } catch (e) {
    logger.error('log in error', e.message);
    res.status(400).json({ msg: e.message });
  }
});

router.post('/activate-account', async (req, res) => {
  const { token, isLogin } = req.body;
  try {
    if (!token) throw Error('Something went wrong');

    jwt.verify(token, JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        throw Error('Token is expired.');
      } else {
        const { email, name, phone, country, timezone, type } = decodedToken;

        const user = await User.findOne({ email });
        console.log('activate account', isLogin);
        if (!isLogin) {
          if (user) throw Error('User already exists');
          const newUser = new User({
            name,
            email,
            phone,
            country,
            timezone,
            type,
          });

          const savedUser = await newUser.save();
          if (!savedUser) throw Error('Something went wrong saving the user');
          res.status(200).json({
            token,
            user: {
              id: savedUser._id,
              name: savedUser.name,
              email: savedUser.email,
              phone: savedUser.phone,
              country: savedUser.country,
              timezone: savedUser.timezone,
              type: savedUser.type,
              status: savedUser.status,
            },
          });
        } else {
          if (user) {
            res.status(200).json({
              token,
              user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                country: user.country,
                timezone: user.timezone,
                type: user.type,
                status: user.status,
              },
            });
          } else {
            throw Error('User does not exist');
          }
        }
      }
    });
  } catch (e) {
    logger.error('active account error', e.message);
    res.status(400).json({ msg: e.message });
  }
});

router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) throw Error('User does not exist');
    res.json(user);
  } catch (e) {
    logger.error('get user', e.message);
    res.status(400).json({ msg: e.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) throw Error('User does not exist');

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: 3600,
    });

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'whitesnow9734@gmail.com',
        pass: 'isop199734',
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    let mailOptions = {
      from: '"MicHero team" <noreply@ipsum.com>',
      to: email,
      subject: 'Reset Password Link',
      html: `
      <h2>Please click on given link to reset your password<h2>
      <a href='${process.env.CLIENT_URL}/password-reset/${token}'>Click Here</a>
      `,
    };

    user.updateOne({ resetLink: token }, (err, sucess) => {
      if (err) {
        return res.status(400).json({ msg: 'reset password link error' });
      } else {
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            res.json({
              msg: error.message,
            });
          }
          res.json({
            msg: 'Email has been sent, kindly follow the instructions',
          });
        });
      }
    });
  } catch (e) {
    logger.error('forgot password error', e.message);
    res.status(400).json({ msg: e.message });
  }
});

router.post('/reset-password', async (req, res) => {
  const { resetLink, newPass } = req.body;
  if (resetLink) {
    jwt.verify(resetLink, JWT_SECRET, async (err, decodedData) => {
      if (err) {
        logger.error('reset-password token expired error');
        res.status(401).json({
          msg: 'Token is expired.',
        });
      } else {
        const user = await User.findOne({ resetLink });
        if (!user) throw Error('User does not exist');

        const obj = {
          password: newPass,
          resetLink: '',
        };

        const newUser = _.extend(user, obj);
        const savedUser = await newUser.save();
        if (!savedUser) throw Error('Something went wrong saving the user');

        res.status(200).json({ msg: 'Your password has been changed' });
      }
    });
  } else {
    logger.error('reset-password auth error');
    return res.status(401).json({ msg: 'Authentication error!!!' });
  }
});

export default router;
