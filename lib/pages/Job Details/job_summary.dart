// ignore_for_file: prefer_const_constructors

import 'package:fastrucks2/pages/Job%20Details/job_model.dart';
import 'package:flutter/material.dart';

class JobSummary extends StatefulWidget {
  const JobSummary({Key? key}) : super(key: key);

  @override
  _JobSummaryState createState() => _JobSummaryState();
}

class _JobSummaryState extends State<JobSummary> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[],
        ),
      ),
    );
  }
}
