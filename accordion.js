var router = new VueRouter({
    routes: [
        { path: '*' }
    ]
});

var app = new Vue({
    router: router,
    el: '#app',
    data: {
        width: 76,
        height: 56,
        columns: 4,
        rows: 3,
        paperType: 'custom',
        paperTypes: {
            'A1' : [84.1, 59.4],
            'Full imperial' : [76, 56],
        }
    },
    watch: {
        paperType: function(type) {
            var paperType = this.paperTypes[type];
            if (paperType) {
                this.width = paperType[0];
                this.height = paperType[1];
            }
        }
    },
    computed: {
        scale: function() {
            console.log(this.$router.route)
            return Math.min(600 / this.width, 400 / this.height);
        },
        pageWidth: function() {
            return this.paperWidth / this.columns;
        },
        pageHeight: function() {
            return this.paperHeight / this.rows;
        },
        truePageWidth: function() {
            return Math.round(this.pageWidth / this.scale * 100) / 100;
        },
        truePageHeight: function() {
            return Math.round(this.pageHeight / this.scale * 100) / 100;
        },
        paperWidth: function() {
            return this.width * this.scale;
        },
        paperHeight: function() {
            return this.height * this.scale;
        },
        paperPath: function() {
            var d = "M0 0";

            // Top folded line
            d += this.getFoldLine(1, this.columns, 0);

            // Right hand side with cuts
            var cutSize = 2;

            for (var j = 1; j < this.rows; j++) {
                var y = this.getFoldY(this.columns, j);

                // Cut along x
                if ((this.rows - j) % 2 === 0) {
                    d += " V" + (y - cutSize);
                    d += this.getFoldLine(this.columns, 1, j, 0, -cutSize);
                    d += this.getFoldLine(1, this.columns, j, cutSize, 0);
                } else {
                    d += " V" + y;
                }
            }

            d += " V" + this.getFoldY(this.columns, this.rows);

            // Bottom folded line
            d += this.getFoldLine(this.columns, 0, this.rows);

            // Left hand side with cuts
            for (j = this.rows - 1; j > 0; j--) {
                var y = this.getFoldY(this.columns, j);

                // Cut along x
                if ((this.rows - j) % 2 === 1) {
                    d += " V" + (y + cutSize);
                    d += this.getFoldLine(0, this.columns - 1, j, 0, cutSize);
                    d += this.getFoldLine(this.columns - 1, 0, j, -cutSize, 0);
                } else {
                    d += " V" + y;
                }
            }

            return d + "z";
        },
    },
    methods: {
        getX: function(i) {
            return Math.round(i * this.paperWidth / this.columns) + 0.5;
        },
        getY: function(i) {
            return Math.round(i * this.paperHeight / this.rows) + 0.5;
        },
        getFoldY: function(x, y) {
            return 0.5 + y * this.paperHeight / this.rows + (x % 2) * 8;
        },
        getFoldLine: function(x1, x2, y, y1, y2) {
            var s = "";
            y1 = y1 || 0;
            y2 = y2 || 0;
            
            if (x1 < x2) {
                for (var x = x1; x <= x2; x++) {
                    var p = (x - x1) / (x2 - x1);
                    s += " L" + this.getX(x) + " " + (this.getFoldY(x, y) + p * y1 + (1 - p) * y2);
                }
            } else {
                for (var x = x1; x >= x2; x--) {
                    var p = (x - x1) / (x2 - x1);
                    s += " L" + this.getX(x) + " " + (this.getFoldY(x, y) + p * y1 + (1 - p) * y2);
                }
            }

            return s;
        },
        foldType: function(i) {
            return i % 2 ? { 'hill-fold': true }: { 'valley-fold': true };
        }
    }
});