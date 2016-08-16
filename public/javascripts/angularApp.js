var app = angular.module('weekDemo2', ['ui.router','xeditable']);

app.run(function(editableOptions){
   editableOptions.theme = 'bs3'; 
});
app.config(['$stateProvider','$urlRouterProvider',function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('home', {
        url: '/home'
        , templateUrl: '/home.html'
        , controller: 'CompanyController'
        , resolve: {
            postPromise: ['company',function(company){
                return company.getAllCompany();
            }]
        }
         })
    .state('company',{
        url:'/company/{id}',
        templateUrl: '/company.html',
        controller: 'EmployeeController',
        resolve:{
            company_id:['$stateParams','company',function($stateParams,company){
                return company.getCompany($stateParams.id);
            }]
        }
    })
    .state('employee',{
      url:'/company/{cid}/employee/{eid}',
      templateUrl: '/employee.html',
      controller:['$scope','company','employee_id',function($scope,company,employee_id){
        $scope.employee = employee_id;   
          $scope.updateEmployee = function(){
         company.updateEmployee($scope.employee._id,$scope.employee);
    }
   //      console.log(employee_id);
      }],
     resolve:{
         employee_id:['$stateParams','company',function($stateParams,company){
     //        console.log($stateParams.eid);
          
             return company.getEmployee($stateParams.eid);
         }]
     }
    })
    
    $urlRouterProvider.otherwise('home');
}]);

app.factory('company', ['$http', function ($http) {
        var o = {
            companys: []
        }
        o.getAllCompany = function () {
            return $http.get('/company').success(function (data) {
                angular.copy(data, o.companys);
                
            });
        };
        o.create = function (company) {
            return $http.post('/company', company).success(function (data) {
                o.companys.push(data);
            });
        };
        o.addEmployee = function (id, employee) {
            return $http.post('/company/' + id + '/employee', employee);
        }

        o.getCompany = function(id){
            return $http.get('/company/'+id).then(function(res){
                return res.data;
            });
        } 
        
        o.getEmployee = function(id){
            return $http.get('/employee/'+id).then(function(res){
               return res.data; 
            });
        }
        
        o.getAllEmployee = function(id){
            return $http.get('/company/'+id+'/employee').then(function(res){
                return res.data;
            });
        }
        o.updateEmployee = function(id,data){
            return $http.put('/employee/'+id,data).then(function(res){
               return res.data; 
            });
        }
        
        return o;
}
])


app.controller('CompanyController',['$scope','company',function($scope,company){
    $scope.company = company.companys;
   
    $scope.addCompany = function(){
        if(!$scope.name || $scope.name===''){return;}
        console.log($scope.name);
        company.create({
           name: $scope.name
        });
        $scope.name = '';
        
    };
    
}]);

app.controller('EmployeeController',['$scope','company','company_id',function($scope,company,company_id){
    $scope.company = company_id;
  //  console.log(company_id.employee_id);
    var backemployeeid = $scope.company.employee_id;
     $scope.getEmployee = function(emp){
        return company.getEmployee(emp);
    }; 
    $scope.updateEmployee = function(){
    
        console.log("its executing");
        console.log(company.updateEmployee($scope.company.employee_id._id,$scope.company.employee_id));
    
    }
    $scope.addEmployee = function(){
        if($scope.name === ''){return;}
        company.addEmployee(company_id._id,{
            name:$scope.name,
            dob: $scope.dob,
            address: $scope.address,
            age: $scope.age
        }).success(function(data){
            $scope.company.employee_id.push(data);
        });
        
        $scope.name = '';
        $scope.dob = '';
        $scope.address = '';
        $scope.age = '';
    };
        
}]);
