const { model, Types } = require('../connection');

const mySchema = {
    interview: { type: Types.ObjectId, ref: 'jobpostcollection' },
    user: { type: Types.ObjectId, ref: 'signupData' },
    createdAt: { type: Date, default: Date.now },
    resume: { type: String, required: false } // Add this line to store resume file path
};

module.exports = model('apply', mySchema);
