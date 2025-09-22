import React from 'react';
import { Modal, Form, Input, Checkbox, Select } from 'antd';
import type { Todo } from '../types';

const { Option } = Select;

interface TodoFormProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: Omit<Todo, 'id'>) => void;
  initialValues?: Omit<Todo, 'id'>;
}

const TodoForm: React.FC<TodoFormProps> = ({ visible, onCancel, onOk, initialValues }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        onOk(values as Omit<Todo, 'id'>);
      })
      .catch(info => {
        console.log('Validation Failed:', info);
      });
  };

  return (
    <Modal
      title={initialValues ? 'Edit To-Do' : 'Tambah To-Do Baru'}
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText={initialValues ? 'Simpan' : 'Tambah'}
    >
      <Form form={form} layout="vertical" name="todo_form">
        <Form.Item
          name="title"
          label="Judul"
          rules={[{ required: true, message: 'Harap masukkan judul!' }]}
        >
          <Input placeholder="Judul tugas" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Deskripsi"
        >
          <Input.TextArea placeholder="Deskripsi tugas" />
        </Form.Item>
        <Form.Item name="category" label="Kategori">
          <Select placeholder="Pilih kategori">
            <Option value="Kerja">Kerja</Option>
            <Option value="Pribadi">Pribadi</Option>
            <Option value="Belanja">Belanja</Option>
            <Option value="Lainnya">Lainnya</Option>
          </Select>
        </Form.Item>
        <Form.Item name="priority" label="Prioritas">
                  <Select placeholder="Pilih prioritas">
                      <Option value="high">Tinggi</Option>
            <Option value="medium">Sedang</Option>
            <Option value="low">Rendah</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="completed"
          valuePropName="checked"
        >
          <Checkbox>Selesai</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TodoForm;
