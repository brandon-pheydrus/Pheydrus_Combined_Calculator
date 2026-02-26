// Base types and interfaces for the calculator application

export interface CalculatorInput {
  id: string;
  name: string;
  value: number | string;
  type: 'number' | 'text' | 'select';
  options?: string[];
  required?: boolean;
}

export interface CalculatorResult {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
}

export interface CalculatorConfig {
  id: string;
  name: string;
  description: string;
  inputs: CalculatorInput[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
