// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables, prefer_interpolation_to_compose_strings

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mpesa_flutter_plugin/mpesa_flutter_plugin.dart';

class PaymentsPage extends StatefulWidget {
  const PaymentsPage({super.key});

  @override
  State<PaymentsPage> createState() => _PaymentsPageState();
}

class _PaymentsPageState extends State<PaymentsPage> {
  final user = FirebaseAuth.instance.currentUser!;

  late DocumentReference paymentsRef;
  String mUserEmail = '';
  int mCurrentAccountBalance = 0;

  bool _initialized = false;
  bool _error = false;

  Future<void> updateAccount(String mCheckoutRequestID) {
    Map<String, String> initData = {
      'CheckoutRequestID': mCheckoutRequestID,
    };
    paymentsRef.set({'info': "$mUserEmail receipts data goes here."});

    return paymentsRef
        .collection('deposit')
        .doc(mCheckoutRequestID)
        .set(initData)
        .then((value) => print('Transaction Initialized...'))
        .catchError((error) => print('Failed to init transaction: $error'));
  }

  Stream<DocumentSnapshot>? getAccountBalance() {
    if (_initialized) {
      return paymentsRef.collection('balance').doc("account").snapshots();
    } else {
      return null;
    }
  }

  Future<dynamic> startTransaction(
      {required double amount, required String userPhone}) async {
    dynamic transactionInitialisation;

    try {
      transactionInitialisation = await MpesaFlutterPlugin.initializeMpesaSTKPush(
          businessShortCode: '174379',
          transactionType: TransactionType.CustomerPayBillOnline,
          amount: amount,
          partyA: userPhone,
          partyB: '174379',
          callBackURL: Uri(
              scheme: 'https',
              host: "mpesa-requestbin.herokuapp.com",
              path: "/12uepff1"),
          accountReference: "Fastrucks Trucker Payment",
          phoneNumber: userPhone,
          baseUri: Uri(scheme: "https", host: "sandbox.safaricom.co.ke"),
          transactionDesc: "Fastrucks payment",
          passKey:
              'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919');

      var result = transactionInitialisation as Map<String, dynamic>;

      if (result.keys.contains("ResponseCode")) {
        String mResponseCode = result["ResponseCode"];
        print("Resulting Code: " + mResponseCode);
        if (mResponseCode == '0') {
          updateAccount(result["CheckoutRequestID"]);
        }
      }
      print("RESULT: " + transactionInitialisation.toString());
    } catch (e) {
      print("Exception Caught:" + e.toString());
    }
  }

  void initializeFlutterFire() async {
    try {
      await Firebase.initializeApp();
      setState(() {
        _initialized = true;
      });

      paymentsRef =
          FirebaseFirestore.instance.collection('payments').doc(mUserEmail);
    } catch (e) {
      print(e.toString());
      setState(() {
        _error = true;
      });
    }
  }

