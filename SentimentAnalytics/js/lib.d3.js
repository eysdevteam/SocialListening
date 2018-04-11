/***************************** 
	Libreria D3.js
*////////////////////////////

// Table Library
function table(dataset, columnas, container){  

  var tbody = d3.select(container).append('tbody');

  var rows = tbody.selectAll("tr")
    .data(dataset)
    .enter()
    .append("tr")
    .text(function(column) { //return column;
       return column.id + " " + column.name;
     });

  var cells = rows.selectAll("td")
    .data(function(row){
      return columnas.map(function(column){
        return {column:column, value:row[column]};
      });
    })
    .enter()
    .append("td")

    return tbody;
}

// Donut Library
function donut(indi, relleno, container,color) {

  var width = 100;
      height = 170,
      radius = Math.min(width, height) / 2;
          var color  = d3.scale.ordinal()
         .range([color,"#EBE8E8"]);
       

  var pie = d3.layout.pie()
      .sort(null);

  var arc = d3.svg.arc()
      .innerRadius(radius - 2)
      .outerRadius(radius - 7);

  var svg = d3.select(container).append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var path = svg.selectAll("path")
      .data(pie(relleno))
      .enter().append("path")
      .attr("fill", function(d,i) { return color(i); })
      .attr("d", arc);
      
  if(relleno[0] < 99) {
    svg.append("text")
    .text(relleno[0]+"%")
    .attr("class", "units-label")
    .attr("x", ((radius/2)*-1)-5)
    .attr("y", radius-47)
    .attr("font-size", 20);  
  }
  else{
    svg.append("text")
    .text(relleno[0]+"%")
    .attr("class", "units-label")
    .attr("x", ((radius/2)*-1)-9)
    .attr("y", radius-47)
    .attr("font-size", 20);
  }   

  var titulo;
  var centrado;

  if(container === "#Positive_Tweets"){
    titulo = "Positivos";
    centrado = ((radius/2)*-1)+2;
  }
  else{
    titulo = "Negativos";
    centrado = ((radius/2)*-1)
  }
    
  svg.append("text")
    .text(titulo)
    .attr("x", centrado)
    .attr("y", radius-32)
    .attr("font-size", 12);
}

// Tabla Library 
function tabla_tweets(container, data){
        var tabla_tweets = d3.select("#"+container).append("table").attr("class","table" + " " + "m-0");
        var encabezado = tabla_tweets.append("tr");
        encabezado.append("th").attr("colspan","2").text("Usuario");
        encabezado.append("th").text("Tweet");
        encabezado.append("th").text("Seguidores");
        var tabla_tweets2 = tabla_tweets.selectAll(".tr").data(data).enter().append("tr").attr("class","tabla-tweets"+container);      

        tabla_tweets2.append("td").attr("class","avatar"+container + " " + "p-2");
        tabla_tweets2.append("td").attr("class",function(d,i){return "user"+container + " " + "p-2";});
        tabla_tweets2.append("td").attr("class",function(d,i){return "value"+container+ " " + " p-2";});
        tabla_tweets2.append("td").attr("class",function(d,i){return "followers"+container + " " + "p-2";}); 
        d3.selectAll(".avatar"+container).append("img").attr("src","img/avatar.jpg").attr("width","25");
        d3.selectAll(".user"+container).data(data).text(function(d){return d.user;});
        var span =d3.selectAll(".value"+container).append("a").attr("class","tooltips1").attr("data-toggle","modal").attr("data-target","#modalBullet");
        
        //data-toggle="modal"
        var span2 = span.append("div").attr("class", "d-inline-block text-truncate").style("max-width", "415px").style("cursor","pointer").data(data).text(function(d){ return d.value;});         
        span2.on("click", function(d){
          d3.selectAll(".trModal").remove();
          d3.selectAll("tdModal").remove();
          let modal_title = d3.selectAll(".modal-title-bullet")
          modal_title.text(d.user);
          d3.select(this).each(function(d) {
                  //d.data.forEach((data, index) => {
                    d3.selectAll(".modal-bullet")
                      .append("tr")
                      .attr("class", "trModal")
                      .append("td")
                      .attr("class", "tdModal")
                      .text(d.value.charAt(0).toUpperCase() + d.value.slice(1))
                      .style("border-bottom","1px solid #EBE8E8")
                      .style("font-size","1em");
                    //})
                  })
        })

  

        d3.selectAll(".followers"+container).data(data).text(function(d){return d.followers;});
        /*d3.selectAll(".ips").data(datasetmal).text(function(d){return d.name.toLowerCase();});
        d3.selectAll(".goodbad").append("i").attr("class","fa fa-chevron-circle-up greencolor");*/

}


 //.append("title").text(function(d) {return d.name +"\n"+"Total de tweets:"+" "+d.cant;});


