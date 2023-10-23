import mongoose from 'mongoose';

const uploadimageSchema = new mongoose.Schema({
    photo: {
        type: String
    },
}, { timestamps: true });
module.exports = mongoose.model('uploadimage', uploadimageSchema);