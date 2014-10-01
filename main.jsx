/** @jsx React.DOM */

var Square = React.createClass({

	getInitialState: function() {
		return {hidden: true};
	},

	handleClick: function() {
		if (this.state.hidden) {
			this.setState({hidden: false})
		};
	},

	getPosition: function() {
		return {
			left: this.props.x * 50,
			top: this.props.y * 50
		};
	},

	getDisplay: function() {
		if (this.state.hidden) {
			return " ";
		} else {
			if (this.props.mine) {
				return "MINE";
			} else if (this.props.near > 0){
				return this.props.near;
			} else {
				return "0"
			};
		};
	},

	render: function() {
		return (
			<div className='square' style={this.getPosition()} onClick={this.handleClick}>
				{this.getDisplay()}
			</div>
		);
	}
});

var Board = React.createClass({

	getSize: function() {
		return {
			height: this.props.mapSize.height * 50,
			width: this.props.mapSize.width * 50
		};
	},

	render: function() {
		var squares = [];
		var key = 0;
		this.props.map.forEach(function(location){
			squares.push(<Square key={key} x={location.x} y={location.y} mine={location.mine} near={location.near} />)
			key ++;
		});
		return (
			<div className='board' style={this.getSize()}>
				{squares}	
			</div>
		);
	}
});

var Game = React.createClass({
	render: function() {
		return (
			<div className='game'>
				<Board mapSize={this.props.mapSize} map={this.props.map} />
			</div>
		);
	}
});

var SIZE = {height: 4, width: 4};

var MAP = [
	{x: 0, y: 0, mine: false, near: 0},
	{x: 1, y: 0, mine: false, near: 0},
	{x: 2, y: 0, mine: false, near: 0},
	{x: 3, y: 0, mine: false, near: 0},
	{x: 0, y: 1, mine: false, near: 1},
	{x: 1, y: 1, mine: false, near: 1},
	{x: 2, y: 1, mine: false, near: 1},
	{x: 3, y: 1, mine: false, near: 0},
	{x: 0, y: 2, mine: false, near: 2},
	{x: 1, y: 2, mine: true, near: 1},
	{x: 2, y: 2, mine: false, near: 3},
	{x: 3, y: 2, mine: false, near: 1},
	{x: 0, y: 3, mine: false, near: 2},
	{x: 1, y: 3, mine: true, near: 1},
	{x: 2, y: 3, mine: false, near: 3},
	{x: 3, y: 3, mine: true, near: 0}
];

React.renderComponent(
	<Game mapSize={SIZE} map={MAP}/>,
	document.getElementById('wrapper')
);