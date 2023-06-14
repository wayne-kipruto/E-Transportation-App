// ignore_for_file: prefer_const_constructors, library_private_types_in_public_api

import 'package:fastrucks2/auth/new%20auth/signin_page.dart';
import 'package:flutter/material.dart';

class IntroScreen extends StatefulWidget {
  const IntroScreen({super.key});

  @override
  _IntroScreenState createState() => _IntroScreenState();
}

class _IntroScreenState extends State<IntroScreen> {
  final PageController _pageController = PageController(initialPage: 0);
  int _currentPage = 0;

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
          stops: const [0.1, 0.4, 0.7, 0.9],
          colors: const [
            Color(0xFF3594DD),
            Color(0xFF4563DB),
            Color(0xFF5036D5),
            Color(0xFF5B16D0),
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
              child: ElevatedButton(
                // ignore: avoid_print
                onPressed: () => MaterialPageRoute(builder: (context) {
                  return const LoginPage1();
                }),
                child: Text('Skip',
                    style: TextStyle(color: Colors.white, fontSize: 22.0)),
              ),
            ),
            SizedBox(
              height: 600.0,
              child: PageView(
                physics: ClampingScrollPhysics(),
                controller: _pageController,
                onPageChanged: (int page) {
                  setState(() {
                    _currentPage = page;
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
                              'assets/truck.png',
                            ),
                            height: 300.0,
                            width: 300.0,
                          ),
                        ),
                        SizedBox(height: 30.0),
                        Text(
                          'Connect truckers and suppliers \n',
                          style: TextStyle(
                            color: Colors.white,
                            fontFamily: 'CM Sans Serif',
                            fontSize: 26.0,
                            height: 1.5,
                          ),
                        ),
                        SizedBox(height: 15.0),
                        Text(
                          'Become a registered supplier to guarantee timely delivery of your products. ',
                          style: TextStyle(
                            color: Colors.white,
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
                      children: const <Widget>[
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
                          'Meet your deadlines\nwith us!',
                          style: TextStyle(
                            color: Colors.white,
                            fontFamily: 'CM Sans Serif',
                            fontSize: 26.0,
                            height: 1.5,
                          ),
                        ),
                        SizedBox(height: 15.0),
                        Text(
                          'Fastrucks also assists drivers in finding work \nby connecting them with suppliers.',
                          style: TextStyle(
                            color: Colors.white,
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
                      children: const <Widget>[
                        Center(
                          child: Image(
                            image: AssetImage(
                              'assets/driver.png',
                            ),
                            height: 300.0,
                            width: 300.0,
                          ),
                        ),
                        SizedBox(height: 30.0),
                        Text(
                          'Grow your business \nwith us',
                          style: TextStyle(
                            color: Colors.white,
                            fontFamily: 'CM Sans Serif',
                            fontSize: 26.0,
                            height: 1.5,
                          ),
                        ),
                        SizedBox(height: 15.0),
                        Text(
                          'Register today and get jobs/transporters today. ',
                          style: TextStyle(
                            color: Colors.white,
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
                        onPressed: () {
                          _pageController.nextPage(
                            duration: Duration(milliseconds: 500),
                            curve: Curves.ease,
                          );
                        },
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          mainAxisSize: MainAxisSize.min,
                          children: const <Widget>[
                            Text(
                              'Next',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 15.0,
                              ),
                            ),
                            SizedBox(width: 10.0),
                            Icon(
                              Icons.arrow_forward,
                              color: Colors.white,
                              size: 20.0,
                            ),
                          ],
                        ),
                      ),
                    ),
                  )
                : Text(
                    'Sign In',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 15.0,
                    ),
                  ),
          ],
        ),
      ),
    ));
  }
}
