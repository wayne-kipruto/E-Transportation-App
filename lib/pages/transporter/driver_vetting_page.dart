// ignore_for_file: prefer_const_constructors, avoid_print, use_build_context_synchronously

import 'package:fastrucks2/pages/transporter/driver_profile.dart';
import 'package:file_picker/file_picker.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:fastrucks2/pages/widgets/upload_files_function.dart';

class DriverVettingPage extends StatefulWidget {
  const DriverVettingPage({super.key});

  @override
  State<DriverVettingPage> createState() => _DriverVettingPageState();
}

class _DriverVettingPageState extends State<DriverVettingPage> {
  final user = FirebaseAuth.instance.currentUser!;
  @override
  Widget build(BuildContext context) {
    final storage = Storage();
    return Scaffold(
      backgroundColor: Colors.grey[300],
      appBar: AppBar(
        centerTitle: true,
        backgroundColor: Colors.orange[200],
        title: Text(
          'Transporter Verification (${user.email!})',
          style: GoogleFonts.rubik(fontSize: 15, color: Colors.black),
        ),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.only(top: 15, bottom: 15),
          child: Container(
            padding: EdgeInsets.only(left: 30, right: 30, top: 20),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Welcome Transporter and thank you for choosing FasTrucks. Before\n you can start doing jobs, we have to verify a few things...",
                  style: GoogleFonts.rubik(fontSize: 15),
                ),
                SizedBox(
                  height: 5,
                ),
                Text(
                  "We have to assure our suppliers that our their goods are safe \n and that our transporters are TRUSTWORTHY.",
                  style: GoogleFonts.rubik(fontSize: 15),
                ),
                SizedBox(
                  height: 5,
                ),
                Text(
                    "Therefore, we require you to submit the following details for verification.",
                    style: GoogleFonts.rubik(fontSize: 15)),
                SizedBox(
                  height: 5,
                ),
                Text(
                    " 1. A copy of the vehicle logbook to prove ownership of the vehicle\n 2. Pictures of the vehicle (Front, side or back) \n 3. Transporter Information such as the Driving License ",
                    style: GoogleFonts.rubik(fontSize: 15)),
                SizedBox(
                  height: 15,
                ),
                Text(
                    " Once you select the picture, it will automatically upload your file",
                    style: GoogleFonts.rubik(
                        fontSize: 15, color: Colors.red[500])),
                SizedBox(
                  height: 5,
                ),
                Text(" Ensure that your documents are named appropriately",
                    style: GoogleFonts.rubik(
                        fontSize: 15, color: Colors.red[500])),
                SizedBox(
                  height: 30,
                ),
                Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Text(
                      'Please attach the required below ',
                      style: GoogleFonts.rubik(fontSize: 20),
                      textAlign: TextAlign.center,
                    ),
                    SizedBox(height: 10),
                    Padding(
                      padding: const EdgeInsets.only(bottom: 15),
                      child: Text(
                        '(The allowed file extensions is ".jpg" and ".png")',
                        style: GoogleFonts.rubik(
                            fontSize: 10, fontWeight: FontWeight.bold),
                        textAlign: TextAlign.left,
                      ),
                    ),
                    //put an image preview for the file
                    SizedBox(height: 20),
                  ],
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: [
                    Text(
                      "1. Vehicle Logbook:",
                      style: GoogleFonts.rubik(fontSize: 15),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(10),
                      child: Icon(
                        Icons.document_scanner_sharp,
                        size: 25,
                      ),
                    ),
                    ElevatedButton(
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
                        'Upload file ',
                        style: GoogleFonts.rubik(fontSize: 15),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 20),
                Row(
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: [
                    Text(
                      "2. Vehicle Pictures:",
                      style: GoogleFonts.rubik(fontSize: 15),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(10),
                      child: Icon(
                        Icons.image_outlined,
                        size: 25,
                      ),
                    ),
                    ElevatedButton(
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
                        'Upload file ',
                        style: GoogleFonts.rubik(fontSize: 15),
                      ),
                    ),
                  ],
                ),
                SizedBox(
                  height: 20,
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: [
                    Text(
                      "3. Driving License :",
                      style: GoogleFonts.rubik(fontSize: 15),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(10),
                      child: Icon(
                        Icons.image_sharp,
                        size: 25,
                      ),
                    ),
                    ElevatedButton(
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
                        'Upload File',
                        style: GoogleFonts.rubik(fontSize: 15),
                      ),
                    ),
                  ],
                ),
                SizedBox(
                  height: 20,
                ),
                Center(
                  child: Padding(
                    padding: const EdgeInsets.only(top: 20.0),
                    child: MaterialButton(
                      onPressed: () {
                        Navigator.push(context,
                            MaterialPageRoute(builder: (context) {
                          return DriverProfile();
                        }));
                      },
                      color: Colors.orange[200],
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 10.0),
                        child: Text(
                          'Proceed to profile ',
                          style: GoogleFonts.rubik(fontSize: 15),
                        ),
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
