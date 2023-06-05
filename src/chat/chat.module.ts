import { Module } from '@nestjs/common';
import { ChatService } from './services/chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { ChatRoomService } from './services/chat-room.service';
import { ChatRoom } from './entities/chat-room.entity';
import { ChatReadByReceipient } from './entities/chat-readby.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, ChatRoom, ChatReadByReceipient])],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService, ChatRoomService],
})
export class ChatModule {}
