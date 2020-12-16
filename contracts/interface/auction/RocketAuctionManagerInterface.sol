pragma solidity 0.6.12;

// SPDX-License-Identifier: GPL-3.0-only

interface RocketAuctionManagerInterface {
    function getTotalRPLBalance() external view returns (uint256);
    function getAllottedRPLBalance() external view returns (uint256);
    function getRemainingRPLBalance() external view returns (uint256);
    function getLotCount() external view returns (uint256);
    function getLotStartBlock(uint256 _index) external view returns (uint256);
    function getLotEndBlock(uint256 _index) external view returns (uint256);
    function getLotStartPrice(uint256 _index) external view returns (uint256);
    function getLotReservePrice(uint256 _index) external view returns (uint256);
    function getLotTotalRPLAmount(uint256 _index) external view returns (uint256);
    function getLotTotalBidAmount(uint256 _index) external view returns (uint256);
    function getLotAddressBidAmount(uint256 _index, address _bidder) external view returns (uint256);
    function getLotPriceAtBlock(uint256 _index, uint256 _block) external view returns (uint256);
    function getLotPriceByTotalBids(uint256 _index) external view returns (uint256);
    function getLotCurrentPrice(uint256 _index) external view returns (uint256);
    function getLotClaimedRPLAmount(uint256 _index) external view returns (uint256);
    function getLotRemainingRPLAmount(uint256 _index) external view returns (uint256);
    function getLotIsCleared(uint256 _index) external view returns (bool);
    function createLot() external;
    function bid(uint256 _lotIndex) external payable;
    function claim(uint256 _lotIndex) external;
}
