// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables

import 'package:fastrucks2/onboarding_page.dart';
import 'package:fastrucks2/pages/Chats/chat_home.dart';
import 'package:fastrucks2/payments/payments.dart';
import 'package:fastrucks2/supplier/active_jobs.dart';
import 'package:fastrucks2/supplier/user_settings_page.dart';
import 'package:firebase_auth/firebase_auth.dart';

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../auth/new auth/signin_page.dart';
import '../pages/Job Details/job_details.dart';
import '../pages/Maps/select_location.dart';

class UserProfile extends StatefulWidget {
  const UserProfile({super.key});

  @override
  State<UserProfile> createState() => _UserProfileState();
}

Stream? slides;
List<String> _carouselImages = [];
var _dotsPosition = 0;
final PageController controller = PageController();
final TextEditingController _searchController = TextEditingController();

class _UserProfileState extends State<UserProfile> {
  var user = FirebaseAuth.instance.currentUser!;

  /*fetchCarouselImages() async {
    var firestoreInstance = FirebaseFirestore.instance;
    QuerySnapshot qn = await firestoreInstance.collection('users').get();
    setState(() {
      for (int i = 0; i < qn.docs.length; i++) {
        _carouselImages.add(
          qn.docs[i]['img'],

          // ignore: avoid_print
        );
        print(qn.docs[i]['img']);
      }
    });
    return qn.docs;
  }
  

  @override
  void initState() {
    fetchCarouselImages();
    super.initState();
  }
*/
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[00],
      appBar: AppBar(
        backgroundColor: Colors.orange[200],
        title: Text(
          "Supplier Home Page",
          style: GoogleFonts.rubik(fontSize: 15, color: Colors.black),
        ),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(10),
        child: Center(
          child: GridView(
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              mainAxisSpacing: 15,
              crossAxisSpacing: 15,
            ),
            children: [
              InkWell(
                onTap: () {
                  Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => ActiveJobs(),
                      ));
                },
                child: Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(20),
                    color: Colors.grey[400],
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.messenger_rounded,
                        size: 50,
                        color: Colors.black,
                      ),
                      Text(
                        'View My Jobs ',
                        style: GoogleFonts.rubik(
                            fontSize: 25, color: Colors.black),
                      )
                    ],
                  ),
                ),
              ),
              InkWell(
                onTap: () {
                  Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => JobDetailsPage(),
                      ));
                },
                child: Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(20),
                    color: Colors.orange[200],
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.add_task_outlined,
                        size: 45,
                        color: Colors.black,
                      ),
                      Text(
                        'Create a Job',
                        style: GoogleFonts.rubik(
                            fontSize: 25, color: Colors.black),
                      )
                    ],
                  ),
                ),
              ),
              InkWell(
                onTap: () {
                  Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => PaymentsPage(),
                      ));
                },
                child: Container(
                  width: 200,
                  height: 200,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(20),
                    color: Colors.grey[400],
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.attach_money,
                            size: 50,
                            color: Colors.black,
                          ),
                          Icon(
                            Icons.attach_money,
                            size: 50,
                            color: Colors.black,
                          ),
                        ],
                      ),
                      Text(
                        'Payments ',
                        style: GoogleFonts.rubik(
                            fontSize: 25, color: Colors.black),
                      )
                    ],
                  ),
                ),
              ),
              InkWell(
                onTap: () {
                  Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => ChatHome(),
                      ));
                },
                child: Container(
                  width: 200,
                  height: 200,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(20),
                    color: Colors.grey[400],
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.message_outlined,
                            size: 50,
                            color: Colors.black,
                          ),
                        ],
                      ),
                      Text(
                        'View Chats',
                        style: GoogleFonts.rubik(
                            fontSize: 25, color: Colors.black),
                      )
                    ],
                  ),
                ),
              ),
              InkWell(
                onTap: () {
                  Navigator.push(context, MaterialPageRoute(builder: (context) {
                    return SelectLocation();
                  }));
                },
                child: Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(20),
                    color: Colors.brown[400],
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.map_sharp,
                        size: 45,
                        color: Colors.black,
                      ),
                      Text(
                        'Open Maps',
                        style: GoogleFonts.rubik(
                            fontSize: 25, color: Colors.black),
                      )
                    ],
                  ),
                ),
              ),
              InkWell(
                onTap: () {
                  Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => UserSettingsPage(),
                      ));
                },
                child: Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(20),
                    color: Colors.orange[200],
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.settings,
                        size: 50,
                        color: Colors.black,
                      ),
                      Text(
                        'My Settings',
                        style: GoogleFonts.rubik(
                            fontSize: 25, color: Colors.black),
                      ),
                    ],
                  ),
                ),
              ),
              InkWell(
                onTap: () {
                  FirebaseAuth.instance.signOut();
                  Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(
                          builder: (context) => OnboardingPage()));
                },
                child: Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(20),
                    color: Colors.red[400],
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.logout_outlined,
                        size: 45,
                        color: Colors.black,
                      ),
                      Text(
                        'Sign out',
                        style: GoogleFonts.rubik(
                            fontSize: 25, color: Colors.black),
                      )
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
