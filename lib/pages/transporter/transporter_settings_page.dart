// ignore_for_file: prefer_const_constructors, use_build_context_synchronously

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:fastrucks2/pages/transporter/tran_model.dart';
import 'package:fastrucks2/pages/widgets/upload_files_function.dart';
import 'package:file_picker/file_picker.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';

class TransporterSettings extends StatefulWidget {
  const TransporterSettings({super.key});

  @override
  State<TransporterSettings> createState() => _TransporterSettingsState();
}

class _TransporterSettingsState extends State<TransporterSettings> {
  TextEditingController nameController = TextEditingController();
  TextEditingController ageController = TextEditingController();
  TextEditingController vehicleController = TextEditingController();
  TextEditingController mobileController = TextEditingController();

  GlobalKey<FormState> formKey = GlobalKey<FormState>();
  User? user = FirebaseAuth.instance.currentUser;
  TransporterModel tranModel = TransporterModel();

  @override
  void dispose() {
    nameController.dispose();
    ageController.dispose();
    vehicleController.dispose();
    mobileController.dispose();

    FirebaseFirestore.instance
        .collection('users')
        .doc(user!.uid)
        .collection('transporterInfo')
        .doc(user!.uid)
        .get()
        .then((value) => tranModel = TransporterModel.fromMap(value.data()));
    super.dispose();
  }

  Widget introWidget() {
    return Container(
      width: Get.width,
      decoration: BoxDecoration(
        color: Colors.grey[400],
        image: const DecorationImage(
          image: AssetImage('assets/driver.png'),
          fit: BoxFit.fitHeight,
        ),
      ),
      height: Get.height * 0.3,
      child: Container(
        height: Get.height * 0.1,
        width: Get.width,
        margin: EdgeInsets.only(bottom: Get.height * 0.05),
        child: Center(
          child: Text(
            "Transporter Profile Settings",
            style: GoogleFonts.rubik(fontSize: 20, fontWeight: FontWeight.bold),
          ),
        ),
      ),
    );
  }

  textFieldWidget(String title, IconData iconData,
      TextEditingController controller, Function validator,
      {Function? onTap, bool readOnly = false}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: GoogleFonts.rubik(
              fontSize: 15, fontWeight: FontWeight.w600, color: Colors.grey),
        ),
        const SizedBox(
          height: 6,
        ),
        Container(
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
          child: TextFormField(
            readOnly: readOnly,
            onTap: () => onTap!(),
            validator: (input) => validator(input),
            controller: controller,
            style: GoogleFonts.montserrat(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: Color(0xffA7A7A7)),
            decoration: InputDecoration(
              prefixIcon: Padding(
                padding: const EdgeInsets.only(left: 10),
                child: Icon(
                  iconData,
                  color: Colors.green,
                ),
              ),
              border: InputBorder.none,
            ),
          ),
        )
      ],
    );
  }

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final Storage storage = Storage();

    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(
              height: Get.height * 0.4,
              child: Stack(
                children: [
                  introWidget(),
                  Align(
                    alignment: Alignment.bottomCenter,
                    child: InkWell(
                      onTap: () {},
                    ),
                  ),
                ],
              ),
            ),
            Container(
              padding: EdgeInsets.symmetric(horizontal: 23),
              child: Form(
                key: formKey,
                child: Column(
                  children: [
                    Padding(
                      padding: const EdgeInsets.only(bottom: 20.0),
                      child: Text(
                        "Update your profile information ",
                        style: GoogleFonts.rubik(fontSize: 20),
                      ),
                    ),
                    textFieldWidget(
                        'Name', Icons.person_outlined, nameController,
                        (String? input) {
                      if (input!.isEmpty) {
                        return 'Name is required!';
                      }

                      if (input.length < 5) {
                        return 'Please enter a valid name!';
                      }

                      return null;
                    }),
                    const SizedBox(height: 10),
                    textFieldWidget(
                        'Age', Icons.numbers_outlined, ageController,
                        (String? input) {
                      if (input!.isEmpty) {
                        return 'Age is required!';
                      }

                      return null;
                    }),
                    SizedBox(
                      height: 10,
                    ),
                    textFieldWidget('Vehicle Model ', Icons.car_crash_sharp,
                        vehicleController, (String? input) {
                      if (input!.isEmpty) {
                        return 'Vehicle Name is required!';
                      }

                      if (input.length < 5) {
                        return 'Please enter a valid name!';
                      }

                      return null;
                    }),
                    SizedBox(height: 10),
                    textFieldWidget(
                        'Mobile Number ', Icons.numbers, mobileController,
                        (String? input) {
                      if (input!.isEmpty) {
                        return "Please enter your number";
                      }
                      return null;
                    }),
                    SizedBox(
                      height: 10,
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: [
                        Padding(
                          padding: const EdgeInsets.all(5),
                          child: Icon(
                            Icons.image_outlined,
                            size: 40,
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.all(10),
                          child: ElevatedButton(
                            onPressed: (() async {
                              final results =
                                  await FilePicker.platform.pickFiles(
                                allowMultiple: false,
                                type: FileType.custom,
                                allowedExtensions: ['jpg', 'png'],
                              );

                              if (results == null) {
                                ScaffoldMessenger.of(context)
                                    .showSnackBar(const SnackBar(
                                  content: Text('No file selected.'),
                                ));
                                return;
                              } else {
                                ScaffoldMessenger.of(context)
                                    .showSnackBar(const SnackBar(
                                  content: Text('File selected and uploaded.'),
                                ));
                              }

                              final path = results.files.single.path!;
                              final fileName = results.files.single.name;

                              storage
                                  .uploadFile(path, fileName)
                                  .then((value) => print('Done'));
                            }),
                            child: Text(
                              'Update Vehicle image ',
                              style: GoogleFonts.rubik(fontSize: 15),
                            ),
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 10),
                    ElevatedButton(
                        onPressed: updateInfo,
                        child: Text("Update Information",
                            style: GoogleFonts.rubik(
                                fontSize: 15, color: Colors.black)))
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void updateInfo() async {
    FirebaseFirestore firebaseFirestore = FirebaseFirestore.instance;
    final auth = FirebaseAuth.instance;
    User? user = auth.currentUser;
    TransporterModel tranModel = TransporterModel();

    await firebaseFirestore
        .collection('users')
        .doc(user!.uid)
        .collection('transporterInfo')
        .doc(user.uid)
        .set(tranModel.toMap());

    ScaffoldMessenger.of(context)
        .showSnackBar(const SnackBar(content: Text('Data Updated ')));
  }
}
