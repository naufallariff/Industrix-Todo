import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Typography, message, Card, Button, Space, Modal } from 'antd'; // Import Modal
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import Header from './components/Header';
import TodoList from './components/TodoList';
import TodoFilters from './components/TodoFilters';
import TodoForm from './components/TodoForm';
import CategoryManagementModal from './components/CategoryManagementModal';
import type { Todo, Category, TodoFormValues } from './types';
import { getTodos, createTodo, updateTodo, deleteTodo, toggleTodoCompletion, getCategories } from './api';
import type { GetTodosParams, CreateTodoPayload, UpdateTodoPayload } from './api';

const { Content, Footer } = Layout;
const { Text } = Typography;

const App: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState<GetTodosParams>({});
  const [searchTerm, setSearchTerm] = useState('');

  const [isTodoModalVisible, setIsTodoModalVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | undefined>(undefined);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      messageApi.error('Gagal memuat kategori.');
    }
  }, [messageApi]);

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
  }, [pagination.current, pagination.pageSize, filters, searchTerm, messageApi]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddTodo = async (newTodo: TodoFormValues) => {
    try {
      const payload: CreateTodoPayload = {
        title: newTodo.title,
        description: newTodo.description,
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

  const handleEditTodo = async (editedTodo: TodoFormValues & { id: string }) => {
    try {
      const payload: UpdateTodoPayload = {
        id: editedTodo.id,
        title: editedTodo.title,
        description: editedTodo.description,
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

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo(id);
      messageApi.success('To-do berhasil dihapus!');
      fetchTodos();
    } catch (error) {
      messageApi.error('Gagal menghapus to-do.');
    }
  };

  const handleConfirmDeleteTodo = (todo: Todo) => {
    Modal.confirm({
      title: 'Hapus To-Do',
      content: `Anda yakin ingin menghapus to-do "${todo.title}"?`,
      okText: 'Hapus',
      okType: 'danger',
      cancelText: 'Batal',
      onOk() {
        // Panggil fungsi delete yang sebenarnya setelah konfirmasi
        handleDeleteTodo(todo.id);
      },
    });
  };

  const handleToggleCompleted = async (id: string) => {
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

  const handleOpenTodoModal = (todo?: Todo) => {
    setEditingTodo(todo);
    setIsTodoModalVisible(true);
  };

  const handleCloseTodoModal = () => {
    setIsTodoModalVisible(false);
    setEditingTodo(undefined);
  };

  const handleOpenCategoryModal = () => {
    setIsCategoryModalVisible(true);
  };

  const handleCloseCategoryModal = () => {
    setIsCategoryModalVisible(false);
  };

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  }, []);

  const handleFilter = useCallback((newFilters: { category_id?: string; priority?: 'low' | 'medium' | 'high' }) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, current: 1 }));
  }, []);

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination(prev => ({ ...prev, current: page, pageSize }));
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      {contextHolder}
      <Header />
      <Content className="main-container">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '900px' }}>
          <Card
            title="Filter & Pencarian"
            extra={
              <Space>
                <Button key="manage" onClick={handleOpenCategoryModal} icon={<SettingOutlined />}>
                  Kelola Kategori
                </Button>
                <Button key="add" type="primary" onClick={() => handleOpenTodoModal(undefined)} icon={<PlusOutlined />}>
                  Tambah To-Do
                </Button>
              </Space>
            }
          >
            <TodoFilters
              categories={categories}
              searchTerm={searchTerm}
              onSearch={handleSearch}
              onFilter={handleFilter}
            />
          </Card>
          <TodoList
            todos={todos}
            loading={loading}
            pagination={{
              total: pagination.total,
              current: pagination.current,
              pageSize: pagination.pageSize,
              onChange: handlePageChange,
            }}
            onConfirmDelete={handleConfirmDeleteTodo} // Pass the confirmation handler
            onToggleCompleted={handleToggleCompleted}
            onEdit={handleOpenTodoModal}
          />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center', background: 'transparent' }}>
        <Text type="secondary">
          Dibuat oleh <span className="gradient-text-footer"><b><a href="https://github.com/naufallariff" target="_blank" rel="noopener noreferrer">naufallariff</a></b></span>
        </Text>
      </Footer>
      <TodoForm
        visible={isTodoModalVisible}
        onCancel={handleCloseTodoModal}
        onOk={(values) => {
          if (editingTodo) {
            handleEditTodo({ id: editingTodo.id, ...values });
          } else {
            handleAddTodo(values);
          }
          handleCloseTodoModal();
        }}
        initialValues={editingTodo}
        categories={categories}
      />
      <CategoryManagementModal
        visible={isCategoryModalVisible}
        onCancel={handleCloseCategoryModal}
        categories={categories}
        onCategoriesUpdate={fetchCategories}
        messageApi={messageApi}
      />
    </Layout>
  );
};

export default App;