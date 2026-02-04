const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log('🔍 Testing MongoDB Connection...');
console.log('📝 Connection String:', MONGODB_URI.replace(/:[^:@]+@/, ':****@')); // Hide password

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('\n✅ MongoDB Connected Successfully!');
        console.log('📊 Database Name:', mongoose.connection.name);
        console.log('🔗 Host:', mongoose.connection.host);
        console.log('✨ Connection is working perfectly!\n');
        process.exit(0);
    })
    .catch(err => {
        console.error('\n❌ MongoDB Connection Error:', err.message);
        console.error('Please check your connection string and network access.\n');
        process.exit(1);
    });
