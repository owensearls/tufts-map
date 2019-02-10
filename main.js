function color(owner) {
  if (/TUFTS/i.test(owner)) {
    return "#417dc1"
  } else if (/WALNUT/i.test(owner)) {
    return "#F03A47"
  } else {
    return "none"
  }
}

var width = 1000,
    height = 1000;

var svg = d3.select("div#map").append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr('viewBox', `0 0 ${height} ${width}`)
            .attr('preserveAspectRatio', 'xMinYMid');

var projection = d3.geoAlbers()
    .rotate([71.12,0])
    .center([0, 42.406])
    .scale(4200000)
    .translate([width / 2, height / 2]);

var path = d3.geoPath()
    .projection(projection);

Promise.all([
  d3.json("data/tufts-medford.geojson"),
  d3.json("data/tufts-somerville.geojson"),
]).then(render);

function render(data) {
  map = [].concat.apply([], data.map(x => x.features))
  svg.append("g")
    .selectAll("path")
    .data(map)
    .enter().append("path")
      .attr("stroke", "black")
      .attr("fill", function (d) {return color(d.properties.OWNER1)})
      .attr("d", path);
}
