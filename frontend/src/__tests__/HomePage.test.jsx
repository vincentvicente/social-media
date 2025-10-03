import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';

// Mock fetch
global.fetch = jest.fn();

describe('HomePage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockClear();
    localStorage.clear();
  });

  const renderHomePage = () => {
    return render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
  };

  test('renders homepage header', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    renderHomePage();
    
    await waitFor(() => {
      expect(screen.getByText('🌟 Latest Updates')).toBeInTheDocument();
    });
  });

  test('displays loading state initially', () => {
    global.fetch.mockImplementation(() => new Promise(() => {}));
    
    renderHomePage();
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('fetches and displays statuses', async () => {
    const mockStatuses = [
      {
        _id: '1',
        content: 'Test status 1',
        userId: { username: 'testuser1' },
        createdAt: new Date().toISOString(),
        likes: [],
        likesCount: 0
      },
      {
        _id: '2',
        content: 'Test status 2',
        userId: { username: 'testuser2' },
        createdAt: new Date().toISOString(),
        likes: [],
        likesCount: 5
      }
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockStatuses
    });

    renderHomePage();

    await waitFor(() => {
      expect(screen.getByText('Test status 1')).toBeInTheDocument();
      expect(screen.getByText('Test status 2')).toBeInTheDocument();
      expect(screen.getByText('testuser1')).toBeInTheDocument();
      expect(screen.getByText('testuser2')).toBeInTheDocument();
    });
  });

  test('displays error message when fetch fails', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

    renderHomePage();

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
    });
  });

  test('displays no posts message when there are no statuses', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    renderHomePage();

    await waitFor(() => {
      expect(screen.getByText(/No posts yet/i)).toBeInTheDocument();
    });
  });

  test('search functionality filters statuses', async () => {
    const mockStatuses = [
      {
        _id: '1',
        content: 'React is awesome',
        userId: { username: 'reactdev' },
        createdAt: new Date().toISOString(),
        likes: [],
        likesCount: 0
      },
      {
        _id: '2',
        content: 'Node.js is great',
        userId: { username: 'nodedev' },
        createdAt: new Date().toISOString(),
        likes: [],
        likesCount: 0
      }
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockStatuses
    });

    renderHomePage();

    await waitFor(() => {
      expect(screen.getByText('React is awesome')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search posts or users/i);
    fireEvent.change(searchInput, { target: { value: 'React' } });

    await waitFor(() => {
      expect(screen.getByText('React is awesome')).toBeInTheDocument();
      expect(screen.queryByText('Node.js is great')).not.toBeInTheDocument();
    });
  });

  test('like button shows alert when not logged in', async () => {
    const mockStatuses = [
      {
        _id: '1',
        content: 'Test status',
        userId: { username: 'testuser' },
        createdAt: new Date().toISOString(),
        likes: [],
        likesCount: 0
      }
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockStatuses
    });

    global.alert = jest.fn();

    renderHomePage();

    await waitFor(() => {
      expect(screen.getByText('Test status')).toBeInTheDocument();
    });

    const likeButton = screen.getByText('🤍');
    fireEvent.click(likeButton);

    expect(global.alert).toHaveBeenCalledWith('Please login to like posts!');
  });
});

