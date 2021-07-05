const express = require('express');
const passport = require('passport');

const jwt = require('jsonwebtoken');

const router = express.Router();
router.post(
    '/signup',
    passport.authenticate('signup', { session: false }),
    async(req, res, next) => {
        res.json({
            message: 'Signup successful',
            user: req.user
        });
    }
);

router.post(
    '/login',
    async(req, res, next) => {

        passport.authenticate(
            'login',
            async(err, user, info) => {
                try {
                    if (err || !user) {
                        const error = new Error('An error occurred.');

                        return next(error);
                    }

                    req.login(
                        user, { session: false },
                        async(error) => {
                            if (error) return next(error);

                            const body = { _id: user._id, email: user.email };
                            const expiration = process.env.DB_ENV === 'testing' ? 100 : 604800000;
                            const token = jwt.sign({ user: body }, 'TOP_SECRET');

                            // return res.cookie('token', token, {
                            //     expires: new Date(Date.now() + expiration),
                            //     // set to true if your using https
                            //     httpOnly: true,
                            // });
                            return res.json({ token });
                        }
                    );
                } catch (error) {
                    return next(error);
                }
            }
        )(req, res, next);
    }
);

module.exports = router;