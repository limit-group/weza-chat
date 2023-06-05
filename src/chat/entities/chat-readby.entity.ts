import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ChatReadByReceipient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  readBy: number;

  @Column()
  readAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
