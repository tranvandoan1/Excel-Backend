import mongoose from 'mongoose';

const monthSchema = new mongoose.Schema({
    month: {
        type: String,
    },
    data:{
        type: String

    },
}, { timestamps: true });
module.exports = mongoose.model('month', monthSchema);