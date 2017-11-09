// Config
var config = require("../truffle.js");

// Contacts
var rocketHub = artifacts.require("./RocketHub.sol");
var rocketStorage = artifacts.require("./RocketStorage.sol");
var rocketPool = artifacts.require("./RocketPool.sol");
var rocketNode = artifacts.require("./RocketNode.sol");
var rocketPoolMiniDelegate = artifacts.require("./RocketPoolMiniDelegate.sol");
var rocketDepositToken = artifacts.require("./RocketDepositToken.sol");
var rocketPartnerAPI = artifacts.require("./RocketPartnerAPI.sol");
var rocketSettings = artifacts.require("./RocketSettings.sol");
var rocketFactory = artifacts.require("./RocketFactory.sol");
var dummyCasper = artifacts.require("./contract/casper/DummyCasper.sol");

// Interfaces
var rocketStorageInterface = artifacts.require("./contracts/interface/RocketStorageInterface.sol");
var rocketSettingsInterface = artifacts.require("./contracts/interface/RocketSettingsInterface.sol");

// Libs
var arithmeticLib = artifacts.require("./lib/Arithmetic.sol");

// Accounts
var accounts = web3.eth.accounts;

// TODO: Optimise this using the simpler deploy option
module.exports = function (deployer, network) {
    // Deploy libraries
    deployer.deploy(arithmeticLib, rocketSettingsInterface, rocketStorageInterface).then(function () {
        // Lib Links
        deployer.link(arithmeticLib, [rocketPool, rocketPoolMiniDelegate, rocketDepositToken]);
        // Deploy rockethub first - has to be done in this order so that the following contracts already know the hub address
        return deployer.deploy(rocketStorage).then(function () {
            // Deploy rockethub first - has to be done in this order so that the following contracts already know the hub address
            return deployer.deploy(rocketHub).then(function () {
                // Deploy casper dummy contract
                return deployer.deploy(dummyCasper).then(function () {
                    // Seed Casper with some funds to cover the rewards + deposit sent back
                    web3.eth.sendTransaction({ from: accounts[0], to: dummyCasper.address, value: web3.toWei('6', 'ether'), gas: 1000000 });
                    // Deploy rocket 3rd party partner API
                    return deployer.deploy(rocketPartnerAPI, rocketStorage.address).then(function () {
                        // Deploy rocket deposit token
                        return deployer.deploy(rocketDepositToken, rocketHub.address).then(function () {
                            // Deploy rocket factory
                            return deployer.deploy(rocketFactory, rocketHub.address).then(function () {
                                // Deploy rocket settings
                                return deployer.deploy(rocketSettings, rocketStorage.address).then(function () {
                                    // Deploy the main rocket pool
                                    return deployer.deploy(rocketPool, rocketStorage.address).then(function () {
                                        // Deploy the rocket node
                                        return deployer.deploy(rocketNode, rocketStorage.address).then(function () {
                                            // Deploy the rocket pool mini delegate
                                            return deployer.deploy(rocketPoolMiniDelegate, rocketHub.address).then(function () {
                                                // Update the hub with the new addresses
                                                return rocketHub.deployed().then(function (rocketHubInstance) {
                                                     // Update the storage with the new addresses
                                                     return rocketStorage.deployed().then(function (rocketStorageInstance) {
                                                            console.log("\n");
                                                            // Add each contract to the main address book
                                                            rocketHubInstance.setAddress(web3.sha3("rocketPool"), rocketPool.address);
                                                            console.log('\x1b[33m%s\x1b[0m:', 'Updated Hub RocketPool Address');
                                                            console.log(rocketPool.address);
                                                            // Set rocket pool mini delegate
                                                            rocketHubInstance.setAddress(web3.sha3("rocketPoolMiniDelegate"), rocketPoolMiniDelegate.address);
                                                            console.log('\x1b[33m%s\x1b[0m:', 'Updated Hub RocketPoolMiniDelegate Address');
                                                            console.log(rocketPoolMiniDelegate.address);
                                                            // Set rocket pool deposit token contract
                                                            rocketHubInstance.setAddress(web3.sha3("rocketDepositToken"), rocketDepositToken.address);
                                                            console.log('\x1b[33m%s\x1b[0m:', 'Updated Hub RocketDepositToken Address');
                                                            console.log(rocketDepositToken.address);

                                                            // Set rocket factory
                                                            rocketHubInstance.setAddress(web3.sha3("rocketFactory"), rocketFactory.address);
                                                            console.log('\x1b[33m%s\x1b[0m:', 'Updated Hub RocketFactory Address');
                                                            console.log(rocketFactory.address);
                                                            
                                                            // Set rocket settings
                                                            rocketHubInstance.setAddress(web3.sha3("rocketSettings"), rocketSettings.address);
                                                            console.log('\x1b[33m%s\x1b[0m:', 'Updated Hub RocketSettings Address');
                                                            console.log(rocketSettings.address);
                                                            // Set casper address
                                                            rocketHubInstance.setAddress(web3.sha3("dummyCasper"), dummyCasper.address);
                                                            console.log('\x1b[33m%s\x1b[0m:', 'Updated Dummy Casper Address');
                                                            console.log(dummyCasper.address);

                                                            /*** NEW */

                                                            // Rocket Pool
                                                            // First register the contract address as being part of the network so we can do a validation check using just the address
                                                            rocketStorageInstance.setAddress(config.web3Utils.soliditySha3("contract.address", rocketPool.address), rocketPool.address);
                                                            // Now register again that contracts name so we can retrieve it by name if needed
                                                            rocketStorageInstance.setAddress(config.web3Utils.soliditySha3("contract.name", "rocketPool"), rocketPool.address);
                                                            // Log it
                                                            console.log('\x1b[33m%s\x1b[0m:', 'Set Storage RocketPool Address');
                                                            console.log(rocketPool.address);  

                                                            // Rocket Node
                                                            rocketStorageInstance.setAddress(config.web3Utils.soliditySha3("contract.address", rocketNode.address), rocketNode.address);
                                                            rocketStorageInstance.setAddress(config.web3Utils.soliditySha3("contract.name", "rocketNode"), rocketNode.address);
                                                            // Log it
                                                            console.log('\x1b[33m%s\x1b[0m:', 'Set Storage RocketNode Address');
                                                            console.log(rocketNode.address);  

                                                            // Rocket Settings
                                                            rocketStorageInstance.setAddress(config.web3Utils.soliditySha3("contract.address", rocketSettings.address), rocketSettings.address);
                                                            rocketStorageInstance.setAddress(config.web3Utils.soliditySha3("contract.name", "rocketSettings"), rocketSettings.address);
                                                            // Log it
                                                            console.log('\x1b[33m%s\x1b[0m:', 'Set Storage RocketSettings Address');
                                                            console.log(rocketSettings.address);  

                                                            // Rocket Factory
                                                            rocketStorageInstance.setAddress(config.web3Utils.soliditySha3("contract.address", rocketFactory.address), rocketFactory.address);
                                                            rocketStorageInstance.setAddress(config.web3Utils.soliditySha3("contract.name", "rocketFactory"), rocketFactory.address);
                                                            // Log it
                                                            console.log('\x1b[33m%s\x1b[0m:', 'Set Storage RocketFactory Address');
                                                            console.log(rocketFactory.address);

                                                            // Rocket Partner API
                                                            rocketStorageInstance.setAddress(config.web3Utils.soliditySha3("contract.address", rocketPartnerAPI.address), rocketPartnerAPI.address);
                                                            rocketStorageInstance.setAddress(config.web3Utils.soliditySha3("contract.name", "rocketPartnerAPI"), rocketPartnerAPI.address);
                                                            // Log it
                                                            console.log('\x1b[33m%s\x1b[0m:', 'Set Storage RocketPartnerAPI Address');
                                                            console.log(rocketPartnerAPI.address);
                                  
                                                            // Return
                                                            return deployer;
                                                       
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};
