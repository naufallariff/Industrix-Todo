import type { ReactNode } from 'react';

export interface Category {
    id: string;
    name: string;
    color: string;
    icon?: ReactNode;
}

export interface Todo {
    id: string;
    title: string;
    description?: { String: string; Valid: boolean };
    completed: boolean;
    category?: Category;
    priority: 'low' | 'medium' | 'high';
}

export interface TodoFormValues {
    title: string;
    description?: string;
    completed: boolean;
    category?: Category;
    priority: 'low' | 'medium' | 'high';
}