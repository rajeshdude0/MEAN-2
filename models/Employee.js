var mongoose = require('mongoose');

var EmployeeSchema = mongoose.Schema({
   name: String,
    dob: String,
    age: String,
    address: String,
    company_id: {type: mongoose.Schema.Types.ObjectId, ref:'Company'}
});

mongoose.model('Employee',EmployeeSchema);