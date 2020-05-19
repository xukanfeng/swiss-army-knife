import React, { Component } from 'react';
import { Card, Button } from 'antd';
import { connect } from 'umi';

const namespace = 'PuzzleCards'

const mapStateToProps = state => {
  const cardList = state[namespace].data
  return {
    cardList,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onDidMount: () => {
      dispatch({
        type: `${namespace}/queryInitCards`,
      })
    },
    onClickAdd: () => {
      const action = {
        type: `${namespace}/addCard`,
        payload: {},
      }
      dispatch(action)
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class PuzzleCardsPage extends Component {
  componentDidMount() {
    this.props.onDidMount()
  }
  render() {
    return (
      <div>
        {
          this.props.cardList.map(card => {
            return (
              <Card key={card.id} style={{ margin: '10px 0' }}>
                <div>Q:{card.setup}</div>
                <div>
                  <strong>A:{card.punchline}</strong>
                </div>
              </Card>
            )
          })
        }
        <div>
          <Button onClick={() => this.props.onClickAdd()}>添加卡片</Button>
        </div>
      </div>
    )
  }
}