// ignore_for_file: prefer_const_constructors

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:fastrucks2/pages/widgets/message_text_field.dart';
import 'package:fastrucks2/pages/widgets/single_msg.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class ChatScreen extends StatelessWidget {
  //final ChatModel currentUser;
  final user = FirebaseAuth.instance.currentUser!;
  final String friendId;
  final String friendName;
  final String friendImage;

  ChatScreen(
      {required this.friendId,
      required this.friendImage,
      required this.friendName});

  @override
  Widget build(BuildContext context) {
    final user = FirebaseAuth.instance.currentUser!;
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.teal,
        title: Row(
          children: [
            ClipRRect(
                borderRadius: BorderRadius.circular(40),
                child: Image.network(
                  friendImage,
                  height: 30,
                )),
            SizedBox(
              width: 5,
            ),
            Text(
              friendName,
              style: GoogleFonts.montserrat(fontSize: 20),
            )
          ],
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: Container(
              padding: EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(25),
                    topRight: Radius.circular(25)),
              ),
              child: StreamBuilder(
                stream: FirebaseFirestore.instance
                    .collection('users')
                    .doc(user.uid)
                    .collection('messages')
                    .doc(friendId)
                    .collection('chats')
                    .orderBy('date', descending: true)
                    .snapshots(),
                builder: (context, AsyncSnapshot snapshot) {
                  if (snapshot.hasData) {
                    if (snapshot.data.docs.length < 1) {
                      return Center(
                        child: Text('Say Hi'),
                      );
                    }
                    return ListView.builder(
                        itemCount: snapshot.data.docs.length,
                        reverse: true,
                        physics: BouncingScrollPhysics(),
                        itemBuilder: (context, index) {
                          bool isMe =
                              snapshot.data.docs[index]['senderId'] == user.uid;
                          return SingleMessage(
                              snapshot.data.docs[index]['message'], isMe);
                        });
                  }
                  return Center(
                    child: CircularProgressIndicator(),
                  );
                },
              ),
            ),
          ),
          MessageTextField(user.uid, friendId)
        ],
      ),
    );
  }
}
