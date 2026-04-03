# 🛡️ Aegis Oracle Engine

A production-ready oracle security module for DeFi protocols.

## 🚨 Problem

DeFi protocols are vulnerable to:
- Oracle manipulation (flash loans)
- Stale data
- Oracle downtime

## ✅ Solution

Aegis introduces a multi-layer oracle protection system:

- Chainlink integration
- Deviation checks
- Circuit breaker
- Fallback oracle
- Fail-safe recovery

## 🧠 Features

- Multi-source price validation
- Emergency pause system
- Role-based access control
- Last good price fallback

## ⚙️ Usage

```solidity
uint256 price = oracle.getFinalPrice();