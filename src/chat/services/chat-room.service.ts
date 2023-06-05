import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw } from 'typeorm';
import { ChatRoom } from '../entities/chat-room.entity';

@Injectable()
export class ChatRoomService {
  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,
  ) {}

  async initiateChat(userIds: number[], chatInitiator: number) {
    const chatRoom = {
      userIds: userIds,
      chatInitiator: chatInitiator,
    };
    const availableRoom = await this.chatRoomRepository.findOne({
      where: {
        userIds: Raw((alias) => `${alias} @> ARRAY[:...userIds]::int[]`, {
          userIds: userIds,
        }),
      },
    });
    if (availableRoom) {
      return {
        isNew: false,
        message: 'retriving old room',
        chatRoomId: availableRoom.id,
      };
    }
    const newRoom = await this.chatRoomRepository.save(chatRoom);
    return {
      isNew: true,
      message: 'creating a new chatroom',
      chatRoomId: newRoom.id,
    };
  }

  async getChatRoomByRoomId(roomId: string) {
    return await this.chatRoomRepository.findOne({
      where: {
        id: roomId,
      },
    });
  }

  async deleteChatRoomById(roomId: string) {
    return await this.chatRoomRepository.delete({ id: roomId });
  }
}
