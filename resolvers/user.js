import Jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';

import sendEmail from '../config/emailSending.js';
import resetPasswordEmailTemplate from '../htmlEmailTemplates/resetPasswordLink.js';
import fileUpload from './../config/fileUpload.js';
import authentication from '../middleware/authentication.js';
import { getDatabase } from './../config/databaseConnection.js';
import { decrypt, encrypt } from '../config/encryptionDecryption.js';
import { validateAlphabet, validateAlphabetWithOneSpace, validateEmail, validateNumber, validatePassword } from '../config/validation.js';

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

          validateAlphabetWithOneSpace(firstName);
          validateAlphabet(lastName);
          validateEmail(email);
          validateNumber(phoneNumber, 11);
          validatePassword(password);

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
        const { identifier, password } = args;
        if (identifier && password) {

          const userCollection = (await getDatabase()).collection("users");

          const registerUser = await userCollection.findOne({ $or: [{ email: identifier }, { phoneNumber: identifier }] }, { projection: { _id: 1, password: 1 } });
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
    },
    userUploadProfilePicture: async (_, args, context, info) => {
      try {
        const { userId } = await authentication(context);
        if (userId == args.userId) {

          if (ObjectId.isValid(args.userId)) {

            if (args.profilePicture) {
              const fileInfo = args.profilePicture;
              const fileMaxSize = parseInt(process.env.PROFILE_PICTURE_MAX_SIZE);
              const fileName = args.userId;
              const filePath = process.env.PROFILE_PICTURE_PATH;
              const supportedFormat = ['image/jpeg', 'image/png'];
              const uploadStatus = await fileUpload(fileInfo, fileMaxSize, fileName, filePath, supportedFormat);

              if (uploadStatus.status) {

                const userCollection = (await getDatabase()).collection("users");
                const updateStatus = await userCollection.updateOne({ _id: new ObjectId(args.userId) }, { $set: { profilePicture: uploadStatus.fileName } })

                return uploadStatus.status && updateStatus.acknowledged;

              } else {
                throw new Error("Failed to Upload Profile Picture");
              }

            } else {
              throw new Error("All Fields Are Required");
            }

          } else {
            throw new Error("Invalid Admin");
          }

        } else {
          throw new Error("Authentication Failed");
        }
      } catch (error) {
        throw error;
      }
    },
    userResetPasswordSendEmail: async (_, args, context, info) => {
      try {
        const { email } = args;
        if (email) {

          const userCollection = (await getDatabase()).collection("users");

          const registerUser = await userCollection.findOne({ email }, { projection: { _id: 1 } });
          if (registerUser) {

            const { secretKey, encryptedUserId } = encrypt(registerUser._id.toString());
            console.log(secretKey, encryptedUserId)
            const resetPasswordToken = Jwt.sign({ userId: encryptedUserId }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.TOKEN_EXPIRES });
            const resetPasswordLink = `http://localhost:${process.env.PORT}/new-password/${secretKey.toString('hex')}/${resetPasswordToken}`;
            const emailTitle = "Reset Password";
            const emailTemplate = resetPasswordEmailTemplate(emailTitle, resetPasswordLink);

            return sendEmail(email, emailTitle, emailTemplate);

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
    userResetPassword: async (_, args, context, info) => {
      try {
        const { secretKey, token, password } = args;
        if (secretKey && token && password) {

          validatePassword(password);

          try {
            const verifiedToken = Jwt.verify(token, process.env.JWT_SECRET_KEY);
            const userId = decrypt(verifiedToken.userId, Buffer.from(secretKey, 'hex'));

            const bcryptSalt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_GEN_SALT_NUMBER));
            const hashPassword = await bcrypt.hash(password, bcryptSalt);

            const userCollection = (await getDatabase()).collection("users");
            const updateStatus = await userCollection.updateOne({ _id: new ObjectId(userId) }, { $set: { password: hashPassword } });

            return updateStatus.acknowledged;

          } catch (error) {
            if (error.name === 'JsonWebTokenError') {
              throw new Error('Something Went Wrong');
            } else {
              throw error;
            }
          }

        } else {
          throw new Error("All Fields are Required");
        }
      } catch (error) {
        throw error;
      }
    }
  }
}

export default userResolvers;