// Tablavar Library
function tablavar(data,container){
    //d3.json("web/name-var/name.json", function(error, data) {
    var dataset = data; 
    d3.select(".card-title").text("Variables analizadas");
    d3.select(container).selectAll("tr").data(dataset).enter().append("tr").attr("class","var1");
    d3.selectAll(".var1").append("td").attr("class",function(d,i){return "numvar";});
    d3.selectAll(".var1").append("td").attr("class",function(d,i){return "var2";});
    d3.selectAll(".numvar").data(dataset).text(function(d){return d.var;});
    d3.selectAll(".var2").data(dataset).text(function(d){return d.name.toLowerCase();});
    
//});
}

// Scatter Treemap and HeatMap library
function scatreeheat(data, container) {
  var margin = {
    top: 20, 
    right:30, 
    bottom: 20, 
    left: 30,
    padding: 20,
    padding2: 40,
    padding3: 28
  },
  height = 275 - margin.top - margin.bottom;
  width = parseInt(d3.select(container).style("width")) - margin.left - margin.right;

  var color = d3.scaleSequential(d3.interpolateRdYlBu).domain([100, 0])

  var x = d3.scale.linear()
    .domain([d3.min(data, function(d){return d.cx-15; }), d3.max(data, function(d) { return d.cx+15; })])
    .range([ 0, width ]);

  var y = d3.scale.linear()
    .domain([d3.max(data, function(d){return d.cm+5}), 0])
    .range([0, height]);

  var yAxis = d3.axisLeft().scale(y);

  var legend = d3.select(container)
    .append('svg:svg')
    .attr('width', width + margin.right + margin.left)
    .attr('height', 15)
    .style("padding-left", "4%")

  var image = legend.append("svg:image")
    //attr("transform", 'translate(' + margin.left + ',' + margin.top + ')')
    .attr('width', width)
    .attr('height', 15)
    .attr("xlink:href","legendV2.png")    

  var chart = d3.select(container)
    .append('svg:svg')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom);

  var axisLeft = chart.append("g")
    .call(yAxis)
    .attr("transform", 'translate(' + margin.left + ',' + margin.top + ')')

  var textAxisLeft = chart.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", ((height/2)+margin.top+margin.bottom)*-1)
    .attr("y", 10)
    .style("font-size", "0.8em")
    .text("Cantidad de IPS")
    .attr("fill","gray");

  var main = chart.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom);

  var g = main.append("svg:g");

  g.selectAll("dots")
    .data(data)
    .enter()
    .append("svg:circle")
    .style("cursor","pointer")
    .attr("cx", function (d,i) { return x(d.cx); } )
    .attr("cy", function (d) { return y(d.cm); } )
    .attr("r", function (d) { return d.cm + 30; } )
    .attr("class", "dots")
    .attr("data-toggle", "modal")
    .attr("data-target", "#myModal")
    .attr("stroke", "white")
    .attr("fill", function(d) { return color(d.cx); })
    .on("mouseover", function(d,i) {
        var radio = d3.select(this)
        .transition()
        .duration(200)
        .attr("r", function(d) { return d.cm + 35});
    })
    .on("mouseout", function(d,i) {
        var radio = d3.select(this)
        .transition()
        .attr("r", function(d) { return d.cm + 30});
    })
    .on("click", function(d) {
        d3.selectAll(".trModal").remove();
        d3.selectAll("tdModal").remove();

        let modal_title = d3.selectAll(".modal-title-scatter")
        modal_title.text("Este grupo tiene " + d.cm + " IPS");
        d3.select(this).each(function(d) {
          d.m.forEach((ips, index) => {
            d3.selectAll(".modal-scatter")
              .append("tr")
              .attr("class", "trModal")
              .append("td")
              .attr("class", "tdModal")
              .text(ips)
              .style("border-bottom","1px solid #EBE8E8")
          })
        })
    })
    .append("title").text("Click para mas informacion")
    d3.selectAll(".trModal").remove();
    d3.selectAll("tdModal").remove();  
       
  g.selectAll("text")
    .data(data)
    .enter()
    .append("svg:text") 
    .attr("x", function (d,i){
      if(d.cm < 10){ return x(d.cx-2.5) }
      else{ return x(d.cx-5) }
    })
    .attr("y", function (d,i) { return y(d.cm-0.15); } )   
    .text(function(d) { return d.cm + " IPS"; } )    
    .attr("fill", "black")
    .style("font-weight","600")
    //.style("text-shadow","1px 1px white");    
}

