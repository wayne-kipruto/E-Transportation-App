// ignore_for_file: prefer_const_constructors, prefer_interpolation_to_compose_strings

import 'dart:html';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:fastrucks2/pages/Job%20Details/myjobsmodel.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class ActiveJobs extends StatefulWidget {
  final user = FirebaseAuth.instance.currentUser!;

  ActiveJobs({super.key});

  @override
  State<ActiveJobs> createState() => _ActiveJobsState();
}

class _ActiveJobsState extends State<ActiveJobs> {
  final user = FirebaseAuth.instance.currentUser!;
  MyJobsModel myJobsModel = MyJobsModel();

  @override
  void initState() {
    FirebaseFirestore.instance
        .collection('users')
        .doc(user.uid)
        .collection('myJobs')
        .doc(user.uid)
        .get()
        .then((value) {
      myJobsModel = MyJobsModel.fromMap(value.data());
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'My Jobs',
          style: GoogleFonts.rubik(fontSize: 15),
        ),
        backgroundColor: Colors.orange[200],
        centerTitle: true,
      ),
      body: Padding(
        padding: EdgeInsets.only(left: 15, right: 15, top: 20, bottom: 20),
        child: StreamBuilder(
          stream: FirebaseFirestore.instance
              .collection('users')
              .doc(myJobsModel.uid)
              .snapshots(),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return Center(child: CircularProgressIndicator());
            } else if (snapshot.hasError) {
              return Center(child: Text('Error'));
            } else {
              var document = snapshot.data!.docs;
              return ListView.builder(
                itemCount: snapshot.data!.document,
                itemBuilder: (BuildContext context, int index) {
                  final DocumentSnapshot data = snapshot.data!.docs[index];
                  return Expanded(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 8),
                      child: ListTile(
                        dense: false,
                        visualDensity: VisualDensity(vertical: 4),
                        title: Text(
                          "Goods " +
                              data['goodsSelected'] + // the records in firebase
                              "\nInfo:" +
                              data['jobDescription'] +
                              "\nVehicle Selected: " +
                              data['vehicleSelected'],
                          style: GoogleFonts.montserrat(fontSize: 11),
                        ),
                        subtitle: Padding(
                          padding: const EdgeInsets.symmetric(
                            vertical: 8.0,
                          ),
                          child: Text("From:" +
                              data['delieved From'] +
                              "To:" +
                              data['delievered To']),
                        ),
                        trailing: IconButton(
                          onPressed: () {
                            //function to send info to transporters active jobs
                            ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('Job Rejected')));
                          },
                          icon: Icon(
                            Icons.cancel_outlined,
                            color: Colors.red,
                          ),
                        ),
                        leading: IconButton(
                          onPressed: () {
                            //function to remove info from their screen
                            ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('Job Accepted')));
                          },
                          icon: Icon(
                            Icons.check_circle_outline,
                            color: Colors.lightGreenAccent,
                          ),
                        ),
                      ),
                    ),
                  );
                },
              );
            }
            //
          },
        ),
      ),
    );
  }
}
