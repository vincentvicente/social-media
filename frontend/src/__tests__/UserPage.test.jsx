import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UserPage from '../pages/UserPage';
import { StatusContext } from '../component/StatusContext';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

global.fetch = jest.fn();
global.confirm = jest.fn();
global.prompt = jest.fn();

describe('UserPage Component', () => {
  const mockSetStatuses = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockClear();
    localStorage.clear();
    global.confirm.mockReturnValue(false);
    global.prompt.mockReturnValue(null);
  });

  const renderUserPage = (isLoggedIn = true, statuses = []) => {
    if (isLoggedIn) {
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('userId', 'user123');
      localStorage.setItem('username', 'testuser');
    }

    return render(
      <BrowserRouter>
        <StatusContext.Provider value={{ statuses, setStatuses: mockSetStatuses }}>
          <UserPage isLoggedIn={isLoggedIn} />
        </StatusContext.Provider>
      </BrowserRouter>
    );
  };

  test('shows error when not logged in', async () => {
    renderUserPage(false);
    
    await waitFor(() => {
      expect(screen.getByText(/You must log in to view this page/i)).toBeInTheDocument();
    });
  });

  test('shows loading state initially', () => {
    global.fetch.mockImplementation(() => new Promise(() => {}));
    
    renderUserPage();
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('fetches and displays user data', async () => {
    const mockUserData = {
      user: {
        _id: 'user123',
        username: 'testuser',
        description: 'Test user description',
        createdAt: new Date().toISOString()
      },
      statuses: [
        {
          _id: 'status1',
          content: 'Test status 1',
          createdAt: new Date().toISOString()
        }
      ]
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserData
    });

    renderUserPage();

    await waitFor(() => {
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(screen.getByText('Test user description')).toBeInTheDocument();
      expect(screen.getByText('Test status 1')).toBeInTheDocument();
    });
  });

  test('shows edit description button when logged in as the user', async () => {
    const mockUserData = {
      user: {
        _id: 'user123',
        username: 'testuser',
        description: 'Test description',
        createdAt: new Date().toISOString()
      },
      statuses: []
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserData
    });

    renderUserPage();

    await waitFor(() => {
      expect(screen.getByText('Edit Description')).toBeInTheDocument();
    });
  });

  test('toggles edit description mode', async () => {
    const mockUserData = {
      user: {
        _id: 'user123',
        username: 'testuser',
        description: 'Original description',
        createdAt: new Date().toISOString()
      },
      statuses: []
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserData
    });

    renderUserPage();

    await waitFor(() => {
      expect(screen.getByText('Edit Description')).toBeInTheDocument();
    });

    const editButton = screen.getByText('Edit Description');
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByText('Cancel Edit')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByText('Save')).toBeInTheDocument();
    });
  });

  test('saves updated description', async () => {
    const mockUserData = {
      user: {
        _id: 'user123',
        username: 'testuser',
        description: 'Original description',
        createdAt: new Date().toISOString()
      },
      statuses: []
    };

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserData
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Description updated' })
      });

    renderUserPage();

    await waitFor(() => {
      expect(screen.getByText('Edit Description')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Edit Description'));

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Updated description' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/users/user123/description',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ description: 'Updated description' })
        })
      );
    });
  });

  test('prompts for edit when edit button is clicked on status', async () => {
    const mockUserData = {
      user: {
        _id: 'user123',
        username: 'testuser',
        description: 'Test description',
        createdAt: new Date().toISOString()
      },
      statuses: [
        {
          _id: 'status1',
          content: 'Original content',
          createdAt: new Date().toISOString()
        }
      ]
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserData
    });

    global.prompt.mockReturnValue('Updated content');

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: {
          _id: 'status1',
          content: 'Updated content',
          createdAt: new Date().toISOString()
        }
      })
    });

    const mockStatuses = [
      {
        _id: 'status1',
        content: 'Original content',
        createdAt: new Date().toISOString()
      }
    ];

    renderUserPage(true, mockStatuses);

    await waitFor(() => {
      expect(screen.getByText('Original content')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);

    expect(global.prompt).toHaveBeenCalledWith('Edit your status:');
  });

  test('confirms before deleting status', async () => {
    const mockUserData = {
      user: {
        _id: 'user123',
        username: 'testuser',
        description: 'Test description',
        createdAt: new Date().toISOString()
      },
      statuses: [
        {
          _id: 'status1',
          content: 'Status to delete',
          createdAt: new Date().toISOString()
        }
      ]
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserData
    });

    const mockStatuses = [
      {
        _id: 'status1',
        content: 'Status to delete',
        createdAt: new Date().toISOString()
      }
    ];

    renderUserPage(true, mockStatuses);

    await waitFor(() => {
      expect(screen.getByText('Status to delete')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this status?');
  });

  test('handles fetch error', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    renderUserPage();

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  test('shows default message when no description', async () => {
    const mockUserData = {
      user: {
        _id: 'user123',
        username: 'testuser',
        description: '',
        createdAt: new Date().toISOString()
      },
      statuses: []
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserData
    });

    renderUserPage();

    await waitFor(() => {
      expect(screen.getByText('No description provided')).toBeInTheDocument();
    });
  });

  test('renders StatusForm when logged in as the user', async () => {
    const mockUserData = {
      user: {
        _id: 'user123',
        username: 'testuser',
        description: 'Test description',
        createdAt: new Date().toISOString()
      },
      statuses: []
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserData
    });

    renderUserPage();

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/What's on your mind/i)).toBeInTheDocument();
    });
  });
});

