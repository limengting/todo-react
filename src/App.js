import React, { Component } from 'react';
import './App.css';
import TodoInput from './TodoInput'
import TodoItem from './TodoItem'
import 'normalize.css'
import * as localStore from './localStore'
import AV from 'leancloud-storage'
var APP_ID = '9HR3PfJcM1Xb8tHiDbIPvhlx-gzGzoHsz';
var APP_KEY = 'eJdbaCMiwbhBo93LJ2KoN8CP';

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});


class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      newTodo:'',
      todoList:localStore.load('todoList')||[]
    }
  }
  componentDidUpdate(){
     localStore.save('todoList',this.state.todoList)
  }
  render() {
    let todu = this.state.todoList.filter((item)=>!item.deleted).map((item,index)=>{
      return ( <li key={index}>
              <TodoItem todo = {item} onToggle={this.toggle.bind(this)}
              onDelete={this.delete.bind(this)}/>
               </li>);
    })
   
    return (
      <div className="App">
        <h1>我的待办</h1>
        <div className="inputWrapper">
        <TodoInput content={this.state.newTodo} 
          onChange={this.changeTitle.bind(this)}
          onSubmit={this.addTodo.bind(this)}/>
        </div>
         <ol className="todoList">
          {todu}
        </ol> 
      </div>
    )
  }
    delete(event,todo){
      todo.deleted=true
      this.setState(this.state)
    }
    toggle(e,todo){
      todo.status = todo.status === 'completed'?'':'completed'
      this.setState(this.state)
     
    }
    changeTitle(event){
      this.setState({
        newTodo:event.target.value,
        todoList:this.state.todoList
      })
    }
    addTodo(event){
      // console.log('我得添加一个TODOle')
      this.state.todoList.push({
        id:idMaker(),
        title:event.target.value,
        status:null,
        deleted:false
      })
      this.setState({
        newTodo:'',
        todoList:this.state.todoList
      })
    }
}

export default App;

let id = 0
function idMaker(){
  id+=1
  return id
}