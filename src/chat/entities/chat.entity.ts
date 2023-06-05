import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatReadByReceipient } from './chat-readby.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chatRoomId: string;

  @Column()
  text: string;

  @Column()
  sentBy: number;

  @Column('int', { array: true, nullable: true })
  readBy: ChatReadByReceipient[];

  @CreateDateColumn()
  createdAt: Date;
}
