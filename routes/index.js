var express = require('express');
var mongoose = require('mongoose');
require('../models/Company');
require('../models/Employee');
var Company = mongoose.model('Company');
var Employee = mongoose.model('Employee');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/company',function(req,res,next){
    Company.find(function(err,company){
       if(err){return next(err);}
       res.json(company);
    });
});



router.param('company',function(req,res,next,id){
    
   var query = Company.findById(id);
    query.exec(function(err,company){
       if(err){return next(err);} 
        if(!company){ return next(new Error("Can't find the company"));}
        req.company = company;
        return next();
    });
});

router.param('employee',function(req,res,next,id){
    var query = Employee.findById(id);
    query.exec(function(err,employee){
       if(err){ return next(err);} 
        if(!employee){ return next(new Error("Can't find the employee"));}
        
        req.employee = employee;
        return next();
    });
});

router.get('/company/:company',function(req,res){
    req.company.populate('employee_id',function(err, company){
       if(err) {return next(err);}
        //console.log(req.company);
         res.json(req.company);
    });
});

router.get('/employee/:employee',function(req, res){
    req.employee.populate('company_id',function(err, employee){
       if(err) {return next(err);}
         console.log(req.employee);
         res.json(req.employee);
    }); 
});



router.post('/company',function(req, res, next){
  var company = new Company(req.body);
    //console.log(req.body);
    company.save(function(err,company){
        if(err){ return next(err);}
        return res.json(company);
    });
});

router.post('/company/:company/employee',function(req, res, next){
   var employee = new Employee(req.body);
   employee.company_id = req.company;
    console.log(req.company);
    employee.save(function(err,employee){
       req.company.employee_id.push(employee);
        req.company.save(function(err,company){
           if(err){ return next(err);} 
            return res.json(employee);
        });
    });
});

router.put('/employee/:employee',function(req,res,next){
    Employee.update({_id:req.employee},req.body,{multi:true},function(err,employee){
      if(employee)
          res.json(true);
    })
    
    
})

module.exports = router;
