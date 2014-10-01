
var CodelGrid = function(height, width) {

	this.grid = [];
	this.height = height;
	this.width = width;

	for (var i=0; i < height; i++){
		this.grid.push(new CodelRow(this, this.width, i));
	};

};

CodelGrid.prototype = {

	getCell: function(x,y) {

		var activeCell = this.grid[y].codels[x];
		return activeCell.color;

	},

	printRow: function(y) {

		var rowPrint = ""
		for (var i=0;i<this.width;i++){
			rowPrint = rowPrint + " " + this.getCell(i,y);
		}
		console.log(rowPrint);
	},

	printGrid: function() {
		for (var i=0;i<this.height;i++){
			console.log('---')
			this.printRow(i);
		}
	},

	toggleCodel: function(x,y) {
		this.grid[y].codels[x].color = !this.grid[y].codels[x].color;

	},


	floodFill: function(x,y) {
		this.toggleCodel(x,y);
		if((0 < (x+1) && (x+1) < this.width) && (this.grid[y].codels[x].color !== this.grid[y].codels[x + 1].color)){
			this.floodFill(x+1,y);
		}
		if((0 <= (x-1) && (x-1) < this.width) && (this.grid[y].codels[x].color !== this.grid[y].codels[x - 1].color)){
			this.floodFill(x-1,y);
		}
		if((0 <= (y+1) && (y+1) < this.height) && (this.grid[y].codels[x].color !== this.grid[y+1].codels[x].color)){
			this.floodFill(x,y+1);
		}
		if((0 <= (y-1) && (y-1) < this.height) && (this.grid[y].codels[x].color !== this.grid[y-1].codels[x].color)){
			this.floodFill(x,y-1);
		}

	}
};

var CodelRow = function(canvasModel, width, y){

	this.codels = [];
	this.canvasModel = canvasModel;
	this.y = y;

	for (var i=0; i < width; i++){
		this.codels.push(new Codel(this.canvasModel, i, this.y, true));
	};


};

var Codel = function(canvasModel, x, y, color) {

	this.canvasModel = canvasModel;
	this.x = x;
	this.y = y;
	this.color = color;

};