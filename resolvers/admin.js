import Jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';

import { getDatabase } from './../config/databaseConnection.js'
import authentication from '../middleware/authentication.js';

const adminResolvers = {
  Query: {
    admin: async (_, args, context, info) => {
      try {
        const { adminId } = await authentication(context);
        if (adminId == args.adminId) {

          if (ObjectId.isValid(args.adminId)) {

            const adminCollection = (await getDatabase()).collection("admins");
            const adminData = await adminCollection.findOne({ _id: new ObjectId(args.adminId) }, { projection: { password: 0 } });

            if(adminData){
              return adminData;
            }else{
              throw new Error("Nothing Found");
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
    }
  },
  Mutation: {
    adminLogin: async (_, args, context, info) => {
      try {
        const { email, password } = args;
        if (email && password) {

          const adminCollection = (await getDatabase()).collection("admins");

          const admin = await adminCollection.findOne({ email }, { projection: { _id: 1, password: 1 } });
          if (admin) {

            const isMatch = await bcrypt.compare(password, admin.password);
            if (isMatch) {
              return Jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.TOKEN_EXPIRES });
            } else {
              throw new Error("Wrong Password");
            }

          } else {
            throw new Error("Invalid Admin");
          }
        } else {
          throw new Error("All Fields are Required");
        }
      } catch (error) {
        throw error;
      }
    }
  }
};

export default adminResolvers;