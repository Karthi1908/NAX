# NAX - Neo Assets Exchange

smart contract : <a href="https://smartpy.io/explorer.html?address=KT1MpgKoT5L32ngsPJgjE9fptVgBE9XAUc6X">KT1MpgKoT5L32ngsPJgjE9fptVgBE9XAUc6X</a>

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
4. It also performs the "Funding" operations to align the Mark price and market price

Ledger receives the Market prices from the oracle and it can use either mark price or market price for the MTM and Margin calculation. Mark price is provide by mCFMM


### mCFMM


NAX Prepetual(nPreps) uses modified Constant Function Market Maker (mCFMM) as a price discovery mechanism. Additional info on Constant Function Market Maker can be found <a href ="https://medium.com/bollinger-investment-group/constant-function-market-makers-defis-zero-to-one-innovation-968f77022159" target="_blank">here</a>

nPreps use the constant product function  X * Y = K ( same as Uniswap). However for nPerps, there will be no swap of assets.

Below is the example on how the mCFMM functions.

Let us assume a Floor price of Beeple NFT is a 700Tez and  100 nPrep are  introduced for trading.

 X = number of contracts = 100 
 Y = equivalent  amount of tez = 700 * 100 = 70,000
 Z = 100 * 70,000 = 7,000,000  Mark price for the contract = Y / X
					
							

							
![image](https://user-images.githubusercontent.com/33004854/140507647-1de190cb-39b0-4c38-8b5c-a89133f88946.png)


Alice sends a buy order for 1000 tez.

Y adds 1000 tez => 71,000 so X becomes 98.5915 to maintain  Z at a constant 7,000,000
This results in Alice buying 1.4085 ( 100 - 98.5915) contracts for 1000 tez and the Mark Price moves to 720
							
![image](https://user-images.githubusercontent.com/33004854/140507692-cf231079-2d53-4718-b68c-4a643b6aad55.png)
							
Another user Bob sends a buy order for 1000 tez.	

Y adds 1000 tez => 72,000 so X becomes 97.22222 to maintain  Z at a constant 7,000,000
This results in Bob buying 1.3693 contracts for 1000 tez and the Mark Price moves to 740

							
![image](https://user-images.githubusercontent.com/33004854/140507754-9d912fe7-4d6d-4cd7-9bab-ff64e4d39bc7.png)


Now Alice decides to close her long position of 1.4085 contracts and sends the order to NAX
This results in following changes in CFMM
X adds 1.4085 to become 98.6307 so Y becomes 70972 to maintain  Z at a constant 7,000,000
Alice receives 1028 tez (change in Y => 72000 - 70972) and the Mark Price moves to 720.
ALice made a profit of 28 tez

							
![image](https://user-images.githubusercontent.com/33004854/140507974-e1537d77-88cd-44e3-8a19-f697edcedbb1.png)


Bob follows the suit to close his long position of 1.3693 contracts and sends the order to NAX
This results in following changes in CFMM
X adds 1.3693  to become 100 so Y becomes 7000 to maintain  Z at a constant 7,000,000
Bob receives 972 tez (change in Y => 70972 - 70000) and the Mark Price moves to 700.
Bob made a loss of 28 tez.							

							
![image](https://user-images.githubusercontent.com/33004854/140508016-0e4e5919-44b7-45c3-9633-fa064483d888.png)



As we can see from example, Alice's profit was compensated by Bob 's loss which for exhange to run , there is no need for additional liquidity or liquidity providers.
Traders themselves compensate each other.The Mark price is determined by the algorithm. 














