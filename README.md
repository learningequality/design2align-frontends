# Judgment UI and Visualization projects

## Project setup

Install the following:

* [Node](https://nodejs.org/en/download/)
* [Yarn](https://yarnpkg.com/lang/en/docs/install)

Fork the repository on github.

Clone your fork of the repository.

Inside the cloned folder install the dependencies using yarn:
```
yarn install
```

To install dev dependencies, run:
```
yarn install --dev
```

Make a copy of the `__template__` directory in either the `judgment` or the `visualization` folder. Edit the files in there to create your own app, it will be shown in the list of apps available from the index page of the server.


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
