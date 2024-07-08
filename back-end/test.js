const Flutterwave = require('flutterwave-node-v3');
                    require('dotenv').config();
                    
                    const flw_secrete_key = process.env.FLW_SECRET_KEY;

                    const flw_public_key = process.env.FLW_PUBLIC_KEY;
            
                    const flw = new Flutterwave(flw_public_key, flw_secrete_key);
                    const details = {
                        account_bank: "MPS",
                        account_number: "2540782773934",
                        amount: 1200,
                        currency: "KES",
                        beneficiary_name: "Akinyi Kimwei",
                        meta: {
                          "sender": "Flutterwave Developers",
                          "sender_country": "ZA",
                          "mobile_number": "23457558595"
                        }
                      };
                      await flw.Transfer.initiate(details);
                      