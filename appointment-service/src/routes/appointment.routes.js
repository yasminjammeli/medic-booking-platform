const express = require('express');
const router = express.Router();
const controller = require('../controllers/appointment.controller');

router.post('/', controller.create);
router.get('/', controller.getAll);
router.patch('/:id/cancel', controller.cancel); // pour annuler
router.put('/:id', controller.update); // pour modifier (PUT ou PATCH)
router.patch('/:id', controller.update);

module.exports = router;
