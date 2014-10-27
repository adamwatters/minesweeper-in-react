
var META = {height:10, width:10, mines:0}
var MAP = [];
var mineMaker;

for (var i = 0; i < META.width; i++){
	for (var j = 0; j < META.height; j++){
		if (Math.random()>.80) {
			mineMaker = true;
			META.mines ++;
		} else {
			mineMaker = false;
		}
		MAP.push({x: i, y: j, mine: mineMaker, near: 0})
	}
}

MAP.forEach(function(cellOne){
	if (cellOne.mine === true){
		MAP.forEach(function(cellTwo){
			if (
				cellTwo.x === (cellOne.x + 1) && (cellTwo.y >= (cellOne.y - 1) && cellTwo.y <= (cellOne.y + 1)) ||
				cellTwo.x === (cellOne.x - 1) && (cellTwo.y >= (cellOne.y - 1) && cellTwo.y <= (cellOne.y + 1)) ||
				cellTwo.y === (cellOne.y + 1) && cellTwo.x === cellOne.x ||
				cellTwo.y === (cellOne.y - 1) && cellTwo.x === cellOne.x
			){
				cellTwo.near ++;
			}
		});
	};
});