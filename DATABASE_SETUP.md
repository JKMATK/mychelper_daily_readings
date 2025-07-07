# Database Setup Instructions

## PostgreSQL Database Setup

This project uses PostgreSQL with the following configuration:
- **Database Name**: `mychelper_daily_readings`
- **Username**: `mychelper_use`
- **Password**: `LordBless`

### Prerequisites
- PostgreSQL installed on your system
- `psql` command-line tool available

### Setup Steps

1. **Create the database and user**:
   ```bash
   # Connect to PostgreSQL as superuser (usually postgres)
   sudo -u postgres psql
   
   # Run the setup script
   \i setup-database.sql
   
   # Exit psql
   \q
   ```

2. **Create environment file**:
   Create a `.env` file in the project root with:
   ```
   DATABASE_URL="postgresql://mychelper_use:LordBless@localhost:5432/mychelper_daily_readings"
   ```

3. **Generate Prisma client and run migrations**:
   ```bash
   # Install dependencies (if not already done)
   npm install
   
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma db push
   ```

### Alternative Setup (if you prefer manual steps)

If you prefer to run the SQL commands manually:

1. Connect to PostgreSQL:
   ```bash
   sudo -u postgres psql
   ```

2. Create database and user:
   ```sql
   CREATE DATABASE mychelper_daily_readings;
   CREATE USER mychelper_use WITH PASSWORD 'LordBless';
   GRANT ALL PRIVILEGES ON DATABASE mychelper_daily_readings TO mychelper_use;
   ```

3. Connect to the new database:
   ```sql
   \c mychelper_daily_readings;
   ```

4. Grant schema privileges:
   ```sql
   GRANT ALL ON SCHEMA public TO mychelper_use;
   GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO mychelper_use;
   GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO mychelper_use;
   ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO mychelper_use;
   ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO mychelper_use;
   ```

### Tables Created

The Prisma schema will create the following tables:
- `churches` - Church information
- `daily_readings` - Reading schedules
- `daily_reading_entries` - Individual daily reading entries

### Testing the Connection

You can test the database connection by running:
```bash
npx prisma studio
```

This will open a web interface where you can view and manage your database tables. 