# Moon-Active-BE-Exam
A slot machine and a points accumlation system that grants rewards using microservices architecture

Files tree:

Moon-Active-BE-Exam/
├── accumulation-system-service/
│   ├── node_modules/
│   ├── src/
│   │   ├── index.ts
│   │   ├── redisClient.ts          
│   │   └── accumulator.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── .gitignore
│  
├── slot-machine-service/
│   ├── node_modules/
│   ├── src/
│   │   ├── index.ts
│   │   ├── redisClient.ts
│   │   |── spinSlotMachine.ts
│   │
│   ├── package.json
│   ├── tsconfig.json
│   ├── .gitignore
│   
├── .gitignore                     
├── README.md                       
└── package.json

User data initial struct in redis:
{
    coins: 0,
    missionIndex: 0,
    spins: 50
}