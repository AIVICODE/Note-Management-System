import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany,JoinTable } from 'typeorm';
import { User } from '../user/user.entity';
import { Category } from '../category/category.entity';

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ default: false })
  archived: boolean;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  user: User;

  @ManyToMany(() => Category, category => category.notes, { cascade: true, eager: true })  
  @JoinTable()
  categories?: Category[];
  
}

export default Note;
