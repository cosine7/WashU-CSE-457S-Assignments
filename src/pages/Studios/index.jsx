import { NavLink, Outlet } from 'react-router-dom';
import './index.scss';

const studios = [3, 4, 5, 6, 7, 8, 9, 10];

export default function Studios() {
  return (
    <div className="studios-wrapper">
      <aside>
        {studios.map(studio => (
          <NavLink
            key={studio}
            to={`${studio}`}
            className={({ isActive }) => `sidebar-item${isActive ? ' sidebar-item-active' : ''}`}
          >
            Studio
            {' '}
            {studio}
          </NavLink>
        ))}
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
