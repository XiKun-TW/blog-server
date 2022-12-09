import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'thumbup' })
export class ThumbUpEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  blogId: string;
}
