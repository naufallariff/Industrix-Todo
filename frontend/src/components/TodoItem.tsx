import React from 'react';
import { Typography, Space, Button, Checkbox, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Todo } from '../types';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

interface TodoItemProps {
    todo: Todo;
    onDelete: (id: number) => void;
    onToggleCompleted: (id: number) => void;
    onEdit: (todo: Todo) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onDelete, onToggleCompleted, onEdit }) => {
    const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
        switch (priority) {
            case 'high': return 'tag-priority-high';
            case 'medium': return 'tag-priority-medium';
            case 'low': return 'tag-priority-low';
            default: return '';
        }
    };

    const getCategoryColor = (category: string) => {
        const colors = ['#108ee9', '#87d068', '#f50', '#2db7f5', '#8a65f5', '#eb2f96'];
        const hash = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
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
                    {todo.description}
                </Text>
                <Space size="small" style={{ marginTop: '8px' }}>
                    <Tag color={getCategoryColor(todo.category)}>{todo.category}</Tag>
                    <Tag className={getPriorityColor(todo.priority)}>
                        {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                    </Tag>
                </Space>
            </Space>
            <Space size="middle">
                <Checkbox checked={todo.completed} onChange={() => onToggleCompleted(todo.id)} />
                <Button
                    icon={<EditOutlined />}
                    onClick={() => onEdit(todo)}
                    type="text"
                />
                <Button
                    icon={<DeleteOutlined />}
                    onClick={() => onDelete(todo.id)}
                    type="text"
                    danger
                />
            </Space>
        </motion.div>
    );
};

export default TodoItem;
