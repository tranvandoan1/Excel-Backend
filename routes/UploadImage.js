import express from 'express';
import { create, listAllImage } from '../controllers/UploadImage';
import multer from 'multer';
const router = express.Router();

const storage = multer.diskStorage({
    destination: "Uploads",
    filename: function (req, file, callBack) {
        const extension = file.originalname.split(".").pop();
        callBack(null, `${file.fieldname}-${Date.now()}.${extension}`);
    },
});
const upload = multer({ storage: storage });
// router.post("/month-add", create);
// router.post("/month-upload", update);

// router.get('/get-data-month', list);
// router.get('/month/:categoryId', read);

// router.put('/month/:categoryId', update);

// router.post('/month-remove', remove);

// router.param('categoryId', categoryById);


router.get('/getall-image', listAllImage);
router.post('/upload-image', upload.array("files"), create);

module.exports = router;