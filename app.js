import React, { Component } from 'react';
import { Alert, AppState, BackHandler } from 'react-native';

import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';


import {
  Symbology,
  SymbologyDescription,
  SparkScanSettings,
  SparkScan,
  SparkScanViewSettings,
  SparkScanView,
} from 'scandit-react-native-datacapture-barcode';
import {
  Brush,
  Color,
  Camera,
  CameraSettings,
  DataCaptureContext,
  DataCaptureView,
  FrameSourceState,
  RectangularViewfinder,
  RectangularViewfinderStyle,
  RectangularViewfinderLineStyle,
  VideoResolution,
} from 'scandit-react-native-datacapture-core';

import { requestCameraPermissionsIfNeeded } from './camera-permission-handler';

	//REACT COMPONENT LIFECYCLE: 1.-constructor	2.-RENDER	3.-DIDMOUNT
	//SPARKSCAN   https://docs.scandit.com/data-capture-sdk/react-native/get-started-spark-scan.html


export default class App extends Component {

  constructor() {
    super();
	//Alert.alert(null,`constructor`,[{ text: 'OK'}],{ cancelable: false });
	
    this.dataCaptureContext = DataCaptureContext.forLicenseKey('AWSS2j0mHgg/Ip+PXwckLXInQkDtGo070lP3axgpfUtUfbQNFWkXbBR8hJRlZiqKZAzKaG16pnjTcl/b6Ca6cvJ1mrWGe9Gtqx8kApFaRAPIRpIqDGG1nC1vSLQ8GiY/21dsTsFtMH6JUJSS6mrTAVBmRGdtcsgyp2uv0wtvKPpEcWdyKkipb8ph2EVtcV9vmG3v2mZuqRdxT3AU63IX/7Jt37SWZbI2cVNmFbRx5vGte4GhsUal+zRtNKelSQDi0VhPOOBFRV4LedeFm3b5d71TqmGjaPxvo0kcW4BnZ15ic1iYV2VaWs8hseijdfO+lETG4cohWFQ5RtXQtHOZvaNjxfCzVdhRSEVwZrRZU2ooZejTAW+/wH1B7AP+dHXB3mJUAttdh/+SUb/3d2qTzCNFhGQ1URxv9mFQH6xRf4u8cklAel6AffF1hTWzZp6JLUT7OTQvv/IJNhCABl+wqlApTPw6egdcQ2XniqtkwWiLJNbGBn2CW9t3iwvyZ8cZRBzkmlsNm8yKKvt8MjhSotXzvMXoqRN8lWm4jg5rqrO2Tb/ZXRKwB2dpt1cUvAwSaljrEFWOtUq/sL3H+zZeBUWmvtUm0SrHqoelv865b0XP3xN8GJq72Uu/vIbRIpDmPrIGxdC8Twfy7CcSBntqlOBvOrRmVTY8dMRo0A96kCMJNYgXLbuDbEbHGF9CAoSBbvwzh5mJnya0ob9T4LSwuEbSqYeqB7JTY6q+qbqQ/1pseKe7hgSdfgj3oUFDMm7nhMQJeqZL9LSNmwDQZP7HNhmX1SnoS+8TJWgM6U3ee+MT2BU3xmQKirUCyeZAObF/YSKW4C+wgAifabxsNzKcNpy7XuMM9fTPsF3THTVjBjxq2cnqdlofztjmMFTYPVk2EB0WZQM5CNevWhEIQ2//Od2hK+o3NpOi5kKGpIfbMKR0Og73OFsDtWWzrT71gnKhcUuB2v5HrtV19Dli3jLkqUhYMxiUcNq8ONHBgdMQhkYyQ7qSUMl4mAWRrJF3eiCExN6FQaUiHUjITRDksSoVKh3TO7PA/aPLDL1au2TfKIKXKyPNWjE9fynZ7JsLpIRma5usAZ7R+b3rzZ51t3fq8DKT5tuFz+kY5zYSfuaYDIE52K00Im/lqzK0QiAZjt8eryrGRmDyR4oh8y9KOo3Sz8YEOR7MJNCWCgnKvacyjqxjCOhadV7yEZt6PugRYrxn');
       this.setupScanning();
	    this.viewRef = React.createRef();
	
  }

  componentDidMount() {

    this.handleAppStateChangeSubscription = AppState.addEventListener('change', this.handleAppStateChange);
	requestCameraPermissionsIfNeeded();
	
	//Alert.alert(null,`didMount`,[{ text: 'OK'}],{ cancelable: false });
  }

  componentWillUnmount() {
    this.handleAppStateChangeSubscription.remove();
    this.dataCaptureContext.dispose();
  }

  handleAppStateChange = async (nextAppState) => {
    if (nextAppState.match(/inactive|background/)) {	  
	   this.sparkScanView.pauseScanning();
	   
    } else {
    
	 
	  //ok//Alert.alert(null,`dopo startCapture`,[{ text: 'OK'}],{ cancelable: false });
    }
  }


  setupScanning() {
	const sparksettings = new SparkScanSettings();
	sparksettings.enableSymbologies([Symbology.EAN13UPCA, Symbology.EAN8, Symbology.Code128, Symbology.QR]);	
	
	this.sparkScan = SparkScan.forSettings(sparksettings);
	
	const listener = {
	  didScan: (sparkScan, session, getFrameData) => {

		const barcode = session.newlyRecognizedBarcodes[0];

		 Alert.alert(null,`scanned  ${barcode.data}`,[{ text: 'OK'}],{ cancelable: false });
	  },
	  
	};
	this.sparkScan.addListener(listener);
	
	this.viewSettings = new SparkScanViewSettings();
	//this.viewSettings.barcodeCountButtonVisible = true; 
	
	//Alert.alert(null,`end of settings`,[{ text: 'OK'}],{ cancelable: false }); 	
  } //end settings

  render() {
	//	  	        Alert.alert(null,`render`,[{ text: 'OK'}],{ cancelable: false });

    return (
	<> 
		<Text>
		  <Text>
			{'DEV.EXP SCANDIT TEST - BY CXNT48 v1.0'}
			{'\n'}
			{'\n'}
		  </Text>
		  <Text numberOfLines={5}>{'THIS IS A SPARKSCAN EXAMPLE IN REACTNATIVE'}</Text>
		</Text>
		<SparkScanView context={this.dataCaptureContext} sparkScan={this.sparkScan} sparkScanViewSettings={this.viewSettings} style={{ flex: 1 }} />
	</>
    );
  };
}