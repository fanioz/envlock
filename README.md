# envcrypt

Encrypt, sync, and inject `.env` files. Zero-config, zero-login, works offline.

## Install

```bash
npm install -g envcrypt
```

## Quick Start

```bash
# 1. Create your .env file
echo "DB_HOST=localhost\nDB_PASS=secret" > .env

# 2. Initialize — encrypts .env → .env.lock
envcrypt init

# 3. Run any command with decrypted env vars injected
envcrypt run node server.js
envcrypt run npm start
envcrypt run python app.py
```

## Commands

### `envcrypt init`

Encrypts your current `.env` file into `.env.lock` using AES-256-GCM. The encryption key is stored locally at `~/.envcrypt.json`.

```bash
envcrypt init
```

### `envcrypt run <command>`

Decrypts `.env.lock` and injects all values as environment variables, then runs the given command.

```bash
envcrypt run node server.js
envcrypt run "npm run dev"
```

### `envcrypt sync <env>`

Saves the decrypted environment to `.envs/<env>.env` and copies it to `.env`. Use this to switch between environments.

```bash
envcrypt sync staging
envcrypt sync production
```

### `envcrypt list`

Shows all saved environments.

```bash
envcrypt list
```

## How It Works

1. **`init`** generates a random encryption key (saved to `~/.envcrypt.json`), reads `.env`, encrypts it with AES-256-GCM, and writes the ciphertext to `.env.lock`.
2. **`run`** decrypts `.env.lock`, injects all variables into `process.env`, and spawns your command as a child process.
3. **`sync`** decrypts `.env.lock`, saves a named copy to `.envs/<name>.env`, and overwrites `.env` with it.
4. **`list`** scans the `.envs/` directory for saved environments.

## Security

- AES-256-GCM encryption with scrypt key derivation
- Key stored locally at `~/.envcrypt.json` (never sent anywhere)
- Zero network calls — fully offline
- Do NOT commit `.env`, `.env.lock`, or `~/.envcrypt.json` to version control

## License

MIT
