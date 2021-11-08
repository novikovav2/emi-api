import {
    Optional,
    Model,
    DataTypes,
    BelongsToGetAssociationMixin, BelongsToSetAssociationMixin
} from "sequelize";
import {sequelize} from "../db/mysql";
import {User} from "./user";

export interface TokenAttributes {
    id: number,
    jwt: string,
    active: boolean,
    expAt: Date
}

export interface TokenCreationAttributes extends Optional<TokenAttributes, 'id'> {}

export class Token extends Model<TokenAttributes, TokenCreationAttributes> implements TokenAttributes {
    public id!: number
    public jwt!: string
    public active!: boolean
    public expAt!: Date

    public readonly createdAt!: Date
    public readonly updatedAt!: Date

    public getUser!: BelongsToGetAssociationMixin<User>
    public setUser!: BelongsToSetAssociationMixin<User, number>
}

export const initToken = () => {
    Token.init({
        id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    jwt: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    expAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
    }, {
        sequelize
    })
}
