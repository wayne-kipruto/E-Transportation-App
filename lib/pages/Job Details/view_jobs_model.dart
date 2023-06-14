class ViewJobsModel {
  String names = "some";

  @override
  bool operator ==(Object other) =>
      other is ViewJobsModel && other.names == names;

  @override
  int get hashCode => names.hashCode;

  String? goodsSelected;
  String? vehicleSelected;
  String? jobDescription;
  String? destination;
  String? source;
  DateTime? dateSelected;

  ViewJobsModel(
      {this.goodsSelected,
      this.vehicleSelected,
      this.jobDescription,
      this.destination,
      this.source,
      this.dateSelected});

  factory ViewJobsModel.fromMap(map) {
    return ViewJobsModel(
        goodsSelected: map['goodsSelected'],
        vehicleSelected: map['vehicleSelected'],
        jobDescription: map['jobDescription'],
        dateSelected: map['dateSelected'],
        source: map['delivered To'],
        destination: map['delivered From']);
  }

  Map<String, dynamic> toMap() {
    return {
      'goodsSelected': goodsSelected,
      'age': vehicleSelected,
      'mobile': jobDescription,
      'vehicle': dateSelected,
      'delivered To': source,
      'delivered From': destination
    };
  }
}
