import React, { Component } from 'react';
import styled from 'styled-components';
import AddToDo from './AddToDo';
import ToDo from './ToDo';
import uuidv4 from 'uuid/v4';

const ContainerStyle = styled.div`
  width: 400px;
  margin: auto;
  text-align: left;
  border-top: 1px solid #e4e4e4;
`;

const HeaderStyle = styled.h2`
  text-align: center;
`;

const LoadingStyle = styled.h4`
  text-align: center;
`;

class ToDoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      newTodo: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    // before component renders, fetch todos first
    try {
      await this.props.fetchTodos();
    } catch (e) {
      return;
    }

    // if we get here successfully, we're done loading!
    this.setState({
      loading: false
    });
  }

  // TODO: replace with getDerivedStateFromProps in 16.3
  //  https://reactjs.org/docs/react-component.html#static-getderivedstatefromprops
  componentWillReceiveProps(nextProps) {
    // if we've added a todo, reset the newTodo form
    if (this.props.todos.length < nextProps.todos.length)
      this.setState({
        newTodo: ''
      });
  }

  handleChange(e) {
    this.setState({
      newTodo: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (!this.state.newTodo.trim()) {
      return;
    }
    const addedTodo = {
      id: uuidv4(),
      name: this.state.newTodo
    };
    this.props.addTodo(addedTodo);
  }

  toggleTodo(id) {
    this.props.toggleTodo(id);
  }

  removeTodo(id) {
    this.props.removeTodo(id);
  }

  render() {
    const companies = (
      <ContainerStyle>
        {this.props.todos.map(todo => (
          <ToDo
            toggleTodo={this.toggleTodo.bind(this, todo.id)}
            removeTodo={this.removeTodo.bind(this, todo.id)}
            key={todo.id}
            {...todo}
          />
        ))}
        <AddToDo
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
          value={this.state.newTodo}
        />
      </ContainerStyle>
    );
    return (
      <div>
        <HeaderStyle> Companies to Apply @ </HeaderStyle>
        {this.state.loading ? (
          <LoadingStyle> loading... </LoadingStyle>
        ) : (
          companies
        )}
      </div>
    );
  }
}

export default ToDoList;
