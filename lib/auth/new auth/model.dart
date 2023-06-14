// ignore_for_file: non_constant_identifier_names

class UserModel {
  int? mobile;
  int? age;
  String? name;
  String? email;
  String? role;
  String? uid;

// receiving data
  UserModel(
      {this.uid, this.mobile, this.age, this.email, this.role, this.name});
  factory UserModel.fromMap(map) {
    return UserModel(
      name: map['name'],
      mobile: map['mobile'],
      age: map['age'],
      uid: map['uid'],
      email: map['email'],
      role: map['role'],
    );
  }
// sending data
  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'uid': uid,
      'email': email,
      'age': age,
      'mobile': mobile,
      'role': role,
    };
  }
}
