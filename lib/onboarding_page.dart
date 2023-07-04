// ignore_for_file: prefer_const_constructors, library_private_types_in_public_api, prefer_const_literals_to_create_immutables

import 'package:fastrucks2/auth/new%20auth/signin_page.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';

class OnboardingPage extends StatefulWidget {
  const OnboardingPage({super.key});

  @override
  _OnboardingPageState createState() => _OnboardingPageState();
}

class _OnboardingPageState extends State<OnboardingPage> {
  final PageController _pageController = PageController(initialPage: 0);
  int _currentPage = 0;
  bool isLastPage = false;

  List<Widget> _buildPageIndicator() {
    List<Widget> list = [];
    for (int i = 0; i < 3; i++) {
      list.add(i == _currentPage ? _indicator(true) : _indicator(false));
    }
    return list;
  }

  Widget _indicator(bool isActive) {
    return AnimatedContainer(
      duration: Duration(milliseconds: 150),
      margin: EdgeInsets.symmetric(horizontal: 8.0),
      height: 8.0,
      width: isActive ? 24.0 : 16.0,
      decoration: BoxDecoration(
        color: isActive ? Colors.white : Color(0xFF7B51D3),
        borderRadius: BorderRadius.all(Radius.circular(12)),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            stops: const [0.1, 0.5, 0.9],
            colors: const [
              Color(0xFFFFCC80),
              Color(0xFFEF9A9A),
              Color(0xFFFFCC80),
            ],
          ),
        ),
        child: Padding(
          padding: EdgeInsets.symmetric(vertical: 40.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              Container(
                alignment: Alignment.centerRight,
                height: 80,
              ),
              SizedBox(
                height: 600,
                child: PageView(
                  physics: ClampingScrollPhysics(),
                  controller: _pageController,
                  onPageChanged: (int page) {
                    setState(() {
                      _currentPage = page;
                      isLastPage = page == 2;
                    });
                  },
                  children: <Widget>[
                    Padding(
                      padding: EdgeInsets.all(40.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        // ignore: prefer_const_literals_to_create_immutables
                        children: <Widget>[
                          Center(
                            child: Image(
                              image: AssetImage(
                                'assets/supplier.png',
                              ),
                              height: 300.0,
                              width: 300.0,
                            ),
                          ),
                          SizedBox(height: 30.0),
                          Text(
                            'Connect truckers and suppliers',
                            style: GoogleFonts.rajdhani(
                              color: Colors.black,
                              fontWeight: FontWeight.w500,
                              fontSize: 24.0,
                              height: 1.5,
                            ),
                          ),
                          SizedBox(
                            height: 15,
                          ),
                          Text(
                            'Become a registered supplier to guarantee timely delivery of your products. ',
                            style: GoogleFonts.montserrat(
                              color: Colors.black,
                              fontSize: 17.0,
                              height: 1.2,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Padding(
                      padding: EdgeInsets.all(40.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          Center(
                            child: Image(
                              image: AssetImage(
                                'assets/truck.png',
                              ),
                              height: 300.0,
                              width: 300.0,
                            ),
                          ),
                          SizedBox(height: 30.0),
                          Text(
                            'Meet your deadlines with us!',
                            style: GoogleFonts.rajdhani(
                              color: Colors.black,
                              fontWeight: FontWeight.w500,
                              fontSize: 24.0,
                              height: 1.5,
                            ),
                          ),
                          SizedBox(
                            height: 15,
                          ),
                          Text(
                            'Fastrucks also assists drivers in finding work by connecting them with suppliers.',
                            style: GoogleFonts.montserrat(
                              color: Colors.black,
                              fontSize: 18.0,
                              height: 1.2,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Padding(
                      padding: EdgeInsets.all(40.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          Center(
                            child: Image(
                              image: AssetImage(
                                'assets/truck.png',
                              ),
                              height: 300.0,
                              width: 300.0,
                            ),
                          ),
                          SizedBox(height: 30.0),
                          Text(
                            'Grow your business with us',
                            style: GoogleFonts.rajdhani(
                              color: Colors.black,
                              fontWeight: FontWeight.w500,
                              fontSize: 24.0,
                              height: 1.5,
                            ),
                          ),
                          SizedBox(
                            height: 15,
                          ),
                          Text(
                            'Register today and find jobs and transporters today. ',
                            style: GoogleFonts.montserrat(
                              color: Colors.black,
                              fontSize: 18.0,
                              height: 1.2,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: _buildPageIndicator(),
              ),
              _currentPage != 2
                  ? Expanded(
                      child: Align(
                        alignment: FractionalOffset.bottomRight,
                        child: ElevatedButton(
                          style: ButtonStyle(
                              backgroundColor: MaterialStatePropertyAll<Color>(
                                  const Color.fromRGBO(255, 204, 128, 1))),
                          onPressed: () => _pageController.nextPage(
                              duration: Duration(milliseconds: 500),
                              curve: Curves.ease),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            mainAxisSize: MainAxisSize.min,
                            children: <Widget>[
                              Text(
                                'Next',
                                style: GoogleFonts.rajdhani(
                                  color: Colors.black,
                                  fontWeight: FontWeight.w500,
                                  fontSize: 19.0,
                                ),
                              ),
                              SizedBox(width: 10.0),
                              Icon(
                                Icons.arrow_forward,
                                color: Colors.black,
                                size: 20.0,
                              ),
                            ],
                          ),
                        ),
                      ),
                    )
                  : Expanded(
                      child: Align(
                        alignment: FractionalOffset.bottomCenter,
                        child: ElevatedButton(
                          style: ButtonStyle(
                            backgroundColor: MaterialStatePropertyAll<Color>(
                              const Color.fromRGBO(255, 204, 128, 1),
                            ),
                          ),
                          onPressed: () async {
                            //this prevents the user from seeing the page again
                            final prefs = await SharedPreferences.getInstance();
                            prefs.setBool('showLogin', true);

                            //this pushes the user to the login page
                            Navigator.of(context)
                                .pushReplacement(MaterialPageRoute(
                              builder: (context) => LoginPage1(),
                            ));
                          },
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: <Widget>[
                              Text(
                                'Go to Login',
                                style: GoogleFonts.rajdhani(
                                  color: Colors.black,
                                  fontWeight: FontWeight.w500,
                                  fontSize: 19,
                                ),
                              ),
                              Icon(
                                Icons.login,
                                color: Colors.black,
                                size: 20,
                              )
                            ],
                          ),
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
