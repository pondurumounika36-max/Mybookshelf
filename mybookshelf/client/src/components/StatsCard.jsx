// StatsCard.jsx
// Shows a summary of book counts by status at the top of the page.
// Reads from React Query's cache — no extra network call when the list
// is already loaded with filter="all".

import { useQuery } from '@tanstack/react-query';
import { getBooks } from '../api/books';

function StatsCard() {
  // Always fetch ALL books for stats, regardless of which filter the list
  // is showing. React Query will share this result with any other component
  // that uses the same queryKey ['books', 'all'].
  const { data: books, isLoading } = useQuery({
    queryKey: ['books', 'all'],
    queryFn: () => getBooks('all'),
  });

  if (isLoading || !books) {
    return null; // don't show anything while loading
  }

  // Calculate counts in JavaScript. Note: the backend stores "completed"
  // books with status="read" (see ALLOWED_STATUSES in schemas.js) —
  // that's why we compare against 'read', not 'completed'.
  const total = books.length;
  const reading = books.filter((b) => b.status === 'reading').length;
  const completed = books.filter((b) => b.status === 'completed').length;
  const wantToRead = books.filter((b) => b.status === 'want-to-read').length;

  const cardStyle = {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    padding: '16px',
    backgroundColor: '#f5f7fa',
    border: '1px solid #e0e6ed',
    borderRadius: '8px',
    marginBottom: '24px',
  };

  const statStyle = {
    flex: '1',
    minWidth: '90px',
    textAlign: 'center',
  };

  const numberStyle = {
    fontSize: '28px',
    fontWeight: '700',
    margin: 0,
    color: '#2c3e50',
  };

  const labelStyle = {
    fontSize: '12px',
    color: '#7f8c8d',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    margin: '4px 0 0 0',
  };

  return (
    <div style={cardStyle}>
      <div style={statStyle}>
        <p style={numberStyle}>📚 {total}</p>
        <p style={labelStyle}>Total</p>
      </div>
      <div style={statStyle}>
        <p style={numberStyle}>📖 {reading}</p>
        <p style={labelStyle}>Reading</p>
      </div>
      <div style={statStyle}>
        <p style={numberStyle}>✅ {completed}</p>
        <p style={labelStyle}>Completed</p>
      </div>
      <div style={statStyle}>
        <p style={numberStyle}>🎯 {wantToRead}</p>
        <p style={labelStyle}>Want to Read</p>
      </div>
    </div>
  );
}

export default StatsCard;
