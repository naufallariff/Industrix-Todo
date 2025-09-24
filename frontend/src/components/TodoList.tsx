import React from 'react';
import { Card, List, Typography, Pagination, Empty } from 'antd';
import TodoItem from './TodoItem';
import type { Todo } from '../types';

const { Title } = Typography;

interface TodoListProps {
    todos: Todo[];
    loading: boolean;
    pagination: {
        total: number;
        current: number;
        pageSize: number;
        onChange: (page: number, pageSize: number) => void;
    };
    onDeleteTodo: (id: string) => void;
    onToggleCompleted: (id: string) => void;
    onEdit: (todo: Todo) => void;
}

const TodoList: React.FC<TodoListProps> = ({
    todos,
    loading,
    pagination,
    onDeleteTodo,
    onToggleCompleted,
    onEdit,
}) => {
    return (
        <Card
            title={
                <Title level={3} style={{ margin: 0 }}>Daftar Tugas</Title>
            }
            style={{ width: '100%', maxWidth: '900px' }}
            loading={loading}
        >
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
                            onEdit={onEdit}
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
        </Card>
    );
};

export default TodoList;