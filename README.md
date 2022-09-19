# finjector
Financial CCOA Lookup As A Service

## Run it

You'll need user-secrets from 1pass.

On first run, it'll auto install all nuget and npm packages.  But if you are updating, you'll have to go into ClientApp/ and run `npm install` to stay current.

Otherwise, it's the same as any other app:

`npm start`

This will launch a "landing page" which spins up our client code and waits for it to be ready.  Once ready it'll auto swap to `https://localhost:3000` and our react code.