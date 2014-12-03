angular.module("scheduleApp.directives").directive('gameEnter', function () {
    return function (scope, elem, attrs) {

        scope.$watch('selectedGame', function (data) {
            if (data) {
                if (data.Week === attrs.gameEnter) {
                    elem.addClass("selected");
                } else {
                    elem.removeClass("selected");
                }
            }
        });
    };
});