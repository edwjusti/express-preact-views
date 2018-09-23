import { h, Component } from 'preact';

function countTo(n) {
  const a = [];
  for (let i = 0; i < n; i++) {
    a.push(i + 1);
  }
  return a.join(', ');
}

class Index extends Component {
  render() {
    return (
      <div>
        <h1>{this.props.title}</h1>
        <p>Welcome to {this.props.title}</p>
        <p>
          I can count to 10:
          {countTo(10)}
        </p>
      </div>
    );
  }
}

export default Index;
