(function () {
    function ModelController($scope) {
        var groupIdentity = 0;

        function _addGroup() {
            $scope.groups.push({
                id: groupIdentity,
                descriptorIdentity: 0,
                name: null,
                descriptors: []
            });

            groupIdentity++;
        }

        function _removeGroup(group) {
            if (group) {
                var index = _.findIndex($scope.groups, function (d) {
                    return d.id === group.id;
                });
                $scope.groups.splice(index, 1);
            }
        }

        function _addDescriptor(group) {
            if (group) {
                group.descriptors.push({
                    id: group.descriptorIdentity,
                    identifier: null,
                    description: null,
                    value: null
                });

                group.descriptorIdentity++;
            }
        }

        function _removeDescriptor(group, descriptor) {
            if (group && descriptor) {
                var index = _.findIndex(group.descriptors, function (d) {
                    return d.id === descriptor.id;
                });
                group.descriptors.splice(index, 1);
            }
        }

        $scope.groups = [];
        $scope.addGroup = _addGroup;
        $scope.addDescriptor = _addDescriptor;
        $scope.removeDescriptor = _removeDescriptor;
        $scope.removeGroup = _removeGroup;
    }

    ModelController.$inject = ['$scope'];

    angular.module('dps').controller('ModelCtrl', ModelController);
} ());