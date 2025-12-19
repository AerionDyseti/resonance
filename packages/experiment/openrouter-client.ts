/**
 * OpenRouter LLM Client
 *
 * Simple wrapper for calling OpenRouter's chat completions API.
 * Compatible with OpenAI's API format.
 */

import { logLLMCall } from './file-logger';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stopSequences?: string[];
}

export interface ChatCompletionResponse {
  content: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason: string;
}

const DEFAULT_MODEL = 'anthropic/claude-sonnet-4';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export class OpenRouterClient {
  private apiKey: string;
  private defaultModel: string;

  constructor(apiKey?: string, defaultModel?: string) {
    this.apiKey = apiKey || process.env.OPENROUTER_API_KEY || '';
    this.defaultModel = defaultModel || process.env.OPENROUTER_MODEL || DEFAULT_MODEL;

    if (!this.apiKey) {
      throw new Error(
        'OpenRouter API key not provided. Set OPENROUTER_API_KEY environment variable or pass it to the constructor.'
      );
    }
  }

  async chat(
    messages: ChatMessage[],
    options?: ChatCompletionOptions
  ): Promise<ChatCompletionResponse> {
    const model = options?.model || this.defaultModel;

    const requestBody = {
      model,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 4096,
      stop: options?.stopSequences,
    };

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
        'HTTP-Referer': 'https://github.com/resonance-app',
        'X-Title': 'Resonance Intelligence Experiment',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from OpenRouter API');
    }

    const choice = data.choices[0];

    const result = {
      content: choice.message?.content || '',
      model: data.model || model,
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
      },
      finishReason: choice.finish_reason || 'unknown',
    };

    // Log the raw request and response for debugging
    logLLMCall(requestBody, data);

    return result;
  }

  /**
   * Simple single-turn query
   */
  async query(
    systemPrompt: string,
    userMessage: string,
    options?: ChatCompletionOptions
  ): Promise<string> {
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ];

    const response = await this.chat(messages, options);
    return response.content;
  }
}

/**
 * Create a client from environment variables
 */
export function createOpenRouterClient(): OpenRouterClient {
  return new OpenRouterClient();
}
