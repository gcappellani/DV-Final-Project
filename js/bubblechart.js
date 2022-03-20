var canvasWidth = 1300;
var canvasHeight = 650;
var margin = { top: 100, right: 40, bottom: 80, left: 180 };

var svg = d3.select("body").append("svg")
    .attr("width",  canvasWidth)
    .attr("height", canvasHeight)

var width = canvasWidth - margin.left - margin.right;
var height = canvasHeight - margin.top - margin.bottom;
var minBubbleSize = 1;
var maxBubbleSize = 10;

svg.append("text")
    .attr("x", width/2)
    .attr("y", 30)
    .attr("font-size", "24px")
    .text("HP, CI and MPG relation for car brands made between 1971 and 1984")

var xScale = d3.scaleLinear().range([0, width]);
var yScale = d3.scaleLinear().range([height, 0]);
var zScale = d3.scaleLinear().range([minBubbleSize, maxBubbleSize]);

var container_g = svg.append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

d3.csv("https://raw.githubusercontent.com/gcappellani/DV-Final-Project/main/data/eminem.csv",
    function(d) {
        return {
            ci: +d[' cubicinches'],
            hp: +d[' hp'],
            mpg: +d['mpg'],
            brand: d[' brand']
        };
    }).then( function(data) {

    // We sort the cars by mpg descending order because when we will be displaying
    // the different dots we want the bigger ones to be displayed first, so that
    // they will not cover the smaller dots
    var sortedCars = d3.rollup(data, d => d).sort((a,b) => d3.descending(a.mpg, b.mpg))

    // Getting the unique values for brand feature
    // The following tutorial helped for this instruction:
    // https://stackoverflow.com/questions/28572015/how-to-select-unique-values-in-d3-js-from-data
    var brands = [...new Set(data.map(d => d.brand))];
    var colors = ["rgb(239,145,139)", "rgb(97,187,78)", "rgb(199,139,239)"]

    xScale.domain([0, d3.max(data, d => d.ci) + 50]);
    yScale.domain([0, d3.max(data, d => d.hp) + 20]);
    zScale.domain([d3.min(data, d => d.mpg), d3.max(data, d => d.mpg)]);

    var colorScale = d3.scaleOrdinal()
        .domain(brands)
        .range(colors);

    // Display legend
    for (var i = 0; i < brands.length; i++) {
        svg.append("rect")
            .attr("x", 100 * i + 200)
            .attr("y", 50)
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", colors[i])
        svg.append("text")
            .attr("x", 100 * i + 225)
            .attr("y", 65)
            .text(brands[i])
    }

    // Display the X-axis
    container_g.append("g")
        .attr("transform", "translate(0, " + height + ")")
        .call(d3.axisBottom(xScale))
        .append("text")
        .attr("y", 50)
        .attr("x", width/2)
        .attr("stroke", "black")
        .attr("fill", "black")
        .attr("font-size", "15px")
        .text("Cubic Inches")

    // Display the Y-axis
    container_g.append("g")
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -100)
        .attr("stroke", "black")
        .attr("fill", "black")
        .attr("font-size", "15px")
        .text("Horse Power")

    // Displaying tooltips
    var tooltip = d3.select("g")
        .append("text")
        .attr("position", "absolute")
        .style("color", "black")

    var showTooltip = function(event, d) {
        // To get mouse position this post on stack overflow has been useful
        // https://stackoverflow.com/questions/16770763/mouse-position-in-d3
        var coords = d3.pointer(event);
        tooltip
            .transition()
            .duration(200)
        tooltip
            .style("opacity", 1)
            .html("MPG: " + d.mpg)
            .attr("x", coords[0])
            .attr("y", coords[1]-125)
    }

    var hideTooltip = function(d) {
        tooltip
            .transition()
            .duration(200)
            .style("opacity", 0)
    }

    // Display dots
    container_g.selectAll("circle").data(sortedCars)
        .enter().append("circle")
        .attr("cy", d => yScale(d.hp))
        .attr("cx", d => xScale(d.ci))
        .attr("r", d => zScale(d.mpg))
        .attr("fill", d => colorScale(d.brand))
        .attr("stroke", "white")
        .attr("stroke-width", .5)
        .on("mouseover", showTooltip)
        .on("mouseout", hideTooltip);
})