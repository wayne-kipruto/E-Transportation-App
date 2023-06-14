// ignore_for_file: prefer_const_constructors

import 'package:fastrucks2/pages/transporter/driver_vetting_page.dart';
import 'package:fastrucks2/auth/new%20auth/forgot_pw_page.dart';
import 'package:fastrucks2/auth/old_auth/login.dart';
import 'package:fastrucks2/auth/old_auth/register_page.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class DriverLoginPage extends StatefulWidget {
  const DriverLoginPage({super.key});

  @override
  State<DriverLoginPage> createState() => _DriverLoginPageState();
}

class _DriverLoginPageState extends State<DriverLoginPage> {
  String? errorMessage = '';
  bool isLogin = true;
  bool visible = true;
  bool _isObscure2 = true;

  final TextEditingController _controllerEmail = TextEditingController();
  final TextEditingController _controllerPassword = TextEditingController();

  Future signIn() async {
    try {
      await FirebaseAuth.instance.signInWithEmailAndPassword(
          email: _controllerEmail.text.trim(),
          password: _controllerPassword.text.trim());
    } on FirebaseAuthException catch (e) {
      setState(() {
        errorMessage = e.message;
      });
    }
  }

  @override
  void dispose() {
    _controllerEmail.dispose();
    _controllerPassword.dispose();
    super.dispose();
  }

  Widget _errorMessage() {
    return Text(
      errorMessage == '' ? '' : ' $errorMessage',
      style: const TextStyle(backgroundColor: Colors.red),
    );
  }

  Widget buildEmail() => TextField(
        controller: _controllerEmail,
        decoration: InputDecoration(
          label: Text('Email Address'),
          prefixIcon: Icon(Icons.email),
          suffixIcon: _controllerEmail.text.isEmpty
              ? Container(width: 0)
              : IconButton(
                  icon: Icon(Icons.close),
                  onPressed: () => _controllerEmail.clear(),
                ),
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
        ),
        keyboardType: TextInputType.emailAddress,
        textInputAction: TextInputAction.done,
      );
  Widget passwordField() => TextField(
        controller: _controllerPassword,
        obscureText: true,
        decoration: InputDecoration(
            label: Text('Password'),
            prefixIcon: Icon(Icons.password),
            suffixIcon: IconButton(
                icon:
                    Icon(_isObscure2 ? Icons.visibility_off : Icons.visibility),
                onPressed: () {
                  setState(() {
                    _isObscure2 = !_isObscure2;
                  });
                }),
            border:
                OutlineInputBorder(borderRadius: BorderRadius.circular(12))),
        keyboardType: TextInputType.visiblePassword,
        textInputAction: TextInputAction.done,
        onChanged: (value) {},
      );

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[200],
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                Padding(
                  padding: EdgeInsets.symmetric(vertical: 20),
                  child: Text(
                    "Welcome Transporter",
                    style: GoogleFonts.montserrat(
                      fontSize: 25,
                      fontWeight: FontWeight.normal,
                    ),
                  ),
                ),
                Image.asset(
                  'assets/driver.png',
                  height: 150,
                  width: 200,
                ),
                Text(
                  'Your local and regional logistsics partner. ',
                  style: GoogleFonts.montserrat(
                      fontSize: 15,
                      fontWeight: FontWeight.w600), // put italic font
                ),
                SizedBox(
                  height: 19,
                ),
                Text(
                  'Transporter Log In ',
                  style: GoogleFonts.montserrat(
                      fontSize: 25, fontWeight: FontWeight.bold),
                ),
                SizedBox(
                  height: 19,
                ),

                // email textfield
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20.0),
                  child: Container(
                    child: buildEmail(),
                  ),
                ),

                const SizedBox(height: 15),
                //Password Field
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20.0),
                  child: Container(
                    child: passwordField(),
                  ),
                ),
                const SizedBox(height: 10),
                _errorMessage(),

                Padding(
                  padding: const EdgeInsets.all(25.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      GestureDetector(
                        onTap: () {
                          Navigator.push(context,
                              MaterialPageRoute(builder: (context) {
                            return const ForgotPasswordPage();
                          }));
                        },
                        child: Text(
                          'Forgot Password',
                          style: GoogleFonts.montserrat(
                            color: Colors.blue,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 10),

                MaterialButton(
                  color: Colors.orange[200],
                  hoverColor: Colors.orange[400],
                  height: 40,
                  minWidth: 100,
                  onPressed: () {
                    setState(() {
                      visible = true;
                    });
                    signIn();
                  },
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.all(Radius.circular(20)),
                  ),
                  child: Text(
                    'Sign In',
                    style: GoogleFonts.rubik(fontSize: 15),
                  ),
                ),

                const SizedBox(height: 30),
/*
                Visibility(
                  maintainSize: true,
                  maintainAnimation: true,
                  maintainState: true,
                  visible: visible,
                  child: CircularProgressIndicator(
                    color: Colors.white,
                  ),
                ),
*/
                GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) {
                          return const DriverVettingPage();
                        },
                      ),
                    );
                  },
                  child: Text(
                    'Next',
                    style: GoogleFonts.montserrat(
                      color: Colors.blue,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),

                Padding(
                  padding: const EdgeInsets.only(top: 30),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Padding(
                        padding: EdgeInsets.all(15.0),
                        child: Text(
                          'Not a member?',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      GestureDetector(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) {
                                return RegisterPage(
                                  showLoginPage: () {},
                                );
                              },
                            ),
                          );
                        },
                        child: Text(
                          'Register now',
                          style: GoogleFonts.montserrat(
                            color: Colors.blue,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                SizedBox(height: 10),
                GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) {
                          return LoginPage(
                            showRegisterPage: () {},
                          );
                        },
                      ),
                    );
                  },
                  child: Padding(
                    padding: const EdgeInsets.only(bottom: 40),
                    child: Text(
                      'Log in as Supplier instead',
                      style: TextStyle(
                        color: Colors.red,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
