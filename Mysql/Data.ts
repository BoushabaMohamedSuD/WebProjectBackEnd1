
import { Model, Column, Table, BelongsToMany, Scopes, CreatedAt, UpdatedAt, HasMany, ForeignKey, AllowNull, Unique, NotNull, Default, HasOne, BelongsTo } from "sequelize-typescript";



@Scopes(() => ({
    data: {

    },
}))
@Table
export class Data extends Model<Data> {


    @AllowNull(false)
    @Unique
    @Column
    Nom!: string;

    @AllowNull(false)
    @Unique
    @Column
    Description!: string;


    @CreatedAt
    @Column
    createdAt!: Date;

    @UpdatedAt
    @Column
    updatedAt!: Date;



}