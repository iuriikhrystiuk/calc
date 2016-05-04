(function () {
    var doNothingActions = [];

    function HomeController($scope, storiesProvider, storiesBuilder) {
        $scope.doesCurrent = {story:'You are being Hello\'ed, from RPS!'};

        var story = storiesBuilder.createStory()
                    .addSection('Stop it!')
                    .addSection('Stop doing that!')
                    .addSection('Why don\'t you...')
                    .addSection('... go...')
                    .addSection('... and kill yourself!')
                    .getStory();
                    
        doNothingActions.push(story); 
        story = storiesBuilder.createStory()
                    .addSection('URGHHH!')
                    .addSection('WAAAAAIT!')
                    .addSection('C\'MOOON!')
                    .addSection('Take your stinkin\' paws off me you damn dirty ape!')
                    .getStory();
        doNothingActions.push(story); 

        function _doNothing() {
            $scope.doesCurrent = storiesProvider.getNext(doNothingActions, $scope.doesCurrent);
        }

        $scope.doNothing = _doNothing;
    }

    HomeController.$inject = ['$scope', 'storiesProvider', 'storiesBuilder'];

    angular.module('dps').controller('HomeCtrl', HomeController);
} ());