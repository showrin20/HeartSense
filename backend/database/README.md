# 🗄️ HeartSense Database Files

This directory contains all SQL files needed to set up the HeartSense Supabase database.

---

## ⭐ NEW USER? START HERE! ⭐

### � Open `00_START_HERE.md` first!

That file has everything you need in one place. Just copy, paste, done! ✅

---

## �📁 All Files Overview

### 🎯 Quick Start Files (Pick One)
| File | Best For | Time |
|------|----------|------|
| **`00_START_HERE.md`** ⭐ | First time setup, fixing errors | 5 min |
| `QUICK_SETUP.md` | Quick reference | 3 min |
| `FILE_GUIDE.md` | Confused? Read this | 2 min |

### 📝 SQL Files (Advanced/Manual Setup)
| File | Purpose | Required | When to Use |
|------|---------|----------|-------------|
| `01_drop_existing.sql` | Delete everything | Optional | Reset/Clean slate |
| `02_create_tables.sql` | Create tables | **Yes** | Manual setup |
| `03_enable_rls.sql` | Enable security | **Yes** | Manual setup |
| `04_create_policies.sql` | Set permissions | **Yes** | Manual setup |
| `05_create_views_functions.sql` | Add analytics | Optional | Extra features |
| `06_seed_data_optional.sql` | Test data | Optional | Testing only |
| `07_verify_setup.sql` | Check setup | Verify | After setup |

### 📚 Documentation Files
| File | Contains |
|------|----------|
| `SETUP_INSTRUCTIONS.md` | Detailed step-by-step guide |
| `README.md` | This file - overview & reference |

---

## 🚀 Quick Start (3 Steps)

### Step 1: Run SQL in Supabase
Open `00_START_HERE.md` and copy the SQL query into your Supabase SQL Editor

### Step 2: Update .env
Add your database password to `backend/.env`

### Step 3: Restart Backend
Press Ctrl+C and restart: `python main.py`

**Done! ✅**

## 📊 Database Schema

```
┌─────────────────┐         ┌──────────────────┐
│  auth.users     │         │  message_history │
│  (Supabase)     │         ├──────────────────┤
├─────────────────┤         │ id               │
│ id (UUID)       │         │ session_id       │
│ email           │         │ message (JSONB)  │
│ ...             │         │ created_at       │
└────────┬────────┘         └────────┬─────────┘
         │                           │
         │ 1:N                       │
         │                           │
         └────────┐         ┌────────┘
                  │         │
           ┌──────▼─────────▼────┐
           │   user_sessions     │
           ├─────────────────────┤
           │ id                  │
           │ user_id (FK)        │
           │ session_id (UNIQUE) │
           │ personality (JSONB) │
           │ language            │
           │ message_count       │
           │ created_at          │
           │ last_message_at     │
           └─────────────────────┘
```

## 🔑 Key Concepts

### Tables
- **message_history**: Stores all chat messages in LangChain-compatible format
- **user_sessions**: Links users to their chat sessions with metadata

### Security (RLS)
- Row Level Security ensures users only access their own data
- Policies enforce access control at database level

### Relationships
- `auth.users` (1) → (N) `user_sessions`
- `user_sessions` (1) → (N) `message_history` (via session_id)

## 📖 For Developers

### Adding New Tables
1. Create SQL file: `0X_add_tablename.sql`
2. Follow same structure (CREATE → INDEX → RLS → POLICIES)
3. Update this README
4. Test with verify script

### Modifying Schema
1. Create migration file: `0X_migrate_description.sql`
2. Include rollback statements
3. Test in development first
4. Document changes

### Testing Queries
```sql
-- Get user's sessions
SELECT * FROM user_sessions WHERE user_id = 'YOUR_USER_ID';

-- Get session messages
SELECT * FROM message_history WHERE session_id = 'YOUR_SESSION_ID';

-- Get user stats
SELECT * FROM user_session_stats WHERE user_id = 'YOUR_USER_ID';
```

## 🔧 Maintenance

### Regular Tasks
- Run `cleanup_old_sessions()` monthly to remove old data
- Monitor table sizes via Supabase dashboard
- Review slow queries in database logs
- Update RLS policies as needed

### Backup
Supabase provides automatic backups, but for critical data:
```sql
-- Export sessions
COPY user_sessions TO '/path/to/backup.csv' CSV HEADER;

-- Export messages
COPY message_history TO '/path/to/messages.csv' CSV HEADER;
```

## 📞 Support

- **Setup Issues:** See `SETUP_INSTRUCTIONS.md`
- **Schema Questions:** Review this README
- **Errors:** Check `07_verify_setup.sql` output
- **Supabase Docs:** https://supabase.com/docs

---

**Last Updated:** November 1, 2025  
**Version:** 1.0.0  
**Compatible With:** Supabase PostgreSQL 15+
