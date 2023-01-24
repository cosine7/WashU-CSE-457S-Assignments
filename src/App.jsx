import { NavLink, Outlet } from 'react-router-dom';
import { BsMap } from 'react-icons/bs';
import { BiAnalyse } from 'react-icons/bi';
import { MdGesture } from 'react-icons/md';

const items = [
  { path: 'electoral-map', text: 'Electoral Map', icon: <BsMap /> },
  { path: 'once-upon-a-time', text: 'Once Upon a Time', icon: <BiAnalyse /> },
  { path: 'studios', text: 'Studios', icon: <MdGesture /> },
];

export default function App() {
  return (
    <>
      <nav>
        <h1>WashU CSE457S Assignments</h1>
        <div className="nav-item-wrapper">
          {items.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item${isActive ? ' nav-item-active' : ''}`}
            >
              {item.icon}
              {item.text}
            </NavLink>
          ))}
        </div>
      </nav>
      <Outlet />
    </>
  );
}
