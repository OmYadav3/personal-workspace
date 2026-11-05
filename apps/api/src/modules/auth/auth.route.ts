import { Router } from 'express';
import { registerUserController } from './auth.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { registerUserSchema } from './auth.schema.js';


const router = Router();


/* REGISTER ROUTE */
router.route('/register').post(
   validate(registerUserSchema),
   registerUserController
);

/* LOGIN ROUTE */
// router.route('/login').post();


export default router;