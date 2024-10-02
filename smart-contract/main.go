package main

import (
	"log"

	"github.com/p2eengineering/kalp-sdk-public/kalpsdk"
)

func main() {
	contract := kalpsdk.Contract{IsPayableContract: false}
	contract.Logger = kalpsdk.NewLogger()

	// Create a new instance of your SmartContract
	smartContract := &SmartContract{contract}

	// Create a new instance of KalpContractChaincode with your smart contract
	chaincode, err := kalpsdk.NewChaincode(smartContract)
	if err != nil {
		log.Panicf("Error creating KalpContractChaincode: %v", err)
	}

	contract.Logger.Info("Initializing Kalp DLT Greeting Smart Contract")

	// Start the chaincode
	if err := chaincode.Start(); err != nil {
		log.Panicf("Error starting chaincode: %v", err)
	}
}
