import express from 'express';
import { create, list, update, categoryById, read, remove } from '../controllers/DataMonth';
const router = express.Router();

router.post("/month-add", create);
router.post("/month-upload",update);

router.get('/get-data-month', list);
router.get('/month/:categoryId', read);

router.put('/month/:categoryId', update);

router.post('/month-remove', remove);

router.param('categoryId', categoryById);

module.exports = router;