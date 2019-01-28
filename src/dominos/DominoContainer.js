import { Container } from 'unstated';

export default class DominoContainer extends Container {
  state = {
    speed: 1500,
  }

  setSpeed = speed => this.setState({ speed });
}