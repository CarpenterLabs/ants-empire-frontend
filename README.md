# Ants Empire – Frontend (React, TypeScript)

Frontend application for the **Ants Empire** Web3 game.  
Built with **React** and **TypeScript** for a type-safe, scalable, and maintainable codebase.  
Communicates with the backend via **REST APIs** and **real-time WebSocket channels**, and integrates indirectly with blockchain smart contracts through backend services.

## Features

- **Web3-enabled UI**: Interactive interface connected to the game’s blockchain logic via backend APIs and event streams.
- **Real-time updates**: Subscribes to WebSocket channels for instant gameplay changes, marketplace updates, and event notifications.
- **NFT Marketplace UI**: View, list, and interact with in-game NFTs, backed by indexed marketplace data from the backend.
- **Game systems integration**: Interfaces for gameplay actions, quests, expeditions, and resource management.
- **Optimized rendering**: Component-level memoization and selective re-renders for performance on complex UI states.
- **Secure authentication**: EIP-712 signature-based login and action verification.
- **Responsive design**: Fully optimized for desktop and mobile experiences.

## Tech Stack

- **Framework**: React
- **Language**: TypeScript
- **Routing**: React Router
- **Communication**: REST APIs + WebSockets (real-time data streams from the backend)
- **Web3**: [`wagmi`](https://wagmi.sh/) for direct contract calls; backend proxy used only for specific blockchain operations
- **Build Tooling**: Vite (fast build times, instant hot module replacement)
- **Styling**: SCSS Modules

## UI Preview

Below are some example screens from the **Ants Empire** frontend, showcasing the core game UI.

<p align="center">
  <img src="https://i.imgur.com/JkF501f.png" alt="Main Colony Layout - Day" width="800"/>
</p>

<p align="center">
  <img src="https://i.imgur.com/wkESzFG.png" alt="Main Colony Layout - Night" width="800"/>
</p>

<p align="center">
  <img src="https://i.imgur.com/YgjS87W.png" alt="Expeditions" width="800"/>
</p>

<p align="center">
  <img src="https://i.imgur.com/Li2o8XI.png" alt="Expedition Detail" width="800"/>
</p>

<p align="center">
  <img src="https://i.imgur.com/L3OkYKH.png" alt="Blacksmith" width="800"/>
</p>

<p align="center">
  <img src="https://i.imgur.com/zd1wgFR.png" alt="Seller" width="800"/>
</p>

<p align="center">
  <img src="https://i.imgur.com/YADjGCN.png" alt="Seller - Tablet" width="800"/>
</p>

<p align="center">
  <img src="https://i.imgur.com/rLc056p.png" alt="Seller - Mobile" width="380"/>
</p>

<p align="center">
  <img src="https://i.imgur.com/blti2k0.png" alt="Faucet" width="800"/>
</p>


---

## License – Showcase Use Only

Copyright (c) 2025 **Carpenter Labs**
All Rights Reserved.

This repository is provided as a public showcase for educational and technical evaluation purposes only. It contains proprietary and confidential code. Unauthorized copying, modification, redistribution, or use of this code, in whole or in part, for any purpose, is strictly prohibited without the express written permission of the copyright holder.

You are permitted to:

View and review the code for learning or evaluation Reference architectural patterns and ideas with proper attribution

You are not permitted to:

Use this code in production systems Redistribute or sublicense it Use it for any commercial purpose By accessing this repository, you agree to these terms.
