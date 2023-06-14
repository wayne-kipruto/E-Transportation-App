import 'package:flutter/material.dart';

class Intropage extends StatefulWidget {
  const Intropage({Key? key}) : super(key: key);

  @override
  _IntropageState createState() => _IntropageState();
}

class _IntropageState extends State<Intropage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
          child: Column(
        children: <Widget>[
          // IntroductionScreen(
          //   pages: listPagesViewModel,
          //   showNextButton: true,
          //   showSkipButton: false,
          //   done: const Text("Done"),
          //   onDone: () {
          //     //onpressed
          //   },
          // )
        ],
      )),
    );
  }
}
