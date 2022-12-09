import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'auth' })
export class AuthEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  path: string;
}
