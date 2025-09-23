import React, { useState } from 'react';
import { Card, Input, List, Button, Typography, Pagination, Empty, Space } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import TodoFilters from './TodoFilters';
import type { Todo, Category } from '../types';

const { Title } = Typography;

interface TodoListProps {
    todos: Todo[];
    categories: Category[];
    loading: boolean;
    pagination: {
        total: number;
        current: number;
        pageSize: number;
        onChange: (page: number, pageSize: number) => void;
    };
    onSearch: (searchTerm: string) => void;
    onFilter: (filters: { category_id?: number | undefined; priority?: 'low' | 'medium' | 'high' | undefined }) => void;
    onAddTodo: (todo: Omit<Todo, 'id'>) => void;
    onEditTodo: (todo: Todo) => void;
    onDeleteTodo: (id: number) => void;
    onToggleCompleted: (id: number) => void;
}

const TodoList: React.FC<TodoListProps> = ({
    todos,
    categories,
    loading,
    pagination,
    onSearch,
    onFilter,
    onAddTodo,
    onEditTodo,
    onDeleteTodo,
    onToggleCompleted,
}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingTodo, setEditingTodo] = useState<Todo | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState('');

    const handleAdd = () => {
        setEditingTodo(undefined);
        setIsModalVisible(true);
    };

    const handleEdit = (todo: Todo) => {
        setEditingTodo(todo);
        setIsModalVisible(true);
    };

    const handleModalOk = (values: Omit<Todo, 'id'>) => {
        if (editingTodo) {
            onEditTodo({ ...editingTodo, ...values });
        } else {
            onAddTodo(values);
        }
        setIsModalVisible(false);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setEditingTodo(undefined);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value); // Memanggil debouncedSearch dari prop
    };

    const handleFilterChange = (newFilters: { category?: number | 'all'; priority?: 'low' | 'medium' | 'high' | 'all' }) => {
        onFilter({
            category_id: newFilters.category === 'all' ? undefined : newFilters.category,
            priority: newFilters.priority === 'all' ? undefined : newFilters.priority,
        });
    };

    return (
        <Card
            title={
                <Title level={3} style={{ margin: 0 }}>Daftar Tugas</Title>
            }
            style={{ width: '100%', maxWidth: '900px' }}
            extra={
                <Button key="add" type="primary" onClick={handleAdd} icon={<PlusOutlined />}>
                    Tambah To-Do
                </Button>
            }
            loading={loading}
        >
            <Space direction="vertical" style={{ marginBottom: '16px', width: '100%' }}>
                <Input
                    placeholder="Cari To-Do..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    prefix={<SearchOutlined style={{ marginRight: '8px' }} />}
                    className="custom-search-input"
                />
                <TodoFilters onFilterChange={handleFilterChange} categories={categories} />
            </Space>

            {todos.length > 0 ? (
                <List
                    itemLayout="vertical"
                    dataSource={todos}
                    renderItem={(item) => (
                        <TodoItem
                            key={item.id}
                            todo={item}
                            onDelete={onDeleteTodo}
                            onToggleCompleted={onToggleCompleted}
                            onEdit={handleEdit}
                        />
                    )}
                />
            ) : (
                <Empty description="Tidak ada to-do yang ditemukan." />
            )}

            {pagination.total > pagination.pageSize && (
                <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={pagination.total}
                    onChange={pagination.onChange}
                    style={{ textAlign: 'center', marginTop: '16px' }}
                />
            )}
            <TodoForm
                visible={isModalVisible}
                onCancel={handleModalCancel}
                onOk={handleModalOk}
                initialValues={editingTodo}
                categories={categories}
            />
        </Card>
    );
};

export default TodoList;