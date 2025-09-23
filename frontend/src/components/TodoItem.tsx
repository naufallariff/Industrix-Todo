import React from 'react';
import { Typography, Space, Button, Checkbox, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Todo } from '../types';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

interface TodoItemProps {
    todo: any;
    onDelete: (id: number) => void;
    onToggleCompleted: (id: number) => void;
    onEdit: (todo: Todo) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onDelete, onToggleCompleted, onEdit }) => {
    const handleDelete = () => {
        if (todo.id) {
            onDelete(todo.id);
        } else {
            console.error("Todo ID is undefined");
        }
    };

    const handleToggleComplete = () => {
        if (todo.id) {
            onToggleCompleted(todo.id);
        } else {
            console.error("Todo ID is undefined");
        }
    };

    const handleEdit = () => {
        if (todo.id) {
            onEdit(todo.id);
        } else {
            console.error("Todo ID is undefined");
            // Tambahkan logika fallback
        }
    };
    const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
        switch (priority) {
            case 'high': return 'tag-priority-high';
            case 'medium': return 'tag-priority-medium';
            case 'low': return 'tag-priority-low';
            default: return '';
        }
    };

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={`todo-item ${todo.completed ? 'todo-item-completed' : ''}`}
        >
            <Space direction="vertical" style={{ flex: 1, marginRight: '16px' }}>
                <Title level={5} style={{ margin: 0, textDecoration: todo.completed ? 'line-through' : 'none', color: todo.completed ? '#aaa' : 'inherit' }}>
                    {todo.title}
                </Title>
                <Text type="secondary" style={{ display: 'block', color: 'inherit' }}>
                    {todo.description?.Valid ? todo.description.String : ''}
                </Text>
                <Space size="small" style={{ marginTop: '8px' }}>
                    {todo.category && <Tag color={todo.category.color}>{todo.category.name}</Tag>}
                    <Tag className={getPriorityColor(todo.priority)}>
                        {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                    </Tag>
                </Space>
            </Space>
            <Space size="middle">
                <Checkbox checked={todo.completed} onChange={handleToggleComplete} />
                <Button
                    icon={<EditOutlined />}
                    onClick={handleEdit}
                    type="text"
                />
                <Button
                    icon={<DeleteOutlined />}
                    onClick={handleDelete}
                    type="text"
                    danger
                />
            </Space>
        </motion.div>
    );
};

export default TodoItem;