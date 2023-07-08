# React SDK for Algorand

This project was created as a guide/reference for devs to create UI for their Algorand Apps.

## How to?

- Clone the repo.

- Run `npm install` to install all the dependencies.

- Configure your API source for getting data.

    - Create a ".env" file in source folder and provide it with the PureStake API key. (REACT_APP_PURE_STAKE_API_KEY="XXXXXXXX")
    - Or, you can use AlgoNodes API. To do so, go to "src/utils/AlgorandUtils.js". There, uncomment the comment for AlgoNodes API and comment the PureStake API.

- Run `npm start` to start the project.


