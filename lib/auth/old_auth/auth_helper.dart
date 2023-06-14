import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:intl/intl.dart';
import 'package:package_info_plus/package_info_plus.dart';
import 'package:get/get.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:device_info_plus/device_info_plus.dart';

import 'dart:io';
import 'package:flutter/foundation.dart';

class AuthHelper {
  static final FirebaseAuth _auth = FirebaseAuth.instance;

  static signInWithEmail(
      {required String email, required String password}) async {
    final res = await _auth.signInWithEmailAndPassword(
        email: email, password: password);
    final User? user = res.user;
    return user;
  }

  static signupWithEmail(
      {required String email, required String password}) async {
    final res = await _auth.createUserWithEmailAndPassword(
        email: email, password: password);
    final User? user = res.user;
    return user;
  }

  static signInWithGoogle() async {
    GoogleSignIn googleSignIn = GoogleSignIn();
    final acc = await googleSignIn.signIn();
    final auth = await acc?.authentication;
    final credential = GoogleAuthProvider.credential(
        accessToken: auth?.accessToken, idToken: auth?.idToken);
    final res = await _auth.signInWithCredential(credential);
    return res.user;
  }

  static logOut() {
    GoogleSignIn().signOut();
    return _auth.signOut();
  }
}

class UserHelper {
  static final FirebaseFirestore _db = FirebaseFirestore.instance;

  static saveUser(User? user) async {
    PackageInfo packageInfo = await PackageInfo.fromPlatform();
    int buildNumber = int.parse(packageInfo.buildNumber);
    Map<String, dynamic> userData = {
      "name": user?.displayName,
      "email": user?.email,
      "last_login": user?.metadata.lastSignInTime?.millisecond.minutes,
      "created_at": user?.metadata.creationTime?.millisecondsSinceEpoch,
      "build_number": buildNumber,
    };
//to check if user already exists
    final userRef = _db.collection('users').doc(user?.uid);
    if ((await userRef.get()).exists) {
      await userRef.update({
        "last_login": user?.metadata.lastSignInTime?.millisecondsSinceEpoch,
        "build_number":
            buildNumber, //usermight have updated appbuild number helps when sending push notifiications to get device type..smth like that
      });
    } else {
      await userRef.set(userData);
    }
//saving device details
    await _saveDevice(user!);
  }

  static _saveDevice(User user) async {
    //Create an instance of device info plugin
    DeviceInfoPlugin deviceInfo = DeviceInfoPlugin();
    //Unique id for each device
    String? deviceId;
    Map<String, dynamic>? deviceData;
    if (Platform.isAndroid) {
      //instantiate deviceInfo
      AndroidDeviceInfo androidInfo = await deviceInfo.androidInfo;
      deviceId = androidInfo.id;
      deviceData = {
        'version.baseOS': androidInfo.version.baseOS,
        "platform": "android",
        'model': androidInfo.model,
        'device': androidInfo.device,
      };
    }
    if (Platform.isIOS) {
      IosDeviceInfo iosInfo = await deviceInfo.iosInfo;
      deviceId = iosInfo.identifierForVendor;
      deviceData = {
        'version.baseOS': iosInfo.systemVersion,
        "platform": "ios",
        'model': iosInfo.model,
        'device': iosInfo.name,
      };
    }

    if (kIsWeb) {
      WebBrowserInfo webBrowserInfo = await deviceInfo.webBrowserInfo;
      deviceId = "";
      deviceData = {
        //web has different attributes from mobile devices
        'version.baseOS': "",
        "platform": "web",
        'model': "",
        'device': "",
      };
    }

    DateTime now = DateTime.now();
    String nowMs = DateFormat.yMMMEd().format(now);

    final deviceRef = _db
        .collection('users')
        .doc(user.uid)
        .collection('devices')
        .doc(deviceId);
    if ((await deviceRef.get()).exists) {
      await deviceRef.update({
        "updated_at": nowMs,
        "uninstalled": false,
      });
    } else {
      await deviceRef.set({
        "updated_at": nowMs,
        "uninstalled": false,
        "id": deviceId,
        "device_info": deviceData
      });
    }
  }
}
