
var width = 960,
height = 500;

let url_prefix = "http://0.0.0.0/sidebar/api/v1.0/search?subreddit=";
let url = url_prefix + "movies";


var force = d3.layout.force()
    .size([width, height])
    .nodes([]) // init empty
    .linkDistance(200)
    .charge(-1000)
    .on("tick", tick);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

simulation
    .nodes(graph.nodes)
    .on("tick", ticked);

simulation.force("link")
    .links(graph.links);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    // .on("mousemove", mousemove)
    .on("mousedown", mousedownCanvas);


var nodes = force.nodes(),
    links = force.links(),
    node = svg.selectAll(".node"),
    link = svg.selectAll(".link");

let nodeNameToID = {};
let unique_id = 0;

// var cursor = svg.append("circle")
//     .attr("r", 30)
//     .attr("transform", "translate(-100, -100)")
//     .attr("class", "cursor");


restart();

    

function tick() {
    link = svg.selectAll(".link");
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
    console.log("links sane check " + links);
    
    d3.json(_url, (d) => {
        console.log("This is nodes so far before adding their names and ids " + nodes)
        console.log("This is what d.nodes looks like " + d.nodes.length);
        var origin_name =  d.nodes[d.nodes.length - 1].name;
        console.log("This is the origin: " + origin_name);
        nodeNameToID[origin_name] = d.nodes.length - 1;
        d.nodes.forEach((thisNode) => {
            console.log("\n\n"+thisNode.id + ": " + thisNode.name);
            if (thisNode.name in nodeNameToID) {
                console.log("This node exists: " + thisNode.name + ": " + nodeNameToID[thisNode.name]);
            } else {
                console.log("This node didn't exist: " + thisNode.name);
                nodes.push({"name": thisNode.name});
                nodeNameToID[thisNode.name] = unique_id;
                console.log(thisNode.name + " has unique_id: " + unique_id);
                console.log(thisNode.name + " originates from " + origin_name);
                console.log(thisNode.name + " maps to id " + nodeNameToID[origin_name]);
                if(thisNode.name != origin_name){
                    console.log("Pushing to links: " + nodeNameToID[origin_name] +", " + unique_id);
                    links.push({source: nodeNameToID[origin_name], target: unique_id});
                    console.log(links);
                } else {
                    console.log("culprits: " + thisNode.name + " " + origin_name);
                }
                unique_id += 1;
            }
        });
        console.log(links);
        links[0].source = nodeNameToID[origin_name];
        links[0].target = 0;
        console.log(links);
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

        var link = svg.selectAll(".link");


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