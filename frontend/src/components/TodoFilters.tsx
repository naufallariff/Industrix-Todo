import React from 'react';
import { Select, Space } from 'antd';
import type { Category } from '../types';

const { Option } = Select;

interface TodoFiltersProps {
    onFilterChange: (filters: { category?: number | 'all'; priority?: 'low' | 'medium' | 'high' | 'all' }) => void;
    categories: Category[];
}

const TodoFilters: React.FC<TodoFiltersProps> = ({ onFilterChange, categories }) => {
    return (
        <Space style={{ marginBottom: '16px', width: '100%' }} wrap>
            <Select
                placeholder="Filter Kategori"
                style={{ flex: 1, minWidth: '150px' }}
                allowClear
                onChange={(value) => onFilterChange({ category: value })}
            >
                <Option value="all">Semua</Option>
                {categories.map(category => (
                    <Option key={category.id} value={category.id}>{category.name}</Option>
                ))}
            </Select>
            <Select
                placeholder="Filter Prioritas"
                style={{ flex: 1, minWidth: '150px' }}
                allowClear
                onChange={(value) => onFilterChange({ priority: value })}
            >
                <Option value="all">Semua</Option>
                <Option value="high">Tinggi</Option>
                <Option value="medium">Sedang</Option>
                <Option value="low">Rendah</Option>
            </Select>
        </Space>
    );
};

export default TodoFilters;