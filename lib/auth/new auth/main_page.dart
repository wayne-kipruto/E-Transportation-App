// ignore_for_file: prefer_const_constructors

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:fastrucks2/auth/old_auth/auth_page.dart';
import 'package:fastrucks2/pages/transporter/driver_profile.dart';
import 'package:fastrucks2/supplier/user_profile.dart';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import '../old_auth/auth_helper.dart';

//Default 1st page
class MainPage extends StatelessWidget {
  const MainPage({super.key});
/*
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: StreamBuilder(
        stream: FirebaseAuth.instance.authStateChanges(),
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            return const UploadPage();
          } else {
            return const AuthPage();
          }
        },
      ),
    );
  }
}
 */
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: StreamBuilder<User?>(
        stream: FirebaseAuth.instance.authStateChanges(),
        builder: (context, snapshot) {
          if (snapshot.hasData && snapshot.data != null) {
            UserHelper.saveUser(snapshot.data);
            return StreamBuilder<DocumentSnapshot>(
                stream: FirebaseFirestore.instance
                    .collection('users')
                    .doc(snapshot.data?.uid)
                    .snapshots(),
                builder: (BuildContext context,
                    AsyncSnapshot<DocumentSnapshot> snapshot) {
                  if (snapshot.hasData && snapshot.data != null) {
                    // get the value of the role field
                    final userRole = snapshot.data!['role'];
                    if (userRole != 'Transporter') {
                      return UserProfile();
                    } else {
                      return DriverProfile();
                    }
                    //then extract the specific fields
                  }
                  return Material(
                      child: Center(
                    child: CircularProgressIndicator(),
                  ));
                });
          }
          return AuthPage();
        },
      ),
    );
  }
}
