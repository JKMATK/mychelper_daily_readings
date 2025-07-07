#!/bin/bash

echo "Setting up PostgreSQL database for mychelper_daily_readings..."

# Check if PostgreSQL is running
if ! pg_isready -q; then
    echo "PostgreSQL is not running. Please start PostgreSQL first."
    exit 1
fi

# Create the database and user
echo "Creating database and user..."
sudo -u postgres psql -c "CREATE DATABASE mychelper_daily_readings;" 2>/dev/null || echo "Database might already exist"
sudo -u postgres psql -c "CREATE USER mychelper_use WITH PASSWORD 'LordBless';" 2>/dev/null || echo "User might already exist"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE mychelper_daily_readings TO mychelper_use;"

# Grant schema privileges
echo "Setting up schema privileges..."
sudo -u postgres psql -d mychelper_daily_readings -c "GRANT ALL ON SCHEMA public TO mychelper_use;"
sudo -u postgres psql -d mychelper_daily_readings -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO mychelper_use;"
sudo -u postgres psql -d mychelper_daily_readings -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO mychelper_use;"
sudo -u postgres psql -d mychelper_daily_readings -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO mychelper_use;"
sudo -u postgres psql -d mychelper_daily_readings -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO mychelper_use;"

echo "Database setup complete!"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    echo 'DATABASE_URL="postgresql://mychelper_use:LordBless@localhost:5432/mychelper_daily_readings"' > .env
    echo ".env file created with database connection string"
else
    echo ".env file already exists"
fi

echo ""
echo "Next steps:"
echo "1. Run: npm install"
echo "2. Run: npx prisma generate"
echo "3. Run: npx prisma db push"
echo "4. Run: npx prisma studio (to view your database)" 