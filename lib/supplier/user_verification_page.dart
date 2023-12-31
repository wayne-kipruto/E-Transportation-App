// ignore_for_file: prefer_const_constructors, use_build_context_synchronously, prefer_const_literals_to_create_immutables

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:fastrucks2/pages/widgets/upload_files_function.dart';
import 'package:fastrucks2/supplier/business_info_model.dart';
import 'package:fastrucks2/supplier/user_profile.dart';
import 'package:file_picker/file_picker.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';

class UserVerificationPage extends StatefulWidget {
  @override
  State<UserVerificationPage> createState() => _UserVerificationPageState();
}

final user = FirebaseAuth.instance.currentUser!;
CollectionReference ref = FirebaseFirestore.instance.collection('suppInfo');
Widget _title() {
  return Text(
    'Supplier Verification Page (${user.displayName})',
    style: GoogleFonts.rubik(fontSize: 15, color: Colors.black),
  );
}

Widget _afterheader() {
  return Column(
    mainAxisAlignment: MainAxisAlignment.center,
    crossAxisAlignment: CrossAxisAlignment.center,
    children: <Widget>[
      Text(
        'Please fill in the details below ',
        style: GoogleFonts.rubik(fontSize: 20),
        textAlign: TextAlign.center,
      ),
      SizedBox(height: 10),

      //put an image preview for the file
    ],
  );
}

Widget _header() {
  return Column(
    mainAxisAlignment: MainAxisAlignment.center,
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text(
        "Welcome and thank you for choosing FasTrucks. \n\nBefore you can start using this service, we have to verify a few things.\n\nKindly provide the following information:\n",
        style: GoogleFonts.rubik(fontSize: 15),
      ),
      Text(
          "NOTE! Once you select the picture, it will automatically upload your file.\n\n Ensure that your documents are named appropriately. ",
          style: GoogleFonts.rubik(fontSize: 15, color: Colors.red[500])),
      SizedBox(
        height: 30,
      ),
    ],
  );
}

class _UserVerificationPageState extends State<UserVerificationPage> {
  final _businessNameController = TextEditingController();
  final _businessDescriptionController = TextEditingController();
  final _businessAddressController = TextEditingController();

  BusinessInfoModel businessModel = BusinessInfoModel();
  final _auth = FirebaseAuth.instance;

  @override
  void dispose() {
    _businessAddressController.dispose();
    _businessNameController.dispose();
    _businessDescriptionController.dispose();
    FirebaseFirestore.instance
        .collection('users')
        .doc(user.uid)
        .collection('businessInfo')
        .doc(user.uid)
        .get()
        .then(
            (value) => businessModel = BusinessInfoModel.fromMap(value.data()));
    setState(() {});

    super.dispose();
  }

  savetofirebase() async {
    FirebaseFirestore firebaseFirestore = FirebaseFirestore.instance;
    BusinessInfoModel businessModel = BusinessInfoModel();
    User? user = _auth.currentUser;
    businessModel.businessName = _businessNameController.text;
    businessModel.businessDescription = _businessDescriptionController.text;
    businessModel.businessAddress = _businessAddressController.text;

    await firebaseFirestore
        .collection('users')
        .doc(user!.uid)
        .collection('businessInfo')
        .doc(user.uid)
        .set(businessModel.toMap());

    ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Data Uploaded Successfully')));

    // Navigator.pushReplacement(
    //     context, MaterialPageRoute(builder: (context) => UserProfile()));
  }

