import { apiClient, ApiError } from './client';
import { API_ENDPOINTS } from './config';
import type { ChatMessage } from '@/types';

export interface ChatMessageResponse {
  success: boolean;
  data: ChatMessage;
  message?: string;
}

export interface ChatMessagesListResponse {
  success: boolean;
  data: ChatMessage[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface SendMessageRequest {
  receiverId: string;
  message: string;
  type: 'text' | 'image' | 'file';
  sessionId?: string;
}

export interface ConversationResponse {
  success: boolean;
  data: {
    id: string;
    participantId: string;
    participantName: string;
    participantType: 'patient' | 'doctor';
    lastMessage?: ChatMessage;
    unreadCount: number;
  }[];
}

class ChatService {
  // Get all conversations for current user
  async getConversations(): Promise<Array<{
    id: string;
    participantId: string;
    participantName: string;
    participantType: 'patient' | 'doctor';
    lastMessage?: ChatMessage;
    unreadCount: number;
  }>> {
    try {
      const response = await apiClient.get<ConversationResponse>(API_ENDPOINTS.chat.conversations);
      return response.data;
    } catch (error) {
      this.handleError('Failed to fetch conversations', error);
      // Return mock conversations
      console.warn('Chat conversations API unavailable, using fallback data');
      return [
        {
          id: 'conv_1',
          participantId: 'doc_1',
          participantName: 'Dr. Priya Sharma',
          participantType: 'doctor',
          lastMessage: {
            id: 'msg_1',
            senderId: 'doc_1',
            receiverId: 'user_1',
            message: 'How are you feeling today?',
            type: 'text',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            read: false,
          },
          unreadCount: 2,
        },
      ];
    }
  }

  // Get messages for a conversation
  async getMessages(conversationId: string, page = 1, limit = 50): Promise<ChatMessage[]> {
    try {
      const response = await apiClient.get<ChatMessagesListResponse>(
        `${API_ENDPOINTS.chat.conversation(conversationId)}/messages?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      this.handleError('Failed to fetch messages', error);
      // Return mock messages
      console.warn('Chat messages API unavailable, using fallback data');
      return [
        {
          id: 'msg_1',
          senderId: 'doc_1',
          receiverId: 'user_1',
          message: 'How are you feeling today? Any changes in your energy levels?',
          type: 'text',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          read: true,
        },
        {
          id: 'msg_2',
          senderId: 'user_1',
          receiverId: 'doc_1',
          message: 'I feel much better! My digestion has improved significantly.',
          type: 'text',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: true,
        },
        {
          id: 'msg_3',
          senderId: 'doc_1',
          receiverId: 'user_1',
          message: 'That\'s great to hear! Keep following the diet plan.',
          type: 'text',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          read: false,
        },
      ];
    }
  }

  // Send a message
  async sendMessage(messageData: SendMessageRequest): Promise<ChatMessage> {
    try {
      const response = await apiClient.post<ChatMessageResponse>(API_ENDPOINTS.chat.send, messageData);
      return response.data;
    } catch (error) {
      this.handleError('Failed to send message', error);
      // Return mock sent message
      const mockMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        senderId: 'user_1', // Mock current user
        receiverId: messageData.receiverId,
        sessionId: messageData.sessionId,
        message: messageData.message,
        type: messageData.type,
        timestamp: new Date().toISOString(),
        read: false,
      };
      console.warn('Send message API unavailable, returning mock data');
      return mockMessage;
    }
  }

  // Mark messages as read
  async markAsRead(conversationId: string, messageIds: string[]): Promise<void> {
    try {
      await apiClient.put(`${API_ENDPOINTS.chat.conversation(conversationId)}/read`, {
        messageIds,
      });
    } catch (error) {
      this.handleError('Failed to mark messages as read', error);
      console.warn('Mark as read API unavailable, action not performed');
    }
  }

  // Get unread message count
  async getUnreadCount(): Promise<number> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: { count: number };
      }>('/api/chat/unread-count');
      return response.data.count;
    } catch (error) {
      this.handleError('Failed to get unread count', error);
      console.warn('Unread count API unavailable, using fallback');
      return 0;
    }
  }

  // Start typing indicator
  async startTyping(conversationId: string): Promise<void> {
    try {
      await apiClient.post(`${API_ENDPOINTS.chat.conversation(conversationId)}/typing`, {
        typing: true,
      });
    } catch (error) {
      // Non-critical error, just log
      console.warn('Typing indicator API unavailable');
    }
  }

  // Stop typing indicator
  async stopTyping(conversationId: string): Promise<void> {
    try {
      await apiClient.post(`${API_ENDPOINTS.chat.conversation(conversationId)}/typing`, {
        typing: false,
      });
    } catch (error) {
      // Non-critical error, just log
      console.warn('Typing indicator API unavailable');
    }
  }

  private handleError(message: string, error: unknown): void {
    if (error instanceof ApiError) {
      throw error;
    }
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new ApiError(message, 500, errorMessage);
  }
}

export const chatService = new ChatService();
