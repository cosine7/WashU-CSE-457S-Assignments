import { createHashRouter, Navigate } from 'react-router-dom';
import App from '../App';
import ElectoralMap from '../pages/ElectoralMap';

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
      element: <h2>studios</h2>,
    },
    {
      path: '',
      element: <Navigate to="/electoral-map" />,
    },
  ],
}], {
  basename: import.meta.BASE_URL,
});
