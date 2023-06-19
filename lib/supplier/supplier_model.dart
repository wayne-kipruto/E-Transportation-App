class SupplierModel {
  String name = "some";

  @override
  bool operator ==(Object other) =>
      other is SupplierModel && other.name == name;

  @override
  int get hashCode => name.hashCode;

  String? userId;
  String? firstName;
  String? lastName;
  String? businessAddress;
  String? businessName;
  String? businessDescription;

  SupplierModel({
    this.userId,
    this.firstName,
    this.lastName,
    this.businessAddress,
  });

  factory SupplierModel.fromMap(map) {
    return SupplierModel(
        userId: map['userid'],
        firstName: map['firstName'],
        lastName: map['lastName'],
        businessAddress: map['businessAddress']);
  }

  Map<String, dynamic> toMap() {
    return {
      'userId': userId,
      'firstName': firstName,
      'lastName': lastName,
      'businessAddress': businessAddress,
      'businessDescription': businessDescription
    };
  }
}
