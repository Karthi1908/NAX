# NAX - Neo Assets Exchange

Neo Assets Exchange (NAX) is a decentralised exchange for trading perpetual contracts on crypto and NFT assets.
NAX is an experimental exchange for trading perps on new/exotic assets with Tezos as transaction/settlement currency.
Due to its novel mCFMM price discovery mechanism, it doesn't require any liquidity pools or external liquidity.
The main aim of the exchange is to provide exposure to exotic assets to the Tezos Hodlers without having to convert to other cryptocurrencies or trade-in new exchange.

### Why Perpetual contracts (PERPs)?

With explosion of NFT market, it has become very hard to buy the NFTs during the drops. As most of the high value NFTs ( ex Beeple) are minted on Ethereum and its side chains, it has become very hard for the traders to trade as transaction fees eat much of their profits. So NAX decided to introduce the Perpetual contracts on Tezos for traders to get maximum advantage of their trading.
Perpetual contracts are leveraged derivative products that enable users to take exposure ( buy or sell) in an asset without actually holding the asset.
Perps are leverage product and its price is expected to correlate closely with the spot price. So traders can take more postions than on the spot market for given amount of money. 



## Components

NAX smart contract actually consists of three main components:

1. Vault
2. Ledger
3. Market Maker


![NAX ](https://user-images.githubusercontent.com/33004854/140522034-a97552c9-a425-4025-9886-32736148f6fc.png)

### Vault

Vault stores all the tezos of all users deposits in the single place. Vault will act as a multi-sig contract for high value transactions.
Vault will play more important role once the staking and stable coins are introduced.

### Ledger

Ledger smartcontract deals with following 

1. Record all the trade related transctions
2. Calculate the MTM positions and re-calcaulate the balances of each account
3. If any account doesnt meet the maintainence margin, it will perform the liquidation
4. It also performs the funding operations to align the Mark price and market price

Ledger receives the Market prices from the oracle and it can use either mark price or market price for the MTM and Margin calculation. 


### mCFMM


NAX Prepetual(nPreps) uses modified Constant Function Market Maker (mCFMM) as a price discovery mechanism. Additional info on Constant Function Market Maker can be found ![here](https://medium.com/bollinger-investment-group/constant-function-market-makers-defis-zero-to-one-innovation-968f77022159)

nPreps use the constant product function  X * Y = K ( same as Uniswap). However for nPerps, there will be no swap of assets.


							
							

							
![image](https://user-images.githubusercontent.com/33004854/140507647-1de190cb-39b0-4c38-8b5c-a89133f88946.png)




							

							
![image](https://user-images.githubusercontent.com/33004854/140507692-cf231079-2d53-4718-b68c-4a643b6aad55.png)



							
							

							
![image](https://user-images.githubusercontent.com/33004854/140507754-9d912fe7-4d6d-4cd7-9bab-ff64e4d39bc7.png)



							

							
![image](https://user-images.githubusercontent.com/33004854/140507974-e1537d77-88cd-44e3-8a19-f697edcedbb1.png)



							

							
![image](https://user-images.githubusercontent.com/33004854/140508016-0e4e5919-44b7-45c3-9633-fa064483d888.png)


















