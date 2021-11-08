import smartpy as sp

class Perpetual(sp.Contract):
    def __init__(self, **kargs):
        self.init(
            capturedCallbackValue = ("", (sp.timestamp(0), sp.nat(0))),
            oracleContract = sp.address('KT1MwuujtBodVQFm1Jk1KTGNc49wygqoLvpe'),
            priceMap = sp.map(tkey = sp.TString, tvalue = sp.TNat),
            contractStore = sp.map(tkey = sp.TString, tvalue = None),
            ledger =  sp.map(tkey = sp.TAddress, tvalue = None),
            
            n = 0,
            tradeBlotter = sp.map(tkey = sp.TInt, tvalue = None),
            X = 0,
            Y = 0,

            portfolio = sp.map(tkey=sp.TAddress, tvalue =sp.TMap(sp.TString, sp.TRecord(openPostions = sp.TInt,
                                                      avgPrice = sp.TInt,
                                                      marginAvailable = sp.TInt,
                                                      markPrice = sp.TInt,
                                                      valueAtCost = sp.TInt,
                                                      valueAtMarket = sp.TInt,
                                                      pnl =sp.TInt)))
            
        )

    @sp.entry_point
    def newContract(self, params):
        sp.set_type(params, sp.TRecord(ins_name = sp.TString,
                                    rate = sp.TInt,
                                    count = sp.TInt,
                                    leverage_factor =sp.TInt))
        
        insName = params.ins_name
        
        spotRate = params.rate

        leverageFactor = params.leverage_factor
        margin   = 10000 / params.leverage_factor #  10000 is used to accomodate 2 decimals
        contractDetails = sp.record(contractCount_X  = params.count * 1000,
                                    tezQuantity_Y    = params.count * params.rate * 1000,
                                    reserve_Z        = params.count * params.rate * params.count * 1000000 , # Z = X * Y
                                    leverageFactor   = params.leverage_factor,
                                    markPrice        = params.rate
                                    )

        self.data.contractStore[insName] =  contractDetails

    @sp.entry_point
    def clientDeposit(self):

        ledgerDetails = sp.record(balance = sp.to_int(sp.utils.mutez_to_nat(sp.amount) / 1000000),
                                    limitBlocked = 0,
                                    mtm = 0)

        sp.if self.data.ledger.contains(sp.sender) :
            self.data.ledger[sp.sender].balance = self.data.ledger[sp.sender].balance + sp.to_int(sp.utils.mutez_to_nat(sp.amount) / 1000000)
        sp.else:
            self.data.ledger[sp.sender] = ledgerDetails

    @sp.entry_point
    def trade(self, params):
        sp.set_type(params, sp.TRecord(ins_name = sp.TString,
                                    amount = sp.TInt,
                                    buySellId = sp.TInt,
                                    tradeType = sp.TString))

        lf = self.data.contractStore[params.ins_name].leverageFactor  

        portfolioKey = sp.record(trader = sp.sender, insName = params.ins_name)
        self.data.n = self.data.n + 1
        portfolioDetails=sp.map(tkey =sp.TString, tvalue= sp.TRecord(openPostions = sp.TInt,
                                                      avgPrice = sp.TInt,
                                                      marginAvailable = sp.TInt,
                                                      markPrice = sp.TInt,
                                                      valueAtCost = sp.TInt,
                                                      valueAtMarket = sp.TInt,
                                                      pnl =sp.TInt)),

        

        # CFMM

        sp.if params.tradeType == 'New' :

            sp.verify(params.amount < (self.data.ledger[sp.sender].balance) *  self.data.contractStore[params.ins_name].leverageFactor , message = 'Not enough balance') 

            self.data.ledger[sp.sender].limitBlocked =self.data.ledger[sp.sender].limitBlocked + sp.to_int(abs(params.amount) // abs(lf))
            self.data.ledger[sp.sender].balance = (self.data.ledger[sp.sender].balance - sp.to_int(abs(params.amount) // abs(lf)))
            
            #self.data.X = sp.int(0)
            self.data.X  = self.data.contractStore[params.ins_name].contractCount_X
            self.data.contractStore[params.ins_name].tezQuantity_Y  = self.data.contractStore[params.ins_name].tezQuantity_Y + (params.amount * 1000 * params.buySellId)
                 
            self.data.contractStore[params.ins_name].contractCount_X = sp.to_int(abs(self.data.contractStore[params.ins_name].reserve_Z) / abs(self.data.contractStore[params.ins_name].tezQuantity_Y))
            self.data.contractStore[params.ins_name].markPrice = sp.to_int(abs(self.data.contractStore[params.ins_name].tezQuantity_Y) / abs(self.data.contractStore[params.ins_name].contractCount_X))
            contractsTraded = (self.data.X  - self.data.contractStore[params.ins_name].contractCount_X)

            lastTradedAmount = params.amount
            lastTradedPrice = self.data.contractStore[params.ins_name].markPrice
            lastTradedQuantity = contractsTraded
            marginBlocked =   sp.to_int( abs(lastTradedAmount) / abs(self.data.contractStore[params.ins_name].leverageFactor))

            tradeDetails = sp.record( trader = sp.sender,
                                      tradedInstrument = params.ins_name,
                                      tradedAmount = lastTradedAmount,
                                      tradedPrice = lastTradedPrice,
                                      tradedQuantity = lastTradedQuantity,
                                      marginBlocked = marginBlocked,
                                      marginReleased = 0,
                                      timeOfTrade = sp.now)

            self.data.tradeBlotter[self.data.n] = tradeDetails
        
        sp.else:

            self.data.Y = self.data.contractStore[params.ins_name].tezQuantity_Y
            self.data.contractStore[params.ins_name].contractCount_X  = self.data.contractStore[params.ins_name].contractCount_X + ((params.amount)  * -1  * params.buySellId)     
            self.data.contractStore[params.ins_name].tezQuantity_Y = sp.to_int(abs(self.data.contractStore[params.ins_name].reserve_Z) / abs(self.data.contractStore[params.ins_name].contractCount_X))
            self.data.contractStore[params.ins_name].markPrice = sp.to_int(abs(self.data.contractStore[params.ins_name].tezQuantity_Y) / abs(self.data.contractStore[params.ins_name].contractCount_X))
            TzTraded = self.data.Y - self.data.contractStore[params.ins_name].tezQuantity_Y

            sp.if self.data.ledger[sp.sender].limitBlocked > sp.to_int(abs(TzTraded) /1000 / abs(lf)) :
                self.data.ledger[sp.sender].limitBlocked = self.data.ledger[sp.sender].limitBlocked - sp.to_int(abs(TzTraded) /1000 / abs(lf))
            sp.else:
                self.data.ledger[sp.sender].limitBlocked = 0
            self.data.ledger[sp.sender].balance = (self.data.ledger[sp.sender].balance + sp.to_int(abs(TzTraded) /1000 / abs(lf)))

            lastTradedAmount = sp.to_int (abs(TzTraded) / 1000)
            lastTradedPrice = self.data.contractStore[params.ins_name].markPrice
            lastTradedQuantity = params.amount
            marginBlocked =   sp.to_int( abs(lastTradedAmount) / abs(self.data.contractStore[params.ins_name].leverageFactor))

            tradeDetails = sp.record( trader = sp.sender,
                                      tradedInstrument = params.ins_name,
                                      tradedAmount = lastTradedAmount,
                                      tradedPrice = lastTradedPrice,
                                      tradedQuantity = lastTradedQuantity,
                                      marginBlocked = 0,
                                      marginReleased = marginBlocked,
                                      timeOfTrade = sp.now )

            self.data.tradeBlotter[self.data.n] = tradeDetails

        sp.if self.data.portfolio.contains(sp.sender):
            pass
        sp.else:
            self.data.portfolio[sp.sender] = {}
        
        sp.if self.data.portfolio[sp.sender].contains(params.ins_name):
 
            netPositions = self.data.portfolio[sp.sender][params.ins_name].openPostions + (self.data.tradeBlotter[self.data.n].tradedQuantity * params.buySellId)
            self.data.portfolio[sp.sender][params.ins_name].openPostions = self.data.portfolio[sp.sender][params.ins_name].openPostions + self.data.tradeBlotter[self.data.n].tradedQuantity * params.buySellId            
            self.data.portfolio[sp.sender][params.ins_name].avgPrice = sp.to_int(abs(self.data.Y) / abs(self.data.X))
            self.data.portfolio[sp.sender][params.ins_name].marginAvailable = self.data.tradeBlotter[self.data.n].marginReleased - self.data.tradeBlotter[self.data.n].marginBlocked
            self.updatePortfolio(params.ins_name)

        sp.else:

            portfolioDetails =sp.TRecord(openPostions = sp.TInt,
                                                      avgPrice = sp.TInt,
                                                      marginAvailable = sp.TInt,
                                                      markPrice = sp.TInt,
                                                      valueAtCost = sp.TInt,
                                                      valueAtMarket = sp.TInt,
                                                      pnl =sp.TInt)
            portfolioDetails =sp.record(openPostions = 0,
                                                      avgPrice = 0,
                                                      marginAvailable =0,
                                                      markPrice = 0,
                                                      valueAtCost =0,
                                                      valueAtMarket = 0,
                                                      pnl =0)
            self.data.portfolio[sp.sender][params.ins_name] = portfolioDetails
            self.data.portfolio[sp.sender][params.ins_name].openPostions = self.data.tradeBlotter[self.data.n].tradedQuantity
            self.data.portfolio[sp.sender][params.ins_name].avgPrice = self.data.tradeBlotter[self.data.n].tradedPrice
            self.data.portfolio[sp.sender][params.ins_name].marginAvailable = self.data.tradeBlotter[self.data.n].marginReleased - self.data.tradeBlotter[self.data.n].marginBlocked
            self.updatePortfolio(params.ins_name)

        
    @sp.entry_point
    def updatePortfolio(self, ins_name):

        self.data.portfolio[sp.sender][ins_name].markPrice = self.data.contractStore[ins_name].markPrice
        self.data.portfolio[sp.sender][ins_name].valueAtCost = self.data.portfolio[sp.sender][ins_name].avgPrice * self.data.portfolio[sp.sender][ins_name].openPostions
        self.data.portfolio[sp.sender][ins_name].valueAtMarket = self.data.portfolio[sp.sender][ins_name].markPrice * self.data.portfolio[sp.sender][ins_name].openPostions
        self.data.portfolio[sp.sender][ins_name].pnl = self.data.portfolio[sp.sender][ins_name].valueAtCost - self.data.portfolio[sp.sender][ins_name].valueAtMarket
                                                      


    @sp.entry_point
    def marketdata(self, params):
        ac = params.assetcode
        #assetCode = "XTZ-USD"
        contractHandle = sp.contract(sp.TPair(sp.TString, sp.TPair(sp.TTimestamp, sp.TNat)), sp.self_address, entry_point = "callback").open_some()
        param = (ac, contractHandle)
       
        datatype= sp.TPair(sp.TString, sp.TContract(sp.TPair(sp.TString, sp.TPair(sp.TTimestamp, sp.TNat))))

        tContract  = sp.contract(datatype, self.data.oracleContract, "get").open_some()
        sp.transfer(param, sp.mutez(0), tContract) 

    @sp.entry_point
    def callback(self, params):
        self.data.capturedCallbackValue = params
        requestedAsset = sp.compute(sp.fst(params))
        pricedata = sp.compute(sp.snd(params))
        price =  sp.compute(sp.snd(pricedata))
        self.data.priceMap[requestedAsset] = price


@sp.add_test(name="Fetch Data")
def test():
    scenario=sp.test_scenario()
    client = Perpetual()
    scenario += client
    scenario += client.marketdata(assetcode = 'XTZ-USD')
    scenario += client.newContract(ins_name = 'Tezzard Floor Price',
                                    rate = 700,
                                    count = 100,
                                    leverage_factor = 10)

    admin   = sp.address("tz1gRxoWf9uLmGrqpv3Knkdhr64QcUu8C9zs")
    alice   = sp.test_account("Alice")
    bob     = sp.test_account("Robert")
    clark   = sp.test_account("Clark")
    daisy   = sp.test_account("Daisy")

    scenario += client.clientDeposit().run(sender = alice.address, amount = sp.tez(1000))
    scenario += client.clientDeposit().run(sender = alice.address, amount = sp.tez(1000))
    scenario += client.trade(ins_name = 'Tezzard Floor Price',
                                    amount = 1000,
                                    buySellId = 1,
                                    tradeType = 'New').run(sender = alice.address)
    
    scenario += client.clientDeposit().run(sender = bob.address, amount = sp.tez(1000))
    scenario += client.trade(ins_name = 'Tezzard Floor Price',
                                    amount = 1000,
                                    buySellId = 1,
                                    tradeType = 'New').run(sender = bob.address)
    scenario += client.trade(ins_name = 'Tezzard Floor Price',
                                    amount = 1409,
                                    buySellId = -1,
                                    tradeType = 'SQR').run(sender = alice.address)
    
    scenario += client.trade(ins_name = 'Tezzard Floor Price',
                                    amount = 1389,
                                    buySellId = -1,
                                    tradeType = 'SQR').run(sender = bob.address)

    scenario += client.trade(ins_name = 'Tezzard Floor Price',
                                    amount = 1000,
                                     buySellId = -1,
                                    tradeType = 'New').run(sender = alice.address)