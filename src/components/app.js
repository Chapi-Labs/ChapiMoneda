import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Image,
  View,
  Platform,
  Dimensions,
} from 'react-native';
import { Container, Content, Footer, List, ListItem, Button, Icon, Picker, Text, InputGroup, Input } from 'native-base';
import theme from '../theme/theme';
const Item = Picker.Item;
const { height, width } = Dimensions.get('window');
const vertical = require('./../../assets/img/background-vertical.png');
const horizontal = require('./../../assets/img/background-horizontal.png');
import { AdMobInterstitial, AdMobBanner } from 'react-native-admob';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bannerSize: 'smartBannerPortrait',
      layout: {
        height: height,
        width: width,
        image: height > width ? vertical: horizontal
      },
      selectedItem: undefined,
      selected1: 'key0',
      results: {
          items: [],
      },
    };
    this.setBannerSize = this.setBannerSize.bind(this);
  }

  renderDimensions(relayout) {
    console.log(relayout);
    this.setState({
      layout: {
        height: relayout.height,
        width:  relayout.width,
        image:  relayout.height > relayout.width ? vertical: horizontal
      }
    });
    console.log(this.state);
  }

  componentDidMount() {
    AdMobInterstitial.setTestDeviceID('EMULATOR');
    AdMobInterstitial.setAdUnitID('ca-app-pub-3940256099942544/1033173712');

    AdMobInterstitial.addEventListener('interstitialDidLoad',
      () => console.log('interstitialDidLoad event'));
    AdMobInterstitial.addEventListener('interstitialDidClose',
      this.interstitialDidClose);
    AdMobInterstitial.addEventListener('interstitialDidFailToLoad',
      () => console.log('interstitialDidFailToLoad event'));
    AdMobInterstitial.addEventListener('interstitialDidOpen',
      () => console.log('interstitialDidOpen event'));
    AdMobInterstitial.addEventListener('interstitialWillLeaveApplication',
      () => console.log('interstitalWillLeaveApplication event'));

    AdMobInterstitial.requestAd((error) => error && console.log(error));
  }

  componentWillUnmount() {
    AdMobInterstitial.removeAllListeners();
  }

  interstitialDidClose() {
    console.log('interstitialDidClose event');
    AdMobInterstitial.requestAd((error) => error && console.log(error));
  }

  showInterstital() {
    AdMobInterstitial.showAd((error) => error && console.log(error));
  }

  setBannerSize() {
    const { bannerSize } = this.state;
    this.setState({
      bannerSize: bannerSize === 'smartBannerPortrait' ?
        'mediumRectangle' : 'smartBannerPortrait',
    });
  }

  onValueChange(value: string) {
      this.setState({
            selected1: value,
      });
  }

  render() {
    const { bannerSize } = this.state;
    console.log(bannerSize);

    return (
       <Container> 
            <Content 
                theme={theme}
                onLayout={(event) => { this.renderDimensions(event.nativeEvent.layout);}}>
              <Image
                source={this.state.layout.image}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: this.state.layout.height,
                  width: this.state.layout.width
                }}
                >
                 
                    <ListItem>
                        <Icon name="university" style={{ color: '#0A69FE' }} />
                        <Picker
                          iosHeader="Select one"
                          mode="dropdown"
                          selectedValue={this.state.selected1}
                          onValueChange={this.onValueChange.bind(this)} >
                            <Item label="Banco Industrial" value="key0" />
                            <Item label="Promerica" value="key1" />
                        </Picker>
                    </ListItem>
       
                    <Button style={{ alignSelf: 'center', marginTop: 20, marginBottom: 20 }}>
                        Sign Up
                    </Button>
                </Image>
            </Content>

            <Footer>
              <AdMobBanner
                  bannerSize={this.state.bannerSize}
                  testDeviceID="EMULATOR"
                  adUnitID="ca-app-pub-3940256099942544/2934735716"
                />
            </Footer>
        </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  button: {
    color: '#333333',
    marginBottom: 15,
  },
});