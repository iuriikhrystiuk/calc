(function () {
    var doNothingActions = [{name: 'stop', sections: [
        {name: '1', story: 'Stop it!'},
        {name: '2', story: 'Stop doing that!'}
    ]},
    {name:'argh', sections:[
        {name: '3', story: 'URGHHH!'},
        {name: '4', story: 'WAAAAAIT!'},
        {name: '5', story: 'C\'MOOON!'}
    ]}];

    function HomeController($scope, storiesService) {
        $scope.doesCurrent = {story:'You are being Hello\'ed, from RPS!'};

        function _doNothing() {
            $scope.doesCurrent = storiesService.getNext(doNothingActions, $scope.doesCurrent);
        }

        $scope.doNothing = _doNothing;
    }

    HomeController.$inject = ['$scope', 'storiesService'];

    angular.module('rps').controller('HomeCtrl', HomeController);
} ());