
var width = 960,
height = 500;

let url_prefix = "http://0.0.0.0/sidebar/api/v1.0/search?subreddit=";
let url = url_prefix + "movies";


var force = d3.layout.force()
    .size([width, height])
    .nodes([{}]) // init with a single node
    .linkDistance(30)
    .charge(-600)
    .on("tick", tick);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    // .on("mousemove", mousemove)
    .on("mousedown", mousedownCanvas);


var nodes = force.nodes(),
    links = force.links(),
    node = svg.selectAll(".node"),
    link = svg.selectAll(".link");


// var cursor = svg.append("circle")
//     .attr("r", 30)
//     .attr("transform", "translate(-100, -100)")
//     .attr("class", "cursor");


restart();

    

function tick() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    
    // node.attr("cx", function(d) { return d.x; })
    //     .attr("cy", function(d) { return d.y; });
    node = svg.selectAll(".node");
    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}

function restart(_url = url) {
    console.log("This is my url" + _url);
    console.log(nodes);
    
    d3.json(_url, (d) => {
        d.nodes.forEach((thisNode) => {
            console.log(thisNode.id + ": " + thisNode.name);
            if (nodes[thisNode.id + 1] !== undefined) {
                console.log("This id exists: ".concat(thisNode.id + 1));
                nodes[thisNode.id + 1]["id"] = thisNode.id + 1;
                nodes[thisNode.id + 1]["name"] = thisNode.name;
            } else if (nodes[thisNode.id + 1] === undefined) {
                console.log("This id didn't exist: ".concat(thisNode.id + 1));
                nodes.push({"index" : thisNode.id + 1, "id" : thisNode.id + 1, "name": thisNode.name});
            }
        });
        var node = svg.selectAll(".node");
        var nodeEnter = node.data(nodes, function(d, i) { return d.name; }).enter()
            .append("g")
                .attr("class", "node")
                .call(force.drag);
        var circlesEnter = nodeEnter
            .append("circle")
                .attr("r", 30)
                .style("fill", "rgb(12,240,233)" )
                .on("mousedown", mousedownNode);
            
        var textEnter = nodeEnter
            .append("text")
                .attr("dx", 0)
                .attr("dy", ".35em")
                .text(function(d) { return d.name });

        console.log("The size of the selection is: " + svg.selectAll('.node').data(nodes).size());
        

        node.data(nodes).exit().remove();
        link = link.data(links);

        link.enter().insert("line", ".node")
            .attr("class", "link");
        link.exit()
            .remove();
        force.start();
    });

    
}

function mousemove() {
    cursor.attr("transform", "translate(" + d3.mouse(this) + ")");
}
function mousedownCanvas() {
    // var point = d3.mouse(this),
    //     node = {x:point[0], y:point[1]},
    //     n = nodes.push(node);

    restart();
}

function mousedownNode(d, i) {
    // nodes.splice(i, 1);
    // links = links.filter(function(l) {
    //     return l.source !== d && l.target !== d;
    // });

    d3.event.stopPropagation();

    restart(url_prefix + d.name);
}