// ignore_for_file: prefer_const_constructors

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class MessageTextField extends StatefulWidget {
//final String currentId;
  final String user;
  final String friendId;
  MessageTextField(this.friendId, this.user, {super.key});

  @override
  State<MessageTextField> createState() => _MessageTextFieldState();
}

class _MessageTextFieldState extends State<MessageTextField> {
  final user = FirebaseAuth.instance.currentUser!;

  TextEditingController textController = TextEditingController();
  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white,
      padding: EdgeInsetsDirectional.all(10),
      child: Row(
        children: [
          Expanded(
              child: TextField(
            controller: textController,
            decoration: InputDecoration(
                label: Text('Type your message'),
                fillColor: Colors.grey[100],
                filled: true,
                border: OutlineInputBorder(
                  borderSide: BorderSide(width: 0),
                  gapPadding: 10,
                  borderRadius: BorderRadius.circular(25),
                )),
          )),
          SizedBox(
            width: 20,
          ),
          GestureDetector(
            onTap: () async {
              String message = textController.text;
              textController.clear();
              await FirebaseFirestore.instance
                  .collection('users')
                  .doc(widget.user)
                  .collection('messages')
                  .doc(widget.friendId)
                  .collection('chats')
                  .add({
                'senderId': widget.user,
                'receiverId': widget.friendId,
                'message': message,
                'type': 'text',
                'date': DateTime.now(),
              }).then((value) {
                FirebaseFirestore.instance
                    .collection('users')
                    .doc(widget.user)
                    .collection('messages')
                    .doc(widget.friendId)
                    .set({
                  'last_message': message,
                });
              });

              await FirebaseFirestore.instance
                  .collection('users')
                  .doc(widget.friendId)
                  .collection('messages')
                  .doc(widget.user)
                  .collection("chats")
                  .add({
                "senderId": widget.user,
                "receiverId": widget.friendId,
                "message": message,
                "type": "text",
                "date": DateTime.now(),
              }).then((value) {
                FirebaseFirestore.instance
                    .collection('users')
                    .doc(widget.friendId)
                    .collection('messages')
                    .doc(widget.user)
                    .set({"last_msg": message});
              });
            },
            child: Container(
              padding: EdgeInsets.all(8),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.blue,
              ),
              child: Icon(
                Icons.send,
                color: Colors.white,
              ),
            ),
          )
        ],
      ),
    );
  }
}
