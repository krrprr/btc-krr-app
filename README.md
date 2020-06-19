# btc-krr-app

* Provides an API for making custom JSON-RPC requests to a Bitcoin node.
* Combines Bitcoin RPCs under the hood.

## Running the application
### Prerequisites
* Node >= v12.18.1
* Bitcoin Core Daemon (bitcoind)

### Setup
* Run `npm install` in the project folder
* Make a copy of the `.env.example` file and rename it as `.env`
* Edit the `.env` file:
    * The application listens to incoming requests described in [./src/api.ts](https://github.com/krrprr/btc-krr-app/blob/master/src/api.ts) on a port that is assigned to the `PORT` variable.
    * `BITCOIND_RPC_HOST` and `BITCOIND_RPC_PORT` refer to the address and port, respectively, of the Bitcoin node.
    * `BITCOIND_RPC_USER` and `BITCOIND_RPC_PASSWORD` are related to the value of `rpcauth` in the node's `bitcoin.conf` file.
      For generating authentication credentials, see https://github.com/bitcoin/bitcoin/tree/master/share/rpcauth.

### Start
* `npm run start` or
* `npm run dev` in development mode

### Test
* `npm run test` or
* `npm run test:watch`

### Usage examples
* from the command line using curl
    * `curl http://localhost:3000/api/getlastblock`
    * if you have [jq](https://stedolan.github.io/jq/) installed: `curl http://localhost:3000/api/getlastblock | jq`
