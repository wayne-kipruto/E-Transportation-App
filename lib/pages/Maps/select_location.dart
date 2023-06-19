// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables

import 'dart:async';

import 'package:awesome_snackbar_content/awesome_snackbar_content.dart';
import 'package:fastrucks2/pages/Job Details/confirm_job_details.dart';
import 'package:flutter/material.dart';
import 'package:flutter_google_places/flutter_google_places.dart';
import 'package:geolocator/geolocator.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:google_maps_webservice/places.dart';
import 'package:google_api_headers/google_api_headers.dart';

class SelectLocation extends StatefulWidget {
  const SelectLocation({super.key});

  @override
  State<SelectLocation> createState() => _SelectLocationState();
}

class _SelectLocationState extends State<SelectLocation> {
  static const double _latitude = -1.2833301;
  static const double _longitude = 36.8166700;

  static const CameraPosition _defaultLocation /*Nairobi*/ =
      CameraPosition(target: LatLng(_latitude, _longitude), zoom: 11);

  final TextEditingController _searchController = TextEditingController();
  final TextEditingController _searchController2 = TextEditingController();

  late LatLng destination;
  late LatLng source;

  Set<Marker> markers = <Marker>{};
  Set<Marker> markersList = {};

  late GoogleMapController googleMapController;

  final kGoogleApiKey = 'AIzaSyBaPqOe6-Fuex5XOvMOW5a3NruZlkXuIy0';
  final homeScaffoldKey = GlobalKey<ScaffoldState>();

  final Mode _mode = Mode.overlay;

  Future<void> _handleSearches() async {
    Prediction? p = await PlacesAutocomplete.show(
        context: context,
        apiKey: kGoogleApiKey,
        onError: onError,
        mode: _mode,
        language: 'en',
        strictbounds: false,
        types: [""],
        decoration: InputDecoration(
            hintText: 'Search',
            focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(20),
                borderSide: BorderSide(color: Colors.white))),
        components: [
          Component(Component.country, "ke"),
        ]);

