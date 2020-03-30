import { Model, Column, Table, BelongsToMany, Scopes, CreatedAt, UpdatedAt, HasMany, ForeignKey, AllowNull, Unique, NotNull, Default, BelongsTo } from "sequelize-typescript";
import { User } from "./User";

@Scopes(() => ({
    userinfos: {

    },
}))
@Table
export class UserInfo extends Model<UserInfo> {


    @AllowNull(false)
    @Column
    firstname!: string;

    @AllowNull(false)
    @Column
    lastname!: string;


    @AllowNull(false)
    @Default('Empty')
    @Column
    address!: string;


    @AllowNull(false)
    @Default('Empty')
    @Column
    picture!: string;

    @CreatedAt
    @Column
    createdAt!: Date;

    @UpdatedAt
    @Column
    updatedAt!: Date;

    @ForeignKey(() => User)
    UserKey!: number;

    @BelongsTo(() => User)
    UserId!: User;





}