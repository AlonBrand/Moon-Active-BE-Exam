# Moon-Active-BE-Exam
A slot machine and a points accumlation system that grants rewards using microservices architecture.

Project details and flow:
* The slot machine service is the main service responsible for coordinating the flow.
* This service listens to HTTP requests, if GET "http://{ip}/spin/:user Id" request arrives, the flow starts.
* Flow:
    1. The slot machine calls the user manager service and requests to decrease one spin.
        1. If the new spins value is negative -> increase one spin and return a message to the user that not enough .
        2. Else -> continue with the flow.
    2. Run slot machine logic:
        1. Create a randomized array with a size of three.
        2. If one of the values is different than the others, return a message to the user.
        3. Else -> continue with the flow.
        4. Calculate rewards using the utils library functions.
    3. Call the user manager service for setting the new rewards in Redis.
    4. Send a JSON to the user with the results.

* Notes:
    1. User manager is the only service that allowed to write to Redis memory.
    2. Need to crate .env file in each of the services in the following manner:
        * PORT=XXXX
        * Redis_HOST=YYYY
        * Redis_PORT=ZZZZ
    This enable listening to HTTP requests and communicate with Redis.

User data initial struct in Redis:

- **points**: `0`
- **coins**: `0`
- **spins**: `50` (currently)
