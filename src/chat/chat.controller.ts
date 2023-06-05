import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './services/chat.service';
import { ChatRoomService } from './services/chat-room.service';
import { ChatGateway } from './chat.gateway';
import { AuthGuard } from 'src/auth/auth.guard';
import { Chat } from './entities/chat.entity';

@Controller('chats')
export class ChatController {
  constructor(
    private chatService: ChatService,
    private chatRoomService: ChatRoomService,
    private chatGateway: ChatGateway,
  ) {}
  @UseGuards(AuthGuard)
  @Post('/initiate')
  async chatInitiate(@Request() request, @Body() payload: any) {
    try {
      const chatInitiator = request.user.userId;
      const allUserIds = [...payload.userIds, chatInitiator];
      const chatRoom = await this.chatRoomService.initiateChat(
        allUserIds,
        chatInitiator,
      );
      return chatRoom;
    } catch (error) {
      return error;
    }
  }

  @UseGuards(AuthGuard)
  @Post('/:roomId/messages')
  async postMessage(
    @Request() request,
    @Param('roomId') roomId: string,
    @Body() payload: any,
  ): Promise<Chat> {
    const user = request.user.userId;
    const chat = await this.chatService.createChatInRoom(
      roomId,
      payload.text,
      user,
    );
    this.chatGateway.server.sockets
      .in(roomId)
      .emit('recMessage', { message: chat });
    return chat;
  }

  @UseGuards(AuthGuard)
  @Delete('/:roomId/messages/:messageId/')
  async deleteMessageById(@Param('messageId') messageId: number) {
    await this.chatService.deleteChatById(messageId);
    return 'message deleted';
  }

  @UseGuards(AuthGuard)
  @Put(':roomId/read')
  async markConversationAsRead(
    @Request() request,
    @Param('roomId') roomId: string,
  ) {
    const room = await this.chatRoomService.getChatRoomByRoomId(roomId);
    if (!room) {
      return 'No room with this id';
    }
    const user = request.user.userId;
    const read = await this.chatService.markChatAsRead(room.id, user);
    return read;
  }

  @UseGuards(AuthGuard)
  @Get('/:roomId')
  async getConversationByRoomId(@Param('roomId') roomId: string) {
    try {
      const room = await this.chatRoomService.getChatRoomByRoomId(roomId);
      if (!room) {
        return 'No room with this id exists';
      }
      const conversation = await this.chatService.getConversationByRoomId(
        room.id,
        {},
      );
      return conversation;
    } catch (error) {
      console.log(error);
    }
  }

  @Delete('/:roomId')
  async deleteRoomById(@Param('roomId') roomId: string) {
    await this.chatRoomService.deleteChatRoomById(roomId);
    return 'room deleted';
  }

  @Get()
  async getRecentConversation() {}
}
