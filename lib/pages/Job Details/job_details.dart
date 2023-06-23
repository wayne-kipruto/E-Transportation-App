// ignore_for_file: prefer_const_constructors

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:fastrucks2/pages/Job%20Details/job_model.dart';
import 'package:fastrucks2/supplier/browse_trucks.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:fastrucks2/pages/Job Details/myjobsmodel.dart';

class JobDetailsPage extends StatefulWidget {
  const JobDetailsPage({super.key});

  @override
  State<JobDetailsPage> createState() => _JobDetailsPageState();
}

class _JobDetailsPageState extends State<JobDetailsPage> {
  @override
  void initState() {
    super.initState();

    goodsDescription.addListener(() => setState(() {}));
  }

  final goodsDescription = TextEditingController();
  final goodsSelected = TextEditingController();
  final vehicleSelected = TextEditingController();
  final destController = TextEditingController();
  final sourceController = TextEditingController();
  final contactController = TextEditingController();

  JobModel jobModel = JobModel();
  MyJobsModel myJobsModel = MyJobsModel();

  final _auth = FirebaseAuth.instance;
  final user = FirebaseAuth.instance.currentUser!;

  @override
  void dispose() {
    goodsSelected.dispose();
    vehicleSelected.dispose();
    goodsDescription.dispose();
    destController.dispose();
    sourceController.dispose();
    contactController.dispose();

    FirebaseFirestore.instance
        .collection('users')
        .doc(user.uid)
        .collection('myJobs')
        .doc(user.uid)
        .get()
        .then((value) => myJobsModel = MyJobsModel());
    setState(() {});
    super.dispose();
  }

  addJobToMyJobs() async {
    FirebaseFirestore firebaseFirestore = FirebaseFirestore.instance;
    User? user = _auth.currentUser;
    myJobsModel.goodsSelected = dropdownValue;
    myJobsModel.destination = destController.text;
    myJobsModel.source = sourceController.text;
    myJobsModel.userId = user!.uid;
    myJobsModel.jobDescription = goodsDescription.text;
    myJobsModel.vehicleSelected = dropdownValue2;
    // myJobsModel.dateSelected = _dateTime;
    myJobsModel.contactPerson = contactController.text;

    await firebaseFirestore
        .collection('users')
        .doc(user.uid)
        .collection('myJobs')
        .doc(myJobsModel.userId)
        .set(myJobsModel.toMap());
  }

  addJob() async {
    FirebaseFirestore firebaseFirestore = FirebaseFirestore.instance;
    JobModel jobModel = JobModel();
    User? user = _auth.currentUser;
    jobModel.goodsSelected = dropdownValue; //goods selector
    jobModel.vehicleSelected = dropdownValue2; //Vehicle selector
    jobModel.dateSelected = _dateTime;
    jobModel.userId = user!.uid;
    jobModel.source = sourceController.text;
    jobModel.destination = destController.text;
    jobModel.jobDescription = goodsDescription.text;
    jobModel.contactPerson = contactController.text;

    await firebaseFirestore
        .collection('jobDetails')
        .doc(user.uid)
        .set(jobModel.toMap());

    ScaffoldMessenger.of(context)
        .showSnackBar(const SnackBar(content: Text('Job Saved')));
  }

  // List<String> goods = [
  //   'Perishables (Foodstuffs...)',
  //   'Fragile Goods (Glassware, Tiles etc...)',
  //   'Construction Materials (Cement, Metal Rods, Sand etc...)',
  //   'Household items (Couches, Fridges, TV, Beds etc...)',
  //   'Other...(Specify below)',
  // ];
  List<String> goods = [
    'Perishables ',
    'Fragile Goods ',
    'Construction Materials ',
    'Household items ',
    'Other...(Specify below)',
  ];
  String dropdownValue = 'Perishables ';

  String dropdownValue2 = 'Flatbed';

  List<String> vehicle = [
    'Flatbed',
    'Special body type',
    'Small Sized Box Truck (N-Series)',
    'Medium Sized Box Truck (F-Series)',
    'Long Haul Trucks (Trailers)',
    'Other...(Specify below)',
  ];

