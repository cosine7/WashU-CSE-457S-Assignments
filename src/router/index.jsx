import { createHashRouter, Navigate } from 'react-router-dom';
import App from '../App';
import ElectoralMap from '../pages/ElectoralMap';
import Studios from '../pages/Studios';
import Studio3 from '../pages/Studios/Studio3';
import Studio4 from '../pages/Studios/Studio4';
import Studio5 from '../pages/Studios/Studio5';
import Studio6 from '../pages/Studios/Studio6';
import Studio7 from '../pages/Studios/Studio7';
import Studio8 from '../pages/Studios/Studio8';
import Studio9 from '../pages/Studios/Studio9';

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
          element: <Studio6 />,
        },
        {
          path: '7',
          element: <Studio7 />,
        },
        {
          path: '8',
          element: <Studio8 />,
        },
        {
          path: '9',
          element: <Studio9 />,
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
