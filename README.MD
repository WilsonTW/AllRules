
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


## Using the REST API
Rules can be invoked by sending a json document with the payload to the rules server: 

HTTP Method: PUT

URL: http://XXXXXX/api/rulesprocessor/eventname

Payload: 
```json
    {"document":
                {
                "var1":value,
                "var2":value,
                "var3":value,
                ...
                }
```

Response:
```json
    {"result":"approved"}
```
Notes:
* Top-level "document" field is mandatory. var1, var2, var... can be set to any value depending on the business scenario. 
* The value for XXX is set as per the business rules configured.
* "Eventname" value in the URL will be used to filter out the rules to execute. Only the rules that the field "Execute when Event" equal the eventname in the URL will be executed.

## Rule Examples

Assuming whenever a new car loan is created, a message with EventName=NewLoan describing the loan is sent to the rules server:

Business Rule 1: `When a new Car Loan is submitted, automatically approve it if the amount is below 20000 and the credit rating is above 7`

IF:
```bash
amount<20000 && creditRating > 7
```
THEN:
```bash
    state:"APPROVED"
```
Else:
```bash
    state:"REJECTED"
```

Example document sent:
```json
{"document":
            {
            "customerid":63562754,
            "amount":12332,
            "creditRating":9,
            "loanlines":"331241-22"
            }
}
```
Response returned:
```json
    {"result":{"state":"APPROVED"}}
```


Business Rule 2: `When a new Car Loan is submitted, automatically reject it if the credit rating is below 5`

IF:
```bash
creditRating < 5
```
THEN:
```bash
    state:"REJECTED"
```
Else:
```bash
    (leave empty)
```

Example document sent:
```json
{"document":
            {
            "customerid":63562754,
            "amount":12332,
            "creditRating":1,
            "loanlines":"331241-22"
            }
}
```
Response returned:
```json
    {"result":{"state":"REJECTED"}}
```

Business Rule 3: `When a new Car Loan is submitted for credit rating = 10, approve it and increase the amount by 1%`

IF:
```bash
creditRating === 10
```
THEN:
```json
    state:"APPROVED",amount:amount * 1.01
```
Else:
```json
    (leave empty)
```

Example document sent:
```json
{"document":
            {
            "customerid":63562754,
            "amount":12332,
            "creditRating":1,
            "loanlines":"331241-22"
            }
}
```
Response returned:
```json
    {"result":{"state":"APPROVED","amount":12455.32}}
```


## Installation
If you want to install AllRules in runtime mode, after checking out the code for AllRules, follow the instructions below. More information on MEAN framework in [MEAN.io](http://mean.io/) website.  
 

```bash
$ npm install -g mean-cli
$ cd <myApp> && npm install
```

### Invoke node with a task manager
Mean supports the gulp task runner for various services which are applied on the code.
To start your application run:

```bash
$ gulp
```
or 
```bash
$ node server.js
```


## Credits
  * To [Linnovate.net](http://www.linnovate.net/) team, AllRules could not be possible with the MEAN.io framework.
  * To the [jshiki](https://github.com/vsimonian/jshiki) team

## License
AllRules released under MIT License [The MIT License](http://opensource.org/licenses/MIT)
