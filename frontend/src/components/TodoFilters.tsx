import React from 'react';
import { Select, Space } from 'antd';

const { Option } = Select;

interface TodoFiltersProps {
    onFilterChange: (filters: { category?: string | 'all'; priority?: 'low' | 'medium' | 'high' | 'all' }) => void;
    categories: string[];
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
                {categories.map(category => (
                    <Option key={category} value={category}>{category}</Option>
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
