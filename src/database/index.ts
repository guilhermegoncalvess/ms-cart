import { MongoClient } from 'mongodb';

const uri = `mongodb://localhost:27017`;

const databaseClient = new MongoClient(uri, {
  auth: {
    username: '',
    password: '',
  },
});

async function run() {
  try {
    // Connect the client to the server
    await databaseClient.connect();

    // Create index
    // Establish and verify connection
    // await databaseClient.db('admin').command({ ping: 1 })
    console.log('MongoDB Connected successfully to server');
  } catch (error: any) {
    console.log('MongoDB Error: ', error);
  }
}

run();

export { databaseClient };
