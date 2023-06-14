class BusinessInfoModel {
  String name = "some";

  @override
  bool operator ==(Object other) =>
      other is BusinessInfoModel && other.name == name;

  @override
  int get hashCode => name.hashCode;

  String? businessAddress;
  String? businessName;
  String? businessDescription;

  BusinessInfoModel({
    this.businessName,
    this.businessAddress,
    this.businessDescription,
  });

  factory BusinessInfoModel.fromMap(map) {
    return BusinessInfoModel(
        businessName: map['businessName'],
        businessAddress: map['businessAddress'],
        businessDescription: map['businessDescription']);
  }

  Map<String, dynamic> toMap() {
    return {
      'businessName': businessName,
      'businessAddress': businessAddress,
      'businessDescription': businessDescription,
    };
  }
}
