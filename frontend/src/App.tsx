import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Typography, message } from 'antd';
import Header from './components/Header';
import TodoList from './components/TodoList';
import type { Todo, Category } from './types';
import { getTodos, createTodo, updateTodo, deleteTodo, toggleTodoCompletion, getCategories } from './api';
import type { GetTodosParams } from './api';

const { Content, Footer } = Layout;
const { Text } = Typography;

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState<GetTodosParams>({});

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    try {
      const { data, pagination: apiPagination } = await getTodos({
        page: pagination.current,
        limit: pagination.pageSize,
        ...filters,
      });
      setTodos(data);
      setPagination(prev => ({
        ...prev,
        total: apiPagination.total,
        current: apiPagination.page,
      }));
    } catch (error) {
      message.error('Gagal memuat daftar tugas.');
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, filters]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      message.error('Gagal memuat kategori.');
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddTodo = async (newTodo: Omit<Todo, 'id'>) => {
    try {
      const payload = {
        title: newTodo.title,
        description: newTodo.description,
        completed: newTodo.completed,
        category_id: newTodo.category.id,
        priority: newTodo.priority,
      };
      await createTodo(payload);
      message.success('To-do berhasil ditambahkan!');
      fetchTodos();
    } catch (error) {
      message.error('Gagal menambahkan to-do.');
    }
  };

  const handleEditTodo = async (editedTodo: Todo) => {
    try {
      const payload = {
        id: editedTodo.id,
        title: editedTodo.title,
        description: editedTodo.description,
        completed: editedTodo.completed,
        category_id: editedTodo.category.id,
        priority: editedTodo.priority,
      };
      await updateTodo(payload);
      message.success('To-do berhasil diperbarui!');
      fetchTodos();
    } catch (error) {
      message.error('Gagal memperbarui to-do.');
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      message.success('To-do berhasil dihapus!');
      fetchTodos();
    } catch (error) {
      message.error('Gagal menghapus to-do.');
    }
  };

  const handleToggleCompleted = async (id: number) => {
    const todoToUpdate = todos.find(t => t.id === id);
    if (!todoToUpdate) return;

    try {
      await toggleTodoCompletion(id, !todoToUpdate.completed);
      message.success('Status to-do berhasil diperbarui!');
      fetchTodos();
    } catch (error) {
      message.error('Gagal memperbarui status to-do.');
    }
  };

  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  // Implementasi Debouncing
  const debouncedSearch = useCallback((searchTerm: string) => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleFilter = (newFilters: { category_id?: number | undefined; priority?: 'low' | 'medium' | 'high' | undefined }) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination(prev => ({ ...prev, current: page, pageSize }));
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Header />
      <Content className="main-container">
        <TodoList
          todos={todos}
          categories={categories}
          loading={loading}
          pagination={{
            total: pagination.total,
            current: pagination.current,
            pageSize: pagination.pageSize,
            onChange: handlePageChange,
          }}
          onSearch={debouncedSearch} // Menggunakan debouncedSearch
          onFilter={handleFilter}
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