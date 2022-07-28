# EESE - Express Event-Sourcing Example

This is a very basic event sourcing implementation.

## Prerequisites
 * Ruby for Rake - see .ruby-version
 * NVM to install the required node version

## How to run?

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

## Known issues

### "Connection terminated unexpectedly" on first start

This is due to the Postgresql container needing a few more seconds to fully initialise while 
the app is already trying to connect. 

*Resolution*

Currently, only happens when the docker container does not exist yet.
Just run the start command again
