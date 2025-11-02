# 📊 HeartSense Database - Complete File Guide

## 🎯 Which File Should I Use?

### Just Want It Working? → `00_START_HERE.md` ⭐
**Best for:** First time setup, fixing current errors  
**Contains:** One complete SQL query to copy-paste

---

### Need Step-by-Step? → `QUICK_SETUP.md` ⚡
**Best for:** Quick reference, troubleshooting  
**Contains:** 4 steps with copy-paste SQL

---

### Want Full Details? → `SETUP_INSTRUCTIONS.md` 📖
**Best for:** Understanding the system, production setup  
**Contains:** Complete documentation with explanations

---

## 📁 All Files Explained

### Setup Files (Numbered in order)

| File | Use When | Skip If |
|------|----------|---------|
| `00_START_HERE.md` | **Start here!** First time setup | Never skip this |
| `01_drop_existing.sql` | Tables already exist, need fresh start | Tables don't exist yet |
| `02_create_tables.sql` | Need to create tables manually | Using all-in-one query |
| `03_enable_rls.sql` | Need to enable security manually | Using all-in-one query |
| `04_create_policies.sql` | Need to set permissions manually | Using all-in-one query |
| `05_create_views_functions.sql` | Want analytics & helper functions | Don't need extras |
| `06_seed_data_optional.sql` | Want test data | Production setup |
| `07_verify_setup.sql` | Check if setup worked | Everything working |

### Documentation Files

| File | Purpose |
|------|---------|
| `QUICK_SETUP.md` | Quick 3-step setup guide |
| `SETUP_INSTRUCTIONS.md` | Detailed setup documentation |
| `README.md` | Developer reference & schema info |

---

## 🔄 Common Workflows

### Scenario 1: First Time Setup (NEW PROJECT) ✅

```
1. Read: 00_START_HERE.md
2. Run: The one SQL query from that file
3. Update: .env file with password
4. Restart: Backend server
5. Done! ✅
```

### Scenario 2: Getting Errors (FIXING ISSUES) 🔧

```
1. Check error message
2. If "table exists" → Run 01_drop_existing.sql first
3. If "table not found" → Run query from 00_START_HERE.md
4. If "password" → Update .env file
5. Always restart backend after changes
```

### Scenario 3: Manual Step-by-Step (LEARNING) 📚

```
1. Run: 02_create_tables.sql
2. Run: 03_enable_rls.sql
3. Run: 04_create_policies.sql
4. Run: 05_create_views_functions.sql (optional)
5. Run: 07_verify_setup.sql
6. Update: .env file
7. Restart: Backend
```

### Scenario 4: Start Fresh (RESET EVERYTHING) 🔄

```
1. Run: 01_drop_existing.sql
2. Run: Query from 00_START_HERE.md
3. Update: .env file (if needed)
4. Restart: Backend
```

---

## ⚠️ Current Error Solutions

### Error: "relation message_history does not exist"
**Solution:** Tables not created yet
- **DO NOT** run `01_drop_existing.sql`
- **DO** run the query from `00_START_HERE.md`

### Error: "policy already exists"
**Solution:** Trying to create duplicate policies
- Run `01_drop_existing.sql` first
- Then run setup query again

### Error: "SUPABASE_DB_URL not set"
**Solution:** Missing database password in .env
- Get password from Supabase dashboard
- Update `.env` file
- Restart backend server

### Error: "Could not find table 'public.user_sessions'"
**Solution:** RLS blocking access or table missing
- Run `07_verify_setup.sql` to check
- May need to update .env and restart

---

## 🎯 Quick Decision Tree

```
START
  |
  ├─ Tables don't exist? → 00_START_HERE.md
  |
  ├─ Tables exist but broken? → 01_drop_existing.sql + 00_START_HERE.md
  |
  ├─ Need to understand system? → SETUP_INSTRUCTIONS.md
  |
  ├─ Want analytics tools? → 05_create_views_functions.sql
  |
  └─ Check if working? → 07_verify_setup.sql
```

---

## 📍 File Locations

```
HeartSense/
└── backend/
    └── database/
        ├── 00_START_HERE.md           ⭐ START HERE
        ├── 01_drop_existing.sql       🔴 Delete everything
        ├── 02_create_tables.sql       📊 Create tables
        ├── 03_enable_rls.sql          🔒 Enable security
        ├── 04_create_policies.sql     🛡️ Set permissions
        ├── 05_create_views_functions.sql 📈 Add analytics
        ├── 06_seed_data_optional.sql  🌱 Test data
        ├── 07_verify_setup.sql        ✅ Verify setup
        ├── QUICK_SETUP.md             ⚡ Quick guide
        ├── SETUP_INSTRUCTIONS.md      📖 Full docs
        ├── README.md                  📚 Developer ref
        └── FILE_GUIDE.md              📊 This file
```

---

## 💡 Pro Tips

1. **First time?** Just use `00_START_HERE.md` - it's the easiest
2. **Got an error?** Check the error solutions above
3. **Need control?** Use individual SQL files (02-07)
4. **Want to reset?** Use `01_drop_existing.sql` then start fresh
5. **Always restart** backend after changing .env file
6. **Verify** with `07_verify_setup.sql` after setup

---

## 🆘 Still Stuck?

1. ✅ Check you're logged into Supabase
2. ✅ Check project ID is correct: `auqhuozialxppjnpuioa`
3. ✅ Check .env has actual password (no `[YOUR-PASSWORD]`)
4. ✅ Check backend restarted after .env changes
5. ✅ Run `07_verify_setup.sql` to see what's missing

---

**Remember:** When in doubt, start with `00_START_HERE.md`! 🎯
