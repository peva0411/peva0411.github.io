angular.module("scheduleApp").directive("gameDetails", function() {
    return {
        restrict: "E",
        replace: true,
        scope: {
            selectedGame: '='
        },
        templateUrl:"/nflschedule/Angular/Views/GameDetails.html",
        link: function(scope, element) {
            var w = 500, h = 400;
            var padding = 2;
            var rowPadding = 25;

            var svg = d3.select("#statDetails").append("svg").attr("width", w).attr("height", h);

            var details = [
                { "category": "1st Downs", "attribute": "1stD", "domainMax":50} ,
                { "category": "Total Yards", "attribute": "TotYd", "domainMax":700 },
                { "category": "Passing Yards", "attribute": "PassY", "domainMax":700 },
                { "category": "Rushing Yards", "attribute": "RushY", "domainMax":700 },
                { "category": "Turn Overs", "attribute": "TO", "domainMax":10 }
            ];

            var teamColor = {
                "buf": "#0066b3",
                "bal": "#340059",
                "ne": "#d8161c",
                "mia": "#008f98",
                "hou": "#c9243f",
                "ind": "#005596",
                "nyj": "#004b2c",
                "det": "#636354",
                "chi": "#f26e20",
                "stl": "#c7a975",
                "den": "#f26e21",
                "ari": "#b0063a",
                "tb": "#da2128",
                "pit": "#ffc20e",
                "phi": "#4f7e84",
                "cle": "#f26522",
                "was": "#fbba17",
                "jac": "#068ca9",
                "cin": "#f26e20",
                "no": "#a08a58",
                "sf": "#a61744",
                "sea": "#7bcc60",
                "sd": "#ffc20e",
                "gb": "#004b2c",
                "min": "#4c2484",
                "kc": "#DA2128",
                "atl": "#DB2744",
                "car": "#0296D4",
                "ten": "#7EA3D5"

            };

            scope.$watch('selectedGame', function(newGame) {

                if (newGame) {
                    svg.selectAll('*').remove();
                    var gameValues = scope.selectedGame;


                    _.forEach(details, function(detail, index) {


                        var y = rowPadding + (index * rowPadding);

                        var scale = d3.scale
                            .linear()
                            .domain([0,detail.domainMax])
                            .range([0, 200]);

                        svg.append("text")
                            .text(detail.category)
                            .attr("text-anchor", "middle")
                            .attr("x", function(d) {
                                return w / 2;
                            })
                            .attr("y", function(d) {
                                return y;
                            });

                        //buff
                        var buffRect = svg.append("rect")
                            .attr("height", function(d) {
                                return 15;
                            })
                            .attr("transform", "translate(" + ((w/2) - 50) + "," + (y) + ") rotate(180)")
                            .attr("fill", teamColor["buf"])
                            .attr("width", 0);
                   

                        buffRect.transition()
                            .duration(500)
                            .ease("cubic")
                            .attr("width", function(d) {
                            var value = gameValues["Tm" + detail.attribute];
                            return scale(value);
                        });


                        //opp
                        var oppRect =  svg.append("rect")
                            .attr("x", function (d) {
                                return (w / 2) + 50;
                            })
                            .attr("y", function (d) { return y - 15; })
                            .attr("fill", teamColor[gameValues.ABRV])
                            .attr("height", function (d) {
                                return 15;
                            })
                            .attr("width", 0);

                        oppRect.transition()
                            .duration(500)
                            .attr("width", function(d) {
                                return scale(gameValues["Opp" + detail.attribute]);
                            });

                    });
                }
            });


           
        }
    };
});