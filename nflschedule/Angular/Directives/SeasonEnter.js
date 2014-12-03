angular.module("scheduleApp.directives").directive('seasonEnter', function() {
    return function(scope, elem, attrs) {

        scope.$watch('selectedYear', function(data) {
            if (data === attrs.seasonEnter) {
                elem.addClass("selected");
            } else {
                elem.removeClass("selected");
            }

        });
    };
});