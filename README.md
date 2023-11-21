# Puzzle battle server

## What?

App where people compete head to head solving puzzles. A wrong move gifts the other player a free move.

## How does it work?

A nest js graphql server, backed by a redis cache and a nosql database (mongo).

### Development

To create, run, stop and start the docker image, the folloing scripts exist:

`dev:docker:build:redis`
Builds the docker image

`dev:docker:run:redis`
Runs it

`dev:docker:stop:redis`
Stops it

`dev:docker:start:redis`
Starts it

`dev:docker:redis:init`
Executes the scripts against it. This creates the indexes used to query it

Once the docker image is started the ui to it should be accessible at `http://localhost:8001`

Once the redis docker is running, do `npm run start`.

## Games

Sequence diagram for the happy path game flow:
```mermaid
sequenceDiagram
    participant AW as Alex web client
    participant JW as Joe web client
    participant S as Server
    participant MC as Memory Cache
    participant DB as Database
    participant L as Lichess
    par
        AW ->> L: Loads site, initiate lichess oauth for Alex
        L->>AW: Finish lichess oauth for Alex
        AW->>S: Establish a websocket connection
        AW->>S: Notify Server of login
        S ->>DB: Create/update user
        S ->>MC: Add to live user cache
    and
        JW ->> L: Loads site, initiate lichess oauth for Joe
        L->>JW: Finish lichess oauth for Joe
        JW->>S: Establish a websocket connection
        JW->>S: Notify Server of login
        S ->>DB: Create/update user
        S ->>MC: Add to live user cache
    end
    par
        AW ->> S: Select game type X, notify server
        S ->> MC: Set flag in the user hash saying looking for game type x
    and
        JW ->> S: Select game type X, notify server
        S ->> MC: Set flag in the user hash saying looking for game type x
    end
    loop
        S-->MC: Loops, scanning through live users looking for game type x and pairs users
    end
    S ->> MC: Finds a match, creates a game between alex and joe, assigns the game a uuid for that game, removes looking for field from joe and alex
    S ->> L: Fetches a puzzle of the desired rating
    par
        S -> AW: Informs alex's client about the game, alex client subs to a new socket channel where the game events will be broadcast
    and
        S -> JW: Informs joe's client about the game, joe client subs to a new socket channel where the game events will be broadcast
    end
    par
        AW -> S: Alex plays, sends moves to the server
        S -> MC: Server updates live game state in memory cache
        S -> JW: Server broadcasts game events to joe's client
    and
        S -> JW: Informs joe's client about the game, joe client subs to a new socket channel where the game events will be broadcast
        S -> MC: Server updates live game state in memory cache
        S -> AW: Server broadcasts game events to alex's client
    end
    S -> MC: On game end remove game from memory cache
    S -> DB: On game end save game in db
    par
        S -> AW: Disconnect game devoted socket channel
    and
        S -> JW: Disconnect game devoted socket channel
    end
```
