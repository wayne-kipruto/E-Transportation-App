// ignore_for_file: prefer_const_constructors, non_constant_identifier_names, prefer_interpolation_to_compose_strings

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:fastrucks2/pages/Chats/chat_home.dart';
import 'package:fastrucks2/pages/transporter/tran_model.dart';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class ViewTrucks extends StatefulWidget {
  const ViewTrucks({super.key});

  @override
  State<ViewTrucks> createState() => _ViewTrucksState();
}

class _ViewTrucksState extends State<ViewTrucks> {
  User? user = FirebaseAuth.instance.currentUser!;
  TransporterModel tranModel = TransporterModel();

  @override
  void initState() {
    FirebaseFirestore.instance
        .collection('transporters')
        .doc(user!.uid)
        .get()
        .then((value) {
      tranModel = TransporterModel.fromMap(value.data());
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          "Select a transporter",
          style: GoogleFonts.rubik(fontSize: 15),
        ),
      ),
      body: Padding(
        padding:
            const EdgeInsets.only(left: 15.0, right: 15, top: 20, bottom: 20),
        child: StreamBuilder<QuerySnapshot<Map<String, dynamic>>>(
            stream: FirebaseFirestore.instance
                .collection('transporters')
                .snapshots(),
            builder: (_, snapshot) {
              if (snapshot.hasError) return Text('Error = ${snapshot.error}');

              if (snapshot.hasData) {
                final docs = snapshot.data!.docs;
                return Expanded(
                  child: ListView.builder(
                      itemCount: docs.length,
                      itemExtent: 100,
                      itemBuilder: (_, i) {
                        final data = docs[i].data();
                        DocumentSnapshot userData = snapshot.data!.docs[i];

                        return ListTile(
                          dense: false,
                          visualDensity: const VisualDensity(vertical: 4),
                          title: Text(
                            "Name: " + data['name'] + "\n Age: " + data['age'],
                          ),
                          subtitle: Text("Vehicle Type: " + data['vehicle']),
                          trailing: IconButton(
                            onPressed: () {
                              Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) => ChatHome(),
                                  ));
                            },
                            icon: Icon(Icons.message),
                          ),
                        );
                      }),
                );
              }
              return const Center(
                child: CircularProgressIndicator(),
              );
            }),
      ),
    );
  }

  List<String> docIds = [];
  Future getDocs() async {
    await FirebaseFirestore.instance
        .collection('users')
        // .where('role', isEqualTo: 'Transporter')
        .get()
        // ignore: avoid_function_literals_in_foreach_calls
        .then((snapshot) => snapshot.docs.forEach((document) {
              print(document.reference);
              docIds.add(document.reference.id);
            }));
  }
}
