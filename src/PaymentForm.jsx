import axios from 'axios';

const PaymentForm = () => {
    
  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const displayRazorpay = async () => {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    const result = await axios.post('http://localhost:8080/api/payment/orders');

    if (!result) {
      alert('Server error. Are you online?');
      return;
    }

    console.log("/orders, result: ", result);
    console.log("/orders, result.data: ", result.data);

    const { amount, id: order_id, currency } = result.data;

    const options = {
      "key": 'rzp_test_NksMT8cuHP8euC',
      "amount": amount.toString(),
      "currency": currency,
      "name": 'NxtDiv Technologies',
      "description": 'Test Transaction',
      "order_id": order_id,
      "handler": async function (response) {
        const data = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        };

        const result = await axios.post('http://localhost:8080/api/payment/success', data);

        alert(result.data.msg);
      },
      "prefill": {
        name: 'John Doe',
        email: 'john.doe@example.com',
        contact: '9999999999',
      },
      "notes": {
        address: 'Razorpay Corporate Office',
      },
      "theme": {
        color: '#61dafb',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div>
      <h2>Razorpay Integration in React</h2>
      <button onClick={displayRazorpay}>
        Pay Now
      </button>
    </div>
  );
};

export default PaymentForm;
