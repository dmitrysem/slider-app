var app = angular.module('sliderApp', ['ngResource']);

app.factory('SliderData', ['$resource', function($resource) {
    return $resource('/sliderData', {
        min: 0,
        max: 100
    });
}]);

app.controller('SliderController', ['SliderData', function(SliderData) {
    var self = this;

    self.slider = new Slider({
        elem: document.getElementById('slider'),
        max: 100
    });

    setInterval(function() {
        SliderData.get(function(sliderData) {
            self.sliderValue = sliderData.value;
            self.slider.setValue(sliderData.value);
        });
    }, 2000);

    // should be in external file
    function Slider(options) {
        var elem = options.elem;
        var thumbElem = elem.querySelector('.thumb');

        var maxValue = options.max || 100;

        var maxPxValue = elem.offsetWidth - thumbElem.offsetWidth;
        var pxPerValue = maxPxValue / maxValue;

        this.setValue = function(value) {
            if (isNaN(value)) return;

            value = Math.min(value, maxValue);
            value = Math.max(value, 0);

            var newLeft = pxPerValue * value;
            thumbElem.style.left = newLeft + 'px';
        };
    }
}]);