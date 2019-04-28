function color(owner) {
  if (/TUFTS/i.test(owner)) {
    return "#417dc1"
  } else if (/WALNUT/i.test(owner)) {
    return "#F03A47"
  } else {
    return "none"
  }
}

var height = 1000,
    width = 2000;

var svg = d3.select("div#map").append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('preserveAspectRatio', 'xMinYMid');

var projection = d3.geoAlbers()
    .rotate([71.118,0])
    .center([0, 42.4067])
    .scale(5700000)
    .translate([width / 2, height / 2]);

var path = d3.geoPath()
    .projection(projection);

Promise.all([
  d3.json("data/2019/tufts-medford.json"),
  d3.json("data/2019/tufts-somerville.json"),
]).then(render);

function render(data) {
  map = [].concat.apply([], data.map(x => x.features));
  svg.append("g")
    .selectAll("path")
    .data(map)
    .enter().append("path")
      .attr("stroke", "black")
      .attr("fill", function (d) {return color(d.properties.OWNER1)})
      .attr("d", path);

  console.log(map
    .filter(x => color(x.properties.OWNER1) != "none")
    .map(x => (x.properties.TOTAL_VAL))
    .reduce((x, y) => x + y));
}
