// Test script to debug Uber OAuth authentication
import fetch from 'node-fetch';

async function testUberAuth() {
  const clientId = process.env.UBER_CLIENT_ID;
  const clientSecret = process.env.UBER_CLIENT_SECRET;
  
  console.log('Testing Uber OAuth with credentials:');
  console.log('Client ID present:', !!clientId);
  console.log('Client Secret present:', !!clientSecret);
  
  if (!clientId || !clientSecret) {
    console.error('Missing credentials');
    return;
  }
  
  // Test 1: Basic client credentials flow
  const tokenUrl = 'https://login.uber.com/oauth/v2/token';
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials'
  });

  console.log('\nTesting OAuth token request...');
  
  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });
    
    const responseText = await response.text();
    console.log('Response status:', response.status);
    console.log('Response:', responseText);
    
    if (response.ok) {
      const tokenData = JSON.parse(responseText);
      console.log('\n✓ OAuth successful!');
      console.log('Access token received:', !!tokenData.access_token);
      
      // Test API call with token
      const apiResponse = await fetch('https://api.uber.com/v1.2/products?latitude=37.7749295&longitude=-122.4194155', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Accept-Language': 'en_US',
          'Content-Type': 'application/json',
        },
      });
      
      const apiResult = await apiResponse.text();
      console.log('\nAPI test response:', apiResponse.status);
      console.log('API result:', apiResult);
      
    } else {
      console.log('\n✗ OAuth failed');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testUberAuth();