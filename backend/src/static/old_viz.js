// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 40},
width = 800 - margin.left - margin.right,
height = 800 - margin.top - margin.bottom;


// append the svg object to the body of the page
var svg = d3.select("#graph")
.append("svg")
// .attr("width", width + margin.left + margin.right)
.attr("width", parseInt(d3.select('#graph').style('width'), 10))
// .attr("height", height + margin.top + margin.bottom)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");


//add encompassing group for the zoom 
// var g = svg.append("g")
//     .attr("class", "everything");
//add zoom capabilities 
var zoom_handler = d3.zoom()
  .on("zoom", function zoom_actions(){
  svg.attr("transform", d3.event.transform)
});

zoom_handler(svg); 

var data_loader = function (subredditQuery) {
d3.json("http://0.0.0.0/sidebar/api/v1.0/search?subreddit=" + subredditQuery, function(data) {
draw(data);  
});
}
// Example on first load
data_loader("movies");

// Callback for when a node is expanded


// Draw everything based on the data given below!
var draw = function (data, d=null){
  console.log("Hello")
  console.log(data);
  var link = svg
    .selectAll("line")
    .data(data.links)
    .enter()
    .append("line")
      .style("stroke", function(d){if (d.type == "TARGET"){return "#FF0000"} else if(d.type == "KNOWS") {return "#0000FF"} else {return "#00FF00"}})
      .attr('marker-end','url(#arrowhead)');

  console.log("This is in draw; nodes: " + data.nodes);
  // Gradient
  var gradientData = new Array(2);
  var defs = svg.append("defs");
  var gradient = defs.append("linearGradient")
    .attr("id", "svgGradient")
    .attr("x1", "0%")
    .attr("x2", "0%")
    .attr("y1", "100%")
    .attr("y2", "100%");

  var stops = gradient.selectAll('stop')
    .data(gradientData)
    .enter()
    .append('stop')
    .attr('offset', "0%")//function(a, i) { return i * 0.04 + '%'; })
    .attr('stop-color', getRandomColor())

  function getRandomColor() {
      var letters = '0123456789ABCDEF'.split('');
      var color = '#';
      for (var i = 0; i < 6; i++ ) {
          color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
  }
  function randomPercent () {
    return Math.random() * 100 + '%';  
  }
  function dragged(d) {
    d.x = d3.event.x, d.y = d3.event.y;
    d3.select(this).attr("cx", d.x).attr("cy", d.y);
    link.filter(function(l) { return l.source === d; }).attr("x1", d.x).attr("y1", d.y);
    link.filter(function(l) { return l.target === d; }).attr("x2", d.x).attr("y2", d.y);
    textElems.filter(function(l) { return l.text === d; }).attr("x", d.x).attr("y", d.y);
  }
  // Initialize the nodes
  var node = svg
    .selectAll("circle")
    .data(data.nodes)
    .enter()
    .append("circle")
      .attr("r", 50)
      // .style("fill", "#69b3a2")
      .style("fill", "url(#svgGradient)")
      .text("hello")
      .on("click", function(d) {
          alert("on click " + d.id);
      })
      .call(d3.drag().on("drag", dragged));

  // Add names to all the nodes
  const textElems = svg.append('g')
    .selectAll('text')
    .data(data.nodes)
    .enter().append('text')
    .text(d => d.name)
    .style("font-size", function(d) { return Math.min(3 * 23, (3 * 23 - 8) / this.getComputedTextLength() * 24) + "px"; })
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central") 
    .attr('font-size',12)
    .attr('fill',"#ffffff")
    .on("click", function(d) {
          alert("on click " + d.name);
          data_loader(d.name, d);
    });
    // .attr('dx', -14)//positions text towards the left of the center of the circle
    // .attr('dy',4);

  // Let's list the force we wanna apply on the network
  var simulation = d3.forceSimulation(data.nodes)                 // Force algorithm is applied to data.nodes
      .force("center", d3.forceCenter(width / 2, height / 2))     // This force attracts nodes to the center of the svg area
      .force("link", d3.forceLink()                               // This force provides links between nodes
            .id(function(d) { return d.id; })                     // This provide  the id of a node
            .links(data.links)                                    // and this the list of links
      )
      .force("charge", d3.forceManyBody().strength(-4000))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
      .velocityDecay(0.4)
      .alphaTarget(0.1)
      .on("tick", ticked);

  //add zoom capabilities 
  var zoom_handler = d3.zoom()
      .on("zoom", zoom_actions);

  zoom_handler(svg);

  // This function is run at each iteration of the force algorithm, updating the nodes position.
  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function (d) { return d.x+6; })
        .attr("cy", function(d) { return d.y-6; });
    
    textElems
        .attr("x", function (d) { return d.x+6; })
        .attr("y", function(d) { return d.y-6; });
    // d3.selectAll('stop')
    //     .transition()
    //     .ease(d3.easeElastic)
    //     .duration(0)
    //     // .attr('offset', "100%") 
    //     .attr('stop-color', getRandomColor)
    // d3.selectAll('linearGradient')
    // .transition()
    // .ease(d3.easeElastic)
    // .duration(50000)
    // .attr('x1', randomPercent)
    // .attr('x2', randomPercent)
    // .attr('y1', randomPercent)
    // .attr('y2', randomPercent)
  };
};






// console.log("Finished drawing?")
// d3.select("nav").select("form")
//   .on("submit", function(){
//     console.log("this is all of data yo: " + data)
//     console.log(data.links.length)
//     console.log(data.nodes.length)
//     svg.selectAll("circle").data(data, function(d){return d.name;}).exit().remove()
//     svg.selectAll("line").data(data, function(d){return d.id;}).exit().remove()
//     svg.selectAll("text").data(data, function(d){return d.id;}).exit().remove()
//     data.links = []
//     data.nodes = []
//     console.log("Getting rid of circles and links")
//     console.log(data.links.length)
//     console.log(data.nodes.length)

//     // Get the data again
//     var url = "http://0.0.0.0/sidebar/api/v1.0/search?subreddit="+document.getElementById("subredditQuery").value;
//     console.log(url);
//     $.getJSON(url, data, function success(temp_data) {
//         console.log("This is the new data " + temp_data)
//         data = temp_data;
//     });