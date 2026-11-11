import { Router } from 'express';
import { getCurrentUserController, loginUserController, logOutAllUserController, logOutUserController, refreshTokencontroller, registerUserController } from './auth.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { loginUserSchema, registerUserSchema } from './auth.schema.js';
import { jwtVerify } from '../../middlewares/jwtVerify.middlware.js';



const router = Router();


/* REGISTER ROUTE */
router.route('/register').post(
   validate(registerUserSchema),
   registerUserController
);

/* LOGIN ROUTE */
router.route('/login').post(
   validate(loginUserSchema),
   loginUserController);

/* LOGOUT ROUTE - SINGLE DEVICE */
router.route('/logOut').get(
   jwtVerify,
   logOutUserController);


/* LOGOUT ROUTE - MULTIPLE DEVICES */
router.route('/logOut-all').get(
   jwtVerify,
   logOutAllUserController);


/* REFRESH ROUTE  */
router.route('/refresh').post(
   jwtVerify,
   refreshTokencontroller);

/* REFRESH ROUTE  */
router.route('/current-user').get(
   jwtVerify,
   getCurrentUserController);


export default router;  