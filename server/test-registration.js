// Test the registration system
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000';

async function testRegistration() {
  console.log('🧪 Testing user registration system...\n');

  const testUser = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com', // Change this to your email to receive the verification
    phone: '+1234567890',
    password: 'TestPassword123!'
  };

  try {
    console.log('📝 Registering new user...');
    const response = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Registration successful!');
      console.log('📧 Verification email should be sent to:', testUser.email);
      console.log('📋 User created:', {
        id: result.user.id,
        name: `${result.user.firstName} ${result.user.lastName}`,
        email: result.user.email,
        emailVerified: result.user.emailVerified
      });
      console.log('\n📝 Next steps:');
      console.log('1. Check your email for verification link');
      console.log('2. Click the link to verify your account');
      console.log('3. You should receive a welcome email');
      console.log('4. Then you can log in normally');
    } else {
      console.log('❌ Registration failed:', result.message);
      if (result.errors) {
        console.log('📋 Validation errors:', result.errors);
      }
    }
  } catch (error) {
    console.error('❌ Error testing registration:', error.message);
  }
}

testRegistration();