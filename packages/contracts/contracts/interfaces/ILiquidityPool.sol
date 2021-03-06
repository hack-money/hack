pragma solidity >=0.6.0 <0.7.0;

import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';

interface ILiquidityPool {
    function linkedToken() external view returns (IERC20);

    function deposit(uint256 amount) external;

    function withdraw(uint256 amount) external;

    function getUserLPBalance(address user) view external returns (uint256);

    function getPoolERC20Balance() external view returns (uint256);

    function getPoolATokenBalance() external view returns (uint256);

    function withdrawFromAave(uint256 redeemAmount) external;

    function transferATokens(uint256 amount, address recipient) external;

    function transferToAave(uint256 transferAmount) external;

    function sendTokens(address recipient, uint256 transferAmount) external;

    function lock(uint256 amount) external;

    function unlock(uint256 amount) external;
}