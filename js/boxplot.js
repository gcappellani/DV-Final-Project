var canvasWidth = 1000;
var canvasHeight = 500;
var margin = { top: 50, right: 40, bottom: 80, left: 180 };

var width = canvasWidth - margin.left - margin.right;
var height = canvasHeight - margin.top - margin.bottom;

var xScale = d3.scaleBand().range([0, width]);
var yScale = d3.scaleLinear().range([height, 0]);

function drawGraph(yValue) {
    d3.csv("https://raw.githubusercontent.com/gcappellani/DV-Final-Project/main/data/eminem.csv",
        function (d) {
            year = +d['album_released'].split("/")[2]
            if (year < 90) {
                year += 2000
            } else {
                year += 1900
            }
            return {
                danceability: +d['danceability'],
                energy: +d['energy'],
                loudness: +d['loudness'] + 25.5,
                speechiness: +d['speechiness'],
                acousticness: +d['acousticness'],
                positiveness: +d['valence'],
                tempo: +d['tempo'],
                year: year
            }
        }, function (data) {

            d3.select("svg").remove()

            var svg = d3.select("body").append("svg")
                .attr("width",  canvasWidth)
                .attr("height", canvasHeight)

            svg.append("text")
                .attr("transform", "translate(100, 0)")
                .attr("x", width/3)
                .attr("y", 30)
                .attr("font-family", "sans-serif")
                .attr("font-size", "30px")
                .text("Eminem style features overtime")

            var container_g = svg.append("g")
                .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

            var boxesPerYear = d3.nest()
                .key(d => d.year)
                .rollup(function (d) {
                    quartile1 = d3.quantile(d.map(v => v[yValue]).sort(d3.ascending), .25)
                    median = d3.quantile(d.map(v => v[yValue]).sort(d3.ascending), .5)
                    quartile3 = d3.quantile(d.map(v => v[yValue]).sort(d3.ascending), .75)
                    min = d3.min(d.map(v => v[yValue]))
                    max = d3.max(d.map(v => v[yValue]))
                    return ({quartile1: quartile1, median: median, quartile3: quartile3, min: min, max: max})
                }).entries(data);

            var years = [...new Set(data.map(d => d.year))]

            xScale.domain(years);
            yScale.domain([0, d3.max(data, function (d) {
                return d[yValue]
            })])

            // Display the X-axis
            container_g.append("g")
                .attr("transform", "translate(0, " + height + ")")
                .call(d3.axisBottom(xScale))
                .append("text")
                .attr("y", 50)
                .attr("x", width / 2)
                .attr("stroke", "black")
                .attr("fill", "black")
                .attr("font-size", "15px")
                .text("Year");

            // Display the Y-axis
            container_g.append("g")
                .call(d3.axisLeft(yScale))

            // Show the main vertical line
            container_g.selectAll("vertLines")
                .data(boxesPerYear)
                .enter()
                .append("line")
                .attr("x1", d => xScale(d.key) + xScale.bandwidth() / 2)
                .attr("x2", d => xScale(d.key) + xScale.bandwidth() / 2)
                .attr("y1", d => yScale(d.value.min))
                .attr("y2", d => yScale(d.value.max))
                .attr("stroke", "black")
                .style("width", 40);

            container_g.selectAll("minDots")
                .data(boxesPerYear)
                .enter()
                .append("circle")
                .attr("cx", d => xScale(d.key) + xScale.bandwidth() / 2)
                .attr("cy", d => yScale(d.value.min))
                .attr("r", 2)
                .attr("stroke", "black")
                .style("fill", "rgb(0,0,0)")

            container_g.selectAll("maxDots")
                .data(boxesPerYear)
                .enter()
                .append("circle")
                .attr("cx", d => xScale(d.key) + xScale.bandwidth() / 2)
                .attr("cy", d => yScale(d.value.max))
                .attr("r", 2)
                .attr("stroke", "black")
                .style("fill", "rgb(0,0,0)")

            var boxWidth = 20;
            container_g.selectAll("boxes")
                .data(boxesPerYear)
                .enter()
                .append("rect")
                .attr("x", d => xScale(d.key) - boxWidth / 2 + xScale.bandwidth() / 2)
                .attr("y", d => yScale(d.value.quartile3))
                .attr("height", d => yScale(d.value.quartile1) - yScale(d.value.quartile3))
                .attr("width", boxWidth)
                .attr("stroke", "black")
                .style("fill", "rgb(184,72,72)")

            container_g.selectAll("medianLines")
                .data(boxesPerYear)
                .enter()
                .append("line")
                .attr("x1", d => xScale(d.key) - boxWidth / 2 + xScale.bandwidth() / 2)
                .attr("x2", d => xScale(d.key) + boxWidth / 2 + xScale.bandwidth() / 2)
                .attr("y1", d => yScale(d.value.median))
                .attr("y2", d => yScale(d.value.median))
                .attr("stroke", "black")
                .style("width", 80)

        })
}

function setGraph() {
    yValue = d3.select("#y-value").property("value")
    drawGraph(yValue)
}

setGraph()