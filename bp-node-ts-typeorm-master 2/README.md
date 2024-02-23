# TypeScript Express boilerplate for API development

This TypeScript, NodeJS, Express boilerplate provides a solid foundation for building scalable and maintainable APIs. It includes the following features:

- **TypeScript support**: TypeScript brings type safety and better code organization to your projects. The boilerplate is preconfigured to use TypeScript, so you can start writing strongly-typed code right away.
- **Express framework**: Express is a widely-used framework for building web applications and APIs in NodeJS. It provides a robust set of features, including routing, middleware, and error handling.
- **Modular architecture**: The boilerplate is structured using a modular architecture, making it easy to organize your code into reusable components. Each module is responsible for a specific feature or functionality, and can be easily added or removed as needed.
- **Configuration management**: The boilerplate includes a configuration management system that allows you to easily manage environment-specific variables and settings. This makes it easy to deploy your app to different environments without having to modify your code.
- **Logging and error handling**: The boilerplate includes preconfigured logging and error handling, making it easy to diagnose issues in your code.
- **Database integration**: The boilerplate includes a sample database integration using the TypeORM library. This allows you to easily connect to and query a database in your app.

Overall, this boilerplate provides a solid foundation for building high-quality APIs with TypeScript and Express.

# Pre-requisites

- node version >= 18.15.0
- user needs to create a PAT(personal access token) to be used for NPM_TOKEN, this is used in `.npmrc` file

# File and folder Naming conventions

- Folder and file name will be singular and follow `kebab-case`
- Classes and interfaces Names will be singular and follow `PascalCasing`
- Any global constants or environment variables are in `all-caps` and follow `SNAKE_CASE`
- Variable name should be `camelCase`

For more details onto casing refer [here](https://medium.com/better-programming/string-case-styles-camel-pascal-snake-and-kebab-case-981407998841)

# API

## Add new API

In order to add a new API resource,

- create a new controller in folder `src/app/controllers`
- in `src/app/routes` folder, add the resource in `index.ts` file and create another file for the routes of a particular resource. This file be then used in `index.ts` for mapping the resource and the routes.
- For API validation create a validator file in `src/app/validators` folder. This file should contain only the Joi object. For use of that object refer to `src/app/routes/userRoutes.ts`

## API Docs

Swagger is to be used for API documentation.

# Project Setup

To setup the project, all you need to do is :

- Copy default.env to .env and make necessary changes `cp default.env .env`
- Run `npm install ` to install all the dependencies of the project
- (Optional but recommended) Search whole project and replace `ts-bp` with your app name i.e APPNAME (this will make changes in Dockerfile & compose file)
- `docker-compose up -d`
- High level flow would be `routes > validators > controllers > services > repository > model / entity`
- There are sample services files just for understanding code flow / structure. Build one service of your onw and then remove them.

# Migrations

- To crate a migration, `npm run typeorm migration:create ./<path_to_migration_dir>/<migration_name>`
- When using docker, Attach shell to the docker image and in the terminal use `npm run typeorm migration:run -- -d <app_data_source_path>` eg: `npm run typeorm migration:run -- -d ./src/database/app-data-source`

# Creating a new branch

- A new branch from any branch (main/dev or any other) must follow the syntax `^(feature|fix|hotfix|release)\/[A-Z]{1,}-[0-9]{1,}`. Eg: feature/SG-1 or feature/SG-1-health

# Deployment Changes

- Make changes in .yml files present in root folder (your ECR repo etc)

# DB

This project uses typeorm for orm to connect and execute queries on DB. It is configured to use postgres as its database.

This setup is using sync option of Typeorm. So DB is automatically updated with updates in our models

# Module Aliases

This project setup uses some module aliases for the ease in readbility and importing of other modules.
Refer to `_moduleAliases` section in `package.json` for currently created module aliases. These aliases are workable in src folder only as of now

# Commit Messages

- Commit message to be in the format as `feat: message specifying the feature developed` or `feat(SG-123): message specifying the feature developed`. Like wise, the message type can be reffered to the type-enums defined in `commitlint.config.js`. Message syntax to follow `type: commit message` or `type(Ticket_ID): commit message`

## Trobleshooting steps

# node version

- Incase of lower version of node, upgrade the node version to minimum 18.15.0,
- Using npm, `sudo npm cache clean -f` > `sudo npm install -g n` > `sudo n lts` (here lts can be replaced with latest or stable as the version of node you want, lts is for long term support)
- Using brew, `brew update` > `brew unlink node` > `brew install node@18 `
- Using nvm, `nvm install --lts` (preferred choice) or `nvm install <version> # like: 18.15.0` and then `nvm use --lts` or `nvm use <version>`
