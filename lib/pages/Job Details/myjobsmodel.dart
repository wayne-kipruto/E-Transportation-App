class MyJobsModel {
  String names = "some";

  @override
  bool operator ==(Object other) =>
      other is MyJobsModel && other.names == names;

  @override
  int get hashCode => names.hashCode;

  String? userId;
  String? goodsSelected;
  String? vehicleSelected;
  String? jobDescription;
  String? destination;
  String? source;
  String? contactPerson;
  // DateTime? dateSelected;

  MyJobsModel(
      {this.goodsSelected,
      this.vehicleSelected,
      this.jobDescription,
      this.destination,
      this.source,
      this.userId,
      // this.dateSelected,
      this.contactPerson});
  factory MyJobsModel.fromMap(map) {
    return MyJobsModel(
        goodsSelected: map['goodsSelected'],
        vehicleSelected: map['vehicleSelected'],
        jobDescription: map['jobDescription'],
        source: map['delivered To'],
        destination: map['delivered From'],
        userId: map['userId'],
        // dateSelected: map['dateSelected'],
        contactPerson: map['supplierName']);
  }
  Map<String, dynamic> toMap() {
    return {
      'goodsSelected': goodsSelected,
      'vehicle': vehicleSelected,
      'mobile': jobDescription,
      'delivered To': source,
      'delivered From': destination,
      'userId': userId,
      'supplierName': contactPerson,
      // 'dateSelected': dateSelected,
    };
  }
}
