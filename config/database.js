import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://fss_db_user:mUO1J94ZQJ2hPfnB@fss-cluster.7mpbpvv.mongodb.net/?retryWrites=true&w=majority&appName=fss-cluster");
    
    console.log(`DB Connected`);
    
    mongoose.connection.on('error', (err) => {
      console.error('DB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

export { connectDB };