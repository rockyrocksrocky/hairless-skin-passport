# Mint на първите 4 Skin Passport NFT-та

## Стъпка 1 — Качи метаданните в IPFS чрез Pinata (безплатно)

1. Регистрирай се на **https://app.pinata.cloud/register** (безплатен план е достатъчен)
2. След вход: ляво меню → **Files** → **Upload** → **File**
3. Качи `metadata/client1.json`
4. След качване, кликни на файла → копирай неговия **CID** (дълъг низ, изглежда като `bafkrei...` или `Qm...`)
5. Повтори за `client2.json`, `client3.json`, `client4.json`

## Стъпка 2 — Сложи CID-овете в mint скрипта

Отвори `scripts/mint.js` с notepad:

```powershell
notepad scripts/mint.js
```

За всеки клиент, замени:
```js
metadataURI: "ipfs://PASTE_CID_CLIENT1_HERE",
```//
с реалния CID, например:
```js
metadataURI: "ipfs://bafkreigh2akiscaildc6w5d7ymrt5wa3hg5p3sjkj...",
```

Направи това за и четирите клиента (CLIENT1 до CLIENT4).

Запази (Ctrl+S), затвори.

## Стъпка 3 — Пусни mint скрипта

```powershell
npx hardhat run scripts/mint.js --network baseSepolia
```

Очакван резултат — за всеки клиент:
```
Minting passport for Kristin Apostolova (0xA58Ed79C...)...
✅ Minted! Tx: https://sepolia.basescan.org/tx/0x...
```

Всяка транзакция отнема няколко секунди (Base е бърз). В края ще видиш линк за преглед на всички passport-и в контракта.

## Стъпка 4 — Провери резултата

Отиди на:
```
https://sepolia.basescan.org/address/0x262a7032b4E7415B13C5C7c4318069910797b336#readContract
```

Намери функцията `passportOf` → въведи wallet адрес на клиент → би трябвало да върне token ID (1, 2, 3 или 4) вместо 0.

## Ако нямаш Pinata акаунт и искаш по-бърз вариант за demo

Можем временно да пуснем mint-а с **прости placeholder URI-та** (например директно JSON като data URI вместо IPFS), само за да докажем че контрактът работи технически — после ъпгрейдваме към истински IPFS, когато имаш повече клиенти. Кажи ми ако предпочиташ това вместо Pinata стъпките по-горе.
