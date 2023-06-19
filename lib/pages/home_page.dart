import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:fastrucks2/pages/widgets/get_user_name.dart';
import 'package:fastrucks2/pages/about_us.dart';

import 'package:fastrucks2/supplier/user_profile.dart';
import 'package:fastrucks2/supplier/user_verification_page.dart';
import 'package:firebase_auth/firebase_auth.dart';

import 'package:flutter/material.dart';

// After  supplier sign in is successful
class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final user = FirebaseAuth.instance.currentUser!;

  //document id
  List<String> docIds = [];

  //get doc ID

  Future getDocId() async {
    await FirebaseFirestore.instance.collection('users').get().then(
          // ignore: avoid_function_literals_in_foreach_calls
          (snapshot) => snapshot.docs.forEach((document) {
            print(document.reference);
            docIds.add(document.reference.id);
          }),
        );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[300],
      appBar: AppBar(
        title: Center(
          child: Text(
            user.email!, //Change to their name
            style: const TextStyle(fontSize: 15, color: Colors.black),
          ),
        ),
        backgroundColor: Colors.orange[200],
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 5, left: 0),
            child: GestureDetector(
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: ((context) {
                  return const AboutUsPage();
                })));
              },
              child: const Icon(Icons.info_outline),
            ),
          ),
        ],
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 15.0),
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 20),
                child: MaterialButton(
                  onPressed: () {
                    Navigator.push(context,
                        MaterialPageRoute(builder: (context) {
                      return const UserProfile();
                    }));
                  },
                  color: Colors.lightGreen[200],
                  child: const Text('Proceed to dashboard'),
                ),
              ),
              const SizedBox(
                height: 10,
              ),
              MaterialButton(
                onPressed: () {
                  Navigator.push(context, MaterialPageRoute(builder: (context) {
                    return UserVerificationPage();
                  }));
                },
                color: Colors.lightGreen[200],
                child: const Text('Upload your documents'),
              ),
              const SizedBox(height: 30),
              MaterialButton(
                color: Colors.red,
                textColor: Colors.black,
                onPressed: () {
                  FirebaseAuth.instance.signOut();
                },
                child: const Icon(Icons.logout_sharp),
              ),
              const SizedBox(height: 50),
              Expanded(
                //Put a Clickable profile
                child: FutureBuilder(
                  future: getDocId(),
                  builder: ((context, snapshot) {
                    return ListView.builder(
                        itemCount: docIds.length,
                        itemBuilder: ((context, index) {
                          return Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: ListTile(
                              title: GetUserName(documentId: docIds[index]),
                              tileColor: Colors.grey[400],
                            ),
                          );
                        }));
                  }),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
