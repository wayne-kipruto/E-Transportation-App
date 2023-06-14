class TransporterModel {
  String names = "some";

  @override
  bool operator ==(Object other) =>
      other is TransporterModel && other.names == names;

  @override
  int get hashCode => names.hashCode;

  String? name;
  int? age;
  String? vehicle;
  int? mobile;

  TransporterModel({
    this.name,
    this.age,
    this.vehicle,
    this.mobile,
  });

  factory TransporterModel.fromMap(map) {
    return TransporterModel(
        name: map['name'],
        age: map['age'],
        mobile: map['mobile'],
        vehicle: map['vehicle']);
  }

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'age': age,
      'mobile': mobile,
      'vehicle': vehicle,
    };
  }
}
