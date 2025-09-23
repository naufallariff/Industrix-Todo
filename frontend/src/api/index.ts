import axios from 'axios';
import type { Todo, Category } from '../types';

// Pastikan tidak ada trailing slash di akhir URL
const API_BASE_URL = 'http://localhost:4000/api/v1';

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

// Endpoint GET tidak memiliki trailing slash
export const getTodos = async (params: GetTodosParams = {}): Promise<GetTodosResponse> => {
    try {
        const response = await apiClient.get<GetTodosResponse>('/todos', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching todos:', error);
        throw error;
    }
};

type CreateTodoPayload = Omit<Todo, 'id' | 'category'> & { category_id: number };
type UpdateTodoPayload = Omit<Todo, 'category'> & { category_id: number };


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
        // Endpoint PUT tidak memiliki trailing slash
        const response = await apiClient.put<Todo>(`/todos/${editedTodo.id}`, editedTodo);
        return response.data;
    } catch (error) {
        console.error('Error updating todo:', error);
        throw error;
    }
};

export const deleteTodo = async (id: number): Promise<void> => {
    try {
        // Endpoint DELETE tidak memiliki trailing slash
        await apiClient.delete(`/todos/${id}`);
    } catch (error) {
        console.error('Error deleting todo:', error);
        throw error;
    }
};

export const toggleTodoCompletion = async (id: number, completed: boolean): Promise<Todo> => {
    try {
        // Endpoint PATCH tidak memiliki trailing slash
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