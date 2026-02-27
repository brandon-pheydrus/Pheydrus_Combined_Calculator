/**
 * useFormState Hook
 * Manages form state with localStorage persistence
 */

import { useState, useEffect } from 'react';
import type { FormData, CityData } from '../models/form';
import {
  EMPTY_FORM,
  FORM_STORAGE_KEY,
  deserializeFormData,
  serializeFormData,
} from '../models/form';

export function useFormState() {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FORM_STORAGE_KEY);
      if (stored) {
        setFormData(deserializeFormData(stored));
      }
    } catch (error) {
      console.error('Failed to load form data from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage whenever formData changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(FORM_STORAGE_KEY, serializeFormData(formData));
      } catch (error) {
        console.error('Failed to save form data to localStorage:', error);
      }
    }
  }, [formData, isLoading]);

  /**
   * Update a single form field
   */
  const setField = (field: keyof FormData, value: FormData[keyof FormData]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * Update multiple fields at once
   */
  const setFields = (updates: Partial<FormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  /**
   * Reset form to empty state and clear localStorage
   */
  const resetForm = () => {
    setFormData(EMPTY_FORM);
    try {
      localStorage.removeItem(FORM_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear form data from localStorage:', error);
    }
  };

  /**
   * Update location fields (birth or current)
   */
  const setLocation = (
    locationType: 'birthLocation' | 'currentLocation',
    city: CityData | null
  ) => {
    setField(locationType, city);
  };

  return {
    formData,
    setField,
    setFields,
    setLocation,
    resetForm,
    isLoading,
  };
}
