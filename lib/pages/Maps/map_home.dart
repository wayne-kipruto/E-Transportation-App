// ignore_for_file: prefer_const_constructors

import 'package:fastrucks2/pages/Maps/current_location.dart';
import 'package:flutter/material.dart';

class MapHome extends StatefulWidget {
  const MapHome({super.key});

  @override
  State<MapHome> createState() => _MapHomeState();
}

class _MapHomeState extends State<MapHome> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Select location"),
        centerTitle: true,
      ),
      body: SizedBox(
          width: MediaQuery.of(context).size.width,
          child: Column(
            children: [
              SizedBox(
                height: 5,
              ),
              ElevatedButton(
                  onPressed: () {
                    Navigator.of(context).push(
                        MaterialPageRoute(builder: (BuildContext context) {
                      return CurrentLocation();
                    }));
                  },
                  child: Text('Find Me!'))
            ],
          )),
    );
  }
}
