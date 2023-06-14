// ignore_for_file: prefer_interpolation_to_compose_strings, prefer_const_constructors

import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class GetTrucker extends StatelessWidget {
  final String documentId;
  const GetTrucker({super.key, required this.documentId});

  @override
  Widget build(BuildContext context) {
    CollectionReference users =
        FirebaseFirestore.instance.collection('transporters');
    return FutureBuilder<DocumentSnapshot>(
      future: users.doc(documentId).get(),
      builder: ((context, snapshot) {
        if (snapshot.connectionState == ConnectionState.done) {
          Map<String, dynamic> data =
              snapshot.data!.data() as Map<String, dynamic>;
          // ignore: prefer_adjacent_string_concatenation
          return Text('${data[' name']}' +
              ' ' +
              '${data['age']} ' +
              'years old' +
              ' ' +
              '${data['vehicle']}');
        }
        return Text('Loading...');
      }),
    );
  }
}
