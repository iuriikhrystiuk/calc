(function () {
    function StoriesBuilder() {
        var currentStory = null,
            currentName = 0;

        function _createStory() {
            currentStory = {
                name: currentName++,
                sections: []
            };
            return this;
        }

        function _addSection(sectionContent) {
            if (!currentStory) {
                throw 'There is no story created';
            }
            currentStory.sections.push({
                name: currentName++,
                story: sectionContent
            });
            return this;
        }

        function _getStory() {
            if (!currentStory) {
                throw 'There is no story created';
            }
            var storyToReturn = angular.copy(currentStory);
            currentStory = null;
            return storyToReturn;
        }

        this.createStory = _createStory;
        this.addSection = _addSection;
        this.getStory = _getStory;
    }

    angular.module('rps').service('storiesBuilder', StoriesBuilder);
} ());