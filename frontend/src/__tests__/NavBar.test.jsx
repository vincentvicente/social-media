import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NavBar from '../component/NavBar';

describe('NavBar Component', () => {
  const mockOnLogout = jest.fn();

  const renderNavBar = (isLoggedIn = false, username = '') => {
    return render(
      <BrowserRouter>
        <NavBar 
          isLoggedIn={isLoggedIn} 
          username={username} 
          onLogout={mockOnLogout} 
        />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders navbar with brand name', () => {
    renderNavBar();
    
    expect(screen.getByText('Social Hub')).toBeInTheDocument();
  });

  test('renders Home and Profile links', () => {
    renderNavBar();
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  test('shows Login and Sign Up links when not logged in', () => {
    renderNavBar(false);
    
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  test('shows username and logout button when logged in', () => {
    renderNavBar(true, 'testuser');
    
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign Up')).not.toBeInTheDocument();
  });

  test('displays user avatar with first letter of username', () => {
    renderNavBar(true, 'testuser');
    
    const avatar = screen.getByText('T');
    expect(avatar).toBeInTheDocument();
  });

  test('has correct links', () => {
    renderNavBar();
    
    const homeLink = screen.getAllByRole('link', { name: /Home/i })[0];
    const profileLink = screen.getByRole('link', { name: /Profile/i });
    const loginLink = screen.getByRole('link', { name: /Login/i });
    const signUpLink = screen.getByRole('link', { name: /Sign Up/i });
    
    expect(homeLink).toHaveAttribute('href', '/');
    expect(profileLink).toHaveAttribute('href', '/user');
    expect(loginLink).toHaveAttribute('href', '/login');
    expect(signUpLink).toHaveAttribute('href', '/register');
  });
});

