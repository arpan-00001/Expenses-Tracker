import './LoadingSpinner.css';

export default function LoadingSpinner({ fullPage = false, message = 'Loading...' }) {
  if (fullPage) {
    return (
      <div className="loading-fullpage">
        <div className="loading-content">
          <div className="spinner" />
          <p>{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="loading-inline">
      <div className="spinner" />
      <p>{message}</p>
    </div>
  );
}
