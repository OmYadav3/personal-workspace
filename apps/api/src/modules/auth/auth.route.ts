import { Router } from 'express';
import { loginUserController, registerUserController } from './auth.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { loginUserSchema, registerUserSchema } from './auth.schema.js';



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


export default router;