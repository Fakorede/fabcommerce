import React from 'react'
import { usePaystackPayment } from 'react-paystack'

const PaystackPayment = ({publicKey, amount, handleSuccess}) => {
  const config = {
    reference: (new Date()).getTime(),
    email: "test@fabcommerce.com",
    amount: amount * 100,
    publicKey: publicKey,
  };

  // const HandleSuccess = (reference) => {
  //   console.log("stack response: ", reference)

  //   const paymentResult = {
  //     id: reference.id,
  //     status: reference.status,
  //     update_time: reference.update_time,
  //     email_address: reference.payer.email_address,
  //   }

  //   useDispatch(payOrder(orderId, paymentResult))

  //   // redirect to a success page
  // };

  const onClose = () => {
    console.log('closed')
  }

  const initializePayment = usePaystackPayment(config);

  return ( 
    <>
      <button onClick={() => {
        initializePayment(handleSuccess, onClose)
      }}>Pay with Paystack</button>
    </>
  );
}
 
export default PaystackPayment;