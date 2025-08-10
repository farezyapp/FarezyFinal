#!/usr/bin/env node

/**
 * Farezy Android App Builder
 * Generates Android APK using Bubblewrap CLI
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG = {
  appName: 'Farezy - Smart Ride Comparison',
  packageName: 'uk.co.farezy.app',
  host: 'farezy.co.uk',
  manifestUrl: 'https://farezy.co.uk/manifest.json',
  startUrl: '/',
  themeColor: '#f97316',
  backgroundColor: '#ffffff',
  orientation: 'portrait',
  display: 'standalone'
};

console.log('🚀 Building Farezy Android App...\n');

try {
  // Check if bubblewrap is available
  console.log('📋 Checking dependencies...');
  execSync('bubblewrap --version', { stdio: 'pipe' });
  console.log('✅ Bubblewrap CLI is available\n');

  // Create build directory
  const buildDir = path.join(process.cwd(), 'android-build');
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir);
  }
  
  process.chdir(buildDir);

  // Initialize TWA project
  console.log('🔧 Initializing Trusted Web Activity project...');
  const initCommand = `bubblewrap init \\
    --manifest ${CONFIG.manifestUrl} \\
    --directory ./farezy-android`;
  
  execSync(initCommand, { stdio: 'inherit' });
  console.log('✅ TWA project initialized\n');

  // Navigate to project directory
  process.chdir('./farezy-android');

  // Build the APK
  console.log('🏗️  Building Android APK...');
  execSync('bubblewrap build', { stdio: 'inherit' });
  console.log('✅ Android APK built successfully!\n');

  console.log('📱 Android app build complete!');
  console.log('📁 Location: android-build/farezy-android/app/build/outputs/apk/release/');
  console.log('🚀 Ready for Google Play Store submission');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  
  if (error.message.includes('bubblewrap')) {
    console.log('\n💡 Solution: Install Bubblewrap CLI globally:');
    console.log('   npm install -g @bubblewrap/cli');
  }
  
  if (error.message.includes('Java')) {
    console.log('\n💡 Solution: Install Java Development Kit (JDK) 8 or higher');
  }
  
  if (error.message.includes('Android')) {
    console.log('\n💡 Solution: Install Android SDK and set ANDROID_HOME environment variable');
  }
  
  process.exit(1);
}