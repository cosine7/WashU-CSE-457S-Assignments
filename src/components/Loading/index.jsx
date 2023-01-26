import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import './index.scss';

export default function Loading() {
  return (
    <div className="pending-wrapper">
      <AiOutlineLoading3Quarters className="spinner" />
    </div>
  );
}