// Bargraph Library
function bargraph(data,container, container2){

    // set the dimensions and margins
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = parseInt(d3.select(container).style("width")) - margin.left - margin.right;
        height = 190 - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleBand()
              .range([0, width])
              .padding(0.4);
    var y = d3.scaleLinear()
              .range([height, 0]);
              

    var svg = d3.select(container2).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

    // get the data
    //d3.json("web/bars-whisker/table.json", function(error, data) {
    //  if (error) throw error;

     data.forEach(function(d) {
        d.mean = +d.mean;
      });
      var color = d3.scaleSequential(d3.interpolateRdYlBu).domain([100, 0])
       x.domain(data.map(function(d) { return d.name; }));
       y.domain([0, 100]);

      var titulo="Variables de estudio";

  svg.append("text")
      .text(titulo)
      .attr("x",width/2 - margin.left)
      .attr("y",height+margin.bottom)
      .attr("fill","gray")
      .style("font-size",12);

 
  svg.append("text")
      .attr("transform","rotate(-90)")
      .text("valor de referencia")
      .attr("x",((height/2)+margin.top+margin.bottom)*-1)
      .attr("y", margin.bottom*-1)
      .attr("fill","gray")
      .style("font-size",12);

    var bar =svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.name); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(0); })
      .attr("height", function(d) { return 0 })
      .attr("fill", function(d){ return color(d.mean);})

      .transition()
      .ease(d3.easeBounce)
      .duration(2000)
      .on("start", function() { // <-- Executes at start of transition
      d3.select(this).attr("height", function(d){ return 0;})
      ;})

      .attr("x", function(d) { return x(d.name); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.mean); })
      .attr("height", function(d) { return height - y(d.mean); })
      .attr("fill", function(d){ return color(d.mean);})

      .on("end", function() { // <-- Executes at end of transition
      d3.select(this).transition();
      d3.select(this).append("title").text(function(d) {
        var numb =d.mean;
        var numbop =d.open;
        var result= d.open-d.mean;
        return "Valor: "+ numb.toFixed(2) +" +/- " + ""+ result.toFixed(2);});
      });


  svg.selectAll("circle")
      .data(data)
      .enter().append("circle")
      .attr("cx", function(d) { return x(d.name) + x.bandwidth()/2; })
      .attr("cy", function(d) { return y(d.mean); })
      .attr("r",4)
      .attr("fill","gray")
  ;

  for (var i = 0; i < data.length; i++) {
      svg.append("rect").attr("class","whiskertop");
      svg.append("rect").attr("class","whiskerbottom");
  }

  svg.selectAll(".whiskertop").data(data)
      .attr("x",function(d){return x(d.name) + x.bandwidth()/2.4})
      .attr("y", function(d) { return y(d.open); })
      .attr("width",10)
      .attr("height",2)
      .attr("fill","gray");

  svg.selectAll(".whiskerbottom").data(data)
      .attr("x",function(d){return x(d.name) + x.bandwidth()/2.4})
      .attr("y", function(d) { return y(d.close); })
      .attr("width",10)
      .attr("height",2)
      .attr("fill","gray")
      .append("title").text(function(d) {
        var numb =d.close
        return "Valor: "+ numb.toFixed(2);});

  svg.selectAll("line").data(data).enter().append("line").attr("x1", function(d) { return x(d.name) + x.bandwidth()/2; })
      .attr("y1", function(d){return y(d.open);})
      .attr("x2", function(d) { return x(d.name) + x.bandwidth()/2; })
      .attr("y2", function(d){return y(d.close);})
      .attr("stroke-width", 1)
      .attr("stroke", "gray")
      .style("opacity","0.5")
      .style("stroke-dasharray", ("3, 3"));
  // add the x Axis
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
  // add the y Axis
    svg.append("g")
      .call(d3.axisLeft(y));

    d3.selectAll(".domain").attr("stroke","#EBE8E8");
    d3.selectAll(".tick").attr("stroke","beige").attr("stroke-width","0.4");
