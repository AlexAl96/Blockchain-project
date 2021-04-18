---
title: Procedure and Learnings
---

In order to realise the goal of an independent and secure platform based on blockchain technology, various steps were taken.
The procedure and learnings of the project are briefly described below.

First, interviews were conducted to define the exact goal and to discuss the functional and non-functional requirements for PEER.
These were then outlined with the help of diagrams (see link in "Further Information") . Afterwards, the individual contracts were programmed. Since there was hardly any comparable work so far, a lot of research and testing had to be done for a successful implementation of the contracts.  Above all, the storage space limitations posed a great challenge and required an intelligent division of the necessary functions. Possibilities such as transaction did not bring the necessary reduction success, and the problem could not be solved by inheritance alone. Therefore, a combination of library and inheritance was finally chosen.
In addition to challenging the storage capacity, the implementation of the contracts was designed to limit the transaction costs due to the rising ether prices.  This goal was achieved by avoiding unnecessary intermediate storage, among other things.

After the basic building blocks of the contracts were created, the frontend was adapted to them. This was realised with the help of the front-end web application framework Angular.
The decision to proceed in this order is due to the fact that Solidity is still a new programming language, which means that there are some limitations in programming with solidity.

One huge  problem during the project was that, due to the division of the contract functions, great care must be taken to ensure that all contracts are deposited at the correct address and have access to each other and that the sequence of deployment is correct. These challenges can quickly lead to errors and problems in the interface between the contracts and the frontend. The generic error message from Solidity also amplified this challenge.
This problem was solved by implementing the controller, and the data contract separately, which means that only one contract needs to be accessed by the frontend and therefore allows a simple way ofy implementation.