import { Router } from 'express';
import { loginUserController, registerUserController } from './auth.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { registerUserSchema } from './auth.schema.js';
import { jwtVerify } from '../../middlewares/jwtVerify.middlware.js';


const router = Router();


/* REGISTER ROUTE */
router.route('/register').post(
   validate(registerUserSchema),
   registerUserController
);

/* LOGIN ROUTE */
router.route('/login').post(
   jwtVerify,
   validate(registerUserSchema),
   loginUserController);


export default router;