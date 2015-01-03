define([
], function Map(
) {
    var Map = function Map(width, height, data) {
        var self = {};

        var WALL_PROBABILITY = 0.05; // From sample data
        var WALL_THRESHOLD = 100;
        var probability = [];

        var ctor = function() {
            if(data !== undefined) {
                probability = data.slice();
            } else {
                initProb();
            }
        };

        var initProb = function() {
            for(var y = 0; y < height; y++) {
                for(var x = 0; x < width; x++) {
                    probability[y * width + x] = WALL_PROBABILITY;
                }
            }
        };

        self.fromImage = function(imgData) {
            var count = 0;
            for(var y = 0; y < height; y++) {
                for(var x = 0; x < width; x++) {
                    var i = y * width * 4 + x * 4;

                    // Populate probability map
                    var hasWall = imgData[i + 0] < WALL_THRESHOLD
                        && imgData[i + 1] < WALL_THRESHOLD
                        && imgData[i + 2] < WALL_THRESHOLD;
                    var p = hasWall ? 1 : 0;
                    probability[y * width + x] = p;
                    if(p === 1) {
                        count++;
                    }
                }
            }
            var wallProbability = count / (width * height);
            console.log('wallProbability=' + wallProbability);
        };

        self.testObstruction = function(x, y) {
            x = Math.round(x);
            y = Math.round(y);
            if(x < 0 || y < 0 || x > width || y > height) {
                return true;
            }
            return probability[y * width + x];
        };

        self.draw = function(ctx) {
            var imgData = ctx.createImageData(width, height);
            var bitmap = imgData.data;
            for(var y = 0; y < height; y++) {
                for(var x = 0; x < width; x++) {
                    var p = probability[y * width + x];
                    var i = y * width * 4 + x * 4;
                    bitmap[i + 0] = 0;
                    bitmap[i + 1] = 0;
                    bitmap[i + 2] = 255;
                    bitmap[i + 3] = Math.round(p * 255);
                }
            }
            ctx.putImageData(imgData, 0, 0);
        };

        ctor();
        return self;
    };

    return Map;
});