#!/usr/bin/env node

/**
 * Database Reset Script
 * Drops all data and recreates clean database
 */

const { MongoClient } = require('mongodb')

const MONGO_URL = process.env.MONGO_URL || 'mongodb://admin:admin123@localhost:27017/clean-node-api?authSource=admin'

async function resetDatabase() {
  console.log('🔄 Resetting database...')
  
  const client = await MongoClient.connect(MONGO_URL)
  const db = client.db()
  
  try {
    // Drop all collections
    const collections = await db.listCollections().toArray()
    
    for (const collection of collections) {
      await db.collection(collection.name).drop()
      console.log(`🗑️  Dropped collection: ${collection.name}`)
    }
    
    console.log('🎉 Database reset completed!')
    
    // Optionally recreate structure
    if (process.argv.includes('--setup')) {
      const { setupDatabase } = require('./setup-database')
      await setupDatabase()
    }
    
  } finally {
    await client.close()
  }
}

async function main() {
  try {
    await resetDatabase()
  } catch (error) {
    console.error('❌ Database reset failed:', error.message)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

module.exports = { resetDatabase }