var imagen = svg.append("svg:image")
    .attr("transform","translate("+width+","+ height+") rotate(-90)")
      .attr('width', height)
    .attr('height', 10)

    .attr("xlink:href","legend.png");

    //});
}

////////////////FunciÃƒÂ³n principal////////////////////////////////////////
function principalBullet(data,container,title, ind){

   if(ind){
      var margin = {top: 5, right: 20, bottom: 20, left: 0},
      //width = parseInt(d3.select(container).style("width")) - margin.left - margin.right;
      width = 235
      height = 20;
    }
    else{
      var margin = {top: 5, right: 40, bottom: 20, left: 70},
      width = parseInt(d3.select(container).style("width")) - margin.left - margin.right;
      height = 25;
    }

    var chart = d3.bullet()
        .width(width)
        .height(height);
      var svg = d3.select(container).selectAll("svg")
          .data(data)
        .enter().append("svg")
          .attr("class", "bullet")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")        
          .call(chart);

       
      if(title) {
         var tabla = d3.select(container).append("div").attr("class","row titles pl-4 mb-1 ml-5 ");
        estados = ["Inicial (I)", "Repetible (R)", "Definido (D)", "Administrado (A)", "Optimizado (O)"]
        for (var i = 0 ; i <= estados.length; i++) {
          if (i == estados.length){
          var col = tabla.append("div").attr("class","col-sm-0 ");
          col.append("text").text(estados[i]);
        }
        else {
          var col = tabla.append("div").attr("class","col-sm-2 mr-3 ml-1 pl-3 pr-1");
          col.append("text").text(estados[i]);

        }
        }     
        var title = svg.append("g")
          .style("text-anchor", "end")
          .attr("transform", "translate(-6," + height / 2 + ") ");
          title.append("text")
            .attr("class", "title")
            .text(function(d) { return d.seccion; });
      } 
      else{
if(ind){
      var tabla = d3.select(container).append("div").attr("class","row titles pl-0 mb-0 ml-0 ");
        estados = ["Total desacuerdo","En desacuerdo","Neutral","De acuerdo","Total acuerdo"]
        for (var i = 0 ; i <= estados.length; i++) {
          if (i == estados.length){
          var col = tabla.append("div").attr("class","col-sm-0 ");
          col.append("text").text(estados[i]);
        }
        else {
          var col = tabla.append("div").attr("class","col-sm-2 mr-2 ml-0 pl-0 pr-0").style("text-align","center");
          col.append("text").text(estados[i]).style("font-size","8px").style("line-height","1px");
        }
        }  
}
else{
 var tabla = d3.select(container).append("div").attr("class","row titles pl-4 ml-4");
        estados = ["(I)", "(R)", "(D)", "(A)", "(O)"]
        for (var i = 0 ; i <= estados.length; i++) {
          if (i == estados.length){
          var col = tabla.append("div").attr("class","col-sm-0 ml-1");
          col.append("text").text(estados[i]);
        }
        else {
          var col = tabla.append("div").attr("class","col-sm-1 ml-4 pl-4 pr-3");
          col.append("text").text(estados[i]);
        }
        }     
      }
}


}

