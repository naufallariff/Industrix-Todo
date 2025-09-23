// frontend/src/App.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Typography, message } from 'antd';
import Header from './components/Header';
import TodoList from './components/TodoList';
import type { Todo, Category } from './types';
import { getTodos, createTodo, updateTodo, deleteTodo, toggleTodoCompletion, getCategories } from './api';
import type { GetTodosParams, CreateTodoPayload, UpdateTodoPayload } from './api';

const { Content, Footer } = Layout;
const { Text } = Typography;

const App: React.FC = () => {
  // PERBAIKAN: Menggunakan hook message untuk mendapatkan messageApi dan contextHolder
  const [messageApi, contextHolder] = message.useMessage();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [filters, setFilters] = useState<GetTodosParams>({});
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    try {
      const { data, pagination: apiPagination } = await getTodos({
        page: pagination.current,
        limit: pagination.pageSize,
        ...filters,
        search: searchTerm,
      });
      setTodos(data);
      setPagination(prev => ({
        ...prev,
        total: apiPagination.total,
        current: apiPagination.page,
      }));
    } catch (error) {
      messageApi.error('Gagal memuat daftar tugas.');
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, filters, searchTerm, messageApi]); // Tambahkan messageApi ke dependency array

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      messageApi.error('Gagal memuat kategori.');
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
      const payload: CreateTodoPayload = {
        title: newTodo.title,
        description: newTodo.description?.String,
        completed: newTodo.completed,
        category_id: newTodo.category?.id,
        priority: newTodo.priority,
      };
      await createTodo(payload);
      messageApi.success('To-do berhasil ditambahkan!');
      fetchTodos();
    } catch (error) {
      messageApi.error('Gagal menambahkan to-do.');
    }
  };

  const handleEditTodo = async (editedTodo: Todo) => {
    try {
      const payload: UpdateTodoPayload = {
        id: editedTodo.id,
        title: editedTodo.title,
        description: editedTodo.description?.String,
        completed: editedTodo.completed,
        category_id: editedTodo.category?.id,
        priority: editedTodo.priority,
      };
      await updateTodo(payload);
      messageApi.success('To-do berhasil diperbarui!');
      fetchTodos();
    } catch (error) {
      messageApi.error('Gagal memperbarui to-do.');
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      messageApi.success('To-do berhasil dihapus!');
      fetchTodos();
    } catch (error) {
      messageApi.error('Gagal menghapus to-do.');
    }
  };

  const handleToggleCompleted = async (id: number) => {
    const todoToUpdate = todos.find(t => t.id === id);
    if (!todoToUpdate) return;

    try {
      await toggleTodoCompletion(id, !todoToUpdate.completed);
      messageApi.success('Status to-do berhasil diperbarui!');
      fetchTodos();
    } catch (error) {
      messageApi.error('Gagal memperbarui status to-do.');
    }
  };

  const handleSearch = useCallback((searchTerm: string) => {
    setSearchTerm(searchTerm);
    setPagination(prev => ({ ...prev, current: 1 }));
  }, []);

  const debouncedSearch = useCallback((searchTerm: string) => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [handleSearch]);

  const handleFilter = (newFilters: { category_id?: number | undefined; priority?: 'low' | 'medium' | 'high' | undefined }) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination(prev => ({ ...prev, current: page, pageSize }));
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      {/* PERBAIKAN: Menambahkan contextHolder */}
      {contextHolder}
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
          searchTerm={searchTerm}
          onSearch={debouncedSearch}
          onFilter={handleFilter}
          onAddTodo={handleAddTodo}
          onEditTodo={handleEditTodo}
          onDeleteTodo={handleDeleteTodo}
          onToggleCompleted={handleToggleCompleted}
          onCategoriesUpdate={fetchCategories}
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