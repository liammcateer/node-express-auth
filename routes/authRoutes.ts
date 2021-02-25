const { Router } = require('express')
const { register_post } = require('../controllers/authController')

const router = Router();

router.get('/register', () => {});
router.post('/register', register_post);
router.get('/login', () => {});
router.post('/login', () => {});

module.exports = router;