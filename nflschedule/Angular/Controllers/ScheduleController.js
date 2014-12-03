angular.module("scheduleApp.controllers")
       .controller("scheduleController", ["$scope", "recordService",
           function ($scope, recordService) {
               $scope.data = [];
               $scope.selectedYear = "2013";
               $scope.seasons = [];
               $scope.selectedGames = [];

               var getSeasonData = function(data) {
                   var seasons = _.unique(_.pluck(data, "Year"));
                   var seasonDetails = _.map(seasons, function(season) {
                       var selectedGames = _.filter(data, function(s) {
                           return s.Year === season && s.Status === "W";
                       });
                       var wins = selectedGames.length;
                       return {
                           "season": season,
                           "wins": wins
                       };
                   });
                   return _.sortBy(seasonDetails, function(season) {
                       return season.season;
                   });
               };

               recordService.getRecords()
                   .then(function (data) {
                       $scope.seasons = getSeasonData(data);
                       $scope.data = data;
                   },
                       function() {
                           alert('Could not get data');
                       });

               $scope.updateSelectedData = function (selectedYear) {
                   $scope.selectedYear = selectedYear.season;
                   $scope.selectedGame = null;
                   $scope.selectedGames = _.filter($scope.data, function(d) {
                       return d.Year === selectedYear.season;
                   });
               };

               $scope.updateSelectedGame = function(selectedGame) {
                   $scope.selectedGame = selectedGame;
               };
           }]);