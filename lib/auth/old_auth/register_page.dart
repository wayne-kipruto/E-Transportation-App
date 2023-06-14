// ignore_for_file: prefer_const_constructors

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:fastrucks2/auth/old_auth/login.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key, required void Function() showLoginPage});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final _controllerEmail = TextEditingController();
  final _controllerPassword = TextEditingController();
  final _controllerfirstName = TextEditingController();
  final _controllerlastName = TextEditingController();
  final _controllerconfirmPw = TextEditingController();
  final _controllerPhone = TextEditingController();
  final _controllerAge = TextEditingController();

  String? errorMessage = '';
  bool isLogin = true;
  bool _isObscure = true;
  bool _isObscure2 = true;
  bool visible = false;

  var options = [
    'Supplier',
    'Transporter',
  ];

  var _currentItemSelected = "Supplier";
  var role = "Supplier";

  final _formkey = GlobalKey<FormState>();

  @override
  void dispose() {
    _controllerconfirmPw.dispose();
    _controllerEmail.dispose();
    _controllerPassword.dispose();
    _controllerAge.dispose();
    _controllerlastName.dispose();
    _controllerfirstName.dispose();
    _controllerPhone.dispose();

    super.dispose();
  }

  bool passwordConfirmed() {
    if (_controllerPassword.text.trim() == _controllerconfirmPw.text.trim()) {
      return true;
    } else {
      return false;
    }
  }

  Widget _errorMessage() {
    return Text(
      errorMessage == '' ? '' : ' $errorMessage',
      style: const TextStyle(backgroundColor: Colors.red),
    );
  }

  Future signUp() async {
    //create user
    if (passwordConfirmed()) {
      try {
        await FirebaseAuth.instance.createUserWithEmailAndPassword(
          email: _controllerEmail.text.trim(),
          password: _controllerPassword.text.trim(),
        );
      } on FirebaseAuthException catch (e) {
        setState(() {
          errorMessage = e.message;
        });
      }

      // add user details

      addUserDetails(
        _controllerfirstName.text.trim(),
        _controllerlastName.text.trim(),
        _controllerEmail.text.trim(),
        int.parse(_controllerAge.text.trim()),
        int.parse(_controllerPhone.text.trim()),
        role,
      );
    }
  }

  Future addUserDetails(
    String firstName,
    String lastName,
    String email,
    int age,
    int phone,
    String role,
  ) async {
    await FirebaseFirestore.instance.collection('users').add({
      'first name': firstName,
      'last name': lastName,
      'email': email,
      'age': age,
      'phone': phone,
      'role': role
    });

    // ignore: use_build_context_synchronously
    Navigator.pushReplacement(
        context,
        MaterialPageRoute(
            builder: (context) => LoginPage(
                  showRegisterPage: () {},
                )));
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

  Widget firstNameField() => TextField(
        controller: _controllerfirstName,
        decoration: InputDecoration(
            label: Text('First Name'),
            prefixIcon: Icon(Icons.abc_outlined),
            suffixIcon: _controllerfirstName.text.isEmpty
                ? Container(width: 0)
                : IconButton(
                    icon: Icon(Icons.close),
                    onPressed: () => _controllerfirstName.clear(),
                  ),
            border:
                OutlineInputBorder(borderRadius: BorderRadius.circular(12))),
        keyboardType: TextInputType.name,
        textInputAction: TextInputAction.done,
      );

  Widget lastNameField() => TextField(
        controller: _controllerlastName,
        decoration: InputDecoration(
            label: Text('Last Name'),
            prefixIcon: Icon(Icons.abc_outlined),
            suffixIcon: _controllerlastName.text.isEmpty
                ? Container(width: 0)
                : IconButton(
                    icon: Icon(Icons.close),
                    onPressed: () => _controllerlastName.clear(),
                  ),
            border:
                OutlineInputBorder(borderRadius: BorderRadius.circular(12))),
        keyboardType: TextInputType.name,
        textInputAction: TextInputAction.done,
      );
  /*

  Widget roleDescription() => TextField(
        controller: _controllerRole,
        decoration: InputDecoration(
            hintText: 'Transporter or Supplier',
            label: Text('Role Type'),
            prefixIcon: Icon(Icons.person),
            suffixIcon: _controllerRole.text.isEmpty
                ? Container(width: 0)
                : IconButton(
                    icon: Icon(Icons.close),
                    onPressed: () => _controllerRole.clear(),
                  ),
            border:
                OutlineInputBorder(borderRadius: BorderRadius.circular(12))),
        keyboardType: TextInputType.text,
        textInputAction: TextInputAction.done,
      );
      */

  Widget phoneField() => TextField(
        controller: _controllerPhone,
        decoration: InputDecoration(
            label: Text('Phone Number'),
            prefixIcon: Icon(Icons.phone),
            suffixIcon: _controllerPhone.text.isEmpty
                ? Container(width: 0)
                : IconButton(
                    icon: Icon(Icons.close),
                    onPressed: () => _controllerPhone.clear(),
                  ),
            border:
                OutlineInputBorder(borderRadius: BorderRadius.circular(12))),
        keyboardType: TextInputType.phone,
        textInputAction: TextInputAction.done,
      );

  Widget ageField() => TextField(
        controller: _controllerAge,
        decoration: InputDecoration(
            label: Text('Age'),
            prefixIcon: Icon(Icons.numbers_outlined),
            suffixIcon: _controllerAge.text.isEmpty
                ? Container(width: 0)
                : IconButton(
                    icon: Icon(Icons.close),
                    onPressed: () => _controllerAge.clear(),
                  ),
            border:
                OutlineInputBorder(borderRadius: BorderRadius.circular(12))),
        keyboardType: TextInputType.number,
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
                    Icon(_isObscure ? Icons.visibility_off : Icons.visibility),
                onPressed: () {
                  setState(() {
                    _isObscure = !_isObscure;
                  });
                }),
            border:
                OutlineInputBorder(borderRadius: BorderRadius.circular(12))),
        keyboardType: TextInputType.visiblePassword,
        textInputAction: TextInputAction.done,
        onChanged: (value) {},
      );

