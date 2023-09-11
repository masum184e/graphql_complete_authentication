import Jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';

import sendEmail from '../config/emailSending.js';
import authentication from '../middleware/authentication.js';
import { getDatabase } from './../config/databaseConnection.js';

const userResolvers = {
  Query: {
    user: async (_, args, context, info) => {
      try {
        const { adminId, userId } = await authentication(context);
        const targetCollectioinName = adminId ? "admins" : "users";
        const targetId = adminId ? adminId : userId;

        if (targetId) {
          if (ObjectId.isValid(targetId)) {

            // CHECKING AUTHORIZED PERSON(ADMIN||USER) IS VALID OR NOT
            const targetCollection = (await getDatabase()).collection(targetCollectioinName);
            const targetCount = await targetCollection.countDocuments({ _id: new ObjectId(targetId) });
            if (targetCount === 1) {

              if (args.userId) {
                if (ObjectId.isValid(args.userId)) {

                  const userCollection = (await getDatabase()).collection("users");
                  const userData = await userCollection.findOne({ _id: new ObjectId(args.userId) }, { projection: { password: 0 } });
                  if (userData) {
                    return userData;
                  } else {
                    throw new Error("Nothing Found");
                  }

                } else {
                  throw new Error("Invalid User");
                }
              } else {
                throw new Error("User Id Required");
              }

            } else {
              throw new Error("Invalid Request");
            }
          } else {
            throw new Error("Invalid Request");
          }
        } else {
          throw new Error("Authentication Failed");
        }
      } catch (error) {
        throw error;
      }
    },
    users: async (_, args, context, info) => {
      try {
        const { adminId } = await authentication(context);
        if (adminId) {

          // CHECKING AUTHORIZED PERSON(ADMIN) IS VALID OR NOT
          const adminCollection = (await getDatabase()).collection("admins");
          const adminCount = await adminCollection.countDocuments({ _id: new ObjectId(adminId) });
          if (adminCount === 1) {

            const userCollection = (await getDatabase()).collection("users");
            return await userCollection.find({}, { projection: { password: 0 } }).toArray();

          } else {
            throw new Error("Invalid Request");
          }

        } else {
          throw new Error("Authentication Failed");
        }
      } catch (error) {
        throw error;
      }
    }
  },
  Mutation: {
    userRegistration: async (_, args, context, info) => {
      try {
        const { firstName, lastName, email, phoneNumber, password } = args;
        if (firstName && lastName && email && phoneNumber && password) {

          const userCollection = (await getDatabase()).collection("users");

          const duplicateUser = await userCollection.findOne({ $or: [{ email }, { phoneNumber }] });
          if (!duplicateUser) {

            const bcryptSalt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_GEN_SALT_NUMBER));
            const hashPassword = await bcrypt.hash(password, bcryptSalt);

            const newUser = await userCollection.insertOne({
              firstName,
              lastName,
              email,
              phoneNumber,
              password: hashPassword,
              createdAt: new Date()
            });

            const savedUser = await userCollection.findOne({ email });

            if (newUser && savedUser) {
              return Jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.TOKEN_EXPIRES });
            } else {
              throw new Error("Something Went Wrong");
            }

          } else {
            throw new Error("User Already Register");
          }
        } else {
          throw new Error("All Fields are Required");
        }
      } catch (error) {
        throw error;
      }
    },
    userLogin: async (_, args, context, info) => {
      try {
        const { email, password } = args;
        if (email && password) {

          const userCollection = (await getDatabase()).collection("users");

          const registerUser = await userCollection.findOne({ email }, { projection: { _id: 1, password: 1 } });
          if (registerUser) {

            const isMatch = await bcrypt.compare(password, registerUser.password);
            if (isMatch) {
              return Jwt.sign({ userId: registerUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.TOKEN_EXPIRES });
            } else {
              throw new Error("Wrong Password");
            }

          } else {
            throw new Error("User is Not Register");
          }
        } else {
          throw new Error("All Fields are Required");
        }
      } catch (error) {
        throw error;
      }
    },
    removeUser: async (_, args, context, info) => {
      try {
        const { adminId } = await authentication(context);
        if (adminId) {

          // CHECKING AUTHORIZED PERSON(ADMIN) IS VALID OR NOT
          const adminCollection = (await getDatabase()).collection("admins");
          const adminCount = await adminCollection.countDocuments({ _id: new ObjectId(adminId) });
          if (adminCount === 1) {

            if (args.userId) {
              if (ObjectId.isValid(args.userId)) {

                const userCollection = (await getDatabase()).collection("users");
                const removedUser = await userCollection.deleteOne({ _id: new ObjectId(args.userId) });
                return removedUser.acknowledged;

              } else {
                throw new Error("Invalid User");
              }
            } else {
              throw new Error("User Id Required");
            }

          } else {
            throw new Error("Invalid Request");
          }

        } else {
          throw new Error("Authentication Failed");
        }
      } catch (error) {
        throw error;
      }
    }
  }
}

export default userResolvers;