# Skin Passport — Hairless Web3 MVP

Soulbound NFT contract за Hairless Laser Aesthetics. Всеки клиент получава
non-transferable NFT с история на третиранията. Базов слой за Base/Polygon
grant приложения.

## Какво е готово

- `contracts/SkinPassport.sol` — компилиран и логически верифициран ✅
  (mint, update, soulbound enforcement — всичко тествано чрез директна solc компилация)
- `test/SkinPassport.test.js` — 7 теста покриващи mint, double-mint protection,
  operator authorization, и soulbound blocking на transfer/approve
- `scripts/deploy.js` — deploy скрипт за Base Sepolia / Base mainnet / Polygon Amoy
- `hardhat.config.js` — конфигуриран за трите мрежи

## Стъпки локално (5 минути)

### 1. Клонирай/копирай тази папка и инсталирай

```bash
cd skin-passport
npm install
```

### 2. Пусни тестовете (трябва да минат всичките 7)

```bash
npx hardhat test
```

### 3. Направи `.env` файл

```bash
cp .env.example .env
```

Попълни:
```
PRIVATE_KEY=твоят_тестов_wallet_private_key   # БЕЗ 0x в началото
BASESCAN_API_KEY=                              # от basescan.org (безплатно)
```

⚠️ **Никога не commit-вай `.env` файла. Никога не ползвай wallet с реални средства за testnet.**
Направи отделен тестов wallet в MetaMask само за тази цел.

### 4. Вземи безплатен Base Sepolia testnet ETH

- https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
- или https://bridge.base.org/deposit (ако имаш Sepolia ETH на Ethereum)

Трябват ти само стотинки testnet ETH — деплойването струва центове.

### 5. Деплойни на Base Sepolia testnet

```bash
npx hardhat run scripts/deploy.js --network baseSepolia
```

Ще видиш адреса на контракта и линк към BaseScan explorer.

### 6. Верифицирай контракта публично (важно за grant заявка)

```bash
npx hardhat verify --network baseSepolia <CONTRACT_ADDRESS>
```

### 7. Mint-ни първия тестов Skin Passport

Бърз скрипт за това можем да го напишем след deploy — ще ти трябва адресът
на контракта.

## Защо Cancun EVM target

Контрактът ползва OpenZeppelin's нов `Bytes.sol` helper, който разчита на
`MCOPY` опкода (EIP-5656). Base Sepolia, Base mainnet, и Polygon Amoy всички
поддържат Cancun upgrade — затова е безопасно зададено в `hardhat.config.js`.

## Следваща стъпка след successful testnet deploy

1. Mint 3 тестови паспорта за реални клиенти (демонстрация за grant reviewers)
2. Push кода в публичен GitHub repo с ясен README (вече го имаш)
3. Кандидатствай за Base Builder Grant nomination
4. Паралелно — провери Polygon Season статус през questbook.app

## Контракт функции (за grant писане)

| Функция | Кой може | Какво прави |
|---|---|---|
| `mintPassport(client, skinType, metadataURI)` | оторизиран operator | Издава нов паспорт |
| `updatePassport(tokenId, newMetadataURI)` | оторизиран operator | Обновява история след сесия |
| `setOperator(address, bool)` | owner (ти) | Дава достъп на Sonya/Kristin да минтват |
| `tokenURI(tokenId)` | публично | Връща IPFS метаданните |
| `transferFrom` / `approve` | — | **Винаги revert-ват** — soulbound |