////////////////FunciÃƒÂ³n principal////////////////////////////////////////
function principalBullet2(data,container,title){
        var margin = {top: 5, right: 100, bottom: 50, left: 10},
    width = parseInt(d3.select(container).style("width")) - margin.left - margin.right;
    height = 25;
    var chart = d3.bullet()
        .width(width)
        .height(height);
      var svg = d3.select(container).selectAll("svg")
          .data(data)
        .enter().append("svg")
          .attr("class", "bullet")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")        
          .call(chart);

      if(title) {
        var title = svg.append("g")
          .style("text-anchor", "end")
          .attr("transform", "translate(-6," + height / 2 + ") ");

        title.append("text")
            .attr("class", "title")
            .text(function(d) { return d.seccion; });
      } 

       var tabla = d3.select(container).append("div").attr("class","row titles pl-0 ml-0");
        estados = ["(I)", "(R)", "(D)", "(A)", "(O)"]
        for (var i = 0 ; i <= estados.length; i++) {
          if (i == estados.length){
          var col = tabla.append("div").attr("class","col-sm-0 ml-2");
          col.append("text").text(estados[i]);
        }
        else {
          var col = tabla.append("div").attr("class","col-sm-1 ml-3 pl-4 pr-4");
          col.append("text").text(estados[i]);

        }
      } 
}
////////////////////////////// FunciÃƒÂ³n de atributos y parÃƒÂ¡metros de configuraciÃƒÂ³n//////////////////////////
 d3.bullet = function() {
    var orient = "left", 
        reverse = false,
        duration = 1000,
        ranges = bulletRanges,
        markers = bulletMarkers,
        questions = bulletQuestions,
        width = 380,
        height = 30;
  // For each small multipleÃ¢â‚¬Â¦
  function bullet(g) {
    g.each(function(d, i) {
      var rangez = ranges.call(this, d, i).slice().sort(d3.descending),
        markerz = markers.call(this, d, i).slice(),
        questionz = questions.call(this, d, i),
        g = d3.select(this);

      // Compute the new x-scale.
      var x1 = d3.scale.linear()
        .domain([0, Math.max(rangez[0], markerz[0], 6)])
        .range(reverse ? [width, 0] : [0, width]);
      // Derive width-scales from the x-scales.
      w1 = bulletWidth(x1);

        if(ind){
        // Update the range rects.
        var range = g.selectAll("rect.range")
        .data(rangez);
        
        // Rect categories         
        range.enter().append("rect")
          .attr("class", function(d, i) { return "range m" + i; })
          .transition()
          .duration(duration)
          .attr("x", reverse ? x1 : 0)
          .attr("width", w1)
          .attr("height", height);

          for (var i = 0; i <= markerz.length - 1 ; i++) {
              valores = [questionz.preguntas[i]];

              var marker = g.selectAll("line.marker")
              .data(valores);

              marker.enter().append("text")
               .attr("class", "marker")
               .attr("x", x1((i*1.3)+1/2))
               .attr("y", height/1.6)
               .style("font-size", 11)
               .style("font-weight", 100)
               .text(function(d,i){return d.valor;})
               .style("cursor", "pointer")    
               .on("click", function(d){
                  var mark = d3.select(this)
                    .attr("data-toggle", "modal")
                    .attr("data-target", "#modalBullet");

                  d3.selectAll(".trModal").remove();
                  d3.selectAll("tdModal").remove();

                  let modal_title = d3.selectAll(".modal-title-bullet")
                  modal_title.text(d.seccion);
                  d3.select(this).each(function(d) {
                  d.preguntas.forEach((preguntas, index) => {
                    d3.selectAll(".modal-bullet")
                      .append("tr")
                      .attr("class", "trModal")
                      .append("td")
                      .attr("class", "tdModal")
                      .text(preguntas)
                      .style("border-bottom","1px solid #EBE8E8")
                      .style("font-size","1.2em");
                    })
                  })
               });
          }
        }
        else{
        // Update the range rects.
          var range = g.selectAll("rect.range")
            .data(rangez);
      // Rect categories         
          range.enter().append("rect")
            .attr("class", function(d, i) { return "range s" + i; })
            .transition()
            .duration(duration)
            .attr("x", reverse ? x1 : 0)
            .attr("width", w1)
            .attr("height", height);
        // Update the marker lines.
          var marker = g.selectAll("line.marker")
            .data(markerz);
        
          marker.enter().append("circle")
            .attr("class", "marker")
            .attr("cx", x1(1.268*markerz-(1/2)))
            .attr("cy", height / 2.15)
            .attr("r",4.5);
        
          marker.on("mouseover",function(d){
          marker.attr("r", 10);});

          marker.on("mouseout", function(d){
          marker.attr("r",4.5);})
          }
    });
  }
  
  // ranges (bad, satisfactory, good)
  bullet.ranges = function(x) {
    if (!arguments.length) return ranges;
    ranges = x;
    return bullet;
  };
  // markers (previous, goal)
  bullet.markers = function(x) {
    if (!arguments.length) return markers;
    markers = x;
    return bullet;
  };

  // ranges (bad, satisfactory, good)
  bullet.questions = function(x) {
    if (!arguments.length) return questions;
    questions = x;
    return bullet;
  };
  bullet.width = function(x) {
    if (!arguments.length) return width;
    width = x;
    return bullet;
  };
  bullet.height = function(x) {
    if (!arguments.length) return height;
      height = x;
      return bullet;
    };
    return bullet;
  };  

  function bulletRanges(d) {
    var count = d.contC;
    var array1 = [];

    for(var i=1;i<=count;i++)
    {
        var name = i;
        array1.push(name);
    }
    rango = array1; 
    return rango;
  }

  function bulletQuestions(d) {
    return d;
  }

  function bulletMarkers(d) {
    return d.valor;
  }

  function bulletWidth(x) {

    var x0 = x(0);
    return function(d) {
    return Math.abs(x(d)*1.3 - x0);
  };
}

