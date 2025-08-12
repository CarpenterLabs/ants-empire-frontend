import { Address } from 'viem';
export const PackToBuyMetadata = {
    address: '0xCeeFD27e0542aFA926B87d23936c79c276A48277' as Address,
    abi: [
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_contract",
                    "type": "address"
                }
            ],
            "name": "addAllowedContract",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_id",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "_price",
                    "type": "uint256"
                }
            ],
            "name": "addWelcomePack",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "player",
                    "type": "address"
                },
                {
                    "internalType": "uint256[]",
                    "name": "tokenIds",
                    "type": "uint256[]"
                }
            ],
            "name": "batchNftTransferToAddress",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "player",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "colonyId",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "packToBuyId",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "packFamily",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "uuid",
                    "type": "string"
                },
                {
                    "internalType": "uint32",
                    "name": "count",
                    "type": "uint32"
                },
                {
                    "internalType": "uint256",
                    "name": "packPrice",
                    "type": "uint256"
                }
            ],
            "name": "buyPack",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "welcomePackId",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "packFamily",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "colonyId",
                    "type": "string"
                },
                {
                    "internalType": "uint32",
                    "name": "count",
                    "type": "uint32"
                },
                {
                    "internalType": "uint256",
                    "name": "packPrice",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "uuid",
                    "type": "string"
                }
            ],
            "name": "buyWelcomePack",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_id",
                    "type": "string"
                }
            ],
            "name": "deleteWelcomePack",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "ogBuyer",
                    "type": "address"
                },
                {
                    "internalType": "string[]",
                    "name": "tokenUris",
                    "type": "string[]"
                },
                {
                    "internalType": "bool",
                    "name": "toContract",
                    "type": "bool"
                }
            ],
            "name": "mintBatchAnts",
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
                    "internalType": "address",
                    "name": "_antNFTSCAddress",
                    "type": "address"
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
                    "name": "_poolSC",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "_nectarAddress",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "_usdt",
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
                    "name": "playerAddress",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "welcomePackId",
                    "type": "string"
                }
            ],
            "name": "PackBurned",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "playerAddress",
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
                    "internalType": "uint256",
                    "name": "amountPaid",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "packToBuyId",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "packFamily",
                    "type": "string"
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
            "name": "PackToBuyPurchaseRequest",
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
                    "name": "playerAddress",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "welcomePackId",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "family",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "uuid",
                    "type": "string"
                }
            ],
            "name": "requestResolveWelcomePack",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "playerAddress",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "welcomePackId",
                    "type": "string"
                }
            ],
            "name": "setBurned",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_id",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "_newPrice",
                    "type": "uint256"
                }
            ],
            "name": "updateWelcomePack",
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
                    "name": "playerAddress",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "welcomePackId",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "packFamily",
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
                    "name": "pricePaid",
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
            "name": "WelcomePackPurchased",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "playerAddress",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "welcomePackId",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "family",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "uuid",
                    "type": "string"
                }
            ],
            "name": "WelcomePackResolveRequest",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "playerAddress",
                    "type": "address"
                }
            ],
            "name": "WelcomePackResolved",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "withdraw",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
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
            "name": "antNFTSCAddress",
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
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "discountTiers",
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
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "purchaseCount",
                    "type": "uint256"
                }
            ],
            "name": "getDiscountByPurchaseCount",
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
            "inputs": [
                {
                    "internalType": "address",
                    "name": "playerAddress",
                    "type": "address"
                }
            ],
            "name": "getPlayerPurchaseCount",
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
            "inputs": [
                {
                    "internalType": "address",
                    "name": "playerAddress",
                    "type": "address"
                }
            ],
            "name": "getPlayerPurchaseHistory",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "string",
                            "name": "welcomePackId",
                            "type": "string"
                        },
                        {
                            "internalType": "bool",
                            "name": "burned",
                            "type": "bool"
                        },
                        {
                            "internalType": "uint256",
                            "name": "pricePaid",
                            "type": "uint256"
                        }
                    ],
                    "internalType": "struct PackToBuy.PurchaseDetail[]",
                    "name": "purchases",
                    "type": "tuple[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_id",
                    "type": "string"
                }
            ],
            "name": "getWelcomePack",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "string",
                            "name": "welcomePackId",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "price",
                            "type": "uint256"
                        }
                    ],
                    "internalType": "struct PackToBuy.WelcomePackEntry",
                    "name": "",
                    "type": "tuple"
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
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "playerPurchaseCount",
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
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "playerPurchaseDetails",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "welcomePackId",
                    "type": "string"
                },
                {
                    "internalType": "bool",
                    "name": "burned",
                    "type": "bool"
                },
                {
                    "internalType": "uint256",
                    "name": "pricePaid",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "usdt",
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
            "inputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "name": "welcomePackDatabase",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "welcomePackId",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "price",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ] as const
} 