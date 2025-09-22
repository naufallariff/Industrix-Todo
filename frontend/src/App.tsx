import React, { useState } from 'react';
import { Layout, Typography } from 'antd';
import Header from './components/Header';
import TodoList from './components/TodoList';
import type { Todo } from './types';
import { mockTodos } from './mockData';

const { Content, Footer } = Layout;
const { Text } = Typography;

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(mockTodos);

  const handleAddTodo = (newTodo: Omit<Todo, 'id'>) => {
    const newId = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;
    setTodos(prevTodos => [
      { ...newTodo, id: newId },
      ...prevTodos,
    ]);
  };

  const handleEditTodo = (editedTodo: Todo) => {
    setTodos(prevTodos =>
      prevTodos.map(todo => (todo.id === editedTodo.id ? editedTodo : todo))
    );
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  const handleToggleCompleted = (id: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Header />
      <Content className="main-container">
        <TodoList
          todos={todos}
          onAddTodo={handleAddTodo}
          onEditTodo={handleEditTodo}
          onDeleteTodo={handleDeleteTodo}
          onToggleCompleted={handleToggleCompleted}
        />
      </Content>
      <Footer style={{ textAlign: 'center', background: 'transparent' }}>
        <Text type="secondary">
          Dibuat oleh <span className="gradient-text-footer"><b><a href="https://github.com/naufallariff" target="_blank" rel="noopener noreferrer">naufallariff</a></b></span>
        </Text>
      </Footer>
    </Layout>
  );
};

export default App;
