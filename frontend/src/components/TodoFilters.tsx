import React, { useState } from 'react';
import { Select, Space, Modal, Form, Input, Button, ColorPicker, Tooltip } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Category } from '../types';
import { createCategory, deleteCategory } from '../api';

const { Option } = Select;
interface TodoFiltersProps {
    onFilterChange: (filters: { category_id?: number | undefined; priority?: 'low' | 'medium' | 'high' | undefined }) => void;
    categories: Category[];
    onCategoriesUpdate: () => void;
}

const generateRandomDarkColor = () => {
    let color = '#000000';
    do {
        color = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        const r = parseInt(color.substring(1, 3), 16);
        const g = parseInt(color.substring(3, 5), 16);
        const b = parseInt(color.substring(5, 7), 16);
        const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
        if (hsp < 127.5) {
            return color;
        }
    } while (true);
};

const TodoFilters: React.FC<TodoFiltersProps> = ({ onFilterChange, categories, onCategoriesUpdate }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [color, setColor] = useState<string>(generateRandomDarkColor());

    const handleOpenModal = () => {
        setIsModalVisible(true);
        form.resetFields();
        setColor(generateRandomDarkColor());
    };

    const handleCreateCategory = async (values: { name: string }) => {
        try {
            await createCategory({ name: values.name, color });
            setIsModalVisible(false);
            onCategoriesUpdate();
        } catch (error) {
            console.error('Gagal membuat kategori baru:', error);
        }
    };

    // FITUR BARU: Fungsi untuk menghapus kategori dengan konfirmasi
    const handleDeleteCategory = (categoryId: number) => {
        Modal.confirm({
            title: 'Konfirmasi Hapus Kategori',
            content: 'Apakah Anda yakin ingin menghapus kategori ini? To-Do yang terkait tidak akan terhapus.',
            okText: 'Hapus',
            okType: 'danger',
            cancelText: 'Batal',
            onOk: async () => {
                try {
                    await deleteCategory(categoryId);
                    onCategoriesUpdate();
                } catch (error) {
                    console.error('Gagal menghapus kategori:', error);
                }
            },
        });
    };

    const handleCategoryFilter = (value: number | 'all') => {
        onFilterChange({ category_id: value === 'all' ? undefined : value });
    }
    const handlePriorityFilter = (value: 'low' | 'medium' | 'high' | 'all') => {
        onFilterChange({ priority: value === 'all' ? undefined : value });
    }

    return (
        <Space style={{ marginBottom: '16px', width: '100%' }} wrap>
            <Select
                placeholder="Filter Kategori"
                style={{ flex: 1, minWidth: '150px' }}
                allowClear
                onChange={handleCategoryFilter}
                popupRender={(menu) => (
                    <>
                        {menu}
                        <Button type="text" icon={<PlusOutlined />} onClick={handleOpenModal} style={{ width: '100%', textAlign: 'left', paddingLeft: '12px' }}>
                            Tambah Kategori Baru
                        </Button>
                    </>
                )}
            >
                <Option key="all" value="all">Semua</Option>
                {categories.filter(c => c.id).map(category => (
                    <Option key={category.id} value={category.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {category.name}
                            <Tooltip title="Hapus Kategori">
                                <Button
                                    icon={<DeleteOutlined />}
                                    size="small"
                                    type="text"
                                    danger
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteCategory(category.id);
                                    }}
                                />
                            </Tooltip>
                        </div>
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
                <Option key="low" value="low">Rendah</Option>
            </Select>
            <Modal
                title="Tambah Kategori Baru"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => form.submit()}
                okText="Simpan"
                cancelText="Batal"
            >
                <Form form={form} onFinish={handleCreateCategory} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Nama Kategori"
                        rules={[{ required: true, message: 'Harap masukkan nama kategori!' }]}
                    >
                        <Input placeholder="Contoh: Kantor, Pribadi" />
                    </Form.Item>
                    <Form.Item label="Warna Badge">
                        <Space>
                            <ColorPicker
                                value={color}
                                onChange={(_, hex) => setColor(hex)}
                                showText
                            />
                            <Button onClick={() => setColor(generateRandomDarkColor())}>
                                Warna Acak
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </Space>
    );
};

export default TodoFilters;