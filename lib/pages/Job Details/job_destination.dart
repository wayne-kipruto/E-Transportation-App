// ignore_for_file: prefer_const_constructors, use_build_context_synchronously

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:fastrucks2/pages/Job%20Details/location_model.dart';
import 'package:fastrucks2/supplier/browse_trucks.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';

class JobDestination extends StatefulWidget {
  const JobDestination({super.key});

  @override
  State<JobDestination> createState() => _JobDestinationState();
}

final user = FirebaseAuth.instance.currentUser!;

class _JobDestinationState extends State<JobDestination> {
  TextEditingController sourceController = TextEditingController();
  TextEditingController destController = TextEditingController();

  LocationModel locModel = LocationModel();

  @override
  void dispose() {
    sourceController.dispose();
    destController.dispose();
    FirebaseFirestore.instance
        .collection('jobDetails')
        .doc(user.uid)
        .get()
        .then((value) {
      locModel = LocationModel.fromMap(value.data());
    });
    super.dispose();
  }

  addtoJobDetails() async {
    FirebaseFirestore firebaseFirestore = FirebaseFirestore.instance;
    LocationModel locModel = LocationModel();
    User? user = FirebaseAuth.instance.currentUser!;

    await firebaseFirestore
        .collection('jobDetails')
        .doc(user.uid)
        .set(locModel.toMap());

    ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Location Information Saved')));

    Navigator.pushReplacement(
        context, MaterialPageRoute(builder: (context) => ViewTrucks()));
  }

  Widget buildTextField() {
    return Positioned(
      top: 100,
      left: 20,
      right: 20,
      child: Container(
        width: Get.width,
        height: 50,
        decoration: BoxDecoration(
            color: Colors.white,
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.05),
                spreadRadius: 1,
                blurRadius: 1,
              ),
            ],
            borderRadius: BorderRadius.circular(8)),
        child: Padding(
          padding: const EdgeInsets.all(10.0),
          child: TextFormField(
            controller: sourceController,
            textCapitalization: TextCapitalization.words,
            style: GoogleFonts.montserrat(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: Color(0xffA7A7A7)),
            decoration: InputDecoration(
              hintText: 'Deliver To:',
              border: InputBorder.none,
            ),
          ),
        ),
      ),
    );
  }

  Widget buildTextField2() {
    return Positioned(
      top: 100,
      left: 20,
      right: 20,
      child: Container(
        width: Get.width,
        height: 50,
        decoration: BoxDecoration(
            color: Colors.white,
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.05),
                spreadRadius: 1,
                blurRadius: 1,
              ),
            ],
            borderRadius: BorderRadius.circular(8)),
        child: Padding(
          padding: const EdgeInsets.all(10.0),
          child: TextFormField(
            controller: destController,
            textCapitalization: TextCapitalization.words,
            style: GoogleFonts.montserrat(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: Color(0xffA7A7A7)),
            decoration: InputDecoration(
              hintText: 'Deliver From:',
              border: InputBorder.none,
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[300],
      appBar: AppBar(
        backgroundColor: Colors.orange[300],
        title: Text(
          "Choose job destination",
          style: GoogleFonts.montserrat(fontSize: 15, color: Colors.black),
        ),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(15.0),
        child: SingleChildScrollView(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              Padding(
                padding: EdgeInsets.all(10),
                child: buildTextField(),
              ),
              SizedBox(
                height: 10,
              ),
              Padding(
                padding: EdgeInsets.all(8),
                child: buildTextField2(),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Padding(
                    padding: EdgeInsets.all(10),
                  ),
                  ElevatedButton(
                    onPressed: () {
                      addtoJobDetails();
                    },
                    child: Text(
                      "Submit",
                      style: GoogleFonts.montserrat(
                          fontSize: 13, color: Colors.white),
                    ),
                  ),
                  SizedBox(
                    width: 20,
                  ),
                  // ElevatedButton(
                  //   onPressed: () {
                  //     Navigator.push(context,
                  //         MaterialPageRoute(builder: (context) {
                  //       return ViewTrucks();
                  //     }));
                  //   },
                  //   child: Text(
                  //     "Select available transporters",
                  //     style: GoogleFonts.montserrat(
                  //         fontSize: 13, color: Colors.white),
                  //   ),
                  // )
                ],
              )
            ],
          ),
        ),
      ),
    );
  }
}

void sendData() {}
