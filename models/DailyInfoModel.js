const mongoose = require('mongoose');

const dailyInfoSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    pulseRate: Number,
    bloodPressure: String,
    weight: Number,
    temperature: Number,
    respiratoryRate: Number,
    updatedOn: {
        type: Date,
        default: Date.now,
    },
    medicationTaken: {
        type: Boolean,
        default: false,
    }
});

const DailyInfoModel = mongoose.model('DailyInfo', dailyInfoSchema);

module.exports = DailyInfoModel;
