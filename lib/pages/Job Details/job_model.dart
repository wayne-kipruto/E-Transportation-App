class JobModel {
  String name = 'some';

  @override
  bool operator ==(Object other) => other is JobModel && other.name == name;

  @override
  int get hashCode => name.hashCode;

  String? userId;
  String? goodsSelected;
  String? vehicleSelected;
  String? jobDescription;
  String? source;
  String? destination;
  String? contactPerson;

  DateTime? dateSelected;

  JobModel(
      {this.userId,
      this.goodsSelected,
      this.vehicleSelected,
      this.jobDescription,
      this.source,
      this.destination,
      this.dateSelected,
      this.contactPerson});

  factory JobModel.fromMap(map) {
    return JobModel(
        userId: map['userid'],
        goodsSelected: map['goodsSelected'],
        vehicleSelected: map['vehicleSelected'],
        jobDescription: map['jobDescription'],
        source: map['Delivered From'],
        destination: map['Delivered To'],
        dateSelected: map['dateSelected'],
        contactPerson: map['supplierName']);
  }

  Map<String, dynamic> toMap() {
    return {
      'userId': userId,
      'goodsSelected': goodsSelected,
      'vehicleSelected': vehicleSelected,
      'dateSelected': dateSelected,
      'delivered From': source,
      'delivered To': destination,
      'jobDescription': jobDescription,
      'supplierName': contactPerson,
    };
  }
}
