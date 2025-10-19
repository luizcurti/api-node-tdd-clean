#!/usr/bin/env node

/**
 * Database Setup Script
 * Creates collections, indexes and initial data for development
 */

const { MongoClient } = require('mongodb')
const bcrypt = require('bcrypt')

const MONGO_URL = process.env.MONGO_URL || 'mongodb://admin:admin123@localhost:27017/clean-node-api?authSource=admin'

async function setupDatabase() {
  console.log('🔧 Setting up database...')
  
  const client = await MongoClient.connect(MONGO_URL)
  const db = client.db()
  
  try {
    // Create collections if they don't exist
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map(c => c.name)
    
    if (!collectionNames.includes('users')) {
      await db.createCollection('users')
      console.log('✅ Created users collection')
    }
    
    // Create indexes
    const usersCollection = db.collection('users')
    
    // Email unique index
    try {
      await usersCollection.createIndex({ email: 1 }, { unique: true })
      console.log('✅ Created unique index on email')
    } catch (error) {
      if (error.code !== 85) { // Index already exists
        throw error
      }
      console.log('ℹ️  Email index already exists')
    }
    
    // AccessToken index
    try {
      await usersCollection.createIndex({ accessToken: 1 })
      console.log('✅ Created index on accessToken')
    } catch (error) {
      if (error.code !== 85) { // Index already exists
        throw error
      }
      console.log('ℹ️  AccessToken index already exists')
    }
    
    console.log('🎉 Database setup completed successfully!')
    
  } finally {
    await client.close()
  }
}

async function seedTestData() {
  console.log('🌱 Seeding test data...')
  
  const client = await MongoClient.connect(MONGO_URL)
  const db = client.db()
  
  try {
    const usersCollection = db.collection('users')
    
    // Check if test user already exists
    const existingUser = await usersCollection.findOne({ email: 'test@example.com' })
    
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('123456', 12)
      
      await usersCollection.insertOne({
        email: 'test@example.com',
        name: 'Test User',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      
      console.log('✅ Created test user: test@example.com / 123456')
    } else {
      console.log('ℹ️  Test user already exists')
    }
    
    console.log('🎉 Test data seeded successfully!')
    
  } finally {
    await client.close()
  }
}

async function main() {
  try {
    await setupDatabase()
    
    if (process.argv.includes('--seed')) {
      await seedTestData()
    }
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

module.exports = { setupDatabase, seedTestData }