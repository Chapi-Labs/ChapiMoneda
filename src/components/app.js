import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Image,
  View,
  Dimensions
} from 'react-native';
import { Container, Content, Footer, List, Header, Title, ListItem, Button, Icon, Picker, Text, InputGroup, Input } from 'native-base';
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
        image: height > width ? vertical: horizontal,
        margin: height > width ? 120: 80,
        mButton: height > width ? 20: 0,
      },
      selectedBank: 'bi',
      selectedType: 'key0',
    };
    this.setBannerSize = this.setBannerSize.bind(this);
  }

  renderDimensions(relayout) {
    console.log(relayout);
    this.setState({
      layout: {
        height: relayout.height,
        width:  relayout.width,
        image:  relayout.height > relayout.width ? vertical: horizontal,
        margin: relayout.height > relayout.width ? 120: 80,
        mButton: height > width ? 20: 0,
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
    console.log('test');
    AdMobInterstitial.showAd((error) => error && console.log(error));
  }

  setBannerSize() {
    const { bannerSize } = this.state;
    this.setState({
      bannerSize: bannerSize === 'smartBannerPortrait' ?
        'mediumRectangle' : 'smartBannerPortrait',
    });
  }

  onTypeChange(value: string) {
      this.setState({
            selectedType: value,
      });
  }
  onBankChange(value: string) {
      this.setState({
            selectedBank: value,
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
            
            <Container
            onLayout={ (event) => { this.renderDimensions(event.nativeEvent.layout); }}
            theme={ theme }
            >

              <Image
                source={this.state.layout.image}
                style={{
                  height: this.state.layout.height,
                  width: this.state.layout.width
                }}
                >   
                 <AdMobBanner
                      bannerSize={this.state.bannerSize}
                      testDeviceID="EMULATOR"
                      adUnitID="ca-app-pub-3940256099942544/2934735716"
                    />
                    <View 
                        style={{marginTop: this.state.layout.margin}}
                    >
                    <ListItem>
                        <InputGroup>
                            <Icon name="money" style={{ color: '#ffffff' }}/>
                            <Input placeholder="Tipo de cambio" keyboardType="numeric"/>
                        </InputGroup>
                    </ListItem>
                    <ListItem>
                        <InputGroup>
                            <Icon name="envelope" style={{ color: '#ffffff' }}/>
                            <Input placeholder="EMAIL" />
                        </InputGroup>
                    </ListItem>
                    <ListItem>
                        <Icon name="cogs" style={{ color: '#ffffff' }} />
                        <Picker
                          iosHeader="Select one"
                          mode="dropdown"
                          selectedValue={this.state.selectedType}
                          onValueChange={this.onTypeChange.bind(this)} >
                            <Item label="Compra Internet" value="key0" />
                            <Item label="Venta Internet" value="key1" />
                            <Item label="Compra Agencia" value="key2" />
                            <Item label="Venta Agencia" value="key3" />
                        </Picker>
                    </ListItem>
                    <ListItem>
                        <Icon name="university" style={{ color: '#ffffff' }} />
                        <Picker
                          iosHeader="Select one"
                          mode="dropdown"
                          selectedValue={this.state.selectedBank}
                          onValueChange={this.onBankChange.bind(this)} >
                            <Item label="Banco Industrial" value="bi" />
                            <Item label="Banco Promerica" value="promerica" />
                        </Picker>
                    </ListItem>
                    </View>
                    <Button block
                        onPress= { this.showInterstital }
                        style={{ marginLeft: 10, marginRight: 10, marginTop: this.state.layout.mButton }}
                    >
                        Guardar
                    </Button>

                    </Image>
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