import { Router } from 'express';
import { registerUserController } from './auth.controller.js';


const router = Router();


/* REGISTER ROUTE */
router.route('/register').post(registerUserController);

/* LOGIN ROUTE */
// router.route('/login').post();


export default router;