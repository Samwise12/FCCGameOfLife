import ReactDOM from 'react-dom';
import React, {Component} from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import createFragment from 'react-addons-create-fragment';

import './styles/app.scss';

var events = {}

class Cell extends Component{
  constructor(props) {
    super(props);
    this.state = {
  selected: false,
  nextState: false
    }
this.onClick = this.onClick.bind(this);
  }
componentDidMount() {
  this.props.cells[this.props.id] = this; //*1 enable this cell to ref all cells
 $(events).on("process", this.process.bind(this))  // subscribe to process event
 $(events).on("renderNext", this.renderNext.bind(this))
}
start() {
  console.log('clicked')
}
life(r, c) {  
  let size = Math.sqrt(this.props.cells.length)
  
  if (r == -1) r = size - 1
  if (r == size) r = 0

  if(c == -1) c = size - 1
  if(c == size) c = 0

let id = r * size + c 
//console.log(this.props.cells[id])
return this.props.cells[id].state.selected//*1 gives this.props.cells[#] 'a state'
}
process() {
   // console.log('b')
  let neighbors = 0;
  
  let size = Math.sqrt(this.props.cells.length) //10
  let row = Math.floor( this.props.id / size ) //9.9
  let col = this.props.id - row * size //9
 //console.log(col)
if( this.life( row - 1, col ) ) neighbors += 1
if( this.life( row - 1, col + 1 ) ) neighbors += 1
if( this.life( row - 1, col - 1 ) ) neighbors += 1
    
if( this.life( row, col + 1 ) ) neighbors += 1
if( this.life( row, col - 1 ) ) neighbors += 1
    
if( this.life( row + 1, col ) ) neighbors += 1
if( this.life( row + 1, col + 1 ) ) neighbors += 1
if( this.life( row + 1, col - 1 ) ) neighbors += 1     

//nextState
this.state.nextState = false
if ( this.state.selected) {
  if( neighbors < 2)  this.state.nextState = false
  if( neighbors > 3) this.state.nextState = false      
  if( neighbors == 3 || neighbors == 2) this.state.nextState = true      
    }else{
      if( neighbors == 3) this.state.nextState = true            
    }
//console.log(this.state.nextState)
  // this.renderNext()
}
renderNext() {
  //console.log(this.state.nextState)
  this.setState({selected: this.state.nextState})
}
onClick(e) { 
  this.setState({selected: !this.state.selected})
}
  render() {    
    return(
<div className={this.state.selected ? "cell active": "cell"}
onClick={this.onClick}> 
</div>
      )
  }
}

class Board extends Component {
  constructor(props){
    super(props);
    //this.newGame = this.newGame.bind(this);
    this.state = {
      cells: []
    }
  }
  componentDidMount() {
    let arr = [];
    for (let i=0; i<100; i++) {
      arr.push(<Cell key={i} id={i} cells={arr}
ref={(child) => { this.processCell = child; }}
//selected={this.state.selected}
        />)
    }
this.setState({ cells: arr})    
  }
start() {  
  this.processCell.start()
}
process() {
$(events).trigger("process")
$(events).trigger("renderNext")
$(events).trigger("counter")
}
  render(){
//console.log(this)
    return(<div key={this.state.uniqueKey}>
      {this.state.cells}
      <button onClick={this.process.bind(this)}>ONE GENERATION</button>
      <button id={'start'} onClick={this.start.bind(this)}>Start</button>
      </div>)
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
this.newGame = this.newGame.bind(this);
this.state = {
game: () => <Board />
}    
  }
newGame() {
    this.setState({
        game: () => <Board />
    });
  }
  render() {
const ActiveGame = this.state.game;
    return(<div>
      <ActiveGame />
      <button onClick={this.newGame.bind(this)}>CLEAR BOARD</button>
{/*      <button onClick={this.counter.bind(this)}>Add</button>*/}
      <span>{this.state.count}</span>
    </div>)
  }
}

class Count extends Component {
constructor(props){
    super(props);
  this.state = {
    count: 0
  }
      }
componentDidMount() {
 $(events).on("counter", this.counter.bind(this))  
}      
counter() {
this.setState({count: this.state.count +1})
}
render() {
  return (<span>
{/*<button onClick={this.counter.bind(this)}>Add</button>*/}
    Generations: {this.state.count}
    </span>)
}
  }
/*$(document).keydown(function(e){  
  if( e.which == 32){  // space   
    $(events).trigger("process")
    $(events).trigger("renderNext")
    $(events).trigger("counter")
  }
})*/
  
  var x1 = 0, interval;
$(function(){
  $("#start").click(
    function(){
      if(x1 == 0 ){
         x1 += 1;
        $("#start").html('stop');
 interval = setInterval( function(){
    $(events).trigger("process")
    $(events).trigger("renderNext")
    $(events).trigger("counter")                        
     }     
,1000)        
      } else {
        x1 -= 1;
//console.log(interval)        
        clearInterval(interval)
        $("#start").html('start')
        }

/*     setInterval( function(){
    $(events).trigger("process")
    $(events).trigger("renderNext")
    $(events).trigger("counter")                        
     }     
,2000)*/
  })
})

ReactDOM.render(<div>
  <App />
  <Count />
  </div>,
  document.getElementById('root'));
