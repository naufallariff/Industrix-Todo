import axios from 'axios';
import type { Todo, Category } from '../types';

const API_BASE_URL = '/api/v1';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface GetTodosParams {
    page?: number;
    limit?: number;
    search?: string;
    category_id?: number;
    priority?: 'low' | 'medium' | 'high';
}

export interface GetTodosResponse {
    data: Todo[];
    pagination: {
        total: number;
        pages: number;
        page: number;
        limit: number;
    };
}

export interface CreateTodoPayload {
    title: string;
    description?: string;
    completed: boolean;
    category_id?: number;
    priority: 'low' | 'medium' | 'high';
}

export interface UpdateTodoPayload {
    id: number;
    title?: string;
    description?: string;
    completed?: boolean;
    category_id?: number;
    priority?: 'low' | 'medium' | 'high';
}

export interface CreateCategoryPayload {
    name: string;
    color: string;
}

export const getTodos = async (params: GetTodosParams = {}): Promise<GetTodosResponse> => {
    try {
        const response = await apiClient.get<GetTodosResponse>('/todos', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching todos:', error);
        throw error;
    }
};

export const createTodo = async (newTodo: CreateTodoPayload): Promise<Todo> => {
    try {
        const response = await apiClient.post<Todo>('/todos', newTodo);
        return response.data;
    } catch (error) {
        console.error('Error creating todo:', error);
        throw error;
    }
};

export const updateTodo = async (editedTodo: UpdateTodoPayload): Promise<Todo> => {
    try {
        const response = await apiClient.put<Todo>(`/todos/${editedTodo.id}`, editedTodo);
        return response.data;
    } catch (error) {
        console.error('Error updating todo:', error);
        throw error;
    }
};

export const deleteTodo = async (id: number): Promise<void> => {
    try {
        await apiClient.delete(`/todos/${id}`);
    } catch (error) {
        console.error('Error deleting todo:', error);
        throw error;
    }
};

export const toggleTodoCompletion = async (id: number, completed: boolean): Promise<Todo> => {
    try {
        const response = await apiClient.patch<Todo>(`/todos/${id}/complete`, { completed });
        return response.data;
    } catch (error) {
        console.error('Error toggling todo completion:', error);
        throw error;
    }
};

export const getCategories = async (): Promise<Category[]> => {
    try {
        const response = await apiClient.get<Category[]>('/categories');
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

export const createCategory = async (newCategory: CreateCategoryPayload): Promise<Category> => {
    try {
        const response = await apiClient.post<Category>('/categories', newCategory);
        return response.data;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
};
export const deleteCategory = async (id: number): Promise<void> => {
    try {
        const response = await apiClient.delete(`/categories/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
    }
}