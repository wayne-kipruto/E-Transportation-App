// ignore_for_file: prefer_const_constructors
import 'dart:async';

import 'package:fastrucks2/onboarding_page.dart';
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/services.dart';
import 'package:mpesa_flutter_plugin/mpesa_flutter_plugin.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'auth/new auth/signin_page.dart';
import 'firebase_options.dart';

Future<void> main() async {
  MpesaFlutterPlugin.setConsumerKey("Tzu61Ch4bI9g3Tq275Pc3HLF630ISgFw");
  MpesaFlutterPlugin.setConsumerSecret('10zU1CgwvxM4Jtxz');

  WidgetsFlutterBinding.ensureInitialized();

  final prefs = await SharedPreferences.getInstance();
  final showLogin = prefs.getBool('showLogin') ?? false;

  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(MyApp(showLogin: showLogin));
}

class MyApp extends StatelessWidget {
  final bool showLogin;
  const MyApp({
    Key? key,
    required this.showLogin,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(
      const SystemUiOverlayStyle(statusBarColor: Colors.transparent),
    );
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'FasTrucks',
      theme: ThemeData(
        primaryColor: const Color.fromARGB(255, 226, 170, 124),
        colorScheme: ColorScheme.fromSwatch()
            .copyWith(secondary: const Color.fromARGB(255, 129, 106, 87)),
      ),
      //home: LoginPage1(),
      home: showLogin ? LoginPage1() : OnboardingPage(),
    );
  }
}
