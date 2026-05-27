import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBook } from '../api/books';
import { createBookSchema } from '../schemas';

function BookForm() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    rating: '',
    status: 'want-to-read',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const queryClient = useQueryClient();

  // useMutation handles the "create" API call
  const mutation = useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      // After a successful create, refetch the books list automatically
      queryClient.invalidateQueries({ queryKey: ['books'] });
      // Reset the form
      setFormData({
        title: '',
        author: '',
        genre: '',
        rating: '',
        status: 'want-to-read',
        notes: '',
      });
      setErrors({});
    },
    onError: (error) => {
      // The backend may respond in two shapes:
      //   - Zod validation errors: { error, details: { field: ["msg"] } }
      //   - General errors:        { error: "Some message" }
      // If neither is present (e.g. network down), fall back to a generic message.
      const backendDetails = error.response?.data?.details;
      const backendMessage = error.response?.data?.error;
      if (backendDetails) {
        setErrors(backendDetails);
      } else if (backendMessage) {
        setErrors({ _form: [backendMessage] });
      } else {
        setErrors({ _form: ['Failed to save book. Is the server running?'] });
      }
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert rating string to number; if empty, leave it out so the
    // optional() check in the schema is satisfied (undefined, not '').
    const dataToValidate = {
      ...formData,
      rating: formData.rating === '' ? undefined : Number(formData.rating),
    };

    // Validate with Zod
    const result = createBookSchema.safeParse(dataToValidate);

    if (!result.success) {
      // Show validation errors
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    // Restructure data: move "notes" into metadata
    const { notes, ...rest } = result.data;
    const payload = {
      ...rest,
      metadata: notes ? { notes } : {},
    };

    // Remove empty optional fields so backend uses defaults
    if (payload.genre === '' || payload.genre === undefined) delete payload.genre;
    if (payload.rating === undefined) delete payload.rating;

    mutation.mutate(payload);
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    marginBottom: '4px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box',
  };

  const errorStyle = {
    color: 'red',
    fontSize: '12px',
    marginBottom: '8px',
    marginTop: '0',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '4px',
    fontWeight: '600',
    fontSize: '14px',
  };

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '24px' }}>
      <h2 style={{ marginTop: 0 }}>Add a New Book</h2>

      <div>
        <label style={labelStyle}>Title *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          style={inputStyle}
        />
        {errors.title && <p style={errorStyle}>{errors.title[0]}</p>}

        <label style={labelStyle}>Author *</label>
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          style={inputStyle}
        />
        {errors.author && <p style={errorStyle}>{errors.author[0]}</p>}

        <label style={labelStyle}>Genre</label>
        <input
          type="text"
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          style={inputStyle}
        />
        {errors.genre && <p style={errorStyle}>{errors.genre[0]}</p>}

        <label style={labelStyle}>Rating (1-5)</label>
        <input
          type="number"
          name="rating"
          min="1"
          max="5"
          value={formData.rating}
          onChange={handleChange}
          style={inputStyle}
        />
        {errors.rating && <p style={errorStyle}>{errors.rating[0]}</p>}

        <label style={labelStyle}>Status *</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="want-to-read">Want to Read</option>
          <option value="reading">Reading</option>
          <option value="read">Completed</option>
        </select>
        {errors.status && <p style={errorStyle}>{errors.status[0]}</p>}

        <label style={labelStyle}>Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          style={inputStyle}
        />
        {errors.notes && <p style={errorStyle}>{errors.notes[0]}</p>}

        {errors._form && <p style={errorStyle}>{errors._form[0]}</p>}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={mutation.isPending}
          style={{
            backgroundColor: '#4a90e2',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            cursor: mutation.isPending ? 'not-allowed' : 'pointer',
            marginTop: '8px',
          }}
        >
          {mutation.isPending ? 'Saving...' : 'Add Book'}
        </button>
      </div>
    </div>
  );
}

export default BookForm;