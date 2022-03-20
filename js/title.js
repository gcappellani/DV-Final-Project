var canvasWidth = 1200;
var canvasHeight = 100;

var svg1 = d3.select("body").append("svg")
    .attr("width",  canvasWidth)
    .attr("height", canvasHeight)

svg1.append("text")
    .attr("x", "50%")
    .attr("y", "50%")
    .attr("text-anchor", "middle")
    .attr("font-size", "40px")
    .attr("font-family", "sans-serif")
    .attr("font-weight", 700)
    .style("fill", "rgb(124,0,0)")
    .text("Eminem is getting old")

var svg2 = d3.select("body").append("svg")
    .attr("width",  canvasWidth)
    .attr("height", 50)

svg2.append("text")
    .attr("x", "50%")
    .attr("y", "50%")
    .attr("text-anchor", "middle")
    .attr("font-size", "25px")
    .attr("font-family", "sans-serif")
    .attr("font-weight", 400)
    .style("fill", "rgb(0,0,0)")
    .text("A project by Giulio Cappellani")



