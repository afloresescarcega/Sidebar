// 
// This file allows the visualizations of the Sidebar site to animate
// 
let subredditQuery = "movies"
// data = d3.json("http://0.0.0.0/sidebar/api/v1.0/search?subreddit=" + subredditQuery, function(data) {return data});


var margin = {top: 10, right: 30, bottom: 30, left: 40},
width = 800 - margin.left - margin.right,
height = 800 - margin.top - margin.bottom;

var svg = d3.select("#graph")
    .append("svg")
    .attr("width", parseInt(d3.select('#graph').style('width'), 10))
    .attr("height", height + margin.top + margin.bottom);

let l = ['1', '2', '3', '4']
// var hehe = svg
//     .selectAll("circle")
//     .data(l)
//     .enter()
//     .append("circle")
//         .text(function(d) {return d})
//         .style("fill", "#ff0000")
//         .attr("r", 50)
//         .attr("cx", 400)
//         .attr("cy", 400);

//     svg.append("circle")
//     .attr("cx", 2).attr("cy", 2).attr("r", 40).style("fill", "#69b3a2");
//   svg.append("circle")
//     .attr("cx", 140).attr("cy", 70).attr("r", 40).style("fill", "red");
//   svg.append("circle")
//     .attr("cx", 300).attr("cy", 100).attr("r", 40).style("fill", "green");

function restart() {
    node = node.data(nodes)
}

d3.json("http://0.0.0.0/sidebar/api/v1.0/search?subreddit=" + subredditQuery, function(data) {
    // var links = svg
    // .selectAll("line")
    // .data(data)
    // .enter()
    // .append("line");
    console.log(data);

    var link = svg
        .selectAll("line")
        .data(data.links)
        .enter()
        .append("line")
            .style("stroke", function(d){if (d.type == "TARGET"){return "#FF0000"} else if(d.type == "KNOWS") {return "#0000FF"} else {return "#00FF00"}})
            .attr('marker-end','url(#arrowhead)')
    ;

    var nodes = svg
        .selectAll("circle")
        .data(data.nodes)
        .enter()
        .append("circle")
            .attr("r", 50)
            .style("fill", "#ff0000")
            .attr("cx", 100)
            .attr("cy", 100)
            .style("color", "#00")
            .on("click", function(d) {
                console.log("I've been clicked on" + d.name);
                draw(d.name);
            })
    ;

    var draw = function(name){
        console.log("Uh-oh")
        d3.json("http://0.0.0.0/sidebar/api/v1.0/search?subreddit=" + name, function(_data) {
            svg
                .selectAll("circle")
                .data(_data.nodes)
                .enter()
                .append("circle")
                    .attr("r", 50)
                    .style("fill", "#ff0000")
                    .attr("cx", 100)
                    .attr("cy", 100)
                    .style("color", "#00")


        });
    }
    
    var labels = svg
        .selectAll("text")
        .data(data.nodes)
        .enter()
        .append("text")
            .attr('x', 400)
            .attr('y', 400)
            // .attr('font-size',12)
            .attr('fill',"#00")
            .style("font-size", function(d) { return Math.min(10, (23 - 8) / this.getComputedTextLength() * 24) + "px"; })
            .attr("text-anchor", "middle")
            .text(d => d.name)
        ;


    // //Add a group to hold the circles
    // var circleGroup = svg.append("g");
    
    // //Add circles to the circleGroup
    // var circles = circleGroup.selectAll("circle")
    //                           .data(data.nodes)
    //                           .enter()
    //                           .append('text')
    //                                 .attr('x', 400)
    //                                 .attr('y', 400)
    //                                 // .attr('font-size',12)
    //                                 .attr('fill',"#00")
    //                                 .text(d => d.name)
    //                           .append("circle")
    //                                 .attr("cx", function (d) { return 400; })
    //                                 .attr("cy", function (d) { return 400; })
    //                                 .attr("r", function (d) { return 40; })
    //                                 .style("fill", function (d) { return "#0000FF"; });
    
            

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

    function ticked() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
    
        nodes
            .attr("cx", function (d) { return d.x+6; })
            .attr("cy", function(d) { return d.y-6; });
        
        labels
            .attr("x", function (d) { return d.x+6; })
            .attr("y", function(d) { return d.y-6; });

        };
});



