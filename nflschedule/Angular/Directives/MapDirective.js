angular.module("scheduleApp.directives").directive("map", function() {
    return {
        restrict: "E",
        replace: true,
        scope: {
            data:'=',
            selectedGame:'='
        },
        link: function(scope, element) {

            var buff = { "name": "buf", "geometry": { "coordinates": [-78.84949, 42.905] } };

            var w = 600, h = 400;

            var projection = d3.geo.albers().translate([w / 2, h / 2]).scale([700]);
            var path = d3.geo.path().projection(projection);

            var svg = d3.select(element[0]).append('svg').attr("width", w).attr("height", h);

            //draw map
            d3.json('/Content/us.json', function(json) {
                svg.selectAll("path")
                    .data(json.features)
                    .enter()
                    .append("path")
                    .attr("d", path)
                    .attr("fill", "#D4D2D2");

                scope.$watch('data', function(newData) {
                    if (newData){ 

                        //oldData = newData;
                        svg.selectAll(".lines").remove();
                        svg.selectAll(".buff").remove();
                        svg.selectAll(".opp").remove();

                        //draw lines with zero length
                       var lines = svg.selectAll(".lines")
                            .data(newData)
                            .enter()
                            .append("path")
                            .on("mouseover", function (d) {
                                d3.select(this).transition()
                                    .duration(500)
                                    .ease("elastic").attr("stroke-width", 5);
                                d3.select(".opp#" + d.ABRV)
                                      .transition()
                                    .duration(500)
                                    .ease("elastic")
                                          .attr({
                                              "width": 40,
                                              "height": 30,
                                              "transform": "translate(" + -(40 / 2) + "," + -(30 / 2) + ")",
                                          });

                                scope.$apply(function () {
                                    scope.selectedGame = d;
                                });
                            })
                            .on("mouseout", function (d) {

                                d3.select(this).transition()
                                    .duration(500)
                                    .ease("elastic").attr("stroke-width", 1);
                                d3.select(".opp#" + d.ABRV)
                                          .transition()
                                    .duration(500)
                                    .ease("elastic").attr({
                                            "width": 26.666666,
                                            "height": 20,
                                            "transform": "translate(" + -(26.666666 / 2) + "," + -(20 / 2) + ")"
                                        });
                            })
                            .attr("d", function(data) {
                                var line = {
                                    "type": "LineString",
                                    "coordinates": [buff.geometry.coordinates, data.geometry.coordinates]
                                };
                                return path(line);
                            })
                            .attr("id", function(d) {
                                return d.ABRV;
                            })
                            .attr("stroke-width", 1.5)
                            .attr("fill", "none")
                            .attr("stroke-dasharray", function(d) {
                                var l = d3.select(this).node().getTotalLength();
                               return l + ' ' + l;
                            })
                           .attr("stroke-dashoffset", function(d) {
                               return d3.select(this).node().getTotalLength();
                           })
                            .attr("class", function(d) {
                                if (d.Status === "W") {
                                    return "win-line lines";
                                } else {
                                    return "loss-line lines";
                                }
                            });

                        //update lines with transition
                        lines.transition().duration(1000).attr("stroke-dashoffset", "0");
                   

                        //draw Buff image
                        svg.selectAll(".buff")
                            .data([buff])
                            .enter()
                            .append("image")
                            .attr({
                                "x":function(d) {
                                    return projection(d.geometry.coordinates)[0];
                                },
                                "y":function(d) {
                                    return projection(d.geometry.coordinates)[1];
                                },
                                "width":30,
                                "height":30,
                                "transform": "translate(" + -(30 / 2) + "," + -(30 / 2) + ")",
                                "xlink:href": "/Content/logos/buff.png",
                                "class":"buff"
                            });

                        //draw opp images 
                        svg.selectAll(".opp")
                            .data(newData)
                            .enter()
                            .append("image")
                            .on("mouseover", function(d) {

                                d3.select(".lines#" + d.ABRV)
                                    .transition()
                                    .duration(500)
                                    .ease("elastic")
                                          .attr({
                                              "stroke-width": 5
                                          });

                                d3.select(this)
                                      .transition()
                                    .duration(500)
                                    .ease("elastic")
                                      .attr({
                                          "width": 40,
                                          "height": 30,
                                           "transform": "translate(" + -(40 / 2) + "," + -(30 / 2) + ")",
                                      });

                                scope.$apply(function () {
                                    scope.selectedGame = d;
                                });
                            })
                            .on("mouseout", function(d) {
                                d3.select(".lines#" + d.ABRV)
                                       .transition()
                                    .duration(500)
                                    .ease("elastic")
                                         .attr({
                                             "stroke-width": 1
                                         });

                                d3.select(this)
                                    .transition()
                                    .duration(500)
                                    .ease("elastic")
                                    .attr({
                                        "width": 26.666666,
                                        "height": 20,
                                        "transform": "translate(" + -(26.666666 / 2) + "," + -(20 / 2) + ")"
                                    });
                            })
                              .attr("id", function (d) {
                                  return d.ABRV;
                              })
                            .attr({
                                "x": function(d) {
                                    return projection(d.geometry.coordinates)[0];
                                },
                                "y": function(d) { return projection(d.geometry.coordinates)[1]; },
                                "width": 26.66666,
                                "height": 20,
                                "transform": "translate(" + -(26.666666 / 2) + "," + -(20 / 2) + ")",
                                "xlink:href": function(d) {
                                    if (d.ABRV) {
                                        return "/Content/logos/" + d.ABRV + ".png";
                                    }
                                },
                                "class":"opp"
                            });
                    }
                });

                scope.$watch('selectedGame', function(newGame) {
                    if (newGame) {

                        //blink icon
                       var icon =  d3.select(".opp#" + newGame.ABRV)
                       .transition()
                                    .duration(500)
                                    .ease("elastic")
                                      .attr({
                                          "width": 40,
                                          "height": 30,
                                          "transform": "translate(" + -(40 / 2) + "," + -(30 / 2) + ")",
                                      });

                        icon.transition()
                                    .duration(500)
                                    .ease("elastic")
                                    .attr({
                                        "width": 26.666666,
                                        "height": 20,
                                        "transform": "translate(" + -(26.666666 / 2) + "," + -(20 / 2) + ")"
                                    });

                        //blink line
                        var line = d3.select(".lines#" + newGame.ABRV)
                                    .transition()
                                    .duration(500)
                                    .ease("elastic")
                                          .attr({
                                              "stroke-width": 5
                                          });
                        line.transition()
                                    .duration(500)
                                    .ease("elastic")
                                         .attr({
                                             "stroke-width": 1
                                         });


                    }
                });

            });
        }
    };
});
