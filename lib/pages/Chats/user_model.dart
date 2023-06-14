import 'package:cloud_firestore/cloud_firestore.dart';

class ChatModel {
  String? email;
  String? name;
  String? role;
  String? img;
  late Timestamp date;
  String? uid;

  ChatModel({
    required this.email,
    required this.name,
    required this.img,
    required this.date,
    required this.uid,
    required this.role,
  });

  factory ChatModel.fromJson(DocumentSnapshot snapshot) {
    return ChatModel(
      email: snapshot['email'],
      name: snapshot['name'],
      img: snapshot['img'],
      date: snapshot['date'],
      uid: snapshot['uid'],
      role: snapshot['role'],
    );
  }
}
