This is the original MEAN.IO installation document, adjusted to install AllRules product.
The original installation document is available here [README-MEANio.MD](README-MEANio.MD), refer to it to view the complete install and configuration instructions for MEAN.io (not within the scope of this document).
 
# Installation Instructions for AllRules

In order to install AllRules from source, you have to follow the instructions below. 

## Prerequisite Technologies
### Linux
* *Node.js* - <a href="http://nodejs.org/download/">Download</a> and Install Node.js.
* *MongoDB* - <a href="https://www.mongodb.org/downloads">Download</a> and Install mongodb - <a href="https://docs.mongodb.org/manual/">Checkout their manual</a> if you're just starting.

If you're using ubuntu, this is the preferred repository to use...

```bash
$ curl -sL https://deb.nodesource.com/setup | sudo bash -
$ sudo apt-get update
$ sudo apt-get install nodejs
```

* *Git* - Get git using a package manager or <a href="http://git-scm.com/downloads">download</a> it.

### Windows
* *Node.js* - <a href="http://nodejs.org/download/">Download</a> and Install Node.js, nodeschool has free <a href=" http://nodeschool.io/#workshoppers">node tutorials</a> to get you started.
* *MongoDB* - Follow the great tutorial from the mongodb site - <a href="https://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/">"Install Mongodb On Windows"</a>
* *Git* - The easiest way to install git and then run the rest of the commands through the *git bash* application (via command prompt) is by downloading and installing <a href="http://git-scm.com/download/win">Git for Windows</a>

### OSX
* *Node.js* -  <a href="http://nodejs.org/download/">Download</a> and Install Node.js or use the packages within brew or macports.
* *MongoDB* - Follow the tutorial here - <a href="https://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/">Install mongodb on OSX</a>
* *git* - Get git <a href="http://git-scm.com/download/mac">from here</a>.

## Prerequisite packages

* Mean currently uses gulp as a build tool and bower to manage frontend packages.
```
$ npm install -g gulp
// and bower
$ npm install -g bower 
```

## AlLRules Installation
To start with MEAN install the `mean-cli` package from NPM.
This will add the *mean* command which lets you interact (install, manage, update ...) your Mean based application.

### Install the MEAN CLI

```bash
$ npm install -g mean-cli
$ cd <myApp> && npm install
```

### Invoke node with a task manager
Mean supports the gulp task runner for various services which are applied on the code.
To start your application run - 
```bash
$ gulp
```

Alternatively, when not using `gulp` (and for production environments) you can run:
```bash
$ node server
```
Then, open a browser and go to:
```bash
http://localhost:3000
```

### Running on a different port
If you have a rails, node, or other mean project already running, you may need to use a different port. You can set the port and start your new mean project with one command:
```bash
$ export PORT=3001 && gulp
```

Then, open a browser and change the port number before you visit:
```bash
  http://localhost:3001
```

### Troubleshooting
During installation depending on your os and prerequisite versions you may encounter some issues.

Most issues can be solved by one of the following tips, but if you are unable to find a solution feel free to contact us via the repository issue tracker or the links provided below.

#### Update NPM, Bower or Gulp
Sometimes you may find there is a weird error during install like npm's *Error: ENOENT*. Usually updating those tools to the latest version solves the issue.

* Updating NPM:
```bash
$ npm update -g npm
```

* Updating Gulp:
```bash
$ npm update -g gulp
```

* Updating Bower:
```bash
$ npm update -g bower
```

#### Cleaning NPM and Bower cache
NPM and Bower has a caching system for holding packages that you already installed.
We found that often cleaning the cache solves some troubles this system creates.

* NPM Clean Cache:
```bash
$ npm cache clean
```

* Bower Clean Cache:
```bash
$ bower cache clean
```

#### Installation problems on Windows 8 / 8.1
Some of Mean.io dependencies uses [node-gyp](https://github.com/nodejs/node-gyp) with supported Python version 2.7.x. So if you see an error related to node-gyp rebuild follow next steps:

1. install [Python 2.7.x](https://www.python.org/downloads/)
2. install [Microsoft Visual Studio C++ 2012 Express](http://www.microsoft.com/en-us/download/details.aspx?id=34673)
3. Run NPM update

```bash
$ npm update -g
```

#### Git "not found" on Windows
If you get this error when trying to `mean init`:

```text
Prerequisite not installed: git
```

And you definitely have Git for Windows installed, then it's not included in your path. Find the folder containing git.exe (likely `C:\Program Files (x86)\Git\cmd`) and add it to your PATH.

### Users

 <p>Information can be display for a specific customer via <code>mean user email</code>. Email is required. User roles can be assigned or removed with the <code>--addRole (or -a)</code> and <code>--removeRole (or -r)</code> options, respectively.</p>
  <p>For example, the <i>admin</i> role is required to edit tokens.</p>

```bash
  $ mean user <email>
  $ mean user <email> --addRole <role>;
  $ mean user <email> --removeRole <role>;
```

## Config (applicable for mean.io)
All the configuration is specified in the [config](/config/) folder,
through the [env](config/env/) files, and is orchestrated through the [meanio](https://github.com/linnovate/meanio) NPM module.
Here you will need to specify your application name, database name, and hook up any social app keys if you want integration with Twitter, Facebook, GitHub, or Google.

### Environmental Settings (applicable for mean.io)

There is a shared environment config: __all__

* __root__ - This the default root path for the application.
* __port__ - DEPRECATED to __http.port__ or __https.port__.
* __http.port__ - This sets the default application port.
* __https__ - These settings are for running HTTPS / SSL for a secure application.
* __port__ - This sets the default application port for HTTPS / SSL. If HTTPS is not used then is value is to be set to __false__ which is the default setting. If HTTPS is to be used the standard HTTPS port is __443__.
* __ssl.key__ - The path to public key.
* __ssl.cert__ - The path to certificate.

There are three environments provided by default: __development__, __test__, and __production__.
Each of these environments has the following configuration options:

* __db__ - This is where you specify the MongoDB / Mongoose settings
* __url__ - This is the url/name of the MongoDB database to use, and is set by default to __mean-dev__ for the development environment.
* __debug__ - Setting this option to __true__ will log the output all Mongoose executed collection methods to your console.  The default is set to __true__ for the development environment.
* __options__ - These are the database options that will be passed directly to mongoose.connect in the __production__ environment: [server, replset, user, pass, auth, mongos] (http://mongoosejs.com/docs/connections.html#options) or read [this] (http://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html#mongoclient-connect-options) for more information.
* __app.name__ - This is the name of your app or website, and can be different for each environment. You can tell which environment you are running by looking at the TITLE attribute that your app generates.
* __Social OAuth Keys__ - Facebook, GitHub, Google, Twitter. You can specify your own social application keys here for each platform:
  * __clientID__
  * __clientSecret__
  * __callbackURL__
* __emailFrom__ - This is the from email address displayed when sending an email.
* __mailer__ - This is where you enter your email service provider, username and password.

To run with a different environment, just specify NODE_ENV as you call gulp:
```bash
$ NODE_ENV=test gulp
```
If you are using node instead of gulp, it is very similar:
```bash
$ NODE_ENV=test node server
```
To simply run tests
```bash
$ npm test
```
> NOTE: Running Node.js applications in the __production__ environment enables caching, which is disabled by default in all other environments.


## More Information on MEAN.io
  * [Linnovate.net](http://www.linnovate.net/).
  * [Ninja's Zone](http://meanleanstartupmachine.com/) for extended support.

## License
We believe that mean should be free and easy to integrate within your existing projects so we chose [The MIT License](http://opensource.org/licenses/MIT)
