const { buildSchema } = require("graphql");

module.exports = buildSchema(`

    type Application{
        name: String!
        description: String!
    }    

    input UserInputData{
        name: String!
        description: String! 
    }

    type RootQuery{
        hello: String
    }

    type RootMutation{
        createApplication(userInput: UserInputData): Application!
    }

    schema{
        query: RootQuery
        mutation: RootMutation
    }
`);
