angular.module("scheduleApp.services").factory('recordService', ["$q",function($q) {

    var _getRecords = function() {

        var deferred = $q.defer();

        d3.csv('/nflschedule/Content/schedule2.csv', function (err, csv) {
            if (err) {
                deferred.reject();
            }
            d3.json('/nflschedule/Content/NFLCities.json', function(error, json) {
                if (error) {
                    deferred.reject();
                }
                _.each(csv, function(game) {
                    var selectedCity = _.find(json.features, function(city) {
                        return city.properties.ABRV === game.ABRV;
                    });
                    game.geometry = selectedCity.geometry;
                });
                deferred.resolve(csv);
            });
        });
        return deferred.promise;
    };
    return {
        getRecords: _getRecords
    };
}]);