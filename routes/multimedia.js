const router = require('express').Router();
const multimediaController = require('../controllers/multimediaController')

router.get('/', multimediaController.getAllMedia)
router.get('/:id', multimediaController.getSelectedMedia)
router.get('/:type', multimediaController.discoverSelectedType)

module.exports = router;