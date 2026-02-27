/**
 * useFormValidation Hook
 * Validates form fields according to requirements
 */

import { useState, useCallback } from 'react';
import type { FormData } from '../models/form';

export interface ValidationErrors {
  [field: string]: string;
}

export function useFormValidation() {
  const [errors, setErrors] = useState<ValidationErrors>({});

  /**
   * Validate a single field
   */
  const validateField = useCallback((field: string, value: unknown): string | null => {
    switch (field) {
      case 'dateOfBirth': {
        if (!value) return 'Birth date is required';
        const dateStr = value as string;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return 'Invalid date format (YYYY-MM-DD)';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return 'Invalid birth date';
        if (date > new Date()) return 'Birth date cannot be in the future';
        return null;
      }

      case 'timeOfBirth': {
        if (!value) return 'Birth time is required';
        const timeStr = value as string;
        if (!/^\d{2}:\d{2}$/.test(timeStr)) return 'Invalid time format (HH:MM)';
        const [hour, minute] = timeStr.split(':').map(Number);
        if (hour < 0 || hour > 23) return 'Hour must be 0-23';
        if (minute < 0 || minute > 59) return 'Minute must be 0-59';
        return null;
      }

      case 'birthLocation': {
        if (!value) return 'Birth location is required';
        return null;
      }

      case 'currentLocation': {
        if (!value) return 'Current location is required';
        return null;
      }

      case 'homeBuiltYear': {
        if (value && value !== '') {
          const yearStr = value as string;
          if (!/^\d{4}$/.test(yearStr)) return 'Year must be YYYY format';
          const year = Number(yearStr);
          if (year < 1500 || year > new Date().getFullYear()) {
            return `Year must be between 1500 and ${new Date().getFullYear()}`;
          }
        }
        return null;
      }

      default:
        return null;
    }
  }, []);

  /**
   * Validate all required fields
   */
  const validate = useCallback(
    (formData: FormData): boolean => {
      const newErrors: ValidationErrors = {};

      // Required fields
      const requiredFields = [
        'dateOfBirth',
        'timeOfBirth',
        'birthLocation',
        'currentLocation',
      ] as const;

      for (const field of requiredFields) {
        const error = validateField(field, formData[field]);
        if (error) {
          newErrors[field] = error;
        }
      }

      // Optional fields that need validation if provided
      const optionalFields = ['homeBuiltYear'] as const;

      for (const field of optionalFields) {
        const error = validateField(field, formData[field]);
        if (error) {
          newErrors[field] = error;
        }
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [validateField]
  );

  /**
   * Clear errors for a specific field
   */
  const clearFieldError = useCallback((field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * Check if form is valid (has no errors and required fields filled)
   */
  const isValid = useCallback(
    (formData: FormData): boolean => {
      return (
        formData.dateOfBirth !== '' &&
        formData.timeOfBirth !== '' &&
        formData.birthLocation !== null &&
        formData.currentLocation !== null &&
        Object.keys(errors).length === 0
      );
    },
    [errors]
  );

  return {
    errors,
    validateField,
    validate,
    clearFieldError,
    clearErrors,
    isValid,
  };
}
