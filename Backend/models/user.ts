import sequelize from "../config/database";
import { DataTypes, Model } from "sequelize";

class User extends Model {
    public id!: number;
    public name!: string;
    public lastName!: string;
    public email!: string;
    public password!: string;
    public phone!: string;
    public city!: string;
    public country!: string;
    public zipCode!: string;
    public subscription_id!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },

}, {
    sequelize,
    modelName: "User"
}
)

export default User;