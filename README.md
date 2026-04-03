# envlock

Encrypt, sync, and inject `.env` files. Zero-config, zero-login, works offline.

## Install

```bash
npm install -g envlock
```

## Quick Start

```bash
# 1. Create your .env file
echo "DB_HOST=localhost\nDB_PASS=secret" > .env

# 2. Initialize — encrypts .env → .env.lock
envlock init

# 3. Run any command with decrypted env vars injected
envlock run node server.js
envlock run npm start
envlock run python app.py
```

## Commands

### `envlock init`

Encrypts your current `.env` file into `.env.lock` using AES-256-GCM. The encryption key is stored locally at `~/.envlock.json`.

```bash
envlock init
```

### `envlock run <command>`

Decrypts `.env.lock` and injects all values as environment variables, then runs the given command.

```bash
envlock run node server.js
envlock run "npm run dev"
```

### `envlock sync <env>`

Saves the decrypted environment to `.envs/<env>.env` and copies it to `.env`. Use this to switch between environments.

```bash
envlock sync staging
envlock sync production
```

### `envlock list`

Shows all saved environments.

```bash
envlock list
```

## How It Works

1. **`init`** generates a random encryption key (saved to `~/.envlock.json`), reads `.env`, encrypts it with AES-256-GCM, and writes the ciphertext to `.env.lock`.
2. **`run`** decrypts `.env.lock`, injects all variables into `process.env`, and spawns your command as a child process.
3. **`sync`** decrypts `.env.lock`, saves a named copy to `.envs/<name>.env`, and overwrites `.env` with it.
4. **`list`** scans the `.envs/` directory for saved environments.

## Security

- AES-256-GCM encryption with scrypt key derivation
- Key stored locally at `~/.envlock.json` (never sent anywhere)
- Zero network calls — fully offline
- Do NOT commit `.env`, `.env.lock`, or `~/.envlock.json` to version control

## License

MIT
