# Bide Server

## Issues

- No typing for the frontend because this is a REST API and not GraphQL
- No authentication or authorization; Just a completely public API
- Database does not store actual user login information or anything
  - This means email and password
- Want to use OAuth 2.0 to authenticate with different providers

## Todo

- Create a routes file so that I can see, at a glance, what all my routes are

  - Functions specific to different parts of the website can be in different modules (users, groups, tokens, etc.)

- <i>Actually</i> store user authentication information (email and password)

  - Make sure email and username are unique

- Prefer UUID over auto-generating primary keys

- Prefer using a username as the unique identifier of a user
  - Usernames are just convenient for the frontend because the routes use
