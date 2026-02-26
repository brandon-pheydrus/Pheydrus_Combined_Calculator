import { describe, it, expect } from 'vitest';
import { calculatorService } from './calculatorService';

describe('CalculatorService', () => {
  describe('validateInputs', () => {
    it('should return success when all required inputs are provided', () => {
      const inputs = [
        {
          id: 'input-1',
          name: 'Value 1',
          value: 10,
          type: 'number' as const,
          required: true,
        },
      ];

      const result = calculatorService.validateInputs(inputs);

      expect(result.success).toBe(true);
      expect(result.data).toBe(true);
    });

    it('should return error when required input is missing', () => {
      const inputs = [
        {
          id: 'input-1',
          name: 'Value 1',
          value: '',
          type: 'number' as const,
          required: true,
        },
      ];

      const result = calculatorService.validateInputs(inputs);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Value 1 is required');
    });

    it('should return success when non-required inputs are empty', () => {
      const inputs = [
        {
          id: 'input-1',
          name: 'Value 1',
          value: '',
          type: 'number' as const,
          required: false,
        },
      ];

      const result = calculatorService.validateInputs(inputs);

      expect(result.success).toBe(true);
    });
  });

  describe('calculate', () => {
    it('should return a successful response with results', async () => {
      const inputs = { value1: 10, value2: 20 };

      const result = await calculatorService.calculate(inputs);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
    });
  });
});
