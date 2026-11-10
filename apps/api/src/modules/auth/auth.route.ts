import { Router } from 'express';
import { loginUserController, logOutAllUserController, logOutUserController, registerUserController } from './auth.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { loginUserSchema, logOutUserSchema, registerUserSchema } from './auth.schema.js';
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
router.route('/logOut').post(
   jwtVerify,
   validate(logOutUserSchema),
   logOutUserController);


/* LOGOUT ROUTE - MULTIPLE DEVICES */
router.route('/logOut-all').post(
   jwtVerify,
   validate(logOutUserSchema),
   logOutAllUserController);


export default router;  