# EESE - Express Event-Sourcing Example

-----
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/JDurstberger/express-event-sourcing-example/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/JDurstberger/express-event-sourcing-example/tree/main)

This is a very basic event sourcing implementation.
I often have a conversation with people about the benefits of event sourcing, but it is hard to explain what it looks like.
This repository is supposed to showcase a very simple implementation.

## Design Decisions
 * **Postgresql** as the DB as it is widely adopted and offers a combination of schema & schemaless storage.
 * **Typescript** as it is imho slightly better than javascript
 * **ExpressJs** as it widely adopted
 * **HAL/JSON** as it is imho the best way to represent RESTFUL data
 * **Rake** as it offers a lot of plugins and is fast and convenient
 * **Hiera** as it provides an easy way to configure for multiple deployments
  
## Prerequisites
 * rbenv to install the required ruby for Rake - see .ruby-version
 * NVM to install the required node version - see .node-version

## How to Run?

All commands are executed through the `go` script. 
The script makes sure that all required dependencies beyond the prerequisites are installed
and then launches Rake.

To run the service `go app:start`

To run the service with auto-reload `go app:dev`

To run the tests `go test:all`

To run all checks `go`

To find all available tasks `go -T`

## Tech Stack & Design

* Express.js as the http service
* Postgresql as the DB
* Rake as the build system
* HAL/JSON as the data transfer protocol
 

## Known Constraints

* No pagination or offsetting on events endpoint
* URL templating is very lacking

## Known Issues

### "Connection terminated unexpectedly" on First Start

This is due to the Postgresql container needing a few more seconds to fully initialise while 
the app is already trying to connect. 

**Resolution**

Currently, only happens when the docker container does not exist yet.
Just run the start command again
