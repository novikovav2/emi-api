import {sequelize} from "../db/mysql";
import {
    Association,
    DataTypes,
    HasManyCreateAssociationMixin,
    HasManyGetAssociationsMixin,
    HasManyHasAssociationMixin,
    Model,
    Optional
} from "sequelize";
import {Token} from "./token";
const bcrypt = require('bcrypt')

export interface UserAttributes {
    id: number
    email: string
    password: string
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number
    public email!: string
    public password!: string

    public readonly createdAt!: Date
    public readonly updatedAt!: Date

    public getTokens!: HasManyGetAssociationsMixin<Token>
    public hasToken!: HasManyHasAssociationMixin<Token, number>
    public createToken!: HasManyCreateAssociationMixin<Token>

    public readonly tokens?: Token[]

    public static associations: {
        tokens: Association<User, Token>
    }
}

export const initUser = () => {
    User.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [6, 20]
            }
        }
    }, {
        sequelize,
        hooks: {
            beforeCreate: async (user: any) => {
                if (user.password) {
                    user.password = await bcrypt.hash(user.password, 10)
                }
            },
            beforeUpdate: async (user: any) => {
                if (user.password) {
                    user.password = await bcrypt.hash(user.password, 10)
                }
            }
        }
    })
}
