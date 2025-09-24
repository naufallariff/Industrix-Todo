import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, ColorPicker, List, Space, Tooltip } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'; // Removed EditOutlined
import type { Category } from '../types';
import { createCategory, deleteCategory } from '../api';
import type { MessageInstance } from 'antd/es/message/interface';
import axios from 'axios';

interface CategoryManagementModalProps {
    visible: boolean;
    onCancel: () => void;
    categories: Category[];
    onCategoriesUpdate: () => void;
    messageApi: MessageInstance;
}

// DEFINISI FUNGSI DIPINDAHKAN KE SINI (GLOBAL SCOPE)
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
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

    useEffect(() => {
        if (visible) {
            form.resetFields();
            // Panggilan di sini sudah benar
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
            // Panggilan di sini sudah benar
            setColor(generateRandomDarkColor());
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 500) {
                const errorMessage = error.response.data?.error || '';
                if (errorMessage.includes("duplicate key value violates unique constraint")) {
                    messageApi.error(`Nama kategori sudah ada.`);
                } else {
                    messageApi.error('Gagal membuat kategori. Terjadi kesalahan server.');
                }
            } else {
                console.error('Gagal membuat kategori baru:', error);
                messageApi.error('Gagal membuat kategori.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (categoryId: string) => {
        setCategoryToDelete(categoryId);
        setIsDeleteModalVisible(true);
    };

    const handleDeleteConfirm = async () => {
        if (!categoryToDelete) return;

        try {
            await deleteCategory(categoryToDelete);
            onCategoriesUpdate();
            messageApi.success('Kategori berhasil dihapus!');
            setIsDeleteModalVisible(false);
        } catch (error) {
            console.error('Gagal menghapus kategori:', error);
            messageApi.error('Gagal menghapus kategori.');
        }
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
                                    onClick={() => handleDeleteClick(item.id)}
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
            <Modal
                title="Konfirmasi Hapus Kategori"
                open={isDeleteModalVisible}
                onOk={handleDeleteConfirm}
                onCancel={() => setIsDeleteModalVisible(false)}
                okText="Hapus"
                okType="danger"
                cancelText="Batal"
            >
                <p>Apakah Anda yakin ingin menghapus kategori ini? To-Do yang terkait akan kehilangan kategorinya.</p>
            </Modal>
        </Modal>
    );
};

export default CategoryManagementModal;