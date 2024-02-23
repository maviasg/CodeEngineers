import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ unique: false })
  public email: string;

  @Column()
  public password: string;

  @Column()
  public firstName: string;

  @Column()
  public lastName: string;

  @Column()
  public dob: string;

  @Column()
  public marketing: string;

  @Column()
  public userUniqueKey: string;

  @Column({
    name: "is_verified",
    type: "boolean",
    nullable: false,
    default: false,
  })
  public isVerified: boolean;

  @CreateDateColumn({
    select: false,
  })
  public createdAt: Date;

  @UpdateDateColumn({
    select: false,
  })
  public updatedAt: Date;
}