  DateTime _dateTime = DateTime.now();

  void _showDatePicker() {
    showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime.now(),
      lastDate: DateTime(2023),
    ).then((dateValue) {
      setState(() {
        _dateTime = dateValue!;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[300],
      appBar: AppBar(
        backgroundColor: Colors.orange[200],
        title: Text(
          'Job Details Page',
          style: GoogleFonts.rubik(fontSize: 20, color: Colors.black),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.all(10.0),
              child: contactPerson(),
            ),
            SizedBox(height: 20),
            Padding(
              padding: const EdgeInsets.only(
                left: 10,
              ),
              child: Text(
                "Enter details about the delivery below ",
                style: GoogleFonts.montserrat(
                    fontSize: 20, fontWeight: FontWeight.bold),
              ),
            ),
            SizedBox(height: 10),
            Padding(
              padding: const EdgeInsets.only(top: 20.0, left: 10, right: 10),
              child: Text(
                "Goods to be transported",
                style: GoogleFonts.montserrat(
                    fontSize: 17, fontWeight: FontWeight.bold),
              ),
            ),
            SizedBox(height: 20),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 10),
              child: DropdownButton<String>(
                alignment: AlignmentDirectional.center,
                dropdownColor: Colors.white,
                iconSize: 24,
                elevation: 15,
                onChanged: (String? newValue) {
                  setState(() {
                    dropdownValue = newValue!;
                  });
                },
                value: dropdownValue,
                items: goods.map<DropdownMenuItem<String>>(
                  (String goodsValue) {
                    return DropdownMenuItem<String>(
                      value: goodsValue,
                      child: Text(goodsValue,
                          style: GoogleFonts.rubik(fontSize: 15)),
                    );
                  },
                ).toList(),
              ),
            ),
            SizedBox(height: 20),
            Padding(
              padding: const EdgeInsets.only(top: 15, right: 5, left: 5),
              child: Text(
                "Select the preferred vehicle type ",
                style: GoogleFonts.montserrat(
                    fontSize: 18,
                    color: Colors.black,
                    fontWeight: FontWeight.bold),
              ),
            ),
            SizedBox(height: 20),
            DropdownButton<String>(
              alignment: AlignmentDirectional.center,
              dropdownColor: Colors.white,
              iconSize: 24,
              elevation: 15,
              onChanged: (String? value2) {
                setState(() {
                  dropdownValue2 = value2!;
                });
              },
              value: dropdownValue2,
              items: vehicle.map<DropdownMenuItem<String>>(
                (String value) {
                  return DropdownMenuItem<String>(
                    value: value,
                    child: Text(
                      value,
                      style: GoogleFonts.rubik(fontSize: 15),
                    ),
                  );
                },
              ).toList(),
            ),
            SizedBox(height: 20),
            Column(
              mainAxisAlignment: MainAxisAlignment.start,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                MaterialButton(
                  onPressed: _showDatePicker,
                  color: Colors.orange[300],
                  child: Padding(
                    padding: const EdgeInsets.all(15.0),
                    child: Text(
                      "Choose Delivery date",
                      style:
                          GoogleFonts.rubik(fontSize: 15, color: Colors.black),
                    ),
                  ),
                ),
                SizedBox(height: 15),
                //Displaying the chosen date
                Text(
                  'You selected: ',
                  style: GoogleFonts.montserrat(fontSize: 17),
                ),
                SizedBox(height: 5),
                Text(
                  _dateTime.toString(),
                  style: GoogleFonts.rubik(
                      fontSize: 15, fontWeight: FontWeight.bold),
                ),
                SizedBox(height: 30),
                Padding(
                  padding: const EdgeInsets.all(10.0),
                  child: Container(
                    child: buildDescription(),
                  ),
                ),
                Text("Enter the location information below .",
                    style: GoogleFonts.rubik(
                        fontSize: 15, fontWeight: FontWeight.bold)),
                Padding(
                  padding: const EdgeInsets.all(10.0),
                  child: sourceLocation(),
                ),
                Padding(
                  padding: const EdgeInsets.all(10.0),
                  child: destinationLocation(),
                ),

                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: <Widget>[
                    MaterialButton(
                      color: Colors.orange[300],
                      onPressed: () {
                        // addJob(); Add Job to firebase Function
                        Navigator.push(context,
                            MaterialPageRoute(builder: (context) {
                          return ViewTrucks();
                        }));
                      },
                      child: Padding(
                        padding: const EdgeInsets.all(10),
                        child: Text(
                          'Select Transporter',
                          style: GoogleFonts.rubik(
                              fontSize: 15, color: Colors.black),
                        ),
                      ),
                    ),
                    SizedBox(
                      width: 20,
                    ),
                    MaterialButton(
                      color: Colors.orange[300],
                      onPressed: () {
                        addJobToMyJobs();
                        addJob();

                        // Navigator.push(context,
                        //     MaterialPageRoute(builder: (context) {
                        //   return JobSummary();
                        // }));
                      },
                      child: Padding(
                        padding: const EdgeInsets.all(10),
                        child: Text(
                          'Save Job',
                          style: GoogleFonts.rubik(
                              fontSize: 15, color: Colors.black),
                        ),
                      ),
                    ),
                  ],
                ),

                SizedBox(
                  height: 20,
                )
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget buildDescription() => TextField(
        controller: goodsDescription,
        decoration: InputDecoration(
          hintText: 'Eg: 40 sacks of potatoes @ 10 Tonnes ',
          hintStyle: GoogleFonts.montserrat(fontSize: 16),
          label: Text('A brief description of the goods and total tonnage(T)',
              style: GoogleFonts.montserrat(fontSize: 16)),
          prefixIcon: Icon(Icons.description),
          suffixIcon: goodsDescription.text.isEmpty
              ? Container(width: 0)
              : IconButton(
                  icon: Icon(Icons.close),
                  onPressed: () => goodsDescription.clear(),
                ),
          border: OutlineInputBorder(),
        ),
        keyboardType: TextInputType.multiline,
        textInputAction: TextInputAction.done,
      );

  Widget sourceLocation() => TextField(
        controller: sourceController,
        decoration: InputDecoration(
          label: Text(
            'Delivered From:',
            style: GoogleFonts.montserrat(fontSize: 16),
          ),
          prefixIcon: Icon(Icons.description),
          suffixIcon: sourceController.text.isEmpty
              ? Container(width: 0)
              : IconButton(
                  icon: Icon(Icons.close),
                  onPressed: () => sourceController.clear(),
                ),
          border: OutlineInputBorder(),
        ),
        keyboardType: TextInputType.text,
        textInputAction: TextInputAction.done,
      );

  Widget destinationLocation() => TextField(
        controller: destController,
        decoration: InputDecoration(
          label: Text(
            'Delivered To:',
            style: GoogleFonts.montserrat(fontSize: 16),
          ),
          prefixIcon: Icon(Icons.description),
          suffixIcon: destController.text.isEmpty
              ? Container(width: 0)
              : IconButton(
                  icon: Icon(Icons.close),
                  onPressed: () => destController.clear(),
                ),
          border: OutlineInputBorder(),
        ),
        keyboardType: TextInputType.text,
        textInputAction: TextInputAction.done,
      );
  Widget contactPerson() => TextField(
        controller: contactController,
        decoration: InputDecoration(
          label: Text(
            'Supplier Name:',
            style: GoogleFonts.montserrat(fontSize: 16),
          ),
          prefixIcon: Icon(Icons.person),
          suffixIcon: contactController.text.isEmpty
              ? Container(width: 0)
              : IconButton(
                  icon: Icon(Icons.close),
                  onPressed: () => contactController.clear(),
                ),
          border: OutlineInputBorder(),
        ),
        keyboardType: TextInputType.text,
        textInputAction: TextInputAction.done,
      );
}
