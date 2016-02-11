
# All Rules

All Rules is a multi-purpose rules engine. It allows the end user to quickly configure business rules using simple formulas (as supported by [jshiki](https://github.com/vsimonian/jshiki)). Rules are instantly available to be invoked through REST APIs, which allows for easy integration with existing systems. AllRules was created by extending <a href="http://mean.io/">MEAN.io</a> framework (separate product owned and distributed by [Linnovate.net](http://www.linnovate.net/)). MEAN is based on [MongoDB](https://www.mongodb.org/), [Node.js](http://www.nodejs.org/), [Express](http://expressjs.com/), and [AngularJS](https://angularjs.org/). 




## Product Features
### GUI Rules Builder
* Rules organized by Groups
* Business friendly If-Then-Else expressions with variable and formulas support (detailed expression at [jshiki](https://github.com/vsimonian/jshiki))
* Can test with real messages at design time
* Ability to enable/disable and provide validity range
* User identification with social logins and built-in user registration

### Runtime Engine
* Rules can be excercised using REST APIs
* Rules are available after creation with no service downtime
* Message parsing status returned as per rule configuration
* User friendly message parsing log available for debugging 

## Screenshots

`Groups definition`
![groups](https://cloud.githubusercontent.com/assets/7155108/12968243/e91d16ba-d04d-11e5-96f8-478379cfefb6.png )
`Rule Lists`
![rules-list](https://cloud.githubusercontent.com/assets/7155108/12968240/e8ff9c16-d04d-11e5-97b1-16e4ecdd2a1b.png)
`Editing basic rule data`
![rules-basicdata](https://cloud.githubusercontent.com/assets/7155108/12968239/e8fc651e-d04d-11e5-8ab4-dbfcdd40b492.png)
`Editing if-then-else and testing rules`
![rules-logic](https://cloud.githubusercontent.com/assets/7155108/12968238/e8fb5430-d04d-11e5-9bbf-05f40afadd15.png)
`Viewing REST APIs processing logs`
![processing-log](https://cloud.githubusercontent.com/assets/7155108/12968242/e904cd62-d04d-11e5-96b8-c1a0d4f57ae2.png)


## Docker image for evaluation

* There is a docker image that can be used as test/evaluation for AllRules. By default it is configured as development environment, do not try to use it in production.
Image available here: http://docker 

## Installation
If you want to install AllRules by yourself
### if-then-else examples

```bash
$ npm install -g mean-cli
$ mean init <myApp>
$ cd <myApp> && npm install
```

### Invoke node with a task manager
Mean supports the gulp task runner for various services which are applied on the code.
To start your application run -
```bash
$ gulp
```


## Credits
  * To [Linnovate.net](http://www.linnovate.net/) team, AllRules could not be possible with the MEAN.io framework.
  * To the [jshiki](https://github.com/vsimonian/jshiki) team

## License
AllRules released under MIT License [The MIT License](http://opensource.org/licenses/MIT)
