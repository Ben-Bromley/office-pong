# Office Pong

[![App Version](https://img.shields.io/badge/Office%20Pong-v0.2.0-2b56a1)](https://github.com/Ben-Bromley/office-pong)

Hey! Welcome to the Office Pong repo. I was challenged to build this by my fellow developers at [REVIEWS.io](https://reviews.io) so that we could all track our scores when we play ping pong at lunch.

I worked on this for months building a custom API to integrate with firebase, but then one of the developers had mentioned something called "the t3 stack"

I had no clue what that was, but I looked into the repository: [t3-oss/create-t3-app](https://github.com/t3-oss/create-t3-app)

There was once a long explanation of how much better T3 is than NEXT.js and Firebase, but the TL;DR is that the tools included in the T3 template made it exponentially easier to build this.

## Development Instructions

These instructions a wip, so let me know if you encounter any issues.

### Database Set-up

in primsa/schema.prisma

- set `provider = sqlite`
- comment out `db.text()` annotations

in .env

- Database URL should be `file:./dev.db`

Run the below to create the database, and fill in sample data

```bash
$ npx prisma db push
$ npx prisma db seed
```

### Auth Setup

Set up both the google auth and next auth stuff.

#### Google Auth ([Documentation](https://next-auth.js.org/providers/google))

- Set up a [new google cloud project](https://console.cloud.google.com/projectcreate)
- generate a new oauth client
- add the keys from the new oauth into .env

#### Next Auth

- the next auth secret can be any random string
- the next auth url should be http://localhost:3000
