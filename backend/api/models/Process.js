const mongoose = require('mongoose');

const processesSchema = new mongoose.Schema(
    {
        process_number: { type: String, required: true, unique: true },
        authors: { type: String, required: true },
        lawyers: { type: String, required: true },
        gross_net_principal_amount: { type: Number, required: true },
        late_interest_amount: { type: Number, required: true },
        attorney_fees: { type: Number, required: true },
        status: { type: String, required: true },
        defendant: { type: String, required: true },
        content: { type: String, required: true },
    },
    {
        timestamps: { availability_date: 'availability_date', createdAt: 'created_at', updatedAt: 'updated_at' },
        collection: 'processes',
    }
);

module.exports = mongoose.model('Processes', processesSchema);
