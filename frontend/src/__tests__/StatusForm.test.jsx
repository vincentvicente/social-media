import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StatusForm from '../component/StatusForm';
import { StatusContext } from '../component/StatusContext';

global.fetch = jest.fn();
global.alert = jest.fn();

describe('StatusForm Component', () => {
  const mockAddStatus = jest.fn();
  const mockUserId = 'user123';

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockClear();
    global.alert.mockClear();
    localStorage.setItem('token', 'mock-token');
  });

  const renderStatusForm = () => {
    return render(
      <StatusContext.Provider value={{ addStatus: mockAddStatus }}>
        <StatusForm userId={mockUserId} />
      </StatusContext.Provider>
    );
  };

  test('renders status form with placeholder', () => {
    renderStatusForm();
    
    expect(screen.getByPlaceholderText(/What's on your mind/i)).toBeInTheDocument();
    expect(screen.getByText(/Share Your Thoughts/i)).toBeInTheDocument();
  });

  test('updates textarea value when typing', () => {
    renderStatusForm();
    
    const textarea = screen.getByPlaceholderText(/What's on your mind/i);
    fireEvent.change(textarea, { target: { value: 'New status content' } });
    
    expect(textarea.value).toBe('New status content');
  });

  test('submit button is disabled when textarea is empty', () => {
    renderStatusForm();
    
    const submitButton = screen.getByRole('button', { name: /Post/i });
    expect(submitButton).toBeDisabled();
  });

  test('submit button is enabled when textarea has content', () => {
    renderStatusForm();
    
    const textarea = screen.getByPlaceholderText(/What's on your mind/i);
    fireEvent.change(textarea, { target: { value: 'New status' } });
    
    const submitButton = screen.getByRole('button', { name: /Post/i });
    expect(submitButton).not.toBeDisabled();
  });

  test('displays character counter when approaching limit', () => {
    renderStatusForm();
    
    const textarea = screen.getByPlaceholderText(/What's on your mind/i);
    const longText = 'a'.repeat(265); // 15 chars remaining
    fireEvent.change(textarea, { target: { value: longText } });
    
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  test('disables submit when over character limit', () => {
    renderStatusForm();
    
    const textarea = screen.getByPlaceholderText(/What's on your mind/i);
    const tooLongText = 'a'.repeat(281); // Over 280 limit
    fireEvent.change(textarea, { target: { value: tooLongText } });
    
    const submitButton = screen.getByRole('button', { name: /Post/i });
    expect(submitButton).toBeDisabled();
  });

  test('successfully submits status', async () => {
    const mockNewStatus = {
      _id: 'status123',
      content: 'New status',
      userId: mockUserId,
      createdAt: new Date().toISOString()
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ newStatus: mockNewStatus })
    });

    renderStatusForm();
    
    const textarea = screen.getByPlaceholderText(/What's on your mind/i);
    fireEvent.change(textarea, { target: { value: 'New status' } });
    
    const submitButton = screen.getByRole('button', { name: /Post/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/statuses',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer mock-token',
          },
          body: JSON.stringify({ userId: mockUserId, content: 'New status' })
        })
      );
    });

    await waitFor(() => {
      expect(mockAddStatus).toHaveBeenCalledWith(mockNewStatus);
      expect(textarea.value).toBe('');
    });
  });

  test('shows error alert when submission fails', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    renderStatusForm();
    
    const textarea = screen.getByPlaceholderText(/What's on your mind/i);
    fireEvent.change(textarea, { target: { value: 'New status' } });
    
    const submitButton = screen.getByRole('button', { name: /Post/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Failed to post. Please try again!');
    });
  });

  test('shows posting state while submitting', async () => {
    global.fetch.mockImplementation(() => new Promise(() => {})); // Never resolves

    renderStatusForm();
    
    const textarea = screen.getByPlaceholderText(/What's on your mind/i);
    fireEvent.change(textarea, { target: { value: 'New status' } });
    
    const submitButton = screen.getByRole('button', { name: /Post/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Posting.../i)).toBeInTheDocument();
    });
  });
});