function modalQuestions(data){
  var dataPr= data;
  //var dataPr= dataPr[i];
  console.log(dataPr);
  var table = d3.select(".modal_body").append("table").attr("class","table");
  var title = d3.select(".modal_title").append("text").text(dataPr.seccion);
  var row = table.selectAll("tr").data(dataPr).enter().append("tr").attr("class",function(d,i){ return "Fila"+i;});
    row.append("th").text(function(d,i){return i+1;});
    row.append("td").text(function(d){return d;});
}

function lineGraph(data, container) {

// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 30},
    width = parseInt(d3.select(container).style("width")) - margin.left - margin.right;
    height = 150;

// parse the date / time
var parseTime = d3.timeParse("%d");

// set the ranges
var x = d3.scaleLinear().range([10, width]);
var y = d3.scaleLinear().range([height, 0]);


// define the line
var valueline = d3.line()
    .x(function(d) { return x(parseInt(d.date)); })
    .y(function(d) { return y(parseInt(d.positivo)); });

var valueline2 = d3.line()
    .x(function(d) { return x(parseInt(d.date)); })
    .y(function(d) { return y(parseInt(d.negativo)); });
  
// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select(container).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

function draw(data) {
    
  // format the data
  data.forEach(function(d) {
      d.date = parseInt(d.date);//parseTime(d.fecha);
      d.positivo = +d.positivo;
      d.negativo = +d.negativo;
      //console.log(d.fecha);
  });
  
  // sort years ascending
  data.sort(function(a, b){
    //console.log(a["fecha"]);
    return a["date"]-b["date"];
  })
 
  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) {
    return Math.max(d.positivo,d.negativo); })]);
  
  // Add the valueline path.
  svg.append("path")
      .data([data])
      .attr("class", "lineP")
      .attr("d", valueline);
  
  svg.append("path")
      .data([data])
      .attr("class", "lineN")
      .attr("d", valueline2);
//console.log(x);
for(var i=0;i<data.length;i++){
  svg.append("circle")
  .data(data)
  .attr("cx",x(data[i].date))
  .attr("cy",y(data[i].positivo))
  .attr("r",4)
  .attr("fill","#66BEE7");

   svg.append("circle")
  .data(data)
  .attr("cx",x(data[i].date))
  .attr("cy",y(data[i].negativo))
  .attr("r",4)
  .attr("fill","#E17C72");
};

svg.append("text").text("Día")
.attr("transform", "translate("+ (width - margin.left - margin.right)/2 + ","+ (height-(-30))+")")
.style("font-size",12);
  
svg.append("text").text("Cantidad de Tweets")
.attr("transform", "rotate(-90)")
.attr("x",((width/2-margin.bottom-margin.left)*-1))
.attr("y",(margin.right-(-1))*-1)
//.attr("transform", "translate("+ (margin.left)  + ","+ (height-(-30))/2+")")
.style("font-size",12);
  // Add the X Axis
  svg.append("g")
      .attr("class", "axisColor")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
      .attr("class", "axisColor")
      .attr("transform","translate(10,0)")
      .call(d3.axisLeft(y));
  }
  
  draw(data);
}

