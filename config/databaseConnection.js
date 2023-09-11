import { MongoClient } from 'mongodb';

let database;

const databaseConnection = async (DATABASE_URL, DATABASE_NAME) => {
  try {
    const client = new MongoClient(DATABASE_URL);
    await client.connect();
    database = client.db(DATABASE_NAME);
    console.log('Database Connection Successfull');
  } catch (err) {
    console.error('Error connecting to MongoDB: ', err);
  }
};

const getDatabase = async () => {
  if(!database){
    throw new Error('Database not connected');
  }
  return database;
};

export { databaseConnection, getDatabase };