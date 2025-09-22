import React, { useState } from 'react';
import { Card, Input, List, Button, Typography, Pagination, Empty, Space } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import TodoFilters from './TodoFilters';
import type { Todo } from '../types';


const { Title } = Typography;

interface TodoListProps {
    todos: Todo[];
    onAddTodo: (todo: Omit<Todo, 'id'>) => void;
    onEditTodo: (todo: Todo) => void;
    onDeleteTodo: (id: number) => void;
    onToggleCompleted: (id: number) => void;
}

const TodoList: React.FC<TodoListProps> = ({
    todos,
    onAddTodo,
    onEditTodo,
    onDeleteTodo,
    onToggleCompleted,
}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingTodo, setEditingTodo] = useState<Todo | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<{ category?: string | 'all'; priority?: 'low' | 'medium' | 'high' | 'all' }>({});
    const pageSize = 10;

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

    const handleFilterChange = (newFilters: { category?: string | 'all'; priority?: 'low' | 'medium' | 'high' | 'all' }) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setCurrentPage(1);
    };

    const allCategories = ['Semua', ...new Set(todos.map(todo => todo.category))];

    const filteredTodos = todos.filter(todo => {
        const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !filters.category || filters.category === 'Semua' || todo.category === filters.category;
        const matchesPriority = !filters.priority || filters.priority === 'all' || todo.priority === filters.priority;
        return matchesSearch && matchesCategory && matchesPriority;
    });

    const paginatedTodos = filteredTodos.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

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
        >
            <Space direction="vertical" style={{ marginBottom: '16px', width: '100%' }}>
                <Input
                    placeholder="Cari To-Do..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    prefix={<SearchOutlined style={{ marginRight: '8px' }} />}
                    className="custom-search-input"
                />
                <TodoFilters onFilterChange={handleFilterChange} categories={allCategories} />
            </Space>

            {paginatedTodos.length > 0 ? (
                <List
                    itemLayout="vertical"
                    dataSource={paginatedTodos}
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

            {filteredTodos.length > pageSize && (
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={filteredTodos.length}
                    onChange={(page) => setCurrentPage(page)}
                    style={{ textAlign: 'center', marginTop: '16px' }}
                />
            )}
            <TodoForm
                visible={isModalVisible}
                onCancel={handleModalCancel}
                onOk={handleModalOk}
                initialValues={editingTodo}
            />
        </Card>
    );
};

export default TodoList;