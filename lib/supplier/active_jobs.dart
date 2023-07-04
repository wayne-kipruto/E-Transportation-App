// ignore_for_file: prefer_const_constructors, prefer_interpolation_to_compose_strings

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
        .doc(myJobsModel.userId)
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
              .doc(user.uid)
              .collection('myJobs')
              .doc(myJobsModel.userId)
              .snapshots(),
          builder: (context, AsyncSnapshot snapshot) {
            if (snapshot.hasError) {
              return Text('Error = ${snapshot.error}');
            }
            if (snapshot.hasData) {
              final docs = snapshot.data!.docs;

              return ListView.builder(
                  itemExtent: 100,
                  itemCount: docs.length,
                  itemBuilder: (_, i) {
                    final data = docs[i].data();

                    return Padding(
                        padding: EdgeInsets.symmetric(vertical: 8),
                        child: ListTile(
                          dense: false,
                          visualDensity: VisualDensity(
                            vertical: 4,
                          ),
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
                        ));
                  });
            }
            return const Center(
              child: CircularProgressIndicator(),
            );
          },
        ),
        //
      ),
    );
  }
}
