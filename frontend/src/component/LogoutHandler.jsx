import { useNavigate } from 'react-router-dom';

const LogoutHandler = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(); // 调用父组件传递的清理逻辑
    navigate('/login'); // 重定向到登录页面
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutHandler;
