import {initUser, User} from '../models/user'
import {initToken, Token} from "../models/token";

export const initDB = () => {
    initUser()
    initToken()

    User.hasMany(Token)
    Token.belongsTo(User)
}
