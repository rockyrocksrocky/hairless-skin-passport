# Skin Passport — Hairless Web3 MVP

Soulbound NFT contract за Hairless Laser Aesthetics. Всеки клиент получава
non-transferable NFT с история на третиранията. Базов слой за Base/Polygon
grant приложения.

## 🟢 Live на Base Mainnet

**Contract:** [`0xD9ee2a27e41B1350406F6c9D42f680A869Bd6A52`](https://basescan.org/address/0xD9ee2a27e41B1350406F6c9D42f680A869Bd6A52#code)
**Status:** Source Code Verified ✅
**Live passports:** 4 reálni Skin Passport NFT-та minted за реалния Hairless екип
(Kristin — Sofia, Sonya — Kyustendil, Tanya — Kyustendil, Iva — Mobile)

Testnet версия (Base Sepolia) остава достъпна за развойни цели:
[`0x262a7032b4E7415B13C5C7c4318069910797b336`](https://sepolia.basescan.org/address/0x262a7032b4E7415B13C5C7c4318069910797b336#code)

## Какво е готово

- `contracts/SkinPassport.sol` — компилиран, тестван, **верифициран на mainnet** ✅
  (mint, update, soulbound enforcement — всичко тествано чрез 7 unit теста + реален deploy)
- `test/SkinPassport.test.js` — 7 теста покриващи mint, double-mint protection,
  operator authorization, и soulbound blocking на transfer/approve
- `scripts/deploy.js` — deploy скрипт за Base Sepolia / Base mainnet / Polygon Amoy
- `scripts/mint.js` — mint скрипт, използван за реалните 4 mainnet passport-а
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

## Следваща стъпка

1. ✅ ~~Mint реални паспорти за демонстрация~~ — направено, 4 mainnet passport-а
2. ✅ ~~Push кода в публичен GitHub repo~~ — направено
3. **Кандидатствай за Base Builder Grant nomination** ← следваща стъпка
4. Паралелно — провери Polygon grant статус през questbook.app

## Контракт функции (за grant писане)

| Функция | Кой може | Какво прави |
|---|---|---|
| `mintPassport(client, skinType, metadataURI)` | оторизиран operator | Издава нов паспорт |
| `updatePassport(tokenId, newMetadataURI)` | оторизиран operator | Обновява история след сесия |
| `setOperator(address, bool)` | owner (ти) | Дава достъп на Sonya/Kristin да минтват |
| `tokenURI(tokenId)` | публично | Връща IPFS метаданните |
| `transferFrom` / `approve` | — | **Винаги revert-ват** — soulbound |