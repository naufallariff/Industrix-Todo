import React, { useCallback } from 'react';
import { Select, Space, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { Category } from '../types';

const { Option } = Select;

interface TodoFiltersProps {
    categories: Category[];
    searchTerm: string;
    onSearch: (searchTerm: string) => void;
    onFilter: (filters: { category_id?: string | undefined; priority?: 'low' | 'medium' | 'high' | undefined }) => void;
}

const TodoFilters: React.FC<TodoFiltersProps> = ({ onFilter, categories, searchTerm, onSearch }) => {
    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onSearch(e.target.value);
    }, [onSearch]);

    const handleFilterChange = useCallback((newFilters: { category_id?: string | undefined; priority?: 'low' | 'medium' | 'high' | undefined }) => {
        onFilter(newFilters);
    }, [onFilter]);

    const handleCategoryFilter = (value: string | 'all') => {
        handleFilterChange({ category_id: value === 'all' ? undefined : value });
    }

    const handlePriorityFilter = (value: 'low' | 'medium' | 'high' | 'all') => {
        handleFilterChange({ priority: value === 'all' ? undefined : value });
    }

    return (
        <Space direction="vertical" style={{ marginBottom: '16px', width: '100%' }}>
            <Input
                placeholder="Cari To-Do..."
                value={searchTerm}
                onChange={handleSearchChange}
                prefix={<SearchOutlined style={{ marginRight: '8px' }} />}
                className="custom-search-input"
            />
            <Space style={{ marginBottom: '16px', width: '100%' }} wrap>
                <Select
                    placeholder="Filter Kategori"
                    style={{ flex: 1, minWidth: '150px' }}
                    allowClear
                    onChange={handleCategoryFilter}
                >
                    <Option key="all" value="all">Semua</Option>
                    {categories.map(category => (
                        <Option key={category.id} value={category.id}>
                            {category.name}
                        </Option>
                    ))}
                </Select>
                <Select
                    placeholder="Filter Prioritas"
                    style={{ flex: 1, minWidth: '150px' }}
                    allowClear
                    onChange={handlePriorityFilter}
                >
                    <Option key="all" value="all">Semua</Option>
                    <Option key="high" value="high">Tinggi</Option>
                    <Option key="medium" value="medium">Sedang</Option>
                    <Option value="low">Rendah</Option>
                </Select>
            </Space>
        </Space>
    );
};

export default TodoFilters;