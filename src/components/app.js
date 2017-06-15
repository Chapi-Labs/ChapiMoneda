import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  View,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import { Container, Content, Footer, List, 
    Header, Title, ListItem, Button, Icon, 
    Picker, Text, InputGroup, Input, Spinner } from 'native-base';
import theme from '../theme/theme';
const Item = Picker.Item;
const { height, width } = Dimensions.get('window');
const vertical = require('./../../assets/img/background-vertical.png');
const horizontal = require('./../../assets/img/background-horizontal.png');
import { AdMobInterstitial, AdMobBanner } from 'react-native-admob';
import SplashScreen from 'react-native-splash-screen';

AdMobInterstitial.setTestDeviceID('ad-unit-newton-labs-chapimoneda');
AdMobInterstitial.setAdUnitID('ca-app-pub-5810239506156938/2065751809');

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
      amount: undefined,
      email: undefined,
      selectedBank: 'bi',
      selectedType: 'compraInternet',
      animating: false,
      responseMsg: undefined


    };
    this.setBannerSize = this.setBannerSize.bind(this);
  }

  renderDimensions(relayout) {
    this.setState({
      layout: {
        height: relayout.height,
        width:  relayout.width,
        image:  relayout.height > relayout.width ? vertical: horizontal,
        margin: relayout.height > relayout.width ? 120: 80,
        mButton: height > width ? 20: 0,
      }
    });

  }

  componentDidMount() {

    AdMobInterstitial.addEventListener('interstitialDidLoad',
      () => {});
    AdMobInterstitial.addEventListener('interstitialDidClose',
      this.interstitialDidClose);
    AdMobInterstitial.addEventListener('interstitialDidFailToLoad',
      () => {});
    AdMobInterstitial.addEventListener('interstitialDidOpen',
      () => {});
    AdMobInterstitial.addEventListener('interstitialWillLeaveApplication',
      () => {});

    AdMobInterstitial.requestAd((error) => error && console.log(error));
    SplashScreen.hide();
  }

  componentWillUnmount() {
    AdMobInterstitial.removeAllListeners();
  }

  interstitialDidClose() {
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
  onAmountChange(value: string) {
    this.setState({
        amount: value,
    });
  }
  onSave() {
    const valid = this.validateForm();
    if (valid === true) {
      this.setState({animating: true});
      fetch('https://chapimoneda.herokuapp.com/api/notification', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: this.state.amount,
          email: this.state.email.trim(),
          bank: this.state.selectedBank,
          type: this.state.selectedType,
        })
      }).then((response) => response.json())
        .then((responseJson) => {
          this.setState({animating: false, responseMsg: responseJson});
          this.showInterstital();
          if (responseJson === 'updated') {
              ToastAndroid.show('Se ha actualizado correctamente', ToastAndroid.LONG);
          }
          if (responseJson === 'saved') {
              ToastAndroid.show('Se ha guardado correctamente', ToastAndroid.LONG);
          }
        })
        .catch((error) => {
          this.setState({animating: false});
          ToastAndroid.show('Error', ToastAndroid.LONG);
        });
    } else {
        ToastAndroid.show('Falta ingresar información', ToastAndroid.LONG);
    }
   
  }   

  validateForm() {
    return !(
        this.state.amount === undefined ||
        this.state.email === undefined ||
        this.state.amount === null ||
        this.state.email === null);
  }

  render() {
    const { bannerSize } = this.state;

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
                      testDeviceID="ad-newtonlabs"
                      adUnitID="ca-app-pub-5810239506156938/9941625408"
                    />
                    <View 
                        style={{marginTop: this.state.layout.margin}}
                    >
                    <ListItem>
                        <InputGroup>
                            <Icon name="money" style={{ color: '#ffffff' }}/>
                            <Input 
                                onChangeText= {(amount) => this.setState({amount})}
                                placeholder="Tipo de cambio" keyboardType="numeric"/>
                            <Button style={{height: 30,  width: 33, marginRight: 12}} onPress={() => 
                                alert('Cuando el tipo de cambio sea igual o mayor al monto ingresado será notificado')} >
                                <Icon style={{fontSize: 20}} name="question-circle" />
                            </Button>
                        </InputGroup>
                    </ListItem>
                    <ListItem>
                        <InputGroup>
                            <Icon name="envelope" style={{ color: '#ffffff' }}/>
                            <Input  onChangeText= {(email) => this.setState({email})}
                                placeholder="EMAIL" />
                            <Button style={{height: 30, width: 33, marginRight: 12}} onPress={() => 
                                alert('Correo a enviar notificación')} >
                                <Icon style={{fontSize: 20}} name="question-circle" />
                            </Button>
                        </InputGroup>
                    </ListItem>
                    <ListItem>
                        <Icon name="cogs" style={{ color: '#ffffff' }}/>
                        <Picker
                          style= {{ color: '#ffffff'}}
                          iosHeader="Select one"
                          mode="dropdown"
                          selectedValue={this.state.selectedType}
                          onValueChange={this.onTypeChange.bind(this)} >
                            <Item label="Compra Internet" value="compraInternet" />
                            <Item label="Venta Internet" value="ventaInternet" />
                            <Item label="Compra Agencia" value="compraAgencia" />
                            <Item label="Venta Agencia" value="ventaAgencia" />
                        </Picker>
                        <Button style={{height: 30}} onPress={() => 
                            alert('Tipo de cambio que desea ser notificado')} >
                            <Icon style={{fontSize: 20}} name="question-circle" />
                        </Button>
                    </ListItem>
                    <ListItem>
                        <Icon name="university" style={{ color: '#ffffff' }} />
                        <Picker
                          style= {{ color: '#ffffff'}}
                          iosHeader="Select one"
                          mode="dropdown"
                          selectedValue={this.state.selectedBank}
                          onValueChange={this.onBankChange.bind(this)} >
                            <Item label="Banco Industrial" value="bi" />
                            <Item label="Banco Promerica" value="promerica" />
                        </Picker>
                         <Button style={{height: 30}} onPress={() => alert('Banco a revisar')} >
                            <Icon style={{fontSize: 20}} name="question-circle" />
                        </Button>
                    </ListItem>
                    </View>
                    <Button block
                        onPress= { this.onSave.bind(this) }
                        style={{ marginLeft: 10, marginRight: 10, marginTop: this.state.layout.mButton }}
                    >
                    <Text>
                        Guardar
                    </Text>
                    </Button>
                    <Spinner style={{opacity: this.state.animating ? 1.0 : 0.0, alignSelf: 'center'}} animating={true}/>
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