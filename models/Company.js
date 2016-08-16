var mongoose = require('mongoose');

var CompanySchema = mongoose.Schema({
    name: String,
    employee_id: [{type: mongoose.Schema.Types.ObjectId, ref: 'Employee'}]
});

mongoose.model('Company',CompanySchema);