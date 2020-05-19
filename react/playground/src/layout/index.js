import { Component } from 'react';
import { Link } from 'umi';
import { Layout, Menu } from 'antd';
import { DashboardOutlined } from '@ant-design/icons';

const { Header, Footer, Sider, Content} = Layout;
const { SubMenu } = Menu;

class BasicLayout extends Component {
  render() {
    return (
      <Layout>
        <Sider width={256} style={{ minHeight: '100vh', color: 'white' }}>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key='1'>
              <span>菜单一</span>
            </Menu.Item>
            <SubMenu key="sub1"
              title={
                <span>
                  <DashboardOutlined />
                  <span>菜单二</span>
                </span>
              }
            >
              <Menu.Item key="2"><Link to="/dashboard/analysis">分析页</Link></Menu.Item>
              <Menu.Item key="3"><Link to="/dashboard/monitor">监控页</Link></Menu.Item>
              <Menu.Item key="4"><Link to="/dashboard/workplace">工作台</Link></Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', textAlign: 'center', padding: 0 }}>Header</Header>
          <Content style={{ margin: '24px 16px 0' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              {this.props.children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Footer</Footer>
        </Layout>
      </Layout>
    )
  }
}

export default BasicLayout;