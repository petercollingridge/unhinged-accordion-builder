var app = new Vue({
    el: '#app',
    data: {
        width: 76,
        height: 56,
        columns: 8,
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
            for (var i = 1; i <= this.columns; i++) {
                d += " L" + this.getX(i) + " " + this.getFoldY(i, 0);
            }

            d += " V" + this.getFoldY(this.columns, this.rows);

            // Bottom folded line
            for (var i = this.columns; i >= 0; i--) {
                d += " L" + this.getX(i) + " " + this.getFoldY(i, this.rows);
            }

            return d + "z";
        }
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
        foldType: function(i) {
            return i % 2 ? { 'hill-fold': true }: { 'valley-fold': true };
        },
        foldOrCut: function(x, y) { 
            if ((x === 0 && (this.rows - y) % 2 === 0) ||
                (x === this.columns - 1 && (this.rows - y) % 2 === 1)
            ) {
                return 'hill-fold';
            }
            return 'cut-line';
        }
    }
});