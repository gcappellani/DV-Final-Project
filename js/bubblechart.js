var canvasWidth = 1000;
var canvasHeight = 650;
var margin = { top: 100, right: 200, bottom: 100, left: 180 };

var width = canvasWidth - margin.left - margin.right;
var height = canvasHeight - margin.top - margin.bottom;
var minBubbleSize = 1;
var maxBubbleSize = 10;

var xScale = d3.scaleLinear().range([0, width]);
var yScale = d3.scaleLinear().range([height, 0]);
var zScale = d3.scaleLinear().range([minBubbleSize, maxBubbleSize]);
var colors = colorbrewer["Reds"][8]
var colorScale = d3.scaleLinear().range([colors[colors.length-1], colors[0]])

function drawGraph(xValue, yValue, zValue, colorValue) {
    d3.csv("https://raw.githubusercontent.com/gcappellani/DV-Final-Project/main/data/eminem.csv",
        function (d) {
            return {
                danceability: +d['danceability'],
                energy: +d['energy'],
                loudness: +d['loudness'] + 25.5,
                speechiness: +d['speechiness'],
                acousticness: +d['acousticness'],
                positiveness: +d['valence'],
                tempo: +d['tempo']
            }
        }).then(function (data) {

        d3.select("svg").remove()

        var svg = d3.select("body").append("svg")
            .attr("width",  canvasWidth)
            .attr("height", canvasHeight)

        svg.append("text")
            .attr("transform", "translate(100, 0)")
            .attr("x", width/2)
            .attr("y", 30)
            .attr("font-size", "24px")
            .attr("font-family", "sans-serif")
            .text("Eminem style")

        var container_g = svg.append("g")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

        // We sort the cars by mpg descending order because when we will be displaying
        // the different dots we want the bigger ones to be displayed first, so that
        // they will not cover the smaller dots
        var sortedSongs = d3.rollup(data, d => d).sort((a, b) => d3.descending(a[zValue], b[zValue]))

        xScale.domain([0, d3.max(data, d => d[xValue])])
        yScale.domain([0, d3.max(data, d => d[yValue])])
        zScale.domain([d3.min(data, d => d[zValue]), d3.max(data, d => d[zValue])])
        colorScale.domain([d3.max(data, d => d[colorValue]), d3.min(data, d => d[colorValue])])

        var legendLinear = d3.legendColor()
            .shapeWidth(20)
            .shapeHeight(30)
            .cells(5)
            .orient('vertical')
            .ascending(false)
            .scale(colorScale);

        var legendSize = d3.legendSize()
            .shape('circle')
            .shapePadding(15)
            .labelOffset(20)
            .orient('vertical')
            .scale(zScale)

        // Display the X-axis
        container_g.append("g")
            .attr("transform", "translate(0, " + height + ")")
            .call(d3.axisBottom(xScale))

        // Display the Y-axis
        container_g.append("g")
            .call(d3.axisLeft(yScale))

        // Display dots
        container_g.selectAll("circle").data(sortedSongs)
            .enter().append("circle")
            .attr("cy", d => yScale(d[yValue]))
            .attr("cx", d => xScale(d[xValue]))
            .attr("r", d => zScale(d[zValue]))
            .attr("fill", d => colorScale(d[colorValue]))
            .attr("stroke", "white")
            .attr("stroke-width", .5)

        container_g.append("g")
            .attr("class", "legendLinear")
            .attr("transform", "translate(" + (width + 90) + "," + 10 + ")")
        container_g.select(".legendLinear")
            .call(legendLinear)

        container_g.append("g")
            .attr("class", "legendSize")
            .attr("transform", "translate(" + (width + 90) + "," + 300 + ")")
        container_g.select(".legendSize")
            .call(legendSize)

    })
}

function setGraph() {
    xValue = d3.select("#x-value").property("value")
    yValue = d3.select("#y-value").property("value")
    zValue = d3.select("#z-value").property("value")
    colorValue = d3.select("#color-value").property("value")
    drawGraph(xValue, yValue, zValue, colorValue);
}

setGraph()