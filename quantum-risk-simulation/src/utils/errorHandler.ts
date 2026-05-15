import { logger } from './logger';
import type { AIResponse } from '../models';

export function handleApiError(err: unknown): AIResponse {
  logger.error('API error', err);
  return {
    status: 'error',
    text: 'Failed to connect to AI service. Please try again later.',
  };
}

export function sanitizePrompt(input: string): string {
  // Basic sanitization: trim and collapse whitespace. Avoid sending secrets.
  return input.replace(/\s+/g, ' ').trim();
}
