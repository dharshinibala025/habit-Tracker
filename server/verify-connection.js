const mongoose = require('mongoose');
const http = require('http');
require('dotenv').config();

console.clear();
console.log('╔═══════════════════════════════════════════════════════╗');
console.log('║     HABIT TRACKER - CONNECTION VERIFICATION           ║');
console.log('╚═══════════════════════════════════════════════════════╝\n');

// Test 1: MongoDB Connection
console.log('📋 Test 1: MongoDB Atlas Connection');
console.log('─────────────────────────────────────');

const MONGODB_URI = process.env.MONGODB_URI;
console.log('🔗 Connection String: ' + MONGODB_URI.replace(/:[^:@]+@/, ':****@'));
console.log('🔄 Connecting...\n');

mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000
})
    .then(() => {
        console.log('✅ MongoDB Connection: SUCCESS');
        console.log('📊 Database Name: ' + mongoose.connection.name);
        console.log('🌐 Host: ' + mongoose.connection.host);
        console.log('🔌 Connection State: Connected\n');

        // Test 2: Backend API
        testBackendAPI();
    })
    .catch(err => {
        console.log('❌ MongoDB Connection: FAILED');
        console.log('⚠️  Error: ' + err.message);
        console.log('\n╔═══════════════════════════════════════════════════════╗');
        console.log('║              🚨 ACTION REQUIRED                       ║');
        console.log('╚═══════════════════════════════════════════════════════╝');
        console.log('\nYou need to whitelist your IP in MongoDB Atlas:\n');
        console.log('  1️⃣  Go to: https://cloud.mongodb.com/');
        console.log('  2️⃣  Login with your credentials');
        console.log('  3️⃣  Click "Network Access" (left sidebar)');
        console.log('  4️⃣  Click "ADD IP ADDRESS" button');
        console.log('  5️⃣  Select "ALLOW ACCESS FROM ANYWHERE"');
        console.log('  6️⃣  Click "Confirm"');
        console.log('  7️⃣  Wait 1-2 minutes for changes to apply');
        console.log('\n📝 Then run this script again to verify!\n');

        testBackendAPI();
    });

function testBackendAPI() {
    console.log('📋 Test 2: Backend API Server');
    console.log('─────────────────────────────────────');

    const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/',
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            if (res.statusCode === 200) {
                console.log('✅ Backend API: RUNNING');
                console.log('🌐 URL: http://localhost:5000');
                console.log('📡 Status Code: ' + res.statusCode);
                try {
                    const response = JSON.parse(data);
                    console.log('💬 Message: ' + response.message);
                    console.log('🗄️  MongoDB Status: ' + response.mongodb);
                } catch (e) {
                    console.log('📄 Response: ' + data.substring(0, 100));
                }
            } else {
                console.log('⚠️  Backend API: Running but returned status ' + res.statusCode);
            }

            testFrontend();
        });
    });

    req.on('error', (err) => {
        console.log('❌ Backend API: NOT RUNNING');
        console.log('⚠️  Error: ' + err.message);
        console.log('\n💡 Make sure the backend server is running:');
        console.log('   cd server');
        console.log('   npm start\n');

        testFrontend();
    });

    req.end();
}

function testFrontend() {
    console.log('\n📋 Test 3: Frontend Development Server');
    console.log('─────────────────────────────────────');

    const options = {
        hostname: 'localhost',
        port: 5173,
        path: '/',
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        if (res.statusCode === 200) {
            console.log('✅ Frontend: RUNNING');
            console.log('🌐 URL: http://localhost:5173');
            console.log('📡 Status Code: ' + res.statusCode);
        } else {
            console.log('⚠️  Frontend: Running but returned status ' + res.statusCode);
        }

        printSummary();
    });

    req.on('error', (err) => {
        console.log('❌ Frontend: NOT RUNNING');
        console.log('⚠️  Error: ' + err.message);
        console.log('\n💡 Make sure the frontend server is running:');
        console.log('   npm run dev\n');

        printSummary();
    });

    req.end();
}

function printSummary() {
    setTimeout(() => {
        console.log('\n╔═══════════════════════════════════════════════════════╗');
        console.log('║                  VERIFICATION SUMMARY                 ║');
        console.log('╚═══════════════════════════════════════════════════════╝\n');

        const mongoStatus = mongoose.connection.readyState === 1;

        console.log('Component Status:');
        console.log('  ' + (mongoStatus ? '✅' : '❌') + ' MongoDB Atlas');
        console.log('  🔍 Backend API (check above)');
        console.log('  🔍 Frontend Server (check above)');

        if (mongoStatus) {
            console.log('\n🎉 MongoDB is connected! Your data will be stored in:');
            console.log('   Database: ' + mongoose.connection.name);
            console.log('   Collections: users, habits, exams, studyplans, specialtasks');
        }

        console.log('\n📱 Access your application:');
        console.log('   Frontend: http://localhost:5173');
        console.log('   Backend:  http://localhost:5000');
        console.log('   Health:   http://localhost:5000/api/health\n');

        process.exit(0);
    }, 1000);
}
