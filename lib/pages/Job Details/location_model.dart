class LocationModel {
  String name = "some";

  @override
  bool operator ==(Object other) =>
      other is LocationModel && other.name == name;

  @override
  int get hashCode => name.hashCode;

  String? source;
  String? destination;

  LocationModel({
    this.source,
    this.destination,
  });

  factory LocationModel.fromMap(map) {
    return LocationModel(
      source: map['Delivered From'],
      destination: map['Delivered To'],
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'Delivered From': source,
      'Delivered To': destination,
    };
  }
}
