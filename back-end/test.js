const Flutterwave = require('flutterwave-node-v3');
                    require('dotenv').config();
                    
                    const flw_secrete_key = process.env.FLW_SECRET_KEY;

                    const flw_public_key = process.env.FLW_PUBLIC_KEY;
            
                    const flw = new Flutterwave(flw_public_key, flw_secrete_key);
const payload = {
    phone_number: '24709929220',
    amount: 1500,
    currency: 'XAF',
    email: 'JoeBloggs@acme.co',
    tx_ref: "s23jknjnq9efa",
    country: "CM"
}
flw.MobileMoney.franco_phone(payload)
    .then(console.log)
    .catch(console.log);