
db = db.getSiblingDB('clean-node-api');

db.createUser({
  user: 'api-user',
  pwd: 'api-password',
  roles: [
    {
      role: 'readWrite',
      db: 'clean-node-api'
    }
  ]
});

db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ accessToken: 1 });

print('Database clean-node-api initialized successfully!');