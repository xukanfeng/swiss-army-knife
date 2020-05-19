import { Card } from 'antd';
import myStyle from './HelloWorld.css';

// umi约定式路由，在page下的js文件按照文件名映射到路由，访问/helloworld对应该js文件
export default () => {
  const style = {
    width: '400px',
    margin: '30px',
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
    border: '1px solid #e8e8e8',
  }

  return (
    <>
      <div className={myStyle.hello}>
        Hello World!
      </div>
      <Card style={style} actions={[<a>取消</a>, <a>确定</a>]}>
        <Card.Meta
          title="antd course"
          description="antd组件：Card"
        />
      </Card>
    </>
  )
}