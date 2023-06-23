// ignore_for_file: prefer_const_constructors, prefer_interpolation_to_compose_strings

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:fastrucks2/pages/Chats/Chat_search.dart';
import 'package:fastrucks2/pages/Job%20Details/view_jobs_model.dart';
import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_fonts/google_fonts.dart';

class ViewJobs extends StatefulWidget {
  const ViewJobs({super.key});

  @override
  State<ViewJobs> createState() => _ViewJobsState();
}

class _ViewJobsState extends State<ViewJobs> {
  User? user = FirebaseAuth.instance.currentUser;
  ViewJobsModel jobsModel = ViewJobsModel();

  @override
  void initState() {
    FirebaseFirestore.instance
        .collection('jobDetails')
        .doc(user!.uid)
        .get()
        .then((value) {
      jobsModel = ViewJobsModel.fromMap(value.data());
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'View Available Jobs',
          style: GoogleFonts.rubik(fontSize: 15),
        ),
        backgroundColor: Colors.orange[200],
        centerTitle: true,
      ),
      body: Padding(
        padding: EdgeInsets.only(left: 15, right: 15, top: 20, bottom: 20),
        child: StreamBuilder<QuerySnapshot<Map<String, dynamic>>>(
            stream:
                FirebaseFirestore.instance.collection('jobDetails').snapshots(),
            builder: (_, snapshot) {
              if (snapshot.hasError) {
                return Text('Error = ${snapshot.error}');
              }
              if (snapshot.hasData) {
                final docs = snapshot.data!.docs;

                return Expanded(
                  child: ListView.builder(
                    itemCount: docs.length,
                    itemExtent: 100,
                    itemBuilder: (_, i) {
                      final data = docs[i].data();
                      // DocumentSnapshot userData = snapshot.data!.docs[i];

                      return Padding(
                        padding: EdgeInsets.only(top: 8.0, bottom: 8.0),
                        child: ListTile(
                          dense: false,
                          visualDensity: const VisualDensity(vertical: 3),
                          title: Text(
                            "Contact:" +
                                data['supplierName'] +
                                "\nGoods: " +
                                data['goodsSelected'] +
                                "\nInfo: " +
                                data['jobDescription'] +
                                "\nVehicle : " +
                                data['vehicleSelected'],
                            style: GoogleFonts.rubik(fontSize: 12),
                          ),
                          subtitle: Padding(
                            padding: const EdgeInsets.only(top: 10, bottom: 10),
                            child: Text(
                                'From: ' +
                                    data['delivered From'] +
                                    "\nTo: " +
                                    data['delivered To']
                                // +
                                // "\nDelivery Date: " +
                                // data['dateSelected'],
                                ,
                                style: GoogleFonts.rubik(
                                    fontSize: 13, fontWeight: FontWeight.bold)),
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
                      );
                    },
                  ),
                );
              }
              return const Center(
                child: CircularProgressIndicator(),
              );
            }),
      ),
    );
  }
}
