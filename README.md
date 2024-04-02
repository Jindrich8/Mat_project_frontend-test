# MatProjectTest
This is frontend for [System for practising the grammar of the Czech language](https://github.com/Jindrich8/Mat_project_backend-test) and requires it to run.
## Installation
1. Install this project and it's backend to separate folders that share same parent.
This is required because frontend generates types for api (dtos) from backend schemas.
To costumize this process edit schemas option passed to ,,run" function in [mat-project-vite-test/node_gen_dtos.js](https://github.com/Jindrich8/Mat_project_frontend-test/blob/main/mat-project-vite-test/node_gen_dtos.js).
3. [Generate dtos on backend](https://github.com/Jindrich8/Mat_project_backend-test).
4. run ,,yarn dev" or ,,yarn build"
