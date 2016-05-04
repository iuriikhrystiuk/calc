(function () {
    function StoriesProvider() {
        function _getRandomIndexExcept(length, index) {
            var randomIndex = Math.floor(Math.random() * length);
            if (randomIndex !== index) {
                return randomIndex;
            }

            return _getRandomIndexExcept(length, index);
        }

        function _findIndex(collection, object) {
            return _.findIndex(collection, function (section) {
                return section.name === object.name;
            });
        }

        function _getStoryFromSection(section, stories) {
            return _.find(stories, function (story) {
                return story.sections && _.some(story.sections, function (s) {
                    return s.name === section.name;
                });
            });
        }

        function _getNextSectionInline(story, current) {
            var currentIndex = _findIndex(story.sections, current);
            if (currentIndex >= 0 && currentIndex !== story.sections.length - 1) {
                return story.sections[currentIndex + 1];
            }

            return null;
        }

        function _getNextSection(stories, previousIndex) {
            var nextStoryIndex = _getRandomIndexExcept(stories.length, previousIndex);
            return stories[nextStoryIndex].sections[0];
        }

        function _getNext(stories, current) {
            if (current) {
                var story = _getStoryFromSection(current, stories);
                if (story) {
                    var nextSection = _getNextSectionInline(story, current);
                    if (nextSection) {
                        return nextSection;
                    }

                    var storyIndex = _findIndex(stories, story);
                    return _getNextSection(stories, storyIndex);
                }
            }

            return _getNextSection(stories, -1);
        }

        return {
            getNext: _getNext
        };
    }

    StoriesProvider.$inject = [];

    angular.module('dps').factory('storiesProvider', StoriesProvider);
} ());