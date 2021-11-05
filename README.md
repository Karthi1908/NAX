# NAX - Neo Assets Exchange

Neo Assets Exchange is decentralised exchange for trading the perpetual contracts on crypto and NFT assets and it is run on Tezos.
NAX is experimental exchange for trading new assets such as perps on NFTs, Metaverse tokens and other crypto assets with Tezos as transaction/settlement currency.
The main aim of the exchange is provide exposure to all assets to the Tezos Hodlers without having to convert to other crypto or trade in new exchange.

### Perpetual contracts (PERPs)

Perpetual contracts are leveraged derivative products enable user to take exposure ( buy or sell) in an asset without actually holding the asset.
Since leverage is allowed in trading perps, users can hold more assets by depositing only the margin amount. 
For conventional futures contracts such as WTI, the contract’s price will gradually converge with the underlying asset’s spot market price as the expiry date approaches. For a perpetual contract, to converge its price with the spot market, the most effective method used in the industry is “funding rate”


## NAX introduction

NAX by design does not require any external Liquidity or liquidity providers as it uses CFMM for price discovery. 
Trading happens completely on-chain in a decentralised manner. 
Currently contracts are quoted in tezos to reduce tranaction fee but plan is there to introduce the stablecoins issued on tezos

#### Leverage
Leverage is dependent on individual contracts . Standard process is to set leverage to

1. max of 10x for crypto assets with top 10 market cap. 
2. max of 5x for crypto assets in top 20 market cap and tezos
3. max of 3x for NFT issued in Tezos and high liquid NFTs issued in Ethereum
4. max of 2x for all other assets


#### Margin

There are 2 types of Margin.
 1. Initial Margin: 
 
 This is amount required to open a position. Initial margin is calculated 100/leverage ratio.
 So 10x leverage trade would require 10% of trade amount to be posted as margin and similarly 5x leverage trade would require 20% of trade amount as initial margin.
 
 2. Maintainence Margin:

This is the amount to be held in account as margin for duration of the trade. If the margin amount falls below the maintainence margin, liquidation happens.




NAX smart contract actually consists of three main components:

1. Vault
2. Ledger
3. Market Maker

### Vault




![NAX ](https://user-images.githubusercontent.com/33004854/140522034-a97552c9-a425-4025-9886-32736148f6fc.png)

NAX Prepetual(nPreps) uses modified Constant Function Market Maker (mCFMM) as a price discovery mechanism. https://medium.com/bollinger-investment-group/constant-function-market-makers-defis-zero-to-one-innovation-968f77022159

nPreps use the constant product function  X * Y = K ( same as Uniswap). However for nPerps, there will be no swap of assets.


							
							

							
![image](https://user-images.githubusercontent.com/33004854/140507647-1de190cb-39b0-4c38-8b5c-a89133f88946.png)




							

							
![image](https://user-images.githubusercontent.com/33004854/140507692-cf231079-2d53-4718-b68c-4a643b6aad55.png)



							
							

							
![image](https://user-images.githubusercontent.com/33004854/140507754-9d912fe7-4d6d-4cd7-9bab-ff64e4d39bc7.png)



							

							
![image](https://user-images.githubusercontent.com/33004854/140507974-e1537d77-88cd-44e3-8a19-f697edcedbb1.png)



							

							
![image](https://user-images.githubusercontent.com/33004854/140508016-0e4e5919-44b7-45c3-9633-fa064483d888.png)


















