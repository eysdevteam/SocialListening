app.controller("Q_S1", function($scope, $http, $q){
    $scope.datatest=$http.get("web/Preguntas/seccion1/file2/data.json");
    $scope.datamodal=$http.get("web/Preguntas/seccion1/file1/data.json");

    $q.all([$scope.datatest, $scope.datamodal]).then(function(d){
        $scope.datatest = d[0].data;
        $scope.datamodal = d[1].data;
        $scope.datatest[0]["preguntas"]=[];
        for(i = 0; i <= $scope.datamodal.length-1; i++){
            $scope.datatest[0].preguntas.push($scope.datamodal[i]);
        }    
        principalBullet($scope.datatest, "#Q_S1", title=false, ind=true);
    });

});
app.controller("Q_S2", function($scope, $http, $q){
    $scope.datatest=$http.get("web/Preguntas/seccion2/file2/data.json");
    $scope.datamodal=$http.get("web/Preguntas/seccion2/file1/data.json");

    $q.all([$scope.datatest, $scope.datamodal]).then(function(d){
        $scope.datatest = d[0].data;
        $scope.datamodal = d[1].data;
        $scope.datatest[0]["preguntas"]=[];
        for(i = 0; i <= $scope.datamodal.length-1; i++){
            $scope.datatest[0].preguntas.push($scope.datamodal[i]);
        }    
        principalBullet($scope.datatest, "#Q_S2", title=false, ind=true);
    });

});

app.controller("TabsController", function($scope){
    this.tab=1;
    this.selectTab = function(tab){
        this.tab=tab;
    };   
});

app.controller("Line", function ($scope, $http) {
    $http.get("web/Line/data.json").then(function(data){
        $scope.data = data.data;
        lineGraph($scope.data, "#Line");     
    });
});

app.controller("Positive_Tweets", function ($scope, $http) {
    $http.get("web/Positive_Tweets/donut.json").then(function(data){
        $scope.indi=data.data
        $scope.relleno = new Array();        
        $scope.relleno[0] = ($scope.indi[0]/$scope.indi[1])*100;
        $scope.relleno[1] = (1-($scope.indi[0]/$scope.indi[1]))*100; 
        $scope.relleno[0] = $scope.relleno[0].toFixed(2);
        $scope.relleno[1] = $scope.relleno[1].toFixed(2);
        donut($scope.indi, $scope.relleno, "#Positive_Tweets");     
    });
});

app.controller("Negative_Tweets", function ($scope, $http) {
    $http.get("web/Negative_Tweets/donut.json").then(function(data){
        $scope.indi=data.data
        $scope.relleno = new Array();        
        $scope.relleno[0] = ($scope.indi[0]/$scope.indi[1])*100;
        $scope.relleno[1] = (1-($scope.indi[0]/$scope.indi[1]))*100; 
        $scope.relleno[0] = $scope.relleno[0].toFixed(2);
        $scope.relleno[1] = $scope.relleno[1].toFixed(2);             
        donut($scope.indi, $scope.relleno, "#Negative_Tweets");     
    });
});


