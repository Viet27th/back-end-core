const express = require('express');
const router = express.Router();
const middleware = require('../middleware');
const userControllers = require('../controllers/api_users');

router.post('/', userControllers.addUser);

router.get('/get/:id', userControllers.getUserById);

router.get('/get-all-user', middleware.userAuthenticate ,userControllers.getAllUser);

router.put('/', userControllers.updateUserById);

router.put('/soft-delete', userControllers.softDeleteUserById);

router.put('/undo-soft-delete', userControllers.undoSoftDeleteUserById);

router.delete('/:id', userControllers.deleteUserById);

router.post('/web-login-traditional', userControllers.webLoginTraditional);

router.post('/web-logout-traditional', userControllers.webLogoutTraditional);

router.post('/web-refresh-token-traditional', userControllers.webRefreshTokenTraditional);

module.exports = router;
