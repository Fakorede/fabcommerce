import { useEffect, useState } from 'react'
import { Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { closePaymentModal } from 'flutterwave-react-v3'
import RavePayment from '../components/RavePayment'
import PaystackPayment from '../components/PaystackPayment'
import { getOrderDetails, payOrder } from '../actions/orderActions'
import { ORDER_DETAILS_RESET, ORDER_PAY_RESET } from '../constants/orderConstants'
import Loader from '../components/Loader'
import Message from '../components/Message'

const OrderPage = ({match}) => {
  const orderId = match.params.id
  const dispatch = useDispatch()

  const [sdkReady, setSdkReady] = useState(false)

  const orderDetails = useSelector(state => state.orderDetails)
  const { order, loading, error } = orderDetails
  
  const orderPay = useSelector(state => state.orderPay)
  const { loading: loadingPay, success: successPay } = orderPay

  const [ravePublicKey, setRavePublicKey] = useState('')
  const [paystackPublicKey, setPaystackPublicKey] = useState('')

  // Calculate prices
  if(!loading) {
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2)
    }

    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    )
  }

  const raveSuccessHandler = (response) => {
    console.log(response)

    if (response.status !== "successful"){
        // redirect to a failure page.
    }
    
    const paymentResult = {
      id: response.transaction_id,
      status: response.status,
      update_time: new Date(Date.now()).toISOString(),
      email_address: response.customer.email,
      // tx_ref
    }

    dispatch(payOrder(orderId, paymentResult))

    closePaymentModal()
  }

  const stackSuccessHandler = (response) => {
    console.log(response)

    if (response.status !== "success"){
      // redirect to a failure page.
    }

    const paymentResult = {
      id: response.transaction,
      status: response.status,
      update_time: new Date(Date.now()).toISOString(),
      // email_address: response.customer.email,
      // reference
    }

    dispatch(payOrder(orderId, paymentResult))
  }

  useEffect(() => {
    const setupRaveSdk = async () => {
      const { data: rave_public_key } = await axios.get('/api/config/rave')
      setRavePublicKey(rave_public_key)
      setSdkReady(true)
    }

    const setupPaystackSdk = async () => {
      const { data: paystack_public_key } = await axios.get('/api/config/paystack')
      setPaystackPublicKey(paystack_public_key)
      setSdkReady(true)
    }

    if(!order || successPay) {
      dispatch({ type: ORDER_PAY_RESET })
      dispatch({ type: ORDER_DETAILS_RESET })
      dispatch(getOrderDetails(orderId))
    } else if(!order.isPaid) {
      if(!window.rave || !window.paystack) {
        setupRaveSdk()
        setupPaystackSdk()
      } else {
        setSdkReady(true)
      }
    }

  }, [dispatch, orderId, successPay, order, ravePublicKey, paystackPublicKey])

  return loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : ( 
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p><strong>Name: </strong>{order.user.name}</p>
              <p><strong>Email: </strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered 
                ? <Message variant='success'>Delivered on {order.deliveredAt}</Message> 
                : <Message variant='danger'>Not Delivered</Message>
              }
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid 
                ? <Message variant='success'>Paid on {order.paidAt}</Message> 
                : <Message variant='danger'>Not Paid</Message>
              }
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty!</Message>
              ) : (
                <ListGroup variant='flush'>
                {order.orderItems.map((item, index) => (
                  <ListGroup.Item key={index}>
                    <Row>
                      <Col md={1}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          fluid
                          rounded
                        />
                      </Col>
                      <Col>
                        <Link to={`/product/${item.product}`}>
                          {item.name}
                        </Link>
                      </Col>
                      <Col md={4}>
                        {item.qty} x ₦{item.price} = ₦{item.qty * item.price}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>₦{order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>₦{order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>₦{order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>₦{order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {!sdkReady ? <Loader /> : order?.paymentMethod == 'Rave' 
                    ? <RavePayment publicKey={ravePublicKey} amount={order.totalPrice} handleSuccess={raveSuccessHandler} />
                    : <PaystackPayment publicKey={paystackPublicKey} amount={order.totalPrice} handleSuccess={stackSuccessHandler} />
                  }
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
}
 
export default OrderPage;