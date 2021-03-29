import React from 'react'
import { useFlutterwave } from 'flutterwave-react-v3'

const RavePayment = ({publicKey, amount, handleSuccess}) => {
  const config = {
    public_key: publicKey,
    tx_ref: (new Date()).getTime(),
    amount: amount,
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: 'test@fabcommerce.com',
      phonenumber: '08188469918',
      name: 'test user',
    },
    customizations: {
      title: 'FabCommerce',
      description: 'Payment for items in cart',
      logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
    },
  }

  const handleFlutterPayment = useFlutterwave(config);

  return (
    <>
      <button
        onClick={() => {
          handleFlutterPayment({
            callback: handleSuccess,
            onClose: () => {},
          });
        }}
      >
        Pay with Flutterwave
      </button>
    </>
  );
}
 
export default RavePayment;