angular.module("scheduleApp.directives").directive("status", function() {
    return function(scope, elem) {
        scope.$watch('selectedGame', function(game) {
            if (game.Status === "W") {
                elem.removeClass("lose");
                elem.addClass("win");
            } else {
                elem.removeClass("win");
                elem.addClass("lose");
            }
        });
    };
});