/*Donut tweets positivos*/ 
app.controller("Positive_Tweets", function ($scope, $http) {
    var por = 100
    $http.get("web/PositiveCount/positive.json").then(function(data){
        $scope.indi=data.data
        $scope.relleno = new Array();        
        $scope.relleno[0] = ($scope.indi[0]/por)*100;
        $scope.relleno[1] = (1-($scope.indi[0]/por))*100; 
        $scope.relleno[0] = $scope.relleno[0].toFixed(2);
        $scope.relleno[1] = $scope.relleno[1].toFixed(2);
        donut($scope.indi, $scope.relleno, "#Positive_Tweets","rgb(102, 190, 231)");     
    });
});

/*Donut tweets negativo*/ 
app.controller("Negative_Tweets", function ($scope, $http) {
    var por = 100
    $http.get("web/NegativeCount/negative.json").then(function(data){
        $scope.indi=data.data
        $scope.relleno = new Array();        
        $scope.relleno[0] = ($scope.indi[0]/por)*100;
        $scope.relleno[1] = (1-($scope.indi[0]/por))*100; 
        $scope.relleno[0] = $scope.relleno[0].toFixed(2);
        $scope.relleno[1] = $scope.relleno[1].toFixed(2);             
        donut($scope.indi, $scope.relleno, "#Negative_Tweets","rgb(225, 124, 114)");     
    });
});

/*Mapa*/
app.controller("Mapa_Tweets", function ($scope, $http) {
    $http.get("web/map/map.json").then(function(data){
        $scope.datos=data.data
         map("#Mapa_Tweets", $scope.datos);           
    });
});

/*Tabla Tweets Positivos*/
app.controller("Tabla-Tweets-positivo", function($scope, $http){
     $http.get("web/PositivesTweets/positive.json").then(function(data){
        $scope.datos=data.data
          tabla_tweets("tweets-positivos", $scope.datos);        
    });
});

/*Tabla Tweets Negativos*/
app.controller("Tabla-Tweets-negativo", function($scope, $http){
     $http.get("web/NegativesTweets/negative.json").then(function(data){
        $scope.datos=data.data
          tabla_tweets("tweets-negativos", $scope.datos);        
    });
});

/*Grafica de linea simple*/
app.controller("simple-Line", function($scope, $http){
    $http.get("web/TweetsHour/hour.json").then(function(data){
        $scope.data = data.data;
        SimplelineGraph($scope.data, "#simple-Line");     
    });
});

app.controller("TabsController", function($scope){
    this.tab=1;
    this.selectTab = function(tab){
        this.tab=tab;
    };   
});

app.controller("Line", function ($scope, $http) {
    $http.get("web/Volumen/vol.json").then(function(data){
        $scope.data = data.data;
        lineGraph($scope.data, "#Line");     
    });
});

/*Grafica de linea simple*/
app.controller("card-volumen", function($scope, $http) {
    $http.get("web/Volavg/volavg.json").then(function(data){
        $scope.datos = data.data;
        $scope.volumen = $scope.datos[0].vol; 
        $scope.promedio = $scope.datos[0].avg;    
    });
});

