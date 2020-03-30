
import { Model, Column, Table, BelongsToMany, Scopes, CreatedAt, UpdatedAt, HasMany, ForeignKey, AllowNull, Unique, NotNull, Default, HasOne, BelongsTo } from "sequelize-typescript";
import { UserInfo } from "./UserInfo";


@Scopes(() => ({
    users: {

    },
}))
@Table
export class User extends Model<User> {


    @AllowNull(false)
    @Unique
    @Column
    username!: string;

    @AllowNull(false)
    @Column
    password!: string;


    @AllowNull(false)
    @Unique
    @Column
    email!: string;

    @AllowNull(false)
    @Default(0)
    @Column
    state!: number;

    @AllowNull(false)
    @Default('guest')
    @Column
    authority!: string;

    @AllowNull(false)
    @Default(false)
    @Column
    isReady!: boolean;

    @AllowNull(false)
    @Default(true)
    @Column
    isActive!: boolean;

    @CreatedAt
    @Column
    createdAt!: Date;

    @UpdatedAt
    @Column
    updatedAt!: Date;


    @HasOne(() => UserInfo, 'UserKey')
    UserInfoId?: UserInfo;





}