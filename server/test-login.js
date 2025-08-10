// Test the login system
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000';

async function testLogin() {
  console.log('🧪 Testing user login system...\n');

  const testUser = {
    email: 'test@example.com', // Use the same email from registration test
    password: 'TestPassword123!'
  };

  try {
    console.log('🔐 Attempting to log in...');
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Login successful!');
      console.log('👤 User logged in:', {
        id: result.user.id,
        name: `${result.user.firstName} ${result.user.lastName}`,
        email: result.user.email,
        emailVerified: result.user.emailVerified
      });
      console.log('🔑 JWT Token received:', result.token ? 'Yes' : 'No');
    } else {
      console.log('❌ Login failed:', result.message);
      
      if (result.message.includes('verify your email')) {
        console.log('📧 Note: You need to verify your email first by clicking the link in your inbox');
      }
    }
  } catch (error) {
    console.error('❌ Error testing login:', error.message);
  }
}

testLogin();