  @override
  void initState() {
    initializeFlutterFire();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Mpesa API"),
        centerTitle: true,
        backgroundColor: Colors.green,
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 40.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            children: <Widget>[
              Image.asset(
                'assets/MPESA.jpg',
                height: 150,
                width: 200,
              ),
              Padding(
                padding: EdgeInsets.all(15),
                child: Text("Complete payments via M-PESA"),
              ),
              Padding(
                padding: const EdgeInsets.only(bottom: 10.0),
                child: Text(
                  "Prefix the number in the international format (254...)",
                  style: GoogleFonts.montserrat(
                    fontSize: 15,
                    color: Colors.black,
                  ),
                ),
              ),
              phoneField(),
              SizedBox(
                height: 20,
              ),
              amountField(),

              /*
              StreamBuilder(
                stream: getAccountBalance(),
                builder: (BuildContext context,
                    AsyncSnapshot<DocumentSnapshot> snapshot) {
                  if (snapshot == null ||
                      snapshot.connectionState == ConnectionState.waiting) {
                    return CircularProgressIndicator(
                      strokeWidth: 1.0,
                    );
                  } else if (snapshot.connectionState == ConnectionState.active) {
                    if (snapshot.data!.data() != null) {
                      Object? documentFields = snapshot.data!.data();

                      return Text(
                        documentFields.containsKey('wallet')
                            ? documentFields['wallet'].toString()
                            : '0',
                        style: TextStyle(
                          fontSize: 20,
                        ),
                      );
                    } else {
                      return Text('0');
                    }
                  } else {
                    return Text('!');
                  }
                },
              )
              */
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          /*
          
          if (_error) {
            print("Error initializing Firebase ");
            return;
          }
          if (!_initialized) {
            print('Firebase not initialized');
          }

          */

          startTransaction(
              amount: double.parse(_amountController.text.trim()),
              userPhone: _phoneController.text.trim());
        },
        label: Text("Top Up"),
      ),
    );
  }

  final _phoneController = TextEditingController();

  Widget phoneField() => TextField(
        controller: _phoneController,
        decoration: InputDecoration(
            hintText: '254...',
            label: Text('Phone Number'),
            prefixIcon: Icon(Icons.phone),
            suffixIcon: _phoneController.text.isEmpty
                ? Container(width: 0)
                : IconButton(
                    icon: Icon(Icons.close),
                    onPressed: () => _phoneController.clear(),
                  ),
            border:
                OutlineInputBorder(borderRadius: BorderRadius.circular(12))),
        keyboardType: TextInputType.phone,
        textInputAction: TextInputAction.done,
      );

  final _amountController = TextEditingController();
  Widget amountField() => TextField(
        controller: _amountController,
        decoration: InputDecoration(
            label: Text('Amount'),
            prefixIcon: Icon(Icons.numbers),
            suffixIcon: _amountController.text.isEmpty
                ? Container(width: 0)
                : IconButton(
                    icon: Icon(Icons.close),
                    onPressed: () => _amountController.clear(),
                  ),
            border:
                OutlineInputBorder(borderRadius: BorderRadius.circular(12))),
        keyboardType: TextInputType.phone,
        textInputAction: TextInputAction.done,
      );

  Future<String?> _showTextInputDialog(BuildContext context) async {
    return showDialog(
        context: context,
        builder: (context) {
          return AlertDialog(
            title: const Text('M-Pesa Number'),
            content: TextField(
              controller: _phoneController,
              decoration: const InputDecoration(hintText: "+254..."),
            ),
            actions: <Widget>[
              ElevatedButton(
                child: const Text("Cancel"),
                onPressed: () => Navigator.pop(context),
              ),
              ElevatedButton(
                child: const Text('Proceed'),
                onPressed: () => Navigator.pop(context, _phoneController.text),
              ),
            ],
          );
        });
  }
}
/*
class MpesaFlutterPlugin {
  static bool _consumerKeySet = false;
  static late String _mConsumerKeyVariable;

  static setConsumerKey(String consumerKey) {
    _mConsumerKeyVariable = consumerKey;
    _consumerKeySet = true;
  }

  static bool _consumerSecretSet = false;
  static late String _mConsumerSecretVariable;

  static setConsumerSecret(String consumerSecret) {
    _mConsumerSecretVariable = consumerSecret;
    _consumerSecretSet = true;
  }

  static Future<dynamic> initializeMpesaSTKPush(
      {

      ///BusinessShortCode is the org paybill
      ///Which is same as PartyB
      ///Phone Number should be a registered MPESA number
      ///Which is same as PartyA
      required String businessShortCode,
      required TransactionType transactionType,
      required double amount,
      required String partyA,
      required String partyB,
      required Uri callBackURL,
      required String accountReference,
      String? transactionDesc,
      required String phoneNumber,
      required Uri baseUri,
      required String passKey}) async {
    /*Inject some sanity*/
    if (amount < 1.0) {
      throw "error: you provided $amount  as the amount which is not valid.";
    }
    if (phoneNumber.length < 9) {
      throw "error: $phoneNumber  doesn\'t seem to be a valid phone number";
    }
    if (!phoneNumber.startsWith('254')) {
      throw "error: $phoneNumber need be in international format";
    }

    /*Mine the secrets from Config*/

    if (!_consumerSecretSet || !_consumerKeySet) {
      throw "error: ensure consumer key & secret is set. Use MpesaFlutterPlugin.setConsumer...";
    }
    var rawTimeStamp = DateTime.now();
    var formatter = new DateFormat('yyyyMMddHHmmss');
    String actualTimeStamp = formatter.format(rawTimeStamp);

    return RequestHandler(
            consumerKey: _mConsumerKeyVariable,
            consumerSecret: _mConsumerSecretVariable,
            baseUrl: baseUri.host)
        .mSTKRequest(
            mAccountReference: accountReference,
            mAmount: amount,
            mBusinessShortCode: businessShortCode,
            mCallBackURL: callBackURL,
            mPhoneNumber: phoneNumber,
            mTimeStamp: actualTimeStamp,
            mTransactionDesc: transactionDesc,
            nPassKey: passKey,
            partyA: partyA,
            partyB: partyB,
            mTransactionType:
                transactionType == TransactionType.CustomerPayBillOnline
                    ? "CustomerPayBillOnline"
                    : "CustomerBuyGoodsOnline");
  }
}
*/
