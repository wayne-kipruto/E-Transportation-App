// ignore_for_file: prefer_const_constructors, non_constant_identifier_names, use_build_context_synchronously

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:fastrucks2/supplier/supplier_model.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';

class UserSettingsPage extends StatefulWidget {
  const UserSettingsPage({super.key});

  @override
  State<UserSettingsPage> createState() => _UserSettingsPageState();
}

class _UserSettingsPageState extends State<UserSettingsPage> {
  CollectionReference ref = FirebaseFirestore.instance.collection('users');
  TextEditingController nameController = TextEditingController();
  TextEditingController ageController = TextEditingController();
  TextEditingController businessNameController = TextEditingController();
  TextEditingController businessDescriptionController = TextEditingController();

  GlobalKey<FormState> formKey = GlobalKey<FormState>();

  final ImagePicker _picker = ImagePicker();
  SupplierModel supplierModel = SupplierModel();

  @override
  void dispose() {
    nameController.dispose();
    ageController.dispose();
    businessNameController.dispose();
    businessDescriptionController.dispose();

    FirebaseFirestore.instance
        .collection('users')
        .doc(SupplierModel().userId)
        .get()
        .then((value) => supplierModel = SupplierModel.fromMap(value.data()));
    setState(() {});

    super.dispose();
  }

  sendData() async {
    FirebaseFirestore firebaseFirestore = FirebaseFirestore.instance;
    final auth = FirebaseAuth.instance;
    String user = auth.currentUser!.uid;
    supplierModel.name = nameController.text;
    supplierModel.businessDescription = businessDescriptionController.text;
    supplierModel.businessName = businessNameController.text;

    await firebaseFirestore
        .collection('users')
        .doc(user)
        .collection('businessInfo')
        .doc(user)
        .set(supplierModel.toMap());

    ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Data Updated Successfully')));
  }

  Widget IntroWidget() {
    return Container(
      width: Get.width,
      decoration: BoxDecoration(
        color: Colors.grey[400],
        image: DecorationImage(
          image: AssetImage('assets/truck.png'),
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
            "Profile Settings",
            style: GoogleFonts.rubik(fontSize: 24, fontWeight: FontWeight.bold),
          ),
        ),
      ),
    );
  }

  TextFieldWidget(String title, IconData iconData,
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
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              height: Get.height * 0.4,
              child: Stack(
                children: [
                  IntroWidget(),
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
                    TextFieldWidget(
                        'Name ', Icons.person_outlined, nameController,
                        (String? input) {
                      if (input!.isEmpty) {
                        return 'Name is required!';
                      }

                      if (input.length < 4) {
                        return 'Please enter a valid name!';
                      }

                      return null;
                    }),
                    const SizedBox(height: 10),
                    TextFieldWidget(
                        'Business Name', Icons.shop, businessNameController,
                        (String? input) {
                      if (input!.isEmpty) {
                        return 'Business Name is required!';
                      }

                      if (input.length < 5) {
                        return 'Please enter a valid name!';
                      }

                      return null;
                    }),
                    SizedBox(height: 10),
                    TextFieldWidget('Business Description', Icons.description,
                        businessDescriptionController, (String? input) {
                      if (input!.isEmpty) {
                        return 'Business Description is required!';
                      }

                      if (input.length < 10) {
                        return 'Please enter valid information!';
                      }

                      return null;
                    }),
                    SizedBox(height: 10),
                    ElevatedButton(
                        onPressed: sendData,
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
}
