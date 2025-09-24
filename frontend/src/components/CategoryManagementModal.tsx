import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, ColorPicker, List, Space, Tooltip } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { Category } from '../types';
import { createCategory, deleteCategory } from '../api';
import type { MessageInstance } from 'antd/es/message/interface';

interface CategoryManagementModalProps {
    visible: boolean;
    onCancel: () => void;
    categories: Category[];
    onCategoriesUpdate: () => void;
    messageApi: MessageInstance;
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

const CategoryManagementModal: React.FC<CategoryManagementModalProps> = ({
    visible,
    onCancel,
    categories,
    onCategoriesUpdate,
    messageApi,
}) => {
    const [form] = Form.useForm();
    const [color, setColor] = useState<string>(generateRandomDarkColor());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            form.resetFields();
            setColor(generateRandomDarkColor());
        }
    }, [visible, form]);

    const handleCreateCategory = async (values: { name: string }) => {
        setLoading(true);
        try {
            await createCategory({ name: values.name, color });
            onCategoriesUpdate();
            messageApi.success('Kategori berhasil dibuat!');
            form.resetFields();
            setColor(generateRandomDarkColor());
        } catch (error) {
            console.error('Gagal membuat kategori baru:', error);
            messageApi.error('Gagal membuat kategori.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCategory = (categoryId: string) => {
        Modal.confirm({
            title: 'Konfirmasi Hapus Kategori',
            content: 'Apakah Anda yakin ingin menghapus kategori ini? To-Do yang terkait akan kehilangan kategorinya.',
            okText: 'Hapus',
            okType: 'danger',
            cancelText: 'Batal',
            onOk: async () => {
                try {
                    await deleteCategory(categoryId);
                    onCategoriesUpdate();
                    messageApi.success('Kategori berhasil dihapus!');
                } catch (error) {
                    console.error('Gagal menghapus kategori:', error);
                    messageApi.error('Gagal menghapus kategori.');
                }
            },
        });
    };

    return (
        <Modal
            title="Kelola Kategori"
            open={visible}
            onCancel={onCancel}
            footer={null}
        >
            <Form form={form} onFinish={handleCreateCategory} layout="vertical" style={{ marginBottom: '24px' }}>
                <Form.Item
                    name="name"
                    label="Nama Kategori Baru"
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
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                        <PlusOutlined /> Tambah Kategori
                    </Button>
                </Form.Item>
            </Form>
            <List
                header="Daftar Kategori"
                bordered
                dataSource={categories}
                renderItem={(item) => (
                    <List.Item
                        key={item.id}
                        actions={[
                            <Tooltip title="Hapus Kategori">
                                <Button
                                    icon={<DeleteOutlined />}
                                    size="small"
                                    type="text"
                                    danger
                                    onClick={() => handleDeleteCategory(item.id)}
                                />
                            </Tooltip>
                        ]}
                    >
                        <List.Item.Meta
                            title={<span style={{ color: item.color }}>{item.name}</span>}
                        />
                    </List.Item>
                )}
            />
        </Modal>
    );
};

export default CategoryManagementModal;