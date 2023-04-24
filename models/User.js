const Sequelize = require("sequelize");
const db = require("../config/database");
const bcrypt = require("bcrypt");

class User extends Sequelize.Model {
  validatePassword(password) {
    return bcrypt
      .hash(password, this.salt)
      .then((hashedPassword) => hashedPassword === this.password);
  }
  static findByEmail(email) {
    return User.findOne({ where: { email } });
  }
}

User.init(
  {
    fullName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Required",
        },
        is: {
          args: ["^[a-zA-Z ]+$", "i"],
          msg: "Only letters allowed",
        },
        len: {
          args: [4, 32],
          msg: "User name must be at least 4 and not more than 32 characters",
        }
      }
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        // len: {
        //   args: [4, 32],
        //   msg: "Password must be at least 4 and not more than 32 characters long",
        // },
      }
    },
    salt: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
 
  {
    sequelize: db,
    modelName: "user",
    hooks: {
      beforeValidate: async (user) => {
        const salt = bcrypt.genSaltSync(9);
        user.salt = salt;
        const hash = await bcrypt.hash(user.password, user.salt);
        return (user.password = hash);
      },
    },
  }
);

module.exports = User;
