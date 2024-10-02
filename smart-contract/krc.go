package main

import (
	"encoding/json"
	"fmt"

	"github.com/p2eengineering/kalp-sdk-public/kalpsdk"
)

// SmartContract provides the contract structure
type SmartContract struct {
	kalpsdk.Contract
}

// Candidate structure holds candidate data
type Candidate struct {
	Name  string `json:"name"`
	Votes int    `json:"votes"`
}

// Initialise initializes the candidates only once through the backend
func (s *SmartContract) Initialise(sdk kalpsdk.TransactionContextInterface, candidateNames []string) error {

	// Check if already initialized
	initialized, err := checkInitialized(sdk)
	if err != nil {
		return fmt.Errorf("failed to check if contract is already initialized: %v", err)
	}
	if initialized {
		return fmt.Errorf("contract is already initialized")
	}

	// Create a list of candidates and initialize their vote count to 0
	for _, name := range candidateNames {
		candidate := Candidate{Name: name, Votes: 0}
		candidateBytes, err := json.Marshal(candidate)
		if err != nil {
			return fmt.Errorf("failed to marshal candidate: %v", err)
		}
		// Store candidate in world state
		err = sdk.PutStateWithoutKYC(name, candidateBytes)
		if err != nil {
			return fmt.Errorf("failed to store candidate: %v", err)
		}
	}

	// Mark the contract as initialized
	err = sdk.PutStateWithoutKYC("initialized", []byte("true"))
	if err != nil {
		return fmt.Errorf("failed to mark contract as initialized: %v", err)
	}

	return nil
}

// GetCandidate retrieves the vote count for a specific candidate
func (s *SmartContract) GetCandidate(sdk kalpsdk.TransactionContextInterface, name string) (Candidate, error) {

	// Retrieve the candidate from world state
	candidateBytes, err := sdk.GetState(name)
	if err != nil {
		return Candidate{}, fmt.Errorf("failed to get candidate from world state: %v", err)
	}
	if candidateBytes == nil {
		return Candidate{}, fmt.Errorf("candidate %s does not exist", name)
	}

	// Unmarshal candidate data
	var candidate Candidate
	err = json.Unmarshal(candidateBytes, &candidate)
	if err != nil {
		return Candidate{}, fmt.Errorf("failed to unmarshal candidate: %v", err)
	}

	return candidate, nil
}

// MintVote adds 1 vote to the specified candidate
func (s *SmartContract) MintVote(sdk kalpsdk.TransactionContextInterface, name string) error {

	// Retrieve the candidate from world state
	candidateBytes, err := sdk.GetState(name)
	if err != nil {
		return fmt.Errorf("failed to get candidate from world state: %v", err)
	}
	if candidateBytes == nil {
		return fmt.Errorf("candidate %s does not exist", name)
	}

	// Unmarshal candidate data
	var candidate Candidate
	err = json.Unmarshal(candidateBytes, &candidate)
	if err != nil {
		return fmt.Errorf("failed to unmarshal candidate: %v", err)
	}

	// Increment vote count
	candidate.Votes++

	// Marshal updated candidate data
	updatedCandidateBytes, err := json.Marshal(candidate)
	if err != nil {
		return fmt.Errorf("failed to marshal updated candidate: %v", err)
	}

	// Update the candidate in world state
	err = sdk.PutStateWithoutKYC(name, updatedCandidateBytes)
	if err != nil {
		return fmt.Errorf("failed to update candidate votes in world state: %v", err)
	}

	return nil
}

// Helper function to check if the contract has been initialized
func checkInitialized(sdk kalpsdk.TransactionContextInterface) (bool, error) {
	initializedBytes, err := sdk.GetState("initialized")
	if err != nil {
		return false, fmt.Errorf("failed to read initialization status: %v", err)
	}
	return initializedBytes != nil, nil
}
