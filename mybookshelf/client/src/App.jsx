import BookForm from './components/BookForm';
import BookList from './components/BookList';
import StatsCard from './components/StatsCard';

function App() {
  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1>📚 MyBookShelf</h1>
      <p>Track the books you've read, are reading, or want to read.</p>
      <hr />
      <StatsCard />
      <BookForm />
      <BookList />
    </div>
  );
}

export default App;