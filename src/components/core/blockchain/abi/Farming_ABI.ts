import { Address } from 'viem';
export const farmingMetadata = {
    address: '0x7231ECd1355a60251eE56Bf81f987969fc9bAe29' as Address,
    abi: [
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_poolGeneral",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "_poolQuest",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "_poolReward",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_axePrice",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "_sellerPrice",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "_nodeWallet",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "_vrfConsumerAddress",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "_nectarAddress",
                    "type": "address"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "buyer",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "price",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "colonyId",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "uuid",
                    "type": "string"
                }
            ],
            "name": "AxePurchased",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "colonyId",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "uuid",
                    "type": "string"
                }
            ],
            "name": "buyAxe",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "colonyId",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "packId",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "uuid",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "packPrice",
                    "type": "uint256"
                }
            ],
            "name": "buyHPPack",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "boxId",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "uuid",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "boxPrice",
                    "type": "uint256"
                }
            ],
            "name": "buyMaterialBox",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "colonyId",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "expeRewardId",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "uuid",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "ticketPrice",
                    "type": "uint256"
                }
            ],
            "name": "buyPowerTicket",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "roomId",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "colonyId",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "lvlToUpgrade",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "uuid",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "upgradePrice",
                    "type": "uint256"
                }
            ],
            "name": "buyUpgradeRoom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "colonyId",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "questId",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "questType",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "npcId",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "uuid",
                    "type": "string"
                },
                {
                    "internalType": "bool",
                    "name": "needRandomWords",
                    "type": "bool"
                },
                {
                    "internalType": "uint32",
                    "name": "nWords",
                    "type": "uint32"
                }
            ],
            "name": "completeFreeQuest",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "colonyId",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "questId",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "questType",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "npcId",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "uuid",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "nectarAmountCost",
                    "type": "uint256"
                }
            ],
            "name": "completeQuestForNectar",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "FundsWithdrawn",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "colonyId",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "sellerId",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "uuid",
                    "type": "string"
                }
            ],
            "name": "genPendingPremiumSellerCall",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "buyer",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "price",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "colonyId",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "packId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "uuid",
                    "type": "string"
                }
            ],
            "name": "HPPackPurchased",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "buyer",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amountPaid",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "colonyId",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "roomId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "lvlToUpgrade",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "uuid",
                    "type": "string"
                }
            ],
            "name": "LvlRoomPurchased",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "buyer",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amountPaid",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "boxId",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "uuid",
                    "type": "string"
                }
            ],
            "name": "MaterialBoxPurchased",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "buyer",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "colonyId",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "sellerId",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "uuid",
                    "type": "string"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "requestId",
                    "type": "uint256"
                }
            ],
            "name": "NewPendingPremiumSellerCall",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "previousOwner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "OwnershipTransferred",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "buyer",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "paidAmount",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "colonyId",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "uuid",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "expeRewardId",
                    "type": "string"
                }
            ],
            "name": "PowerTicketPurchased",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "ogRequester",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "chainLinkReqId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "chainLinkRandomValue",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "genPremiumDiscountValue",
                    "type": "uint256"
                }
            ],
            "name": "PremiumDiscountGenerated",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "chainLinkReqId",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "ogRequester",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "chainLinkRandomValue",
                    "type": "uint256"
                },
                {
                    "components": [
                        {
                            "components": [
                                {
                                    "internalType": "uint256",
                                    "name": "value",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "percentage",
                                    "type": "uint256"
                                }
                            ],
                            "internalType": "struct Farming.SellerDiscountPercentage[]",
                            "name": "discounts",
                            "type": "tuple[]"
                        }
                    ],
                    "internalType": "struct Farming.SellerDiscountPercentages",
                    "name": "discountPercents",
                    "type": "tuple"
                }
            ],
            "name": "processRandomnessAndGenPremiumDiscount",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "questType",
                    "type": "string"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "buyer",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "colonyId",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "questId",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amountPaid",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "npcId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "requestId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "uuid",
                    "type": "string"
                }
            ],
            "name": "QuestCompleted",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "renounceOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "transferOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "newPrice",
                    "type": "uint256"
                }
            ],
            "name": "updateAxePrice",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "newPrice",
                    "type": "uint256"
                }
            ],
            "name": "updatePremiumSellerPrice",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "powerTicketId",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "colonyId",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "antId",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "fromQuest",
                    "type": "bool"
                },
                {
                    "internalType": "string",
                    "name": "uuid",
                    "type": "string"
                }
            ],
            "name": "usePowerTicket",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "buyer",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "powerTicketId",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "colonyId",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "antId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "fromQuest",
                    "type": "bool"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "uuid",
                    "type": "string"
                }
            ],
            "name": "UsePowerTicketRequest",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "allowedContracts",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "axePrice",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "nectarToken",
            "outputs": [
                {
                    "internalType": "contract IERC20",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "nodeWallet",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "poolGeneral",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "poolQuest",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "poolReward",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "sellerPrice",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "vrfConsumerAddress",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ] as const
} 