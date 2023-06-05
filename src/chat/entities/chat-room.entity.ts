import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn()
  id: string;

  @Column("int", { array: true})
  userIds: number[];

  @Column()
  chatInitiator: number;

  @CreateDateColumn()
  createdAt: Date;
}
