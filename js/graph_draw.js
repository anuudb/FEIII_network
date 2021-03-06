var netDiv = document.getElementById("network");
// get the data
d3.csv("data/data.csv", function(error, links) {

    var nodes = {};

    // Compute the distinct nodes from the links.
    links.forEach(function(link) {
        link.source = nodes[link.source] ||
            (nodes[link.source] = {
                name: link.source
            });
        link.target = nodes[link.target] ||
            (nodes[link.target] = {
                name: link.target
            });
        link.role = link.Role;
    });

    var width = netDiv.clientWidth;
    height = window.innerHeight;

    console.log("w : " + width + " h : " + height);
	//console.log(nodes);

    var force = d3.layout.force()
        .nodes(d3.values(nodes))
        .links(links)
        .size([width, height])
        .linkDistance(60)
        .charge(-300)
        .on("tick", tick)
        .start();

    var svg = d3.select("#network").append("svg")
        .attr("width", width)
        .attr("height", height);

    // build the arrow.
    svg.append("svg:defs").selectAll("marker")
        .data(["end"]) // Different link/path types can be defined here
        .enter().append("svg:marker") // This section adds in the arrows
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", -1.5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");

    // add the links and the arrows
    var path = svg.append("svg:g").selectAll("path")
        .data(force.links())
        .enter().append("svg:path")
        //    .attr("class", function(d) { return "link " + d.type; })
        .attr("class", "link")
        .attr("marker-end", "url(#end)");

    // define the nodes
    var node = svg.selectAll(".node")
        .data(force.nodes())
        .enter().append("g")
        .attr("class", "node")
        .call(force.drag);

    // add the nodes
    node.append("circle")
        .attr("r", 5);

    // add the text 
    node.append("text")
        .attr("x", 12)
        .attr("dy", ".35em")
        .text(function(d) {
            return d.name;
        });

    // add the curvy lines
    function tick() {
        path.attr("d", function(d) {
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);
            return "M" +
                d.source.x + "," +
                d.source.y + "A" +
                dr + "," + dr + " 0 0,1 " +
                d.target.x + "," +
                d.target.y;
        });

        node
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
    }

	//add slider to the page
    $("#slider").slideReveal("false");
    $(function() {
        slider = $('#slider').slideReveal({
            trigger: $("#trigger")
        });
    });

    var linkedByIndex = {};
		
	function isConnected(a, b) {
        return nodes[a.index + "," + b.index] || nodes[b.index + "," + a.index] || a.index == b.index;
    }

	function hasConnections(a) {
		for (var property in nodes) {
				s = property.split(",");
				if ((s[0] == a.index || s[1] == a.index) && nodes[property]) 					return true;
		}
	return false;
	}
	
	node.on("mouseover", function(d) {
		isConnected(d);
	});
});