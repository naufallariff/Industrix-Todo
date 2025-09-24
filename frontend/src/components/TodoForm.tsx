import React, { useEffect } from "react";
import { Modal, Form, Input, Checkbox, Select } from "antd";
import type { Todo, Category } from "../types";

const { Option } = Select;

interface TodoFormProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: Omit<Todo, "id">) => void;
  initialValues?: Todo;
  categories: Category[];
}

const TodoForm: React.FC<TodoFormProps> = ({
  visible,
  onCancel,
  onOk,
  initialValues,
  categories,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.resetFields();
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          description: initialValues.description?.String,
          category: initialValues.category?.id,
        });
      }
    }
  }, [initialValues, form, visible]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const selectedCategory = categories.find(
          (cat) => cat.id === values.category
        );
        onOk({
          ...values,
          category: selectedCategory,
          completed: values.completed || false,
        });
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };

  return (
    <Modal
      title={initialValues ? "Edit To-Do" : "Tambah To-Do Baru"}
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText={initialValues ? "Simpan" : "Tambah"}
    >
      <Form form={form} layout="vertical" name="todo_form">
        <Form.Item
          name="title"
          label="Judul"
          rules={[{ required: true, message: "Harap masukkan judul!" }]}
        >
          <Input placeholder="Judul tugas" />
        </Form.Item>
        <Form.Item name="description" label="Deskripsi">
          <Input.TextArea placeholder="Deskripsi tugas" />
        </Form.Item>
        <Form.Item name="category" label="Kategori">
          <Select placeholder="Pilih kategori">
            {categories.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="priority" label="Prioritas">
          <Select placeholder="Pilih prioritas">
            <Option value="high">Tinggi</Option>
            <Option value="medium">Sedang</Option>
            <Option value="low">Rendah</Option>
          </Select>
        </Form.Item>
        <Form.Item name="completed" valuePropName="checked">
          <Checkbox>Selesai</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TodoForm;