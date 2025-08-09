#!/usr/bin/env node

/**
 * Farezy App Store Asset Generator
 * Creates screenshots and promotional materials for app stores
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'public', 'screenshots');
const BASE_URL = 'http://localhost:5000';

const SCREENSHOT_CONFIGS = [
  {
    name: 'home-screen',
    url: '/',
    viewport: { width: 390, height: 844 },
    description: 'Home screen with location picker'
  },
  {
    name: 'ride-comparison',
    url: '/?pickup=Milton+Keynes&destination=London',
    viewport: { width: 390, height: 844 },
    description: 'Ride comparison results'
  },
  {
    name: 'tablet-home',
    url: '/',
    viewport: { width: 834, height: 1194 },
    description: 'Tablet home screen'
  },
  {
    name: 'tablet-comparison',
    url: '/?pickup=Milton+Keynes&destination=London',
    viewport: { width: 834, height: 1194 },
    description: 'Tablet ride comparison'
  }
];

async function generateScreenshots() {
  console.log('📸 Generating app store screenshots...\n');
  
  // Ensure screenshots directory exists
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    for (const config of SCREENSHOT_CONFIGS) {
      console.log(`📱 Capturing: ${config.description}`);
      
      const page = await browser.newPage();
      await page.setViewport(config.viewport);
      
      // Navigate to page
      await page.goto(`${BASE_URL}${config.url}`, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });
      
      // Wait for content to load
      await page.waitForTimeout(2000);
      
      // Take screenshot
      const screenshotPath = path.join(SCREENSHOTS_DIR, `${config.name}.png`);
      await page.screenshot({
        path: screenshotPath,
        fullPage: false
      });
      
      console.log(`✅ Saved: ${config.name}.png`);
      await page.close();
    }
    
    console.log('\n🎉 All screenshots generated successfully!');
    console.log(`📁 Location: ${SCREENSHOTS_DIR}`);
    
  } catch (error) {
    console.error('❌ Screenshot generation failed:', error.message);
  } finally {
    await browser.close();
  }
}

async function generateFeatureGraphic() {
  console.log('\n🎨 Generating feature graphic for Google Play Store...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1024, height: 500 });
    
    // Create a custom feature graphic
    await page.setContent(`
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 0;
              background: linear-gradient(135deg, #f97316, #eab308);
              font-family: 'Arial', sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 500px;
              overflow: hidden;
            }
            .container {
              text-align: center;
              color: white;
              position: relative;
            }
            .logo {
              font-size: 72px;
              font-weight: bold;
              margin-bottom: 20px;
              text-shadow: 0 4px 8px rgba(0,0,0,0.3);
            }
            .tagline {
              font-size: 32px;
              font-weight: 300;
              margin-bottom: 10px;
              opacity: 0.95;
            }
            .subtitle {
              font-size: 18px;
              opacity: 0.8;
            }
            .car-icon {
              position: absolute;
              top: -40px;
              right: -60px;
              font-size: 48px;
              opacity: 0.3;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="car-icon">🚗</div>
            <div class="logo">Farezy</div>
            <div class="tagline">Smart Ride Comparison</div>
            <div class="subtitle">Compare • Book • Save</div>
          </div>
        </body>
      </html>
    `);
    
    await page.waitForTimeout(1000);
    
    const featureGraphicPath = path.join(SCREENSHOTS_DIR, 'feature-graphic.png');
    await page.screenshot({
      path: featureGraphicPath,
      fullPage: false
    });
    
    console.log('✅ Feature graphic generated: feature-graphic.png');
    await page.close();
    
  } catch (error) {
    console.error('❌ Feature graphic generation failed:', error.message);
  } finally {
    await browser.close();
  }
}

async function main() {
  console.log('🚀 Farezy App Store Asset Generator\n');
  
  try {
    await generateScreenshots();
    await generateFeatureGraphic();
    
    console.log('\n✨ All assets generated successfully!');
    console.log('📋 Next steps:');
    console.log('   1. Review generated screenshots');
    console.log('   2. Upload to app store consoles');
    console.log('   3. Submit for review');
    
  } catch (error) {
    console.error('❌ Asset generation failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generateScreenshots, generateFeatureGraphic };