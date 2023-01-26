import PropTypes from 'prop-types';
import Loading from '../../../components/Loading';

export default function Pending({ data, render }) {
  if (data) {
    return render(data);
  }
  return <Loading />;
}

Pending.propTypes = {
  data: PropTypes.any,
  render: PropTypes.func.isRequired,
};

Pending.defaultProps = {
  data: null,
};
