import { useState } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import { savePaymentMethod } from '../actions/cartActions'
import CheckoutSteps from '../components/CheckoutSteps'

const PaymentPage = ({ history }) => {
  const cart = useSelector(state => state.cart)
  const { shippingAddress } = cart

  if(!shippingAddress) {
    history.push('/shipping')
  }

  const [paymentMethod, setPaymentMethod] = useState('')

  const dispatch = useDispatch()

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(savePaymentMethod({ paymentMethod }))
    history.push('/placeorder')
  }

  return ( 
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as='legend'>Select Method</Form.Label>
          <Col>
            <Form.Check 
              type='radio' 
              label='Rave by Flutterwave' 
              id='rave' 
              name='paymentMethod' 
              value='Flutterwave' 
              onChange={(e) => setPaymentMethod(e.target.value)}  
            >
            </Form.Check>
            <Form.Check 
              type='radio' 
              label='PayStack' 
              id='PayStack' 
              name='paymentMethod' 
              value='PayStack' 
              onChange={(e) => setPaymentMethod(e.target.value)}  
            >
            </Form.Check>
            {/* Add other payment methods */}
          </Col>
        </Form.Group>
        <Button type='submit' variant='primary'>
          Continue
        </Button>
      </Form>
    </FormContainer>    
  );
}
 
export default PaymentPage;