import { useState, useEffect } from 'react';

const randomNumber = (start, end) => Math.floor(Math.random() * end) + start;

const products = [
  { product: 'coffee', price: '3.40' },
  { product: 'tea', price: '2.20' },
];

export default function CoffeeShop() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let newOrderTimer = null;
    let processOrderTimer = null;

    const newOrder = () => {
      for (let i = 0; i < randomNumber(1, 3); i++) {
        if (orders.length < 10) {
          const product = products[Math.floor(Math.random() * products.length)];
          setOrders(previous => [...previous, product]);
        }
      }
      newOrderTimer = setTimeout(newOrder, randomNumber(1000, 4000));
    };

    const processOrder = () => {
      for (let i = 0; i < randomNumber(1, 3); i++) {
        setOrders(previous => previous.slice(1, Infinity));
      }
      processOrderTimer = setTimeout(processOrder, randomNumber(1000, 5000));
    };

    newOrder();
    processOrderTimer = setTimeout(processOrder, 3000);

    return () => {
      clearTimeout(newOrderTimer);
      clearTimeout(processOrderTimer);
    };
  }, []);

  return (
    <>
      <h3>Coffee Shop - Queue Simulation</h3>
      <h4>Visualizing how customer orders are processed at a coffee shop</h4>
      <svg width={600} height={100}>
        <text
          x={0}
          y={50}
          dominantBaseline="central"
        >
          Orders:
          {' '}
          {orders.length}
        </text>
        {orders.map((order, i) => (
          <circle
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            cx={i * 30 + 100}
            cy={50}
            r={10}
            fill={order.product === 'coffee' ? 'brown' : '#bfa'}
          />
        ))}
      </svg>
    </>
  );
}
