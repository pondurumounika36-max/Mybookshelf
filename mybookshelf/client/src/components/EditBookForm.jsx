import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBook } from '../api/books';
import { createBookSchema } from '../schemas';

function EditBookForm({ book, onCancel }) {
  const [formData, setFormData] = useState({
    title: book.title,
    author: book.author,
    genre: book.genre || '',
    rating: book.rating ?? '',
    status: book.status,
    notes: book.metadata?.notes || '',
  });

  const [errors, setErrors] = useState({});
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }) => updateBook(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      onCancel(); // Close the edit form
    },
    onError: (error) => {
      const backendErrors = error.response?.data?.details;
      if (backendErrors) {
        setErrors(backendErrors);
      } else {
        setErrors({ _form: ['Failed to update book'] });
      }
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const dataToValidate = {
      ...formData,
      rating: formData.rating === '' ? '' : Number(formData.rating),
    };

    const result = createBookSchema.safeParse(dataToValidate);

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    const { notes, ...rest } = result.data;
    const payload = {
      ...rest,
      metadata: notes ? { notes } : {},
    };

    if (payload.genre === '' || payload.genre === undefined) delete payload.genre;
    if (payload.rating === undefined) delete payload.rating;

    mutation.mutate({ id: book.id, data: payload });
  };

  const inputStyle = {
    width: '100%',
    padding: '6px',
    marginBottom: '4px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '13px',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '2px',
    fontSize: '12px',
    fontWeight: '600',
  };

  const errorStyle = { color: 'red', fontSize: '11px', margin: '0 0 4px 0' };

  return (
    <div>
      <label style={labelStyle}>Title</label>
      <input type="text" name="title" value={formData.title} onChange={handleChange} style={inputStyle} />
      {errors.title && <p style={errorStyle}>{errors.title[0]}</p>}

      <label style={labelStyle}>Author</label>
      <input type="text" name="author" value={formData.author} onChange={handleChange} style={inputStyle} />
      {errors.author && <p style={errorStyle}>{errors.author[0]}</p>}

      <label style={labelStyle}>Genre</label>
      <input type="text" name="genre" value={formData.genre} onChange={handleChange} style={inputStyle} />

      <label style={labelStyle}>Rating</label>
      <input type="number" name="rating" min="1" max="5" value={formData.rating} onChange={handleChange} style={inputStyle} />
      {errors.rating && <p style={errorStyle}>{errors.rating[0]}</p>}

      <label style={labelStyle}>Status</label>
      <select name="status" value={formData.status} onChange={handleChange} style={inputStyle}>
        <option value="want-to-read">Want to Read</option>
        <option value="reading">Reading</option>
        {/* The backend stores "completed" books as status="read" — keep the
            label friendly but the value must match ALLOWED_STATUSES in schemas.js. */}
        <option value="read">Completed</option>
      </select>
      {errors.status && <p style={errorStyle}>{errors.status[0]}</p>}

      <label style={labelStyle}>Notes</label>
      <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} style={inputStyle} />

      {errors._form && <p style={errorStyle}>{errors._form[0]}</p>}

      <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
        <button
          onClick={handleSubmit}
          disabled={mutation.isPending}
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '6px 12px',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          {mutation.isPending ? 'Saving...' : 'Save'}
        </button>
        <button
          onClick={onCancel}
          style={{
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '6px 12px',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default EditBookForm;