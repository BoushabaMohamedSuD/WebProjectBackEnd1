
import { Model, Column, Table, BelongsToMany, Scopes, CreatedAt, UpdatedAt, HasMany, ForeignKey, AllowNull, Unique, NotNull, Default, HasOne, BelongsTo } from "sequelize-typescript";



@Scopes(() => ({
    data: {

    },
}))
@Table
export class Data extends Model<Data> {


    @AllowNull(false)
    @Unique
    @Default('Ingénieur des Sciences de Données')
    @Column
    DATA!: string;

    @AllowNull(false)
    @Unique
    @Default('Advanced Software Engineering for Digital Services')
    @Column
    ASEDS!: string;

    @AllowNull(false)
    @Unique
    @Default('Ingénieur Cybersécurité Et Confiance Numérique')
    @Column
    ICCN!: string;

    @AllowNull(false)
    @Unique
    @Default('Systèmes Embraqués et Services Numériques')
    @Column
    SESNum!: string;

    @AllowNull(false)
    @Unique
    @Default('Ingénierie Smart Information & Communication Technology Engineering')
    @Column
    SmartICT!: string;

    @AllowNull(false)
    @Unique
    @Default('Ingénierie des Systèmes Ubiquitaires et Distribués – Cloud et IoT')
    @Column
    SUD!: string;

    @AllowNull(false)
    @Unique
    @Default('Ingénieur Innovation et AMOA')
    @Column
    AMOA!: string;

    @CreatedAt
    @Column
    createdAt!: Date;

    @UpdatedAt
    @Column
    updatedAt!: Date;



}