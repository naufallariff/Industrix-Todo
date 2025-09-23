// frontend/src/types.ts
import type { ReactNode } from 'react';

export interface Category {
    id: number;
    name: string;
    color: string;
    icon?: ReactNode;
}

export interface Todo {
    id: number;
    title: string;
    description?: { String: string; Valid: boolean };
    completed: boolean;
    category?: Category;
    priority: 'low' | 'medium' | 'high';
}