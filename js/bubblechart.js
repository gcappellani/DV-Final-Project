var canvasWidth = 1000;
var canvasHeight = 650;
var margin = { top: 100, right: 200, bottom: 100, left: 180 };

var svg = d3.select("body").append("svg")
    .attr("width",  canvasWidth)
    .attr("height", canvasHeight)

var width = canvasWidth - margin.left - margin.right;
var height = canvasHeight - margin.top - margin.bottom;
var minBubbleSize = 1;
var maxBubbleSize = 10;

svg.append("text")
    .attr("transform", "translate(100, 0)")
    .attr("x", width/2 + 40)
    .attr("y", 30)
    .attr("font-family", "sans-serif")
    .attr("font-size", "30px")
    .text("Eminem style")

var xScale = d3.scaleLinear().range([0, width]);
var yScale = d3.scaleLinear().range([height, 0]);
var zScale = d3.scaleLinear().range([minBubbleSize, maxBubbleSize]);
var colors = colorbrewer["Reds"][8]
var colorScale = d3.scaleLinear().range([colors[colors.length-1], colors[0]])

var container_g = svg.append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

d3.csv("https://raw.githubusercontent.com/gcappellani/DV-Final-Project/main/data/eminem.csv",
    function(d) {
        return {
            danceability: +d['danceability'],
            energy: +d['energy'],
            loudness: +d['loudness'],
            speechiness: +d['speechiness'],
            acousticness: +d['acousticness'],
            positiveness: +d['valence'],
            tempo: +d['tempo']
        }
    }).then( function(data) {

    // We sort the cars by mpg descending order because when we will be displaying
    // the different dots we want the bigger ones to be displayed first, so that
    // they will not cover the smaller dots
    var sortedSongs = d3.rollup(data, d => d).sort((a,b) => d3.descending(a.positiveness, b.positiveness))

    xScale.domain([0, d3.max(data, d => d.danceability)])
    yScale.domain([0, d3.max(data, d => d.speechiness)])
    zScale.domain([d3.min(data, d => d.positiveness), d3.max(data, d => d.positiveness)])
    colorScale.domain([d3.max(data, d => d.energy), d3.min(data, d => d.energy)])

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
        .append("text")
        .attr("y", 50)
        .attr("x", width/2)
        .attr("stroke", "black")
        .attr("fill", "black")
        .attr("font-size", "15px")
        .text("Danceability")

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
        .text("Speechiness")

    // Display dots
    container_g.selectAll("circle").data(sortedSongs)
        .enter().append("circle")
        .attr("cy", d => yScale(d.speechiness))
        .attr("cx", d => xScale(d.danceability))
        .attr("r", d => zScale(d.positiveness))
        .attr("fill", d => colorScale(d.energy))
        .attr("stroke", "white")
        .attr("stroke-width", .5)

    container_g.append("g")
        .attr("class", "legendLinear")
        .attr("transform", "translate(" + (width + 90) + "," + 10 + ")")
    container_g.select(".legendLinear")
        .call(legendLinear)
    container_g.append("g")
        .attr("transform", "translate(" + (width + 90) + "," + 0 + ")")
        .append("text")
        .attr("stroke", "black")
        .attr("fill", "black")
        .attr("font-size", "15px")
        .text("Energy")

    container_g.append("g")
        .attr("class", "legendSize")
        .attr("transform", "translate(" + (width + 90) + "," + 300 + ")")
    container_g.select(".legendSize")
        .call(legendSize)
    container_g.append("g")
        .attr("transform", "translate(" + (width + 90) + "," + 285 + ")")
        .append("text")
        .attr("stroke", "black")
        .attr("fill", "black")
        .attr("font-size", "15px")
        .text("Positiveness")

})