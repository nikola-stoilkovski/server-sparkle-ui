
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Layout as AntLayout, theme } from 'antd';

const { Content } = AntLayout;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('fadeIn');
  const { token } = theme.useToken();

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage('fadeOut');
      setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('fadeIn');
      }, 300);
    }
  }, [location, displayLocation]);

  return (
    <AntLayout style={{ minHeight: '100vh', background: token.colorBgContainer }}>
      <Content style={{ margin: '24px auto', maxWidth: '1200px', padding: '0 24px' }}>
        <div
          style={{
            transition: 'opacity 300ms',
            opacity: transitionStage === 'fadeIn' ? 1 : 0,
          }}
        >
          {children}
        </div>
      </Content>
    </AntLayout>
  );
};

export default Layout;
