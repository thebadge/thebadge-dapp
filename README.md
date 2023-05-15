<p align="center">
  <a href="https://thebadge.xyz">
    <img alt="TheBadge" src="public/favicon/favicon.svg" width="128">
  </a>
</p>

<h1 align="center">TheBadge DApp Front-End</h1>

<p align="center">
  <a href="https://discord.com/invite/FTxtkgbAC4"><img src="https://img.shields.io/discord/1006480637512917033?style=plastic" alt="Join to Discord"></a>
  <a href="https://twitter.com/intent/user?screen_name=thebadgexyz"><img src="https://img.shields.io/twitter/follow/thebadgexyz?style=social" alt="Follow us on Twitter"></a>
</p>

For questions or request information reach out via [Discord](https://discord.gg/tVP75NqVuC).

# Deployed environments

- Production: https://app.thebadge.xyz
- Staging: https://staging-app.thebadge.xyz

## Getting Started

These instructions will help you get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
We use [nvm](https://github.com/nvm-sh/nvm) to ensure that everyone is using the same Node Version. Please install it and run `nvm use`

We use [yarn](https://yarnpkg.com) in our infrastructure, so we decided to go with yarn in the README.
Please install yarn globally if you haven't already.

### Installing and running

Install dependencies for the project:

```
yarn install
```
----

> Make a copy of the `.env.example` and fill the empty values, if you don't know how 
> to do it, reach any of the team members, and they will be happy to help

----

To launch the dev version of the app locally:


```
yarn dev
```

### Building

To get a complete bundle use:

```
yarn build
```

## File structure

Inside the src folder you will find:

- `components`: Stateless components. UI.
- `contracts`: All the contracts the dApp will interact.
- `hooks`: React hooks.
- `pagePartials`: Complex components related to a particular page.
- `providers`: React providers.
- `subgraph`: Queries and configuration for Subgraph's.
- `theme`: General UI styles.
- `utils`: Some utility functions.
- `config`: Global configurations.

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is released under the MIT License - see the [LICENSE.md](LICENSE) file for details.
