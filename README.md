# Monad Testnet dApp Tracker (GitHub JSON version)

This version reads a `data/wallets.json` file from the repo and highlights dApps for a pasted wallet address.
Ideal when you want a zero-backend setup (Vercel + static files only).

## How it works
- User pastes wallet address and clicks **Check**.
- `script.js` fetches `data/wallets.json` and looks up the wallet key (lowercased).
- Matching dApps are highlighted in green; others are dimmed.
- Stats show how many dApps were explored.

## Update data
Edit `data/wallets.json` in GitHub and commit.
Keys are lowercased wallet addresses (simple normalization). Values are arrays of dApp names that must match the `data-dapp` attributes in `index.html`.

Example:
```json
{
  "0x1234567890abcdef": ["MonadSwap", "MonadLend"],
  "0xabcdef1234567890": ["MonadBridge"]
}
```

## Deploy
- Push to a GitHub repo.
- Connect the repo to Vercel (or GitHub Pages). No server needed.
- Ensure relative path `data/wallets.json` is preserved in the deployed output.

## Customize
- Add/remove dApp cards in `index.html` (each has `data-dapp="Name"`).
- Keep names consistent between the HTML and `wallets.json`.
- Style tweaks: edit `styles.css`.
