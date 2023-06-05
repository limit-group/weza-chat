import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from '../entities/chat.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
  ) {}

  async createChatInRoom(
    chatRoomId: string,
    message: any,
    sentBy: number,
  ): Promise<Chat> {
    const chatPayload = {
      chatRoomId: chatRoomId,
      text: message,
      sentBy: sentBy,
    };
    return await this.chatRepository.save(chatPayload);
  }

  async getConversationByRoomId(roomId: string, options: any): Promise<Chat[]> {
    return await this.chatRepository.find({
      where: {
        chatRoomId: roomId,
      },
    });
  }

  async markChatAsRead(roomId: string, userId: number) {
    // mark all as read, by updating readBy
    // await this.chatRepository.bu
    return 'not done';
  }

  async deleteChatById(messageId: number) {
    return await this.chatRepository.delete({ id: messageId });
  }
}
