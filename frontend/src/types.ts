import type { ReactNode } from 'react';

export interface Todo {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    category: string;
    priority: 'low' | 'medium' | 'high';
}

export interface Category {
    id: string;
    name: string;
    color: string;
    icon?: ReactNode;
}
