import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBooks, deleteBook } from '../api/books';
import EditBookForm from './EditBookForm';

// The backend stores statuses as short ids ("want-to-read", "reading", "read")
// but humans want to see prettier text. This map is the single source of truth
// for that translation — used by both the filter buttons and the card display.
const STATUS_LABELS = {
  'want-to-read': 'Want to Read',
  'reading': 'Reading',
  'read': 'Completed',
};

function BookList() {
  const [editingId, setEditingId] = useState(null);
  // Which status the user wants to see. "all" means no filter.
  const [filter, setFilter] = useState('all');
  const queryClient = useQueryClient();

  // The queryKey includes `filter` so React Query treats each filter value as
  // its own cached result — switching filters refetches (or pulls from cache)
  // instead of showing stale data. We wrap getBooks in an arrow so we can pass
  // the current filter through.
  const { data: books, isLoading, isError, error } = useQuery({
    queryKey: ['books', filter],
    queryFn: () => getBooks(filter),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });

  const handleDelete = (book) => {
    if (window.confirm(`Delete "${book.title}"?`)) {
      deleteMutation.mutate(book.id);
    }
  };

  if (isLoading) return <p>Loading books...</p>;
  if (isError) return <p style={{ color: 'red' }}>Error: {error.message}</p>;

  // We intentionally DON'T early-return when books is empty anymore.
  // If we did, the filter buttons below would disappear too, and the user
  // would have no way to switch back to "All". Instead we always render
  // the buttons and show the empty message *inside* the return.
  const isEmpty = !books || books.length === 0;

  // Style helper for the filter buttons. The `isActive` flag flips the colors
  // so the currently-selected filter looks "pressed in" (blue background, white text).
  const filterButtonStyle = (isActive) => ({
    padding: '6px 12px',
    marginRight: '6px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    backgroundColor: isActive ? '#4a90e2' : 'white',
    color: isActive ? 'white' : '#333',
    cursor: 'pointer',
    fontSize: '13px',
  });

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <button onClick={() => setFilter('all')} style={filterButtonStyle(filter === 'all')}>
          All
        </button>
        <button onClick={() => setFilter('want-to-read')} style={filterButtonStyle(filter === 'want-to-read')}>
          Want to Read
        </button>
        <button onClick={() => setFilter('reading')} style={filterButtonStyle(filter === 'reading')}>
          Reading
        </button>
        <button onClick={() => setFilter('read')} style={filterButtonStyle(filter === 'read')}>
          Completed
        </button>
      </div>

      <h2>My Books ({isEmpty ? 0 : books.length})</h2>

      {isEmpty ? (
        // Two different empty messages depending on whether the user has
        // truly no books, or just no books matching the current filter.
        // The second case is way less confusing than "No books yet" when
        // they're staring at a filter button they just clicked.
        <p style={{ color: '#666' }}>
          {filter === 'all'
            ? 'No books yet. Add your first one!'
            : 'No books match this filter. Try a different one above.'}
        </p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
        {books.map((book) => (
          <li
            key={book.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '8px',
            }}
          >
            {editingId === book.id ? (
              <EditBookForm book={book} onCancel={() => setEditingId(null)} />
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 4px 0' }}>{book.title}</h3>
                  <p style={{ margin: '0 0 4px 0', color: '#666' }}>by {book.author}</p>
                  <p style={{ margin: 0, fontSize: '0.9em' }}>
                    {/* Fall back to the raw value if the status isn't in our map
                        (e.g. a future status we haven't added a label for yet). */}
                    Status: <strong>{STATUS_LABELS[book.status] || book.status}</strong>
                    {book.rating && <> | Rating: {'⭐'.repeat(book.rating)}</>}
                    {book.genre && <> | {book.genre}</>}
                  </p>
                  {book.metadata?.notes && (
                    <p style={{ margin: '8px 0 0 0', fontSize: '0.85em', fontStyle: 'italic', color: '#555' }}>
                      📝 {book.metadata.notes}
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '6px', marginLeft: '12px' }}>
                  <button
                    onClick={() => setEditingId(book.id)}
                    style={{
                      backgroundColor: '#4a90e2',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(book)}
                    disabled={deleteMutation.isPending}
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
        </ul>
      )}
    </div>
  );
}

export default BookList;