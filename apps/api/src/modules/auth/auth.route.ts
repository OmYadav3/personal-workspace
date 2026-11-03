import { Router } from 'express';


const router = Router();


// Register route
router.route('/register').post();

// Login route
router.route('/login').post();


export default router;