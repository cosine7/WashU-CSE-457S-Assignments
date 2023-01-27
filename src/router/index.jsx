import { createHashRouter, Navigate } from 'react-router-dom';
import App from '../App';
import ElectoralMap from '../pages/ElectoralMap';
import Studios from '../pages/Studios';
import Studio3 from '../pages/Studios/Studio3';
import Studio4 from '../pages/Studios/Studio4';
import Studio5 from '../pages/Studios/Studio5';

export default createHashRouter([{
  path: '/',
  element: <App />,
  children: [
    {
      path: 'electoral-map',
      element: <ElectoralMap />,
    },
    {
      path: 'once-upon-a-time',
      element: <h2>once time</h2>,
    },
    {
      path: 'studios',
      element: <Studios />,
      children: [
        {
          path: '3',
          element: <Studio3 />,
        },
        {
          path: '4',
          element: <Studio4 />,
        },
        {
          path: '5',
          element: <Studio5 />,
        },
        {
          path: '6',
          element: <h2>6</h2>,
        },
        {
          path: '7',
          element: <h2>7</h2>,
        },
        {
          path: '8',
          element: <h2>8</h2>,
        },
        {
          path: '9',
          element: <h2>9</h2>,
        },
        {
          path: '10',
          element: <h2>10</h2>,
        },
        {
          path: '',
          element: <Navigate to="./3" />,
        },
      ],
    },
    {
      path: '',
      element: <Navigate to="/electoral-map" />,
    },
  ],
}], {
  basename: import.meta.BASE_URL,
});
