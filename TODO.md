# Resonance TODO List

## High Priority Infrastructure Tasks

### 🔥 Set Up Chroma Server on Aiur

**Goal**: Run a centralized Chroma server on your home server ("aiur") so all development machines can share the same memory/vector database.

**Why**:
- Shared memory across laptop and desktop
- No manual sync needed
- Proper concurrent access handling
- Faster than network file systems

**Steps**:

1. **SSH into aiur**:
   ```bash
   ssh aiur
   ```

2. **Install Chroma** (if not already installed):
   ```bash
   pip install chromadb
   # Or use UV for faster install
   uv pip install chromadb
   ```

3. **Create Chroma Server Service**:

   Create systemd service file: `/etc/systemd/system/chroma.service`
   ```ini
   [Unit]
   Description=Chroma Vector Database Server
   After=network.target

   [Service]
   Type=simple
   User=aerion
   WorkingDirectory=/home/aerion/chroma
   ExecStart=/usr/bin/chroma run --host 0.0.0.0 --port 8000 --path /home/aerion/chroma/data
   Restart=always
   RestartSec=10

   [Install]
   WantedBy=multi-user.target
   ```

4. **Create data directory**:
   ```bash
   mkdir -p /home/aerion/chroma/data
   ```

5. **Start and enable service**:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable chroma
   sudo systemctl start chroma
   sudo systemctl status chroma
   ```

6. **Verify it's running**:
   ```bash
   curl http://aiur:8000/api/v1/heartbeat
   ```

7. **Update Claude Code MCP Settings**:

   On **both** desktop and laptop, configure the MCP memory server to use aiur instead of local Chroma.

   Find your MCP memory server config (usually in `~/.config/mcp/` or similar) and update:
   ```json
   {
     "mcpServers": {
       "memory": {
         "command": "npx",
         "args": ["-y", "@modelcontextprotocol/server-memory"],
         "env": {
           "CHROMA_HOST": "aiur",
           "CHROMA_PORT": "8000"
         }
       }
     }
   }
   ```

8. **Import memories on aiur**:
   ```bash
   # On desktop or laptop, run the import against aiur's Chroma
   python scripts/import_memories.py .claude/memory-export.json --host aiur --port 8000
   ```

9. **Test from desktop**:
   ```bash
   # Should be able to query memories stored on aiur
   # Try the /save command or natural memory triggers
   ```

**Security Considerations**:
- Chroma server on 0.0.0.0:8000 is accessible on your home network
- Consider adding firewall rules if needed: `sudo ufw allow from 192.168.0.0/16 to any port 8000`
- Or bind to specific network interface instead of 0.0.0.0

**Alternative (Docker)**:
If you prefer Docker on aiur:
```bash
docker run -d \
  --name chroma \
  --restart unless-stopped \
  -p 8000:8000 \
  -v /home/aerion/chroma/data:/chroma/chroma \
  chromadb/chroma:latest
```

---

## Current Development Tasks

### Issue #8: Core Database Setup
- [x] Create requirements.txt
- [x] Create .env.example
- [x] Implement backend/core/config.py
- [x] Implement backend/core/database.py
- [x] Create directory structure
- [x] WIP commit pushed
- [ ] **Install dependencies on desktop** (uv pip install -r requirements.txt)
- [ ] **Test database initialization** (python test_db_init.py)
- [ ] **Final commit** when tests pass
- [ ] **Create PR** for Issue #8

### Next: Issue #9 - Shared Type Definitions
After completing #8, move on to shared Pydantic models.

---

## Memory Management

### Import Project Memories (One-Time Setup on New Machine)

After setting up Chroma on aiur, import the memory snapshot:

```bash
# Option 1: If import script exists
python scripts/import_memories.py .claude/memory-export.json --host aiur --port 8000

# Option 2: Manual import via MCP tools
# Use Claude Code's MCP memory tools to add each document
```

### Keeping Memories in Sync

Once Chroma is running on aiur:
- ✅ All machines automatically share the same memory
- ✅ No manual export/import needed
- ✅ Session end hooks save to shared Chroma
- ✅ Session start hooks load from shared Chroma

---

## Documentation Tasks

- [ ] Write step-by-step code explanation for Issue #8 (config.py, database.py)
- [ ] Document Chroma server setup process
- [ ] Create memory import/export scripts
- [ ] Update README with server architecture diagram

---

## Notes

- Changed "Campaign" terminology to "Story" for narrative tracking
- Using UV for faster Python package management
- Project uses hybrid database: Chroma (vectors) + SQLite (metadata)
- Test-driven development: each phase fully tested before moving forward
