# Moon-Active-BE-Exam
A slot machine and a points accumlation system that grants rewards using microservices architecture.

Project details and flow:
* The slot machine service is the main service that resposible to cooardinate the flow. 
* This service is listening to HTTP requests, if GET "http://{ip}/spin/:userId" request arraives, the flow starts.
* Flow:
    1. Call user manager service and decrease one spin in redis.
        1. If new value is negative -> fix the decrease and return a message to the user.
        2. Else -> continue with the flow.
    2. Run slot machine logic:
        1. Randmize an array with the size of three.
        2. If one of the values is different then the others, return a messag to the user.
        3. Else -> continue with the flow.
        4. Calculate rewards using the utils library.
    3. Call user manager service for setting the new rewards in redis.
    4. Send a JSON to the user with the results.

* Notes:
    1. Need to crate .env file in each of the services in the following manner:
        * PORT=XXXX
        * REDIS_HOST=YYYY
        * REDIS_PORT=ZZZZ
    This enable listening to HTTP requests and communicate with redis.

User data initial struct in redis:

- **Points**: `0`
- **Coins**: `0`
- **Spins**: `50` (currently)