function map(container,compara){
  var margin = {
    top: 20, 
    right:30, 
    bottom: 20, 
    left: 30
  },
  height = 435;//parseInt(d3.select(container).style("height")) - margin.top - margin.bottom;
  width = 900;//parseInt(d3.select(container).style("width"));
  // Ajustes de proyección para mercator   
  var projection = d3.geo.mercator()
    .center([0, 8])// centro del mapa en grados
    .scale(width/7.5)// zoomlevel
    .rotate([00,0]);// map-rotation
  //Selección de container
  var svg = d3.select(container).append("svg")
    .attr("width", width)
    .attr("height", height);
  // definición de "path" y declaración de escala(projection)
  var path = d3.geo.path()
    .projection(projection);
  //agrupa las capas svg
  var g = svg.append ("g");
  // Carga de datos y visualización del mapa en el canvas
  d3.json("js/datos/map.json", function(error, topology) { 
      var pathmap = g.selectAll("path")
          .data(topojson.object(topology, topology.objects.countries)
          .geometries)
          .enter()
          .append("path")
          .attr("d", path)
          .attr("class","pathmap")
          .on("mouseover", function(d,i){ d3.select(this).style('fill','#AED6F1');})
          .on("mouseout",function(d,i){d3.select(this).style('fill','#D0D3D4')}) 
  });

  // Carga  JSON de marcadores en el mapa
  d3.json("js/datos/countries.json", function(error, marks) {
      array1 = [];
      // Ciclo de comparación entre json guia y json generado por modelo
      for (var i = 0 ; i < compara.length; i++) {
          if(compara[i].location.toLowerCase()=="null"){
            var textw= svg.append("text").text("Nota: Tweets sin ubicación disponible:"+ "" + compara[i].count)
              .attr("transform", function(d) {return "translate(" + projection([-171,-62]) + ")";})
              .style("font-size","12")
              .style("font-family", "'Quicksand', sans-serif");
            }
          else{}
        for (var j = 0; j < marks.length; j++) {
          if(compara[i].location.toLowerCase() === marks[j].location.toLowerCase()){
          marks[j].categ=compara[i].cat;
          marks[j].cant=compara[i].count;
            array1.push(marks[j]);
          }
          else{
          }
        }
      }
      // Generación de marcadores a partir de comparación realizada
      var marcador = svg.selectAll(".mark")
        .data(array1)
        .enter()
        .append("image")
        .attr('class',function(d){return "mark" +" "+"mark"+d.categ})
        .attr('width', 20)
        .attr('height', 20)
        .style("cursor","pointer")
        .attr("href",function(d){
          
          return'img/twitter'+ d.categ+'.png'})
        .attr("transform", function(d) {return "translate(" + projection([d.lng-4.5,d.lat-(-5.00)]) + ")";})
        .append("title").text(function(d) {return d.name +"\n"+"Total de tweets:"+" "+d.cant;});
      // Generación de convenciones
      var imagenconv = svg.append("image")
        .attr('width', width/11)
        .attr('height', height/4.5)
        .attr("href",function(d){return'img/convenciones.jpg'})
        .attr("transform", function(d) {
          return "translate(" + projection([-180,4]) + ")";})
  });
}


/*Line graph simple*/

function SimplelineGraph(data, container) {

// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 33, left: 30},
    width = parseInt(d3.select(container).style("width")) - margin.left - margin.right;
    height = 155;

// parse the date / time
var parseTime = d3.timeParse("%H");

// set the ranges
var x = d3.scaleLinear().range([10, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
    .x(function(d) { return x(parseInt(d.time)); })
    .y(function(d) { return y(d.count); });

  
// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select(container).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

function draw(data) {
    
  // format the data
  data.forEach(function(d) {
      d.time = parseInt(d.time);//parseTime(d.time);
      d.count = +d.count;
      //console.log(d.time);
  });
  
  // sort years ascending
  data.sort(function(a, b){
    return a["time"]-b["time"];
  })
 
  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.time; }));
  y.domain([0, d3.max(data, function(d) {
    return Math.max(d.count); })]);
  
  // Add the valueline path.
  svg.append("path")
      .data([data])
      .attr("class", "lineP")
      .attr("d", valueline);
  
for(var i=0;i<data.length;i++){
  svg.append("circle")
  .data(data)
  .attr("cx",x(data[i].time))
  .attr("cy",y(data[i].count))
  .attr("r",4)
  .attr("fill","#66BEE7");

};  
  svg.append("text").text("Hora")
      .attr("transform", "translate("+ (width - margin.left - margin.right)/2 + ","+ (height-(-30))+")")
      .style("font-size",12);
  svg.append("text").text("Cantidad de Tweets")
      .attr("transform", "rotate(-90)")
      .attr("x",((width/2-margin.bottom-margin.left)*-1))
      .attr("y",(margin.right-(5))*-1)
      //.attr("transform", "translate("+ (margin.left)  + ","+ (height-(-30))/2+")")
      .style("font-size",12);
  // Add the X Axis
  svg.append("g")
      .attr("class", "axisColor")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
      .attr("class", "axisColor")
      .attr("transform","translate(10,0)")
      .call(d3.axisLeft(y));
  }
  
  draw(data);
}


