import 'dart:async';

import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class MapScreen extends StatefulWidget {
  const MapScreen({super.key});

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  final Completer<GoogleMapController> _controller = Completer();

  static const double _latitude = -1.2833301;
  static const double _longitude = 36.8166700;

  static const CameraPosition initialPos =
      CameraPosition(target: LatLng(_latitude, _longitude), zoom: 13.0);

  static const CameraPosition targetPos = CameraPosition(
      target: LatLng(-2.2833391, 38.8166700),
      zoom: 13.0,
      bearing: 192,
      tilt: 60);
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Select Locations"),
        centerTitle: true,
      ),
      body: GoogleMap(
        initialCameraPosition: initialPos,
        mapType: MapType.normal,
        onMapCreated: (GoogleMapController controller) {
          _controller.complete(controller);
        },
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          _goToPlace();
        },
        label: Text('Go!'),
        icon: Icon(Icons.directions),
      ),
    );
  }

  Future<void> _goToPlace() async {
    final GoogleMapController controller = await _controller.future;
    controller.animateCamera(CameraUpdate.newCameraPosition(targetPos));
  }
}
