# Stripe

To start stripe webhook on localhost:

1. login if not logged by opening Command Prompt in stripe.exe file location and execute `stripe login`
2. then execute `stripe listen --forward-to localhost:3000/webhooks/stripe`
3. stripe webhook now is activated

Environmental variable `STRIPE_WEBHOOK_SECRET` in `.env` maybe different in the future. It might be necessary to create new stripe secret key.

Stripe Card Credentials:

- Card number: 4242 4242 4242 4242 for US card and 4000 0061 6000 0005 for Polish Card
- Card expiration date: any date in the future
- CVC code: any
- E-mail: to work with testing localhost it must be the same as the `Resend` account
