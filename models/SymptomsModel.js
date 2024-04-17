const mongoose = require('mongoose');

const symptomsSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    symptomsList: [String],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    severity: {
        type: String,
        enum: ['mild', 'moderate', 'severe'],
        default: 'mild',
    }
});

const SymptomsModel = mongoose.model('Symptoms', symptomsSchema);

module.exports = SymptomsModel;