/*
  Widget confirmpasswordField() => TextField(
        controller: _controllerconfirmPw,
        obscureText: true,
        decoration: InputDecoration(
            label: Text('Confirm Password'),
            prefixIcon: Icon(Icons.password),
            suffixIcon: _controllerconfirmPw.text.isEmpty
                ? Container(width: 0)
                : IconButton(
                    icon: Icon(Icons.close),
                    onPressed: () => _controllerconfirmPw.clear(),
                  ),
            border:
                OutlineInputBorder(borderRadius: BorderRadius.circular(12))),
        keyboardType: TextInputType.visiblePassword,
        textInputAction: TextInputAction.done,
        onChanged: (value) {},
      );
      */

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[300],
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            child: Form(
              key: _formkey,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: <Widget>[
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 15),
                    child: Text(
                      'Register for Fastrucks',
                      style: GoogleFonts.montserrat(
                          fontSize: 30, fontWeight: FontWeight.normal),
                    ),
                  ),
                  Image.asset(
                    'assets/truck.png',
                    height: 150,
                    width: 200,
                  ),
                  Text(
                    'Input your details below.',
                    style: GoogleFonts.rubik(
                        fontSize: 20, fontWeight: FontWeight.normal),
                  ),

                  const SizedBox(height: 30),

                  // First Name textfield
                  Padding(
                    padding: const EdgeInsets.only(
                      top: 10,
                      bottom: 10,
                      left: 20,
                      right: 20,
                    ),
                    child: Container(
                      child: firstNameField(),
                    ),
                  ),

                  const SizedBox(height: 10),

                  // Last Name textfield
                  Padding(
                    padding: const EdgeInsets.only(
                      top: 10,
                      bottom: 10,
                      left: 20,
                      right: 20,
                    ),
                    child: Container(
                      child: lastNameField(),
                    ),
                  ),

                  const SizedBox(height: 15),

                  // email textfield
                  Padding(
                      padding: const EdgeInsets.only(
                        top: 10,
                        bottom: 10,
                        left: 20,
                        right: 20,
                      ),
                      child: buildEmail()),

                  const SizedBox(height: 10),

                  //Phone textfield

                  Padding(
                    padding: const EdgeInsets.only(
                      top: 10,
                      bottom: 10,
                      left: 20,
                      right: 20,
                    ),
                    child: Container(
                      child: phoneField(),
                    ),
                  ),

                  const SizedBox(height: 10),

                  //Age textfield

                  Padding(
                    padding: const EdgeInsets.only(
                      top: 10,
                      bottom: 10,
                      left: 20,
                      right: 20,
                    ),
                    child: Container(
                      child: ageField(),
                    ),
                  ),

                  const SizedBox(height: 10),

                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Text(
                        'Select your role:',
                        style: GoogleFonts.rubik(
                            fontSize: 15, fontWeight: FontWeight.normal),
                      ),
                      Padding(
                        padding: const EdgeInsets.only(
                          top: 10,
                          bottom: 10,
                          left: 20,
                          right: 20,
                        ),
                        child: DropdownButton<String>(
                          dropdownColor: Colors.orange[200],
                          isDense: true,
                          isExpanded: false,
                          iconEnabledColor: Colors.orange[200],
                          items: options.map((String dropDownStringItem) {
                            return DropdownMenuItem<String>(
                              value: dropDownStringItem,
                              child: Text(
                                dropDownStringItem,
                                style: TextStyle(
                                  color: Colors.black,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 15,
                                ),
                              ),
                            );
                          }).toList(),
                          onChanged: (newValueSelected) {
                            setState(() {
                              _currentItemSelected = newValueSelected!;
                              role = newValueSelected;
                            });
                          },
                          value: _currentItemSelected,
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 10),

                  //Password Textfield
                  Padding(
                    padding: const EdgeInsets.only(
                      top: 10,
                      bottom: 10,
                      left: 20,
                      right: 20,
                    ),
                    child: TextFormField(
                      obscureText: _isObscure,
                      controller: _controllerPassword,
                      decoration: InputDecoration(
                        label: Text('Password'),
                        prefixIcon: Icon(Icons.password),
                        suffixIcon: IconButton(
                            icon: Icon(_isObscure
                                ? Icons.visibility_off
                                : Icons.visibility),
                            onPressed: () {
                              setState(() {
                                _isObscure = !_isObscure;
                              });
                            }),
                        enabled: true,
                        contentPadding: const EdgeInsets.only(
                            left: 14.0, bottom: 8.0, top: 15.0),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      validator: (value) {
                        RegExp regex = RegExp(r'^.{6,}$');
                        if (value!.isEmpty) {
                          return "Password cannot be empty";
                        }
                        if (!regex.hasMatch(value)) {
                          return ("please enter valid password min. 6 character");
                        } else {
                          return null;
                        }
                      },
                      onChanged: (value) {},
                      keyboardType: TextInputType.visiblePassword,
                      textInputAction: TextInputAction.done,
                    ),
                  ),

                  const SizedBox(height: 10),

                  //Confirm Pw
                  Padding(
                    padding: const EdgeInsets.only(
                      top: 10,
                      bottom: 10,
                      left: 20,
                      right: 20,
                    ),
                    child: TextFormField(
                      obscureText: _isObscure2,
                      controller: _controllerconfirmPw,
                      decoration: InputDecoration(
                        prefixIcon: Icon(Icons.password),
                        suffixIcon: IconButton(
                            icon: Icon(_isObscure2
                                ? Icons.visibility_off
                                : Icons.visibility),
                            onPressed: () {
                              setState(() {
                                _isObscure2 = !_isObscure2;
                              });
                            }),
                        label: Text('Confirm Password'),
                        enabled: true,
                        contentPadding: const EdgeInsets.only(
                            left: 14.0, bottom: 8.0, top: 15.0),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      validator: (value) {
                        if (_controllerconfirmPw.text !=
                            _controllerPassword.text) {
                          return "Password did not match";
                        } else {
                          return null;
                        }
                      },
                      onChanged: (value) {},
                      keyboardType: TextInputType.visiblePassword,
                      textInputAction: TextInputAction.done,
                    ),
                  ),

                  const SizedBox(height: 10),

                  Padding(
                    padding: const EdgeInsets.only(
                      top: 10,
                      bottom: 10,
                      left: 20,
                      right: 20,
                    ),
                    child: GestureDetector(
                      onTap: signUp,
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.orange[300],
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Center(
                          child: Text(
                            'Register',
                            style: TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 15),
                          ),
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 30),
                  // Bottom of page
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Padding(
                        padding: EdgeInsets.all(15.0),
                        child: Text(
                          'Already registered?',
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
                                return LoginPage(
                                  showRegisterPage: () {},
                                );
                              },
                            ),
                          );
                        },
                        child: const Text(
                          'Log In',
                          style: TextStyle(
                            color: Colors.blue,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
