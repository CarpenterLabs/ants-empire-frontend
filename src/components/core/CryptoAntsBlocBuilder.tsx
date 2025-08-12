import React from "react";

class CryptoAntsBlocBuilder extends React.Component<{ initialValue?: any; subject: any; builder: any }, any> {
  //-1 waiting
  //0 active
  //1 done

  private subscription: any;

  constructor(props: any) {
    super(props);
    this.state = {
      snapshot: {
        data: null,
        connectionState: -1,
        error: null,
      },
    };

    this.subscription = null;
  }

  componentDidMount() {
    this.subscription = this.props.subject.subscribe(
      (data: any) => {
        this.setState({
          snapshot: {
            data: data,
            connectionState: 0,
            error: null,
          },
        });
      },
      (error: any) => {
        this.setState({
          snapshot: {
            data: null,
            connectionState: 1,
            error: error,
          },
        });
      },
      () => {
        this.setState({
          snapshot: {
            data: null,
            connectionState: 1,
            error: null,
          },
        });
      }
    );
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  render() {
    return this.props.builder(this.state.snapshot);
  }
}

export default CryptoAntsBlocBuilder;
