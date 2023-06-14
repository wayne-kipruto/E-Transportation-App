import 'package:fastrucks2/pages/Maps/map_home.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class ConfirmJDetails extends StatelessWidget {
  const ConfirmJDetails({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.orange[300],
        title: Text(
          'Confirm job details',
          style: GoogleFonts.montserrat(fontSize: 20),
        ),
      ),
      body: Column(
        children: [
          MaterialButton(
            color: Colors.orange[300],
            onPressed: () {
              // Navigator.push(context, MaterialPageRoute(builder: (context) {
              //   return const MapHome();
              // }));
            },
            child: Text(
              'Next',
              style: GoogleFonts.rubik(fontSize: 15, color: Colors.black),
            ),
          ),
        ],
      ),
    );
  }
}
