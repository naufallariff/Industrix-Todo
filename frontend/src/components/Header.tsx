import React from 'react';
import { Layout, Typography, Space } from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

const Header: React.FC = () => {
  return (
    <AntHeader className="app-header">
      <div className="header-content">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img src="/assets/logo.png" alt="logo" style={{ height: '32px', display: 'block' }} />
            <Title level={3} className="gradient-text" style={{ margin: 0 }}>
              Industrix Todo
            </Title>
          </div>
        </motion.div>
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <Space size="large">
            <a
              href="https://github.com/naufallariff/Industrix-Todo"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'inherit' }}
            >
              <GithubOutlined style={{ fontSize: '24px' }} />
            </a>
          </Space>
        </motion.div>
      </div>
    </AntHeader>
  );
};

export default Header;