    displayPrediction(p!, homeScaffoldKey.currentState);
  }

  void onError(PlacesAutocompleteResponse response) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      elevation: 0,
      behavior: SnackBarBehavior.floating,
      backgroundColor: Colors.transparent,
      content: AwesomeSnackbarContent(
        title: 'Message',
        message: response.errorMessage!,
        contentType: ContentType.failure,
      ),
    ));

    // homeScaffoldKey.currentState!.showSnackBar(SnackBar(content: Text(response.errorMessage!)));
  }

  Future<void> displayPrediction(
      Prediction p, ScaffoldState? currentState) async {
    GoogleMapsPlaces places = GoogleMapsPlaces(
        apiKey: kGoogleApiKey,
        apiHeaders: await const GoogleApiHeaders().getHeaders());

    PlacesDetailsResponse detail = await places.getDetailsByPlaceId(p.placeId!);

    final lat = detail.result.geometry!.location.lat;
    final lng = detail.result.geometry!.location.lng;

    markersList.clear();
    markersList.add(Marker(
        markerId: const MarkerId("0"),
        position: LatLng(lat, lng),
        infoWindow: InfoWindow(title: detail.result.name)));

    setState(() {});

    googleMapController
        .animateCamera(CameraUpdate.newLatLngZoom(LatLng(lat, lng), 14.0));
  }

  @override
  Widget build(BuildContext context) => Scaffold(
        key: homeScaffoldKey,
        body: Column(
          children: [
            Padding(
              padding: const EdgeInsets.only(top: 35.0),
              child: buildProfileTile(),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 15.0),
              child: buildTextField(),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 15.0),
              child: buildTextField2(),
            ),
            Expanded(
              child: GoogleMap(
                mapType: MapType.normal,
                markers: markers,
                initialCameraPosition: _defaultLocation,
                zoomControlsEnabled: false,
                onMapCreated: (GoogleMapController controller) {
                  googleMapController = controller;
                },
              ),
            ),
            Container(
              padding: const EdgeInsets.only(top: 15, right: 12),
              alignment: Alignment.topRight,
              child: Column(
                children: <Widget>[
                  Padding(
                    padding: EdgeInsets.all(10),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        FloatingActionButton(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => ConfirmJDetails(),
                              ),
                            );
                          },
                          backgroundColor: Colors.blue,
                          child: Icon(Icons.next_week, size: 30),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        floatingActionButton: FloatingActionButton.extended(
          onPressed: () async {
            Position position = await _determinePosition();

            googleMapController.animateCamera(CameraUpdate.newCameraPosition(
                CameraPosition(
                    target: LatLng(position.latitude, position.longitude),
                    zoom: 14)));

            markers.clear();

            markers.add(Marker(
                markerId: const MarkerId('currentLocation'),
                position: LatLng(position.latitude, position.longitude)));

            setState(() {});
          },
          label: const Text("Current Location"),
          icon: const Icon(Icons.location_history),
        ),
      );

  Widget buildProfileTile() {
    return Positioned(
      top: 20,
      left: 20,
      right: 20,
      child: Container(
        width: Get.width,
        child: Row(children: [
          const SizedBox(
            width: 15,
          ),
          Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(15.0),
                child: Center(
                  child: Text(
                    'Where are we delivering to?',
                    style: GoogleFonts.rubik(
                        fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                ),
              )
            ],
          ),
        ]),
      ),
    );
  }

  Widget buildTextField() {
    return Positioned(
      top: 100,
      left: 20,
      right: 20,
      child: Container(
        width: Get.width,
        height: 50,
        decoration: BoxDecoration(
            color: Colors.white,
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.05),
                spreadRadius: 1,
                blurRadius: 1,
              ),
            ],
            borderRadius: BorderRadius.circular(8)),
        child: Padding(
          padding: const EdgeInsets.all(10.0),
          child: TextFormField(
            readOnly: true,
            onTap: () async {
              _handleSearches();
            },
            controller: _searchController,
            textCapitalization: TextCapitalization.words,
            style: GoogleFonts.montserrat(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: Color(0xffA7A7A7)),
            decoration: InputDecoration(
              hintText: 'Deliver To:',
              suffixIcon: Padding(
                padding: const EdgeInsets.only(left: 10),
                child: Icon(
                  Icons.search,
                ),
              ),
              border: InputBorder.none,
            ),
          ),
        ),
      ),
    );
  }

  Widget buildTextField2() {
    return Positioned(
      top: 100,
      left: 20,
      right: 20,
      child: Container(
        width: Get.width,
        height: 50,
        decoration: BoxDecoration(
            color: Colors.white,
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.05),
                spreadRadius: 1,
                blurRadius: 1,
              ),
            ],
            borderRadius: BorderRadius.circular(8)),
        child: Padding(
          padding: const EdgeInsets.all(10.0),
          child: TextFormField(
            readOnly: true,
            onTap: () async {
              _handleSearches();
            },
            controller: _searchController2,
            textCapitalization: TextCapitalization.words,
            style: GoogleFonts.montserrat(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: Color(0xffA7A7A7)),
            decoration: InputDecoration(
              hintText: 'Deliver From:',
              suffixIcon: Padding(
                padding: const EdgeInsets.only(left: 10),
                child: Icon(
                  Icons.search,
                ),
              ),
              border: InputBorder.none,
            ),
          ),
        ),
      ),
    );
  }

  Future<Position> _determinePosition() async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();

    if (!serviceEnabled) {
      return Future.error('Location services are disabled');
    }

    permission = await Geolocator.checkPermission();

    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();

      if (permission == LocationPermission.denied) {
        return Future.error("Location permission denied");
      }
    }

    if (permission == LocationPermission.deniedForever) {
      return Future.error('Location permissions are permanently denied');
    }

    Position position = await Geolocator.getCurrentPosition();

    return position;
  }
}
