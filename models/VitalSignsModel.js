const mongoose = require('mongoose');

const vitalSignsSchema = new mongoose.Schema({
    nurseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    temperature: Number,
    heartRate: Number,
    bloodPressure: String,
    respiratoryRate: Number,
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    notes: {
        type: String,
        maxlength: 500,
    }
});

const VitalSignsModel = mongoose.model('VitalSigns', vitalSignsSchema);

module.exports = VitalSignsModel;
