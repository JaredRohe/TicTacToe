import Button from 'react-bootstrap/Button';
import React from 'react';
class Square extends React.Component {

    getStyles(i) {
        const border = '3px solid white';
        const styles = {
            width: '100%',
            height: '100%',
            borderLeft: new Set([0,3,6]).has(i) ? 'none': border,
            borderTop: new Set([0,1,2]).has(i) ? 'none': border,
            borderRight: new Set([2,5,8]).has(i) ? 'none': border,
            borderBottom: new Set([6,7,8]).has(i) ? 'none': border,
            borderRadius: 0,
            fontSize: '88px',
        }

        return styles;
    }

    getClasses() {
        const classes = [];
        if(this.props.value){
            classes.push('btnDisabled');
        }
        if(this.props.winningPlayerSquare !==undefined){
            classes.push(this.props.winningPlayerSquare ? 'btnPlayerWin' : 'btnPlayerLoss')
        }

        return classes.join(' ');
    }

    render() {
      return (
        <Button
        style = {this.getStyles(this.props.position)}
        className={this.getClasses() }
        onClick={() => this.props.onClick()}
        >
          {this.props.value}
        </Button>
      );
    }
  }

export default Square;