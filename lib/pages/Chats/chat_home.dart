// ignore_for_file: prefer_const_constructors

import 'package:cached_network_image/cached_network_image.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:fastrucks2/pages/Chats/Chat_screen.dart';
import 'package:fastrucks2/pages/Chats/Chat_search.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class ChatHome extends StatefulWidget {
  final user = FirebaseAuth.instance.currentUser!;

  ChatHome();

  @override
  State<ChatHome> createState() => _ChatHomeState();
}

class _ChatHomeState extends State<ChatHome> {
  final user = FirebaseAuth.instance.currentUser!;

  @override
  Widget build(BuildContext context) {
    // final user = FirebaseAuth.instance.currentUser!;
    return Scaffold(
      appBar: AppBar(
        title: Text("Welcome to your chats page"),
        centerTitle: true,
        backgroundColor: Colors.teal,
        actions: [
          IconButton(
              onPressed: () {},
              icon: Icon(
                Icons.info_outline,
                color: Colors.black,
              ))
        ],
      ),
      body: Padding(
        padding:
            const EdgeInsets.only(left: 15.0, right: 15, top: 20, bottom: 20),
        child: StreamBuilder(
          stream: FirebaseFirestore.instance
              .collection('users')
              .doc(widget.user.uid)
              .collection('messages')
              .snapshots(),
          builder: (context, AsyncSnapshot snapshot) {
            if (snapshot.hasData) {
              if (snapshot.data.docs.length < 1) {
                return Center(
                  child: Text(
                    "No chats Available !",
                    style: GoogleFonts.rubik(fontSize: 15),
                  ),
                );
              }
              return ListView.builder(
                  itemCount: snapshot.data.docs.length,
                  itemBuilder: (context, index) {
                    var friendId = snapshot.data.docs[index].id;
                    // var lastMsg = snapshot.data.docs[index]['last_message'];
                    return FutureBuilder(
                        future: FirebaseFirestore.instance
                            .collection('users')
                            .doc(friendId)
                            .get(),
                        builder: (context, AsyncSnapshot asyncSnapshot) {
                          if (asyncSnapshot.hasData) {
                            var friend = asyncSnapshot.data;
                            return ListTile(
                              leading: ClipRRect(
                                borderRadius: BorderRadius.circular(80),
                                child: CachedNetworkImage(
                                  imageUrl: friend['image'],
                                  placeholder: (context, url) =>
                                      CircularProgressIndicator(),
                                  errorWidget: (context, url, error) =>
                                      Icon(Icons.error),
                                  height: 50,
                                ),
                              ),
                              title: Text(friend['name']),
                              subtitle: Container(
                                child: Text(
                                  friend['role'],
                                  style: GoogleFonts.montserrat(
                                      fontSize: 17, color: Colors.grey),
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                              onTap: () {
                                Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                        builder: (context) => ChatScreen(
                                              friendId: friend['uid'],
                                              friendName: friend['name'],
                                              friendImage: friend['image'],
                                            )));
                              },
                            );
                          }
                          return LinearProgressIndicator();
                        });
                  });
            }
            return Center(
              child: CircularProgressIndicator(),
            );
          },
        ),
      ),
      floatingActionButton: FloatingActionButton(
        child: Icon(Icons.search),
        onPressed: () {
          Navigator.push(context, MaterialPageRoute(builder: (context) {
            return SearchScreen();
          }));
        },
      ),
    );
  }
}
