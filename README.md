# Judgment UI and Visualization projects

## Project setup

1. Ensure the following are installed:

* [Node 10+](https://nodejs.org/en/download/)
* [Yarn](https://yarnpkg.com/lang/en/docs/install)

2. Fork the repository on github.

3. Clone your fork of the repository
```
git clone https://github.com/[your-github-username]/design2align-frontends.git
```

4. Inside the cloned folder install the dependencies using yarn:
```
yarn install
```

5. Make a copy of the `__template__` directory in either the `judgment` or the `visualization` folder. Edit the files in there to create your own app, it will be shown in the list of apps available from the index page of the server.


### Run development server to compile and hot-reload
```
yarn run serve
```

### Deploying code
To deploy your code to the production server, open a PR against the main repository. A quick test of the build will be run to verify that the build still completes properly, as breaking the build will break everyone's apps!

Once this is merged, it will be rebuilt and available in the [root of the server](https://hackathon.learningequality.org).

## Additional functionality

### Lints and fixes files
```
yarn run lint
```

### Compiles and minifies for production
```
yarn run build
```

### NPM

If you are unable to install Yarn, and only able to use npm, most of the commands above can be invoked with `npm` instead of `yarn` - however, to fully install all dependencies for development with npm, you will have to run this command:
```
npm install --dev
```