  @override
  Widget build(BuildContext context) {
    final Storage storage =
        Storage(); // calling storage service from 'upload_files.dart'

    return Scaffold(
      backgroundColor: Colors.grey[300],
      appBar: AppBar(
        backgroundColor: Colors.orange[200],
        title: _title(),
        centerTitle: true,
      ),

      //Selecting files to be uploaded
      body: Container(
        padding: EdgeInsets.only(left: 30, right: 30, top: 20),
        child: SingleChildScrollView(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _header(),
              _afterheader(),
              TextField(
                controller: _businessNameController,
                decoration: InputDecoration(
                    label: Text('Business Name'),
                    prefixIcon: Icon(Icons.abc),
                    suffixIcon: _businessNameController.text.isEmpty
                        ? Container(width: 0)
                        : IconButton(
                            icon: Icon(Icons.close),
                            onPressed: () => _businessNameController.clear(),
                          ),
                    border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12))),
                keyboardType: TextInputType.text,
                textInputAction: TextInputAction.done,
              ),
              SizedBox(
                height: 10,
              ),
              TextField(
                controller: _businessAddressController,
                decoration: InputDecoration(
                  label: Text('Business Address'),
                  prefixIcon: Icon(Icons.abc),
                  suffixIcon: _businessAddressController.text.isEmpty
                      ? Container(width: 0)
                      : IconButton(
                          icon: Icon(Icons.close),
                          onPressed: () => _businessAddressController.clear(),
                        ),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                keyboardType: TextInputType.text,
                textInputAction: TextInputAction.done,
              ),
              SizedBox(
                height: 10,
              ),
              TextField(
                controller: _businessDescriptionController,
                decoration: InputDecoration(
                  label: Text('Business Description'),
                  prefixIcon: Icon(Icons.abc),
                  suffixIcon: _businessDescriptionController.text.isEmpty
                      ? Container(width: 0)
                      : IconButton(
                          icon: Icon(Icons.close),
                          onPressed: () =>
                              _businessDescriptionController.clear(),
                        ),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                keyboardType: TextInputType.text,
                textInputAction: TextInputAction.done,
              ),
              SizedBox(
                height: 10,
              ),
              Text(
                "Business Certificate:",
                style: GoogleFonts.rubik(
                    fontSize: 15, fontWeight: FontWeight.bold),
              ),
              Text(
                "(The allowed file types are image (.jpg and.png) files only.)",
                style: GoogleFonts.montserrat(
                    fontSize: 13, fontWeight: FontWeight.normal),
              ),
              SizedBox(
                height: 9,
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.all(5),
                    child: Icon(
                      Icons.document_scanner_sharp,
                      size: 40,
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.only(left: 10, top: 10),
                    child: MaterialButton(
                      color: Colors.orange[200],
                      onPressed: (() async {
                        final results = await FilePicker.platform.pickFiles(
                          allowMultiple: false,
                          type: FileType.custom,
                          allowedExtensions: ['jpg', 'png'],
                        );

                        if (results == null) {
                          ScaffoldMessenger.of(context)
                              .showSnackBar(const SnackBar(
                            content: Text('No file selected.'),
                          ));
                          return;
                        } else {
                          ScaffoldMessenger.of(context)
                              .showSnackBar(const SnackBar(
                            content: Text('File selected and uploaded.'),
                          ));
                        }

                        final path = results.files.single.path!;
                        final fileName = results.files.single.name;

                        storage
                            .uploadFile(path, fileName)
                            .then((value) => print('Done'));
                      }),
                      child: Text(
                        'Upload Business Certificate ',
                        style: GoogleFonts.rubik(
                            fontSize: 15, color: Colors.black),
                      ),
                    ),
                  ),
                ],
              ),
              SizedBox(
                height: 10,
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Padding(
                    padding: const EdgeInsets.only(top: 10.0),
                    child: MaterialButton(
                      onPressed: () async {
                        await savetofirebase();
                        //this prevents the user from seeing the page again
                        final prefs = await SharedPreferences.getInstance();
                        prefs.setBool('showHome', true);
                      },
                      color: Colors.orange[200],
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 10.0),
                        child: Text(
                          'Submit Info',
                          style: GoogleFonts.rubik(
                              fontSize: 15, color: Colors.black),
                        ),
                      ),
                    ),
                  ),
                  SizedBox(width: 20),
                  Padding(
                    padding: const EdgeInsets.only(top: 10.0),
                    child: ElevatedButton(
                      style: ButtonStyle(
                        backgroundColor: MaterialStatePropertyAll<Color>(
                          const Color.fromRGBO(255, 204, 128, 1),
                        ),
                      ),
                      onPressed: () async {
                        //this prevents the user from seeing the page again
                        final prefs = await SharedPreferences.getInstance();
                        prefs.setBool('showHome', true);

                        Navigator.of(context).pushReplacement(MaterialPageRoute(
                          builder: (context) => UserProfile(),
                        ));
                      },
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 10.0),
                        child: Text('Proceed to profile ',
                            style: GoogleFonts.rubik(
                              fontSize: 15,
                              color: Colors.black,
                            )),
                      ),
                    ),
                  ),
                ],
              )
            ],
          ),
        ),
      ),
    );
  }
}
