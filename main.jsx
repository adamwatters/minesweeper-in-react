/** @jsx React.DOM */

var Square = React.createClass({

	getInitialState: function() {
		return {hidden: true, flagged: false, zeroArray:[]};
	},

	flagCheck: function() {
		if(!this.state.flagged) {
			this.props.flagsOutChange(1);
		} else {
			this.props.flagsOutChange(-1);
		};
		if (this.props.mine && !this.state.flagged) {
				this.props.correctFlagPlaced();
			} else if (this.props.mine && this.state.flagged) {
				this.props.correctFlagRemoved();
			}
	},

	reveal: function() {
		this.setState({hidden: false});
		if(this.props.near === 0 && this.props.mine != true){
			this.props.updateZeroArray(this.props.x,this.props.y);
		};
	},

	handleClick: function() {

		if (this.props.flagMode && this.state.hidden){
			this.flagCheck();
			this.setState({flagged: !this.state.flagged});
		} else {
			if (this.state.hidden && !this.state.flagged) {
				this.reveal();
			};
			if (this.props.mine) {
				this.props.setGameState('lose');
			};
		};
	},

	getStyle: function() {

		var color = ''
		var text = ''


		if (this.state.flagged) {
			color = 'red';
			text = 'white';
		} else if (this.state.hidden) {
			color = 'grey';
			text = 'black';
		} else {
			color = 'orange';
			text = 'black';
		};

		return {
			left: this.props.x * 50,
			top: this.props.y * 50,
			backgroundColor: color,
			color: text
		};
	},

	getDisplay: function() {
		if (this.state.flagged) {
			return "F"
		}else if (this.state.hidden) {
			return " ";
		} else {
			if (this.props.mine) {
				return "MINE";
			} else if (this.props.near > 0){
				return this.props.near;
			} else {
				return " "
			};
		};
	},

	componentDidUpdate: function() {
		this.props.zeroArray.forEach(function(zero) {
			if(
				(this.state.hidden === true) &&
					(
						this.props.x === (zero.x + 1) && (this.props.y >= (zero.y - 1) && this.props.y <= (zero.y + 1)) ||
						this.props.x === (zero.x - 1) && (this.props.y >= (zero.y + 1) && this.props.y <= (zero.y + 1)) ||
						this.props.y === (zero.y + 1) && this.props.x === zero.x ||
						this.props.y === (zero.y - 1) && this.props.x === zero.x
					) 
			) {
				this.reveal();
			}

		}.bind(this));
	},

	render: function() {
		return (
			<div className='square' style={this.getStyle()} onClick={this.handleClick}>
				{this.getDisplay()}
			</div>
		);
	}
});

var Board = React.createClass({

	getSize: function() {
		return {
			height: this.props.mapMeta.height * 50,
			width: this.props.mapMeta.width * 50
		};
	},

	render: function() {
		var squares = [];
		var key = 0;
		this.props.map.forEach(function(cell){
			squares.push(<Square 
							key={key} 
							x={cell.x} 
							y={cell.y}
							mine={cell.mine} 
							near={cell.near} 
							setGameState={this.props.setGameState}
							mines={this.props.mapMeta.mines}
							minesRemaining={this.props.minesRemaining} 
							correctFlagPlaced={this.props.correctFlagPlaced}
							correctFlagRemoved={this.props.correctFlagRemoved}
							flagsOut={this.props.flagsOut}
							flagsOutChange={this.props.flagsOutChange}
							updateZeroArray={this.props.updateZeroArray}
							zeroArray={this.props.zeroArray}
							flagMode={this.props.flagMode}/>
						);
			key ++;
		}.bind(this));
		return (
			<div className='board' style={this.getSize()}>
				{squares}	
			</div>
		);
	}
});

var Game = React.createClass({
	getInitialState: function() {
		return {
			zeroArray: [],
			gameState: 'active', 
			flagMode: false, 
			minesRemaining: this.props.mapMeta.mines, 
			flagsOut: 0
		};
	},

	updateZeroArray: function(x,y) {
		
		this.setState({zeroArray: this.state.zeroArray.concat([{x: x, y: y}])});
	
	},

	setGameState: function(stateUpdate) {        // 'active', 'win', or 'lose'
		this.setState({gameState: stateUpdate});
	},

	flagsOutChange: function(num) {
		this.setState({flagsOut: this.state.flagsOut + num});
	},

	correctFlagPlaced: function() {
		this.setState({minesRemaining: this.state.minesRemaining - 1});
	},

	correctFlagRemoved: function() {
		this.setState({minesRemaining: this.state.minesRemaining + 1});
	},

	handleKeyDown: function (event) {
		if (event.altKey) {
			event.preventDefault();
			this.setState({flagMode: !this.state.flagMode});
		};
	},

	componentDidMount: function () {
		window.addEventListener('keydown', this.handleKeyDown);
	},

	componentWillUnmount: function () {
		window.removeEventListener('keydown', this.handleKeyDown);
	},

	componentDidUpdate: function() {

		if(this.props.mapMeta.mines === this.state.flagsOut && this.state.minesRemaining === 0 && this.state.gameState != 'win'){
			this.setGameState('win');
		}
	},

	render: function() {

		if (this.state.gameState === 'active'){
			return (
				<div className='game'>
					<Board 
						mapMeta={this.props.mapMeta} 
						map={this.props.map}
						setGameState={this.setGameState}
						minesRemaining={this.state.minesRemaining} 
						correctFlagPlaced={this.correctFlagPlaced}
						correctFlagRemoved={this.correctFlagRemoved}
						flagsOut={this.state.flagsOut}
						flagsOutChange={this.flagsOutChange}
						updateZeroArray={this.updateZeroArray}
						zeroArray={this.state.zeroArray}
						flagMode={this.state.flagMode}/>
					<h1> press ALT to toggle flag mode </h1>
				</div>
			);
		} else if(this.state.gameState === 'lose') {
			return (
				<div className='game'>
					<Board 
						mapMeta={this.props.mapMeta} 
						map={this.props.map}
						setGameState={this.setGameState}
						minesRemaining={this.state.minesRemaining} 
						correctFlagPlaced={this.correctFlagPlaced}
						correctFlagRemoved={this.correctFlagRemoved}
						flagsOut={this.state.flagsOut}
						flagsOutChange={this.flagsOutChange}
						updateZeroArray={this.updateZeroArray}
						zeroArray={this.state.zeroArray}
						flagMode={this.state.flagMode}/>
					<h1> YOU LOSE </h1>
				</div>
			);
		} else if(this.state.gameState === 'win'){
			return (
				<div className='game'>
					<Board 
						mapMeta={this.props.mapMeta} 
						map={this.props.map}
						setGameState={this.setGameState}
						minesRemaining={this.state.minesRemaining} 
						correctFlagPlaced={this.correctFlagPlaced}
						correctFlagRemoved={this.correctFlagRemoved}
						flagsOut={this.state.flagsOut}
						flagsOutChange={this.flagsOutChange}
						updateZeroArray={this.updateZeroArray}
						zeroArray={this.state.zeroArray}
						flagMode={this.state.flagMode}/>
					<h1> YOU WIN </h1>
				</div>
			);
		}
	}
});

React.renderComponent(
	<Game mapMeta={META} map={MAP} />,
	document.getElementById('wrapper